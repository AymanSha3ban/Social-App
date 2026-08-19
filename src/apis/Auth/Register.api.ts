import type { RegisterData } from "../../schema/RegisterSchema.tsx";
import { API } from '../BaseAPI.ts';

export const addUser = async (registerFormData: RegisterData) => {
  const user  = registerFormData ;
  const { data } = await API.post('/users', user); 
  return data;
};
export const checkUserExists = async (email: string) => {
  const { data } = await API.get(`/users?email=${email}`);
  return data.length > 0;
}