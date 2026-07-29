import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RegisterSchema, type RegisterData } from "../schema/RegisterSchema";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = (data: RegisterData) => {
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
            type="text"
            {...register("name")}
            placeholder="Your name"
            className="w-full p-2 outline-none border-b-2 border-gray-300 focus:border-purple-500 transition-colors bg-transparent placeholder-gray-400"
          />
          {errors.name && (
            <span className="text-red-500 text-xs font-medium mt-1">
              {errors.name.message}
            </span>
          )}
        </div>

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
        <div className="flex flex-col">
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Repassword"
            className="w-full p-2 outline-none border-b-2 border-gray-300 focus:border-purple-500 transition-colors bg-transparent placeholder-gray-400"
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs font-medium mt-1">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <input
            type="date"
            {...register("birth")}
            className="w-full p-2 outline-none border-b-2 border-gray-300 focus:border-purple-500 transition-colors bg-transparent placeholder-gray-400"
          />
          {errors.birth && (
            <span className="text-red-500 text-xs font-medium mt-1">
              {errors.birth.message}
            </span>
          )}
        </div>

        <div className="flex flex-col mt-2">
          <span className="text-gray-600 text-sm font-medium mb-2">Gender:</span>
          <div className="flex justify-around items-center">
            <label className="flex items-center cursor-pointer text-gray-700">
              <input
                type="radio"
                value="male"
                {...register("gender")}
                className="mr-2 accent-purple-600 w-4 h-4"
              />
              Male
            </label>
            <label className="flex items-center cursor-pointer text-gray-700">
              <input
                type="radio"
                value="female"
                {...register("gender")}
                className="mr-2 accent-purple-600 w-4 h-4"
              />
              Female
            </label>
          </div>
          {errors.gender && (
            <span className="text-red-500 text-xs font-medium mt-2 text-center">
              {errors.gender.message}
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