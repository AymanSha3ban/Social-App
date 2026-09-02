import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserType } from "../interfaces/interfaces";
import { getUsers, getLoginedUser, patchUser } from "../apis/Auth/Users.api";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Connections() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'suggested' | 'following'>('suggested');

  const { data: users, isLoading, isError } = useQuery<UserType[]>({
    queryKey: ['Users'],
    queryFn: getUsers
  }); 

  const { data: loginUser } = useQuery<UserType>({
    queryKey: ['LoginedUser'],
    queryFn: getLoginedUser
  });

  const { mutate: mutateFollow, isPending: isFollowPending } = useMutation({
    mutationFn: async ({ targetUser, isFollowing }: { targetUser: UserType, isFollowing: boolean }) => {
      if (!loginUser) return;
      const currentFollowing = loginUser.following || [];
      const currentFollowers = targetUser.followers || [];
      
      const newFollowing = isFollowing 
        ? currentFollowing.filter(id => id !== String(targetUser.id))
        : [...currentFollowing, String(targetUser.id)];
        
      const newFollowers = isFollowing
        ? currentFollowers.filter(id => id !== String(loginUser.id))
        : [...currentFollowers, String(loginUser.id)];

      await Promise.all([
        patchUser(String(loginUser.id), { following: newFollowing }),
        patchUser(String(targetUser.id), { followers: newFollowers })
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['LoginedUser'] });
      queryClient.invalidateQueries({ queryKey: ['Users'] });
    }
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

  const allOtherUsers = users?.filter((u) => String(u.id) !== String(loginUser?.id)) || [];
  
  const followingUsers = allOtherUsers.filter(u => loginUser?.following?.includes(String(u.id)));
  const suggestedUsers = allOtherUsers.filter(u => !loginUser?.following?.includes(String(u.id)));

  const displayUsers = activeTab === 'following' ? followingUsers : suggestedUsers;

  return (
    <div className="bg-white dark:bg-[#151c2c] p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4 transition-colors duration-300">
      <div className="flex gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
        <button 
          onClick={() => setActiveTab('suggested')}
          className={`text-sm font-bold pb-1 transition-colors ${activeTab === 'suggested' ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600' : 'text-gray-500 dark:text-gray-400'}`}
        >
          Suggested ({suggestedUsers.length})
        </button>
        <button 
          onClick={() => setActiveTab('following')}
          className={`text-sm font-bold pb-1 transition-colors ${activeTab === 'following' ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600' : 'text-gray-500 dark:text-gray-400'}`}
        >
          Following ({followingUsers.length})
        </button>
      </div>

      <div className="space-y-3 max-h-100 overflow-y-auto scrollbar-none">
        {displayUsers.map((u) => {
          const isFollowing = loginUser?.following?.includes(String(u.id));
          return (
            <div 
              key={u.id} 
              className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition group"
            >
              <Link to={`/profile/${u.id}`} className="flex items-center gap-3">
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
              </Link>

              <button 
                disabled={isFollowPending}
                onClick={() => mutateFollow({ targetUser: u, isFollowing: isFollowing ?? false })}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition disabled:opacity-50 cursor-pointer ${
                  isFollowing 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30' 
                    : 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                }`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          );
        })}
        {displayUsers.length === 0 && (
          <p className="text-xs text-center text-gray-500 mt-4">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
}