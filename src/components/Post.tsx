import PostCard from "./PostCard";
import { useContext } from "react";
import { PostContext } from "../context/createdContext/PostContext";

export default function Post() {
  
  const context = useContext(PostContext);
  const { isLoading, isError, data } = context || {};
 

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
        <PostCard post={post} key={post.id} />
      ))}
    </div>
  );
}