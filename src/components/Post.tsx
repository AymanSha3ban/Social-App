import { getPosts } from "../apis/Posts/Posts.api";
import { useQuery } from "@tanstack/react-query";
import type { PostType } from "../interfaces/interfaces";
import PostCard from "./PostCard";


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
        <PostCard post={post} key={post.id} />
      ))}
    </div>
  );
}