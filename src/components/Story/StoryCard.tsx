import { useNavigate } from "react-router-dom";
import type { StoryType } from "../../interfaces/interfaces";

export default function StoryCard({ story , UserImage , UserName , userId}: { story: StoryType , UserImage :string, UserName : string , userId : number|string}) {
  const navigate = useNavigate()

  return (
    <>
      <div 
        onClick={() => navigate(`/story/${userId}`)}
        className="relative group w-36 h-60 min-w-36 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gray-900 border border-gray-200 dark:border-gray-800 shrink-0 cursor-pointer"
      >
        
        <img 
          src={story.mediaUrl} 
          alt="story image" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        <div className="absolute top-3 left-3 p-0.5 bg-linear-to-tr from-purple-600 to-pink-500 rounded-full shadow-md">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-white dark:bg-gray-900 border-2 border-transparent">
            <img 
              src={UserImage} 
              alt="User avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

        <div className="absolute top-3 right-3 w-7 h-7 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors">
          <i className="fas fa-plus text-xs"></i>
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-center">
          <span className="text-white text-xs font-semibold truncate block drop-shadow-md">
            {UserName}
          </span>
        </div>
      </div>
    </>
  );
}