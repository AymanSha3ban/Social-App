import axios from "axios";

export const getPosts = async ()=>{
    const res = await axios.get("https://dummyjson.com/posts");
    return res.data.posts ;
}

export const getPost = async (id: number) => {
    const res = await axios.get(`https://dummyjson.com/posts/${id}`);
    return res.data;
};
export const getPostComments = async (id: number) => {
    const res = await axios.get(`https://dummyjson.com/posts/${id}/comments`);
    return res.data;
};


