import type { RegisterData } from "../../schema/RegisterSchema";

import {API} from '../BaseAPI.ts';

export const addUser = async (registerFormData: RegisterData) => {
  const { data } = await API.post('/users', registerFormData); 
  return data;
};