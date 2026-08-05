import { getPosts } from "../apis/Posts.api";
import { useQuery } from "@tanstack/react-query";
import type { PostType } from "../interfaces/interfaces";

export default function Post() {
  const {isLoading , isError , data } = useQuery<PostType[]>({ queryKey: ['posts'] , queryFn : getPosts}) ;

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
    <div className="flex flex-col gap-8 p-4 max-w-2xl mx-auto">
      {data?.map((post) => (
        <div 
          key={post.id} 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors"
        >
          {/* Post Header: User Info */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-50 dark:border-gray-700">
            <img 
              src={`https://i.pravatar.cc/150?u=${post.userId}`} // link to make  avatar based on userId
              alt="User Avatar" 
              className="w-10 h-10 rounded-full object-cover bg-gray-200"
            />
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                User {post.userId}
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
          <img 
            src={`https://picsum.photos/seed/${post.id}/800/400`} 
            alt="Post Cover" 
            className="w-full h-64 object-cover"
          />

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
              <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                <i className="fa-regular fa-comment text-lg"></i>
                <span className="font-medium">24</span>
              </button>
            </div>

            {/* Views */}
            <div className="flex items-center gap-1.5 text-gray-400">
              <i className="fa-regular fa-eye"></i>
              <span>{post.views}</span>
            </div>
            
          </div>
        </div>
      ))}
    </div>
  );
}