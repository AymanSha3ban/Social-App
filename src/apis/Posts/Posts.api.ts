import type { AddPostType, CommentType, IReactions } from '../../interfaces/interfaces.ts';
import {API} from '../BaseAPI.ts';
import type { PaginatedPosts } from '../../interfaces/interfaces.ts';

export const getPosts = async (page ? :  number): Promise<PaginatedPosts> => {
    const res = await  API.get(`/posts?_page=${page}&_per_page=10`);
    return res.data;
}

export const getPost = async (id: number) => {
    const res = await API.get(`/posts/${id}`);
    return res.data;
};
export const getUserPosts = async (page: number, userId: string) => {
  const res = await API.get(
    `/posts?userId=${userId}&_page=${page}&_per_page=5`
  );

  return res.data;
};
export const addPost = async (post:AddPostType) => {
    const res = await API.post(`/posts/`, post);
    return res.data;
};
export const deletePost = async (postId: string ) => {
    const res = await API.delete(`/posts/${postId}`);
    return res.data;
};


export const getComments = async (id: number) => {
    const res = await API.get(`/comments?postId=${id}`);
    return res.data;
};
export const addComments = async (comment:CommentType) => {
    const res = await API.post(`/comments?postId=${comment.postId}`, comment );
    return res.data;
};
export const deleteComment = async (commentId: string) => {
    const res = await API.delete(`/comments/${commentId}`);
    return res.data;
};
export const updateReactions = async ({postId , reactions, likedBy} : IReactions)=>{
    const res = await API.patch(`/posts/${postId}` , {reactions, likedBy})
    return res.data ; 
}

export const searchPosts = async (query: string) => {
    const res = await API.get(`/posts?q=${query}`);
    return res.data;
};