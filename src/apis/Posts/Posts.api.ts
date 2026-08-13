import {API} from '../BaseAPI.ts';

export const getPosts = async () => {
    const res = await API.get("/posts");
       return res.data.posts || res.data;
}

export const getPost = async (id: number) => {
    const res = await API.get(`/posts/${id}`);
    return res.data;
};

export const getPostComments = async (id: number) => {
      const res = await API.get(`/comments?postId=${id}`);
    return res.data;
};