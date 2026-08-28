import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema, type LoginData } from "../schema/LoginSchema";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../apis/Auth/Login.api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "../Stores/useAuthStore";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
  });

  const navigate = useNavigate();
  const {login} = useAuthStore();

  const {mutate , isPending} = useMutation({ 
    mutationFn:loginUser ,
    onSuccess: (my_data) => {
      localStorage.setItem('accessToken', my_data.accessToken);
      localStorage.setItem('userId', my_data.user.id);
      login(my_data.user );
      toast.success("Login successful!");
      navigate('/home');
    },
    onError: () => {
      toast.error("Invalid username or password");
    },
  })
  
  const onSubmit= (data : LoginData) => {
    mutate(data)

  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md flex flex-col bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl shadow-purple-200 dark:shadow-none border dark:border-gray-700 gap-5 transition-colors"
      >
        <div className="flex flex-col">
          <input
            type="text"
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

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-4 py-3 rounded-xl cursor-pointer bg-purple-600 text-white font-bold text-lg shadow-lg shadow-purple-300 dark:shadow-none hover:bg-purple-700 hover:scale-[1.02] transition-all disabled:opacity-50"
        >
          {isPending ? <i className="fas fa-spinner fa-spin"></i> : "Login"}
        </button>

        <div className="flex justify-between px-5">
          <p className="text-gray-600 dark:text-gray-300">If you don't have account</p>
          <Link className="text-purple-500 dark:text-purple-400 font-bold hover:text-purple-600 dark:hover:text-purple-300 transition-colors" to={'/register'}>Go to have account</Link>
        </div>
      </form>
    </div>
  );
}