import { useParams } from "react-router-dom";
import { getPost } from "../apis/Posts/Posts.api";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../components/Post/PostCard";
import type { PostType } from "../interfaces/interfaces";
import CommentCard from "../components/CommentCard";

export default function PostDetails() {
  const { id } = useParams();
  const postId = id ? Number(id) : NaN;
  const {isLoading , isError , data} = useQuery<PostType>({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
  });

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
    data && (
      <div className="flex flex-col gap-8 p-4 max-w-2xl mx-auto">
        <PostCard post={data}/>
        {/*comments*/}
          <div className="p-4 border-t border-gray-50 dark:border-gray-700">
            <CommentCard/>
          </div>
      </div>
    )
  )
}
