import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema, type LoginData } from "../schema/LoginSchema";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginData) => {
    console.log("Data submited succefully");     
    console.log(data);     
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md flex flex-col bg-white p-8 rounded-2xl shadow-xl shadow-purple-200 gap-5"
      >
        <div className="flex flex-col">
          <input
            type="email"
            {...register("email")}
            placeholder="Your email"
            className="w-full p-2 outline-none border-b-2 border-gray-300 focus:border-purple-500 transition-colors bg-transparent placeholder-gray-400"
          />
          {errors.email && (
            <span className="text-red-500 text-xs font-medium mt-1">
              {errors.email.message}
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
        <button
          type="submit"
          className="w-full mt-4 py-3 rounded-xl cursor-pointer bg-purple-600 text-white font-bold text-lg shadow-lg shadow-purple-300 hover:bg-purple-700 hover:scale-[1.02] transition-all"
        >
          Login
        </button>
      </form>
    </div>
  );
}