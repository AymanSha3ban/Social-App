import { Link } from "react-router-dom";
import type { PostType, UserType } from "../../interfaces/interfaces";
import { getUser } from "../../apis/Auth/Users.api";
import { useMutation, useQuery , useQueryClient } from "@tanstack/react-query";
import { getLoginedUser } from "../../apis/Auth/Users.api";
import {deletePost, updateReactions} from '../../apis/Posts/Posts.api'


export default function PostCard({post}: {post: PostType}) {

  const {data , isError , isLoading}  = useQuery<UserType | undefined>({
    queryKey: ['user', post.userId], 
    queryFn: () => getUser(post.userId),
    enabled: Boolean(post.userId),
  }) ; 

  
  const { data : loginUser} = useQuery<UserType>({
    queryKey: ['LoginedUser'],
    queryFn: getLoginedUser
  });
  
  const {mutate , isPending} = useMutation({
    mutationFn: deletePost,
  });
  
  const queryClient = useQueryClient() ;
  const { mutate: mutateReactions } = useMutation({
    mutationFn: updateReactions,

    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: ["posts"],
      });

      const previousData = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((p: PostType) =>
              String(p.id) === String(newData.postId)
                ? {
                    ...p,
                    reactions: newData.reactions,
                  }
                : p
            ),
          })),
        };
      });

      return { previousData };
    },

    onError: (_error, _newData, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["posts"],
          context.previousData
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
  const posty = loginUser?.id != null && loginUser.id === String(post.userId)

  const handleDelete = ()=>{
    if (post.id == null) return;
    mutate(String(post.id))
  }
  const mutateLikes = () => {
    mutateReactions({
      postId: String(post.id),
      reactions: {
        likes: post.reactions.likes + 1,
        dislikes: post.reactions.dislikes,
      },
    });
  };

  const mutateDislikes = () => {
    mutateReactions({
      postId: String(post.id),
      reactions: {
        likes: post.reactions.likes,
        dislikes: post.reactions.dislikes + 1,
      },
    });
  };
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
          <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-700">
            <div className="flex  gap-3">
              <img 
                src={data?.image ? data.image :`https://picsum.photos/seed/${post.id}/800/400`}
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
            {posty&&
              <button 
              className="dark:text-purple hover:text-red-500 cursor-pointer"
              onClick={handleDelete}
              disabled={isPending}
              >
               Delete Post
              </button>
            }
          </div>

          <div className="p-4">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white leading-tight">
              {post.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
              {post.body}
            </p>
  
            <div className="flex flex-wrap gap-2 mt-3">
              {post.tags?.map((tag) => (
                <span 
                  key={tag} 
                  className="text-purple-600 dark:text-purple-400 text-xs font-semibold cursor-pointer hover:underline"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {post.mediaURL &&
          <Link to={`/posts/${post.id}`}>
            <img 
              src={ post.mediaURL }
              alt="Post Cover" 
              className="w-full h-64 object-cover"
            />
          </Link>
          }
          <div className="p-4 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center text-gray-600 dark:text-gray-300 text-sm">
            
            <div className="flex gap-6">
              <button
               type="button"
               className="flex items-center gap-1.5 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  mutateLikes();
                }}
              >
                <i className="fa-regular fa-thumbs-up text-lg"></i>
                <span className="font-medium">{post.reactions.likes}</span>
              </button>
              
              <button 
                type="button"
                className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  mutateDislikes();
                }}
              >
                <i className="fa-regular fa-thumbs-down text-lg"></i>
                <span className="font-medium">{post.reactions.dislikes}</span>
              </button>

              <Link 
                to={`/posts/${post.id}`} className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"
              >
                <i className="fa-regular fa-comment text-lg"></i>
                <span className="font-medium">24</span>
              </Link>
            </div>

            <div className="flex items-center gap-1.5 text-gray-400">
              <i className="fa-regular fa-eye"></i>
              <span>{post.views}</span>
            </div>
          </div>
        </div>
    </>
  )
}
