
import type { UserType } from "../../interfaces/interfaces";
import { API} from '../BaseAPI.ts';

export const loginUser = async (loginFormData: { username: string; password: string }) => {
  const { data: users } = await API.get(`/users?username=${loginFormData.username}`);
  
  const user = users.find((u:UserType) => u.password === loginFormData.password);

  if (user) {
    localStorage.setItem('token', 'fake-token-123');
    return { user, accessToken: 'fake-token-123' };
  } else {
    throw new Error("Invalid credentials");
  }

};