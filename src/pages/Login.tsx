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
    onError: (err: any) => {
      toast.error(err.message || "Invalid username or password");
    },
  });
  
  const onSubmit = (data: LoginData) => {
    mutate(data);
  };

  const handleDemoLogin = () => {
    mutate({ username: "aymanshaaban", password: "demopassword" });
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md flex flex-col bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl shadow-purple-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 gap-5 transition-colors"
      >
        <div className="text-center mb-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Sign in with your credentials or explore via 1-click Demo
          </p>
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Username or Email
          </label>
          <input
            type="text"
            {...register("username")}
            placeholder="Username or email address"
            className="w-full p-2.5 outline-none border-b-2 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 transition-colors bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm"
          />
          {errors.username && (
            <span className="text-red-500 dark:text-red-400 text-xs font-medium mt-1">
              {errors.username.message}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            placeholder="Enter your password"
            className="w-full p-2.5 outline-none border-b-2 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 transition-colors bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm"
          />
          {errors.password && (
            <span className="text-red-500 dark:text-red-400 text-xs font-medium mt-1">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2.5 mt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-xl cursor-pointer bg-purple-600 text-white font-bold text-base shadow-lg shadow-purple-300 dark:shadow-none hover:bg-purple-700 hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {isPending ? <i className="fas fa-spinner fa-spin"></i> : "Sign In"}
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isPending}
            className="w-full py-2.5 rounded-xl cursor-pointer bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-semibold text-sm border border-purple-200 dark:border-purple-800 transition-all flex items-center justify-center gap-2"
          >
            <span>Click Demo Sign-In (Portfolio Mode)</span>
          </button>
        </div>

        <div className="flex justify-between items-center text-xs px-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400">Don't have an account?</span>
          <Link className="text-purple-600 dark:text-purple-400 font-bold hover:underline" to={'/register'}>
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}