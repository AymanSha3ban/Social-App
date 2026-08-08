import { Link } from "react-router-dom";
import type { PostType, UserType } from "../interfaces/interfaces";
import { getUser } from "../apis/Auth/Users.api";
import { useQuery } from "@tanstack/react-query";



export default function PostCard({post}: {post: PostType}) {

  const {data , isError , isLoading}  = useQuery<UserType | undefined>({queryKey: ['user', post.userId], queryFn: () => getUser(post.userId)}) ; ; 

  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <i className="fas fa-spinner fa-spin text-4xl text-purple-600 dark:text-purple-400"></i>
      </div>
    );
  }
  if(isError){
    return (
      <div className="flex justify-center items-center py-20"> 
        <p className="text-gray-500 dark:text-gray-400">
          Error fetching posts. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors"
        >
          {/* Post Header: User Info */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-50 dark:border-gray-700">
            <img 
              src={data && data.image}
              alt="User Avatar" 
              className="w-10 h-10 rounded-full object-cover bg-gray-200"
            />
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                {data ? data.firstName + " " + data.lastName : `User ${post.userId}`}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                2 hours ago
              </span>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white leading-tight">
              {post.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
              {post.body}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {post.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="text-purple-600 dark:text-purple-400 text-xs font-semibold cursor-pointer hover:underline"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Post Image (Generated dynamically based on post ID) */}
          <Link to={`/posts/${post.id}`}>
            <img 
              src={`https://picsum.photos/seed/${post.id}/800/400`} 
              alt="Post Cover" 
              className="w-full h-64 object-cover"
            />
          </Link>

          {/* Post Footer: Reactions, Views, Comments */}
          <div className="p-4 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center text-gray-600 dark:text-gray-300 text-sm">
            
            <div className="flex gap-6">
              {/* Likes & Dislikes */}
              <button className="flex items-center gap-1.5 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                <i className="fa-regular fa-thumbs-up text-lg"></i>
                <span className="font-medium">{post.reactions.likes}</span>
              </button>
              
              <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                <i className="fa-regular fa-thumbs-down text-lg"></i>
                <span className="font-medium">{post.reactions.dislikes}</span>
              </button>

              {/* Comments Icon (Dummy count since API doesn't provide it here) */}
              <Link 
                to={`/posts/${post.id}`} className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"
              >
                <i className="fa-regular fa-comment text-lg"></i>
                <span className="font-medium">24</span>
              </Link>
            </div>

            {/* Views */}
            <div className="flex items-center gap-1.5 text-gray-400">
              <i className="fa-regular fa-eye"></i>
              <span>{post.views}</span>
            </div>
          </div>
        </div>
    </>
  )
}
