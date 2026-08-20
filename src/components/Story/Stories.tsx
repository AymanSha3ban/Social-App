import { useQuery } from "@tanstack/react-query"
import { getUsers } from "../../apis/Auth/Users.api"
import type { UserType } from "../../interfaces/interfaces";
import StoryCard from "./StoryCard";
import { useRef } from "react";

const Stories = () => {
    const { data: users, isLoading, isError } = useQuery<UserType[]>({
       queryKey: ['Users'],
       queryFn: getUsers
     });

    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
      if (scrollRef.current) {
        const { scrollLeft, clientWidth } = scrollRef.current;
        const offset = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
        scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
      }
    };

    if (isLoading) {
        return (
        <div className="flex justify-center items-center py-20 bg-gray-100 dark:bg-[#0b1120] min-h-screen">
            <i className="fas fa-spinner fa-spin text-4xl text-purple-600 dark:text-purple-400"></i>
        </div>
        );
    }

    if (isError) {
        return (
        <div className="flex justify-center items-center py-20 bg-gray-100 dark:bg-[#0b1120] min-h-screen"> 
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Error fetching profile data. Please try again later.
            </p>
        </div>
        );
    }

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
        {
          users?.map((u) => {
            return u.stories?.map((story) => (
              <StoryCard 
                story={story} 
                key={story.id} 
                UserImage={u?.image ?? ""} 
                UserName={u.firstName} 
              />
            ));
          })
        }
      </div>
      <button 
        onClick={() => scroll('right')}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  )
}

export default Stories