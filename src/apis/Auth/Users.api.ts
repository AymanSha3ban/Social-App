import axios from 'axios';
import {API} from '../BaseAPI.ts';

export const getUser = async (id: number) => {
  const { data } = await API.get(`/users/${id}`); 
  return data;
};
export const getUsers = async () => {
  const { data } = await axios.get("http://localhost:3000/users")
  return data;
};

export const getLoginedUser = async () => {
  const userId = localStorage.getItem('userId');
  const { data } = await API.get(`/users/${userId}`); 
  return data;
};