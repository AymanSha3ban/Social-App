import type { UserType } from "../../interfaces/interfaces";
import { API } from "../BaseAPI";
import { DEFAULT_DEMO_USER, getUsers } from "./Users.api";
import { mapRouteUserToUserType } from "../mappers";

export const loginUser = async (loginFormData: {
  username: string;
  password: string;
}): Promise<{ user: UserType; accessToken: string }> => {
  const input = loginFormData.username.trim().toLowerCase();
  const password = loginFormData.password.trim();

  // 1. Instant Demo Login for portfolio reviewers & testing
  if (
    input === "demo" ||
    input === "aymanshaaban" ||
    input === "ayman" ||
    input === "admin"
  ) {
    const user = { ...DEFAULT_DEMO_USER };
    localStorage.setItem("token", "portfolio-demo-token-123");
    localStorage.setItem("accessToken", "portfolio-demo-token-123");
    localStorage.setItem("userId", user.id);
    return { user, accessToken: "portfolio-demo-token-123" };
  }

  // 2. If input is an email, attempt real Route Misr auth signin
  if (input.includes("@")) {
    try {
      const res = await API.post("/auth/signin", {
        email: input,
        password: password,
      });

      if (res.data?.token) {
        const token = res.data.token;
        const apiUser = res.data.user || {};
        
        // Decode ID from JWT if present
        let userId = `user_${Date.now()}`;
        try {
          const payloadBase64 = token.split(".")[1];
          const payload = JSON.parse(atob(payloadBase64));
          if (payload.id) userId = payload.id;
        } catch {
          // ignore
        }

        const user = mapRouteUserToUserType({
          _id: userId,
          name: apiUser.name || "Route User",
          email: apiUser.email || input,
        });

        localStorage.setItem("token", token);
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userId", user.id);
        return { user, accessToken: token };
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Invalid email or password";
      throw new Error(msg);
    }
  }

  // 3. If username given without @, check against active users pool
  const allUsers = await getUsers();
  const matchedUser = allUsers.find(
    (u) =>
      u.username.toLowerCase() === input ||
      u.email.toLowerCase() === input ||
      `${u.firstName} ${u.lastName}`.toLowerCase() === input
  );

  if (matchedUser) {
    const token = `token-${matchedUser.id}-${Date.now()}`;
    localStorage.setItem("token", token);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userId", matchedUser.id);
    return { user: matchedUser, accessToken: token };
  }

  throw new Error("Invalid username or password");
};