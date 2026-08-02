import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema, type LoginData } from "../schema/LoginSchema";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../apis/Login.api";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
  });

  const navigate = useNavigate() ;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const onSubmit =async  (data: LoginData) => {
    try{
      const my_data = await loginUser(data) ;
      setLoading(true);
      setError('');
      navigate('/home') ;
      console.log("User login successfully:", my_data);   
    }catch(err){
      setLoading(false);
      setError('Invalid username or password');
      console.log(err)
    }  
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md flex flex-col bg-white p-8 rounded-2xl shadow-xl shadow-purple-200 gap-5"
      >
        <div className="flex flex-col">
          <input
            type="username"
            {...register("username")}
            placeholder="Your email"
            className="w-full p-2 outline-none border-b-2 border-gray-300 focus:border-purple-500 transition-colors bg-transparent placeholder-gray-400"
          />
          {errors.username && (
            <span className="text-red-500 text-xs font-medium mt-1">
              {errors.username.message}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <input
            type="password"
            {...register("password")}
            placeholder="Enter the password"
            className="w-full p-2 outline-none border-b-2 border-gray-300 focus:border-purple-500 transition-colors bg-transparent placeholder-gray-400"
          />
          {errors.password && (
            <span className="text-red-500 text-xs font-medium mt-1">
              {errors.password.message}
            </span>
          )}
        </div>
        <div className="text-red-500 text-xs font-medium mt-1">{error&&error}</div>
        <button
          type="submit"
          className="w-full mt-4 py-3 rounded-xl cursor-pointer bg-purple-600 text-white font-bold text-lg shadow-lg shadow-purple-300 hover:bg-purple-700 hover:scale-[1.02] transition-all"
        >
          {loading ? <i className="fas fa-spinner fa-spin"></i> : "Login"}
        </button>
        <div className="flex justify-between px-5">
          <p>If you don't have account</p>
          <Link className="text-purple-500 font-bold" to={'/register'}>Go to have account</Link>
        </div>
      </form>
    </div>
  );
}