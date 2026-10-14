import type {
  PostType,
  UserType,
  RouteProductType,
  CommentType,
  Story,
} from "../interfaces/interfaces";

// Storage keys
const CUSTOM_POSTS_KEY = "social_custom_posts";
const HIDDEN_POSTS_KEY = "social_hidden_posts";
const REACTIONS_PREFIX = "social_reactions_";
const COMMENTS_PREFIX = "social_comments_";
const USER_OVERRIDES_PREFIX = "social_user_override_";

export function getCustomPosts(): PostType[] {
  try {
    const raw = localStorage.getItem(CUSTOM_POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomPost(post: PostType): PostType {
  const posts = getCustomPosts();
  const newPost = {
    ...post,
    id: post.id || `custom_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newPost, ...posts];
  localStorage.setItem(CUSTOM_POSTS_KEY, JSON.stringify(updated));
  return newPost;
}

export function deleteLocalPost(postId: string | number): void {
  const idStr = String(postId);
  const posts = getCustomPosts().filter((p) => String(p.id) !== idStr);
  localStorage.setItem(CUSTOM_POSTS_KEY, JSON.stringify(posts));

  try {
    const hiddenRaw = localStorage.getItem(HIDDEN_POSTS_KEY);
    const hidden: string[] = hiddenRaw ? JSON.parse(hiddenRaw) : [];
    if (!hidden.includes(idStr)) {
      hidden.push(idStr);
      localStorage.setItem(HIDDEN_POSTS_KEY, JSON.stringify(hidden));
    }
  } catch {
    // ignore
  }
}

export function isPostHidden(postId: string | number): boolean {
  try {
    const hiddenRaw = localStorage.getItem(HIDDEN_POSTS_KEY);
    const hidden: string[] = hiddenRaw ? JSON.parse(hiddenRaw) : [];
    return hidden.includes(String(postId));
  } catch {
    return false;
  }
}

export function getSavedReactions(
  postId: string | number,
  fallback: { likes: number; dislikes: number; likedBy?: string[] }
) {
  try {
    const raw = localStorage.getItem(REACTIONS_PREFIX + String(postId));
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return fallback;
}

export function saveReactions(
  postId: string | number,
  reactions: { likes: number; dislikes: number },
  likedBy: string[] = []
) {
  try {
    localStorage.setItem(
      REACTIONS_PREFIX + String(postId),
      JSON.stringify({ reactions, likedBy })
    );
  } catch {
    // ignore
  }
}

export function getStoredComments(postId: string | number): CommentType[] {
  const key = COMMENTS_PREFIX + String(postId);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }

  // Seed default engaging comments if empty
  const defaultComments: CommentType[] = [
    {
      id: `seed_1_${postId}`,
      postId,
      body: "This looks absolutely incredible! Love the design and details 🔥",
      likes: 4,
      user: {
        id: "creator_alex",
        username: "alex_design",
        fullName: "Alex Rivera",
        avatar: "https://i.pravatar.cc/150?u=alex_design",
      },
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: `seed_2_${postId}`,
      postId,
      body: "Thanks for sharing this, where can we learn more about it?",
      likes: 2,
      user: {
        id: "creator_sara",
        username: "sara_k",
        fullName: "Sara Khalil",
        avatar: "https://i.pravatar.cc/150?u=sara_k",
      },
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ];

  try {
    localStorage.setItem(key, JSON.stringify(defaultComments));
  } catch {
    // ignore
  }
  return defaultComments;
}

export function addStoredComment(comment: CommentType): CommentType {
  const key = COMMENTS_PREFIX + String(comment.postId);
  const current = getStoredComments(comment.postId);
  const newComment = {
    ...comment,
    id: comment.id || `c_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newComment, ...current];
  try {
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return newComment;
}

export function deleteStoredComment(commentId: string | number): void {
  const idStr = String(commentId);
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(COMMENTS_PREFIX)) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const list: CommentType[] = JSON.parse(raw);
          const filtered = list.filter((c) => String(c.id) !== idStr);
          if (filtered.length !== list.length) {
            localStorage.setItem(key, JSON.stringify(filtered));
            break;
          }
        }
      } catch {
        // ignore
      }
    }
  }
}

export function getUserOverrides(userId: string | number): Partial<UserType> {
  try {
    const raw = localStorage.getItem(USER_OVERRIDES_PREFIX + String(userId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveUserOverride(
  userId: string | number,
  updates: Partial<UserType>
): void {
  try {
    const current = getUserOverrides(userId);
    const updated = { ...current, ...updates };
    localStorage.setItem(
      USER_OVERRIDES_PREFIX + String(userId),
      JSON.stringify(updated)
    );
  } catch {
    // ignore
  }
}

// Convert Route Misr Product to Social Media PostType
export function mapProductToPost(product: RouteProductType): PostType {
  const id = String(product._id || product.id);

  // Generate hashtags from category and brand
  const tags: string[] = [];
  if (product.category?.name) {
    tags.push(product.category.name.replace(/[^a-zA-Z0-9]/g, ""));
  }
  if (product.brand?.name) {
    tags.push(product.brand.name.replace(/[^a-zA-Z0-9]/g, ""));
  }
  if (product.ratingsAverage && product.ratingsAverage >= 4) {
    tags.push("Trending");
  } else {
    tags.push("Explore");
  }

  // Realistic baseline reactions from ratings
  const baseLikes = Math.max(
    8,
    Math.round(
      (product.ratingsQuantity || 12) * 6 +
        (product.ratingsAverage || 4) * 10 +
        ((product.sold || 30) % 40)
    )
  );
  const baseDislikes = Math.max(
    0,
    Math.round((5 - (product.ratingsAverage || 4.2)) * 3)
  );

  const saved = getSavedReactions(id, {
    likes: baseLikes,
    dislikes: baseDislikes,
    likedBy: [],
  });

  // Calculate views
  const views =
    (product.sold || 25) * 5 + Math.round(product.price % 150) + 120;

  // Map author userId: use brand ID if present, or deterministic author
  const userId = product.brand?._id || product.category?._id || "creator_1";

  return {
    id,
    title: product.title,
    body: product.description,
    tags,
    reactions: saved.reactions || {
      likes: saved.likes ?? baseLikes,
      dislikes: saved.dislikes ?? baseDislikes,
    },
    likedBy: saved.likedBy || [],
    mediaURL: product.imageCover || product.images?.[0] || "",
    views,
    userId,
    price: product.price,
    categoryName: product.category?.name,
    brandName: product.brand?.name,
    createdAt: product.createdAt,
  };
}

// Convert Route Misr User to UserType
export function mapRouteUserToUserType(routeUser: any): UserType {
  const id = String(routeUser._id || routeUser.id || "user_default");
  const rawName = routeUser.name || "Social User";
  const nameParts = rawName.trim().split(/\s+/);
  const firstName = nameParts[0] || "User";
  const lastName = nameParts.slice(1).join(" ") || "Member";
  const username = (
    routeUser.email
      ? routeUser.email.split("@")[0]
      : firstName.toLowerCase() + "_" + id.slice(-4)
  )
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");

  const defaultStories: Story[] = [
    {
      id: `story_${id}_1`,
      mediaUrl: `https://picsum.photos/seed/story_${id}_1/400/600`,
    },
    {
      id: `story_${id}_2`,
      mediaUrl: `https://picsum.photos/seed/story_${id}_2/400/600`,
    },
  ];

  const defaultFollowers = ["follower_1", "follower_2", "follower_3"];
  const defaultFollowing = ["following_1", "following_2"];

  const baseUser: UserType = {
    id,
    firstName,
    lastName,
    username,
    email: routeUser.email || `${username}@example.com`,
    phone: routeUser.phone || "+20 100 000 0000",
    gender: routeUser.gender || "male",
    birth: routeUser.createdAt
      ? routeUser.createdAt.split("T")[0]
      : "2000-01-01",
    address: {
      city: routeUser.city || "Cairo",
      country: routeUser.country || "Egypt",
    },
    image: `https://i.pravatar.cc/150?u=${id}`,
    coverPath: `https://picsum.photos/seed/cover_${id}/1200/400`,
    stories: defaultStories,
    followers: defaultFollowers,
    following: defaultFollowing,
    bio: "Passionate community member & digital explorer 🌟",
  };

  const overrides = getUserOverrides(id);
  return {
    ...baseUser,
    ...overrides,
    stories: overrides.stories || baseUser.stories,
    followers: overrides.followers || baseUser.followers,
    following: overrides.following || baseUser.following,
  };
}

// Registered Accounts Registry (to allow seamless login by either username or email)
export interface StoredAccount {
  username: string;
  email: string;
  password?: string;
  user: UserType;
  token?: string;
}

const REGISTERED_ACCOUNTS_KEY = "social_registered_accounts";

export function getRegisteredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
    const list: StoredAccount[] = raw ? JSON.parse(raw) : [];

    // Ensure ayman2027 mapping exists so the user's current credentials work instantly
    const exists = list.some(
      (a) =>
        a.username.toLowerCase() === "ayman2027" ||
        a.email.toLowerCase() === "ayman.23120261@muc.edu.eg"
    );

    if (!exists) {
      list.push({
        username: "ayman2027",
        email: "ayman.23120261@muc.edu.eg",
        user: {
          id: "6acf9f2a723f6000130a1e56",
          firstName: "Ayman",
          lastName: "Shaaban",
          username: "ayman2027",
          email: "ayman.23120261@muc.edu.eg",
          phone: "01012345678",
          gender: "male",
          birth: "2000-01-01",
          address: { city: "Cairo", country: "Egypt" },
          image: "https://i.pravatar.cc/150?u=ayman2027",
          coverPath: "https://picsum.photos/seed/cov_ayman2027/1200/400",
          stories: [],
          followers: [],
          following: [],
          bio: "Full Stack Engineer & React Specialist 🚀",
        },
      });
      localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(list));
    }
    return list;
  } catch {
    return [];
  }
}

export function saveRegisteredAccount(account: StoredAccount): void {
  try {
    const list = getRegisteredAccounts().filter(
      (a) =>
        a.username.toLowerCase() !== account.username.toLowerCase() &&
        a.email.toLowerCase() !== account.email.toLowerCase()
    );
    list.unshift(account);
    localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

