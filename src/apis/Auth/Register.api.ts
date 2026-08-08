import axios from "axios";
import type { RegisterData } from "../../schema/RegisterSchema";

export const  addUser = async (registerFormData : RegisterData)=>{
    const {data}= await axios.post('https://dummyjson.com/users/add' , registerFormData) ; 
    return data ;
}