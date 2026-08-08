import { useQuery } from "@tanstack/react-query";
import { getLoginedUser } from "../apis/Auth/Users.api";
import type { UserType } from "../interfaces/interfaces";

export default function Profile() {
  const { data : user, isLoading, isError } = useQuery<UserType>({
    queryKey: ['LoginedUser'],
    queryFn: getLoginedUser
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <i className="fas fa-spinner fa-spin text-4xl text-purple-600 dark:text-purple-400"></i>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-20"> 
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Error fetching profile data. Please try again later.
        </p>
      </div>
    );
  }

  const { image, firstName, lastName, username, email, phone, gender, address } = user ?? {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-[#151c2c] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
        <div className="h-36 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800"></div>

        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 mb-6 gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <img 
                src={image} 
                alt={firstName} 
                className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-[#151c2c] shadow-lg bg-gray-100 dark:bg-gray-800" 
              />
              <div className="flex flex-col gap-3 mt-2 sm:mt-0 sm:mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {firstName} {lastName}
                </h1>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  @{username}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800/80">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <span className="block text-xs text-gray-400 dark:text-gray-500 font-medium">Email Address</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <i className="fas fa-phone"></i>
              </div>
              <div>
                <span className="block text-xs text-gray-400 dark:text-gray-500 font-medium">Phone Number</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <i className="fas fa-venus-mars"></i>
              </div>
              <div>
                <span className="block text-xs text-gray-400 dark:text-gray-500 font-medium">Gender</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 capitalize">{gender}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <span className="block text-xs text-gray-400 dark:text-gray-500 font-medium">City / Country</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {address?.city}, {address?.country}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}