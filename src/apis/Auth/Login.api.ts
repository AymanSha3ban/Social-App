
import type { UserType } from "../../interfaces/interfaces";
import {API} from '../BaseAPI.ts';

export const loginUser = async (loginFormData: { username: string; password: string }) => {
  const { data: users } = await API.get(`/users?username=${loginFormData.username}`);
  
  const user = users.find((u:UserType) => u.password === loginFormData.password);

  if (!user) {
    throw new Error("اسم المستخدم أو كلمة المرور غير صحيحة");
  }

  return user;
};