import type { UserType } from "../../interfaces/interfaces";
import { API } from "../BaseAPI";
import {
  mapRouteUserToUserType,
  getUserOverrides,
  saveUserOverride,
} from "../mappers";
import { useAuthStore } from "../../Stores/useAuthStore";

// Default demo user fallback to ensure flawless UI presentation
export const DEFAULT_DEMO_USER: UserType = {
  id: "6acf7c52723f6000130a0fbc",
  firstName: "Ayman",
  lastName: "Shaaban",
  username: "aymanshaaban",
  email: "ayman.shaaban@example.com",
  phone: "+20 100 123 4567",
  gender: "male",
  birth: "1998-04-15",
  address: {
    city: "Cairo",
    country: "Egypt",
  },
  image: "https://i.pravatar.cc/150?u=ayman_portfolio",
  coverPath: "https://picsum.photos/seed/ayman_cover/1200/400",
  stories: [
    {
      id: "story_demo_1",
      mediaUrl: "https://picsum.photos/seed/story_demo_1/400/600",
    },
    {
      id: "story_demo_2",
      mediaUrl: "https://picsum.photos/seed/story_demo_2/400/600",
    },
  ],
  followers: ["6acf97f6723f6000130a1be3", "6acf964b723f6000130a1bb4"],
  following: ["6acf94fb723f6000130a1ae3", "6acf891a723f6000130a1537"],
  bio: "Full Stack Engineer & React Specialist | Building modern web experiences 🚀",
};

// Check if string is a valid MongoDB ObjectId
const isMongoId = (id: string | number) => /^[0-9a-fA-F]{24}$/.test(String(id));

export const getUser = async (id: number | string): Promise<UserType> => {
  const idStr = String(id);

  // 1. Check if it's the active logged-in user
  const activeUser = useAuthStore.getState().user;
  if (activeUser && String(activeUser.id) === idStr) {
    const overrides = getUserOverrides(idStr);
    return { ...activeUser, ...overrides };
  }

  // 2. Try fetching from Route Misr Users API if valid Mongo ID
  if (isMongoId(idStr)) {
    try {
      const res = await API.get(`/users/${idStr}`);
      if (res.data?.data) {
        return mapRouteUserToUserType(res.data.data);
      }
    } catch {
      // If /users/:id fails, check /brands/:id
      try {
        const brandRes = await API.get(`/brands/${idStr}`);
        if (brandRes.data?.data) {
          const b = brandRes.data.data;
          return {
            id: idStr,
            firstName: b.name || "Brand",
            lastName: "Creator",
            username: (b.slug || b.name || "creator").toLowerCase().replace(/[^a-z0-9_]/g, ""),
            email: `${b.slug || "creator"}@brand.com`,
            phone: "+20 100 000 0000",
            gender: "male",
            address: { city: "Global", country: "Community" },
            image: b.image || `https://i.pravatar.cc/150?u=${idStr}`,
            coverPath: `https://picsum.photos/seed/brand_${idStr}/1200/400`,
            stories: [
              { id: `s_${idStr}`, mediaUrl: `https://picsum.photos/seed/s_${idStr}/400/600` }
            ],
            followers: ["user1", "user2"],
            following: [],
            bio: `Official ${b.name} showcase profile on Social App 🌟`,
            ...getUserOverrides(idStr),
          };
        }
      } catch {
        // Continue to fallback
      }
    }
  }

  // 3. Fallback synthesized user
  const overrides = getUserOverrides(idStr);
  return {
    ...DEFAULT_DEMO_USER,
    id: idStr,
    firstName: `Creator`,
    lastName: `#${idStr.slice(-4)}`,
    username: `creator_${idStr.slice(-4)}`,
    image: `https://i.pravatar.cc/150?u=${idStr}`,
    ...overrides,
  };
};

export const getUsers = async (): Promise<UserType[]> => {
  try {
    const res = await API.get("/users", { params: { limit: 25 } });
    const rawUsers: any[] = res.data?.users || [];
    const mapped = rawUsers.map(mapRouteUserToUserType);

    // Ensure our logged-in user or demo user is included
    const currentUser = useAuthStore.getState().user || DEFAULT_DEMO_USER;
    const exists = mapped.some((u) => String(u.id) === String(currentUser.id));
    if (!exists) {
      mapped.unshift(currentUser);
    }
    return mapped;
  } catch (err) {
    console.warn("Failed to fetch Route Misr users, falling back to local pool", err);
    return [DEFAULT_DEMO_USER];
  }
};

export const getLoginedUser = async (): Promise<UserType> => {
  const storeUser = useAuthStore.getState().user;
  if (storeUser) {
    const overrides = getUserOverrides(storeUser.id);
    return { ...storeUser, ...overrides };
  }

  const storedId = localStorage.getItem("userId");
  if (storedId) {
    try {
      const user = await getUser(storedId);
      useAuthStore.getState().login(user);
      return user;
    } catch {
      // ignore
    }
  }

  // If no user is logged in, initialize default demo session
  const defaultUser = { ...DEFAULT_DEMO_USER };
  localStorage.setItem("userId", defaultUser.id);
  localStorage.setItem("accessToken", "demo-access-token-route");
  useAuthStore.getState().login(defaultUser);
  return defaultUser;
};

export const patchUser = async (
  id: string,
  userData: Partial<UserType>
): Promise<UserType> => {
  // Persist user overrides (following, followers, stories, etc.)
  saveUserOverride(id, userData);

  // If patching the active logged-in user, update the Zustand store
  const currentUser = useAuthStore.getState().user;
  if (currentUser && String(currentUser.id) === String(id)) {
    const updated = { ...currentUser, ...userData };
    useAuthStore.getState().login(updated);
    return updated;
  }

  const existing = await getUser(id);
  return { ...existing, ...userData };
};

export const searchUsers = async (query: string): Promise<UserType[]> => {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();

  const users = await getUsers();
  return users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
  );
};