import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema, type LoginData } from "../schema/LoginSchema";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { loginUser } from "../apis/Login.api";
import { AuthContext } from "../context/createdContext/AuthContext";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
  });

  const navigate = useNavigate();
  const { setIsAuthed } = useContext(AuthContext)!;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const onSubmit = async (data: LoginData) => {
    try {
      const my_data = await loginUser(data);
      setLoading(true);
      setError('');
      localStorage.setItem('accessToken', my_data.accessToken);
      setIsAuthed(my_data.accessToken);
      navigate('/home');
      console.log("User login successfully:");   
    } catch(err) {
      setLoading(false);
      setError('Invalid username or password');
      console.log(err);
    }  
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md flex flex-col bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl shadow-purple-200 dark:shadow-none border dark:border-gray-700 gap-5 transition-colors"
      >
        <div className="flex flex-col">
          <input
            type="username"
            {...register("username")}
            placeholder="Enter your username"
            className="w-full p-2 outline-none border-b-2 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 transition-colors bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          {errors.username && (
            <span className="text-red-500 dark:text-red-400 text-xs font-medium mt-1">
              {errors.username.message}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <input
            type="password"
            {...register("password")}
            placeholder="Enter the password"
            className="w-full p-2 outline-none border-b-2 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 transition-colors bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          {errors.password && (
            <span className="text-red-500 dark:text-red-400 text-xs font-medium mt-1">
              {errors.password.message}
            </span>
          )}
        </div>
        <div className="text-red-500 dark:text-red-400 text-xs font-medium mt-1">{error && error}</div>
        <button
          type="submit"
          className="w-full mt-4 py-3 rounded-xl cursor-pointer bg-purple-600 text-white font-bold text-lg shadow-lg shadow-purple-300 dark:shadow-none hover:bg-purple-700 hover:scale-[1.02] transition-all"
        >
          {loading ? <i className="fas fa-spinner fa-spin"></i> : "Login"}
        </button>
        <div className="flex justify-between px-5">
          <p className="text-gray-600 dark:text-gray-300">If you don't have account</p>
          <Link className="text-purple-500 dark:text-purple-400 font-bold hover:text-purple-600 dark:hover:text-purple-300 transition-colors" to={'/register'}>Go to have account</Link>
        </div>
      </form>
    </div>
  );
}