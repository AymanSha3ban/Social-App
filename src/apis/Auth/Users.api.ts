import axios from "axios";


export const  getUser = async (id : number)=>{
    const {data}= await axios.get(`https://dummyjson.com/users/${id}`) ; 
    return data ;
}