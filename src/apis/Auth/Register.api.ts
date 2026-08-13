import type { RegisterData } from "../../schema/RegisterSchema";
import { API } from '../BaseAPI.ts';

export const addUser = async (registerFormData: RegisterData) => {
  const user  = registerFormData ;
  const { data } = await API.post('/users', user); 
  return data;
};