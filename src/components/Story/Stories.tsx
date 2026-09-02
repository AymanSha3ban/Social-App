import { useQuery } from "@tanstack/react-query"
import { getUsers, getLoginedUser } from "../../apis/Auth/Users.api"
import type { UserType } from "../../interfaces/interfaces";
import StoryCard from "./StoryCard";
import { useRef, useState } from "react";
import { StoriesSkeleton } from "../UI/Skeletons";
import AddStoryModal from "./AddStoryModal";

const Stories = () => {
    const { data: users, isLoading: usersLoading } = useQuery<UserType[]>({
       queryKey: ['Users'],
       queryFn: getUsers
    });

    const { data: loginUser, isLoading: loginLoading } = useQuery<UserType>({
       queryKey: ['LoginedUser'],
       queryFn: getLoginedUser
    });

    const scrollRef = useRef<HTMLDivElement>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const scroll = (direction: 'left' | 'right') => {
      if (scrollRef.current) {
        const { scrollLeft, clientWidth } = scrollRef.current;
        const offset = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
        scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
      }
    };

    if (usersLoading || loginLoading) {
        return <StoriesSkeleton />;
    }

    const sortedUsers = users ? [...users].sort((a, b) => {
      if (String(a.id) === String(loginUser?.id)) return -1;
      if (String(b.id) === String(loginUser?.id)) return 1;
      return 0;
    }) : [];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 relative group">
      <button 
        onClick={() => scroll('left')}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      <div 
        ref={scrollRef}
        className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex-shrink-0 cursor-pointer" onClick={() => setIsAddModalOpen(true)}>
          <div className="relative w-24 h-40 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 flex flex-col hover:opacity-90 transition shadow-sm">
            <img src={loginUser?.image || `https://i.pravatar.cc/150?u=${loginUser?.id}`} alt="Me" className="w-full h-2/3 object-cover"/>
            <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center border-4 border-white dark:border-[#151c2c]">
              <i className="fas fa-plus text-xs"></i>
            </div>
            <div className="flex-1 flex items-end justify-center pb-2 bg-white dark:bg-[#151c2c]">
              <span className="text-[11px] font-semibold">Create Story</span>
            </div>
          </div>
        </div>

        {
          sortedUsers.map((u) => {
            if (!u.stories || u.stories.length === 0) return null;
            const isMe = String(u.id) === String(loginUser?.id);
            return (
              <StoryCard 
                story={u.stories[0]} 
                key={u.id} 
                userId={u.id}
                UserImage={u?.image ?? ""} 
                UserName={isMe ? "Your Story" : u.firstName} 
                isMe={isMe}
              />
            );
          })
        }
      </div>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <i className="fas fa-chevron-right"></i>
      </button>

      <AddStoryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} user={loginUser} />
    </div>
  )
}

export default Stories