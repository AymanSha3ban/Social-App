import axios from "axios";

export const getPosts = async ()=>{
    const res = await axios.get("https://dummyjson.com/posts");
    return res.data.posts ;
}