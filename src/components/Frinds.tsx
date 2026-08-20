import { useQuery } from "@tanstack/react-query";
import type { UserType } from "../interfaces/interfaces";
import { getUsers, getLoginedUser } from "../apis/Auth/Users.api";

export default function Frinds() {
  const { data: users, isLoading, isError } = useQuery<UserType[]>({
    queryKey: ['Users'],
    queryFn: getUsers
  }); 

  const { data: loginUser } = useQuery<UserType>({
    queryKey: ['LoginedUser'],
    queryFn: getLoginedUser
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <i className="fas fa-spinner fa-spin text-2xl text-purple-600 dark:text-purple-400"></i>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-10"> 
        <p className="text-gray-500 dark:text-gray-400 text-xs">
          Error fetching friends.
        </p>
      </div>
    );
  }

  const filteredFriends = users?.filter(
    (u) => String(u.id) !== String(loginUser?.id)
  );

  return (
    <div className="bg-white dark:bg-[#151c2c] p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4 transition-colors duration-300">
      <h3 className="font-bold text-sm text-gray-500 dark:text-gray-400 mb-2">
        Friends ({filteredFriends?.length || 0})
      </h3>

      <div className="space-y-3 max-h-100 overflow-y-auto scrollbar-none">
        {filteredFriends?.map((u) => (
          <div 
            key={u.id} 
            className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={u.image || `https://i.pravatar.cc/150?u=${u.id}`} 
                  alt={u.firstName} 
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" 
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#151c2c] rounded-full"></span>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                  {u.firstName} {u.lastName}
                </h4>
                <p className="text-xs text-gray-400">
                  @{u.username || 'user'}
                </p>
              </div>
            </div>

            <button className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium px-3 py-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition">
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}