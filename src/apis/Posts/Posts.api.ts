import type { AddPostType, CommentType } from '../../interfaces/interfaces.ts';
import {API} from '../BaseAPI.ts';

export const getPosts = async () => {
    const res = await API.get("/posts");
    return res.data.posts || res.data;
}

export const getPost = async (id: number) => {
    const res = await API.get(`/posts/${id}`);
    return res.data;
};
export const addPost = async (post:AddPostType) => {
    const res = await API.post(`/posts/`, post);
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