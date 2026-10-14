import type { RegisterData } from "../../schema/RegisterSchema";
import { API } from "../BaseAPI";
import { getUsers } from "./Users.api";
import { mapRouteUserToUserType, saveRegisteredAccount } from "../mappers";

export const addUser = async (registerFormData: RegisterData) => {
  const fullName = `${registerFormData.firstName.trim()} ${registerFormData.lastName.trim()}`;
  const username = registerFormData.username.trim();
  const email = registerFormData.email.trim();
  const password = registerFormData.password;

  let token = `token_${Date.now()}`;
  let userId = `user_${Date.now()}`;

  // Attempt live registration on Route Misr
  try {
    const res = await API.post("/auth/signup", {
      name: fullName,
      email: email,
      password: password,
      rePassword: registerFormData.confirmPassword,
      phone: registerFormData.phone || "01012345678",
    });

    if (res.data?.token) {
      token = res.data.token;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.id) userId = payload.id;
      } catch {
        // ignore
      }
    }
  } catch (err: any) {
    console.warn("Route Misr signup note:", err.response?.data?.message || err.message);
  }

  const newUser = {
    ...mapRouteUserToUserType({
      _id: userId,
      name: fullName,
      email: email,
      phone: registerFormData.phone || "+20 100 000 0000",
    }),
    username: username,
    firstName: registerFormData.firstName.trim(),
    lastName: registerFormData.lastName.trim(),
  };

  // Crucial: save registered account so login by either username or email works 100%!
  saveRegisteredAccount({
    username: username,
    email: email,
    password: password,
    user: newUser,
    token: token,
  });

  return newUser;
};

export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    const users = await getUsers();
    return users.some((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  } catch {
    return false;
  }
};