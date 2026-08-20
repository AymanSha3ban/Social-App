import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { UserType } from "../../interfaces/interfaces";
import { getUsers } from "../../apis/Auth/Users.api";

export default function StoriesRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const { data: users, isLoading, isError } = useQuery<UserType[]>({
    queryKey: ['Users'],
    queryFn: getUsers
  });

  const STORY_DURATION = 5000; 

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(0);
    const intervalTime = 50;
    const increment = (intervalTime / STORY_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    const timeout = setTimeout(() => {
      if (users) {
        const currentUser = users.find((u) => String(u.id) === String(id));
        const stories = currentUser?.stories || [];
        
        if (currentIndex < stories.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          navigate(-1);
        }
      }
    }, STORY_DURATION);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [currentIndex, id, users, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 bg-gray-900 min-h-screen">
        <i className="fas fa-spinner fa-spin text-4xl text-purple-500"></i>
      </div>
    );
  }

  if (isError || !users) {
    return (
      <div className="flex justify-center items-center py-20 bg-gray-900 min-h-screen"> 
        <p className="text-gray-400 text-sm font-medium">
          Error fetching Stories data. Please try again later.
        </p>
      </div>
    );
  }

  const currentUser = users.find((u) => String(u.id) === String(id));
  const stories = currentUser?.stories || [];
  const currentStory = stories[currentIndex];

  if (stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white gap-4">
        <p>No stories available for this user.</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-purple-600 rounded-xl font-medium cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      navigate(-1);
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center select-none">
      
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-6 right-6 text-white text-xl z-40 hover:text-gray-300 bg-black/60 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md cursor-pointer transition"
      >
        <i className="fas fa-times"></i>
      </button>

      <div className="relative w-full max-w-sm h-[85vh] bg-gray-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-gray-800">
        
        <div className="absolute top-3 left-3 right-3 z-30 flex gap-1.5">
          {stories.map((_, idx) => {
            let widthClass = "w-0";
            if (idx < currentIndex) widthClass = "w-full";
            else if (idx === currentIndex) widthClass = `${progress}%`;

            return (
              <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-75 ease-linear"
                  style={{ width: widthClass }}
                />
              </div>
            );
          })}
        </div>

        <div className="absolute top-6 left-4 right-4 z-30 flex items-center gap-3 pointer-events-none">
          <img 
            src={currentUser?.image || `https://i.pravatar.cc/150?u=${currentUser?.id}`} 
            alt="Avatar" 
            className="w-10 h-10 rounded-full object-cover border-2 border-purple-500 shadow-md" 
          />
          <div className="flex flex-col">
            <span className="text-white font-semibold text-sm drop-shadow">
              {currentUser?.firstName} {currentUser?.lastName}
            </span>
            <span className="text-gray-300 text-[10px]">Active now</span>
          </div>
        </div>

        <div className="w-full h-full relative flex items-center justify-center bg-black">
          <img 
            src={currentStory?.mediaUrl} 
            alt="Story content" 
            className="w-full h-full object-contain" 
          />
        </div>

        <button 
          onClick={prevStory} 
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center cursor-pointer transition shadow-lg opacity-60 hover:opacity-100"
        >
          <i className="fas fa-chevron-left text-sm"></i>
        </button>

        <button 
          onClick={nextStory} 
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center cursor-pointer transition shadow-lg opacity-60 hover:opacity-100"
        >
          <i className="fas fa-chevron-right text-sm"></i>
        </button>

        <div onClick={prevStory} className="absolute left-0 top-0 w-1/4 h-full z-20 cursor-pointer" />
        <div onClick={nextStory} className="absolute right-0 top-0 w-1/4 h-full z-20 cursor-pointer" />

      </div>
    </div>
  );
}