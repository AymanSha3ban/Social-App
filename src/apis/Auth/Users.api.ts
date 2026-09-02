
import {API} from '../BaseAPI.ts';

export const getUser = async (id: number) => {
  const { data } = await API.get(`/users/${id}`); 
  return data;
};
export const getUsers = async () => {
  const { data } = await API.get("/users");
  return data;
};

export const getLoginedUser = async () => {
  const userId = localStorage.getItem('userId');
  const { data } = await API.get(`/users/${userId}`); 
  return data;
};

export const patchUser = async (id: string, userData: Partial<import('../../interfaces/interfaces.ts').UserType>) => {
  const { data } = await API.patch(`/users/${id}`, userData);
  return data;
};

export const searchUsers = async (query: string) => {
  const { data } = await API.get(`/users?q=${query}`);
  return data;
};