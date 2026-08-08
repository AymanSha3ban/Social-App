import axios from "axios";


export const  getUser = async (id : number)=>{
    const {data}= await axios.get(`https://dummyjson.com/users/${id}`) ; 
    return data ;
}
export const  getLoginedUser = async ()=>{
    const userId = localStorage.getItem('userId') ;
    const {data}= await axios.get(`https://dummyjson.com/users/${userId}`) ; 
    return data ;
}