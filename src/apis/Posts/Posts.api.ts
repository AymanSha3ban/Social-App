import type {
  AddPostType,
  CommentType,
  IReactions,
  PaginatedPosts,
  PostType,
  CategoryType,
} from "../../interfaces/interfaces";
import { API } from "../BaseAPI";
import {
  mapProductToPost,
  getCustomPosts,
  saveCustomPost,
  deleteLocalPost,
  isPostHidden,
  getStoredComments,
  addStoredComment,
  deleteStoredComment,
  saveReactions,
} from "../mappers";

// Get paginated posts from Route Misr products + locally created custom posts
export const getPosts = async (
  page: number = 1,
  categoryId?: string
): Promise<PaginatedPosts> => {
  const params: Record<string, any> = {
    page: page || 1,
    limit: 10,
  };
  if (categoryId) {
    params.category = categoryId;
  }

  const res = await API.get("/products", { params });
  const rawProducts = res.data?.data || [];
  const metadata = res.data?.metadata || {
    currentPage: page,
    numberOfPages: 1,
    limit: 10,
    nextPage: null,
  };

  const remotePosts: PostType[] = rawProducts
    .map(mapProductToPost)
    .filter((p: PostType) => !isPostHidden(p.id!));

  // On page 1, prepend custom user-created posts (filtered by category if specified)
  let allPosts = remotePosts;
  if (page === 1) {
    const customPosts = getCustomPosts().filter((p) => {
      if (isPostHidden(p.id!)) return false;
      if (categoryId && p.categoryName !== categoryId) return false;
      return true;
    });
    allPosts = [...customPosts, ...remotePosts];
  }

  return {
    first: 1,
    prev: metadata.currentPage > 1 ? metadata.currentPage - 1 : null,
    next: metadata.nextPage || null,
    last: metadata.numberOfPages,
    pages: metadata.numberOfPages || 1,
    items: res.data?.results || allPosts.length,
    data: allPosts,
  };
};

// Get single post by ID (checks custom posts first, then Route Misr products)
export const getPost = async (id: number | string): Promise<PostType> => {
  const idStr = String(id);
  const custom = getCustomPosts().find((p) => String(p.id) === idStr);
  if (custom) {
    return custom;
  }

  const res = await API.get(`/products/${id}`);
  const product = res.data?.data;
  if (!product) {
    throw new Error("Post not found");
  }
  return mapProductToPost(product);
};

// Get posts for a specific user profile
export const getUserPosts = async (
  page: number = 1,
  userId: string | number
): Promise<PaginatedPosts> => {
  const idStr = String(userId);
  const customPosts = getCustomPosts().filter(
    (p) => String(p.userId) === idStr && !isPostHidden(p.id!)
  );

  // Fetch a batch of products to find posts associated with this user / brand
  const res = await API.get("/products", {
    params: { limit: 40, page: 1 },
  });
  const rawProducts = res.data?.data || [];
  const mapped = rawProducts.map(mapProductToPost);

  // Match by user ID or brand ID; if no direct matches, deterministically assign a slice
  let userPosts = mapped.filter((p: PostType) => String(p.userId) === idStr);
  if (userPosts.length === 0 && customPosts.length === 0) {
    // Deterministic selection for creator demo profiles
    const hash = idStr.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const startIdx = hash % Math.max(1, mapped.length - 4);
    userPosts = mapped.slice(startIdx, startIdx + 4);
  }

  const combined = [...customPosts, ...userPosts];
  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(combined.length / perPage));
  const pageStart = (page - 1) * perPage;
  const pageData = combined.slice(pageStart, pageStart + perPage);

  return {
    first: 1,
    prev: page > 1 ? page - 1 : null,
    next: page < totalPages ? page + 1 : null,
    last: totalPages,
    pages: totalPages,
    items: combined.length,
    data: pageData,
  };
};

// Add new post (saved to local custom posts and TanStack cache)
export const addPost = async (post: AddPostType): Promise<PostType> => {
  const newPost: PostType = {
    id: `post_${Date.now()}`,
    title: post.title,
    body: post.body,
    tags: post.tags || ["Community", "Vibe"],
    reactions: post.reactions || { likes: 0, dislikes: 0 },
    likedBy: post.likedBy || [],
    mediaURL: post.mediaURL || "",
    views: 1,
    userId: post.userId,
    categoryName: post.categoryName || "General",
    createdAt: new Date().toISOString(),
  };

  return saveCustomPost(newPost);
};

// Delete post
export const deletePost = async (postId: string): Promise<{ success: boolean; id: string }> => {
  deleteLocalPost(postId);
  return { success: true, id: postId };
};

// Comments
export const getComments = async (id: number | string): Promise<CommentType[]> => {
  return getStoredComments(id);
};

export const addComments = async (comment: CommentType): Promise<CommentType> => {
  return addStoredComment(comment);
};

export const deleteComment = async (commentId: string): Promise<{ success: boolean; id: string }> => {
  deleteStoredComment(commentId);
  return { success: true, id: commentId };
};

// Update reactions (likes / unlikes)
export const updateReactions = async ({
  postId,
  reactions,
  likedBy,
}: IReactions): Promise<IReactions> => {
  saveReactions(postId, reactions, likedBy || []);
  return { postId, reactions, likedBy };
};

// Search posts
export const searchPosts = async (query: string): Promise<{ data: PostType[] }> => {
  if (!query.trim()) {
    return { data: [] };
  }
  const q = query.toLowerCase().trim();

  // Search in both custom posts and Route Misr products
  const custom = getCustomPosts().filter((p) => {
    return (
      p.title.toLowerCase().includes(q) ||
      p.body.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const res = await API.get("/products", { params: { limit: 50 } });
  const remote = (res.data?.data || []).map(mapProductToPost).filter((p: PostType) => {
    return (
      p.title.toLowerCase().includes(q) ||
      p.body.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return { data: [...custom, ...remote] };
};

// Fetch Route Misr categories for Feed filter pills
export const getCategories = async (): Promise<CategoryType[]> => {
  const res = await API.get("/categories");
  return res.data?.data || [];
};