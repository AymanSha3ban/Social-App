import axios from "axios";


const loginApi = "https://dummyjson.com/auth/login" ;

export  const loginUser = async (loginFormData : {username : string , password : string})=>{
    const {data} = await axios.post(loginApi , loginFormData) ;
    return data ;
}
