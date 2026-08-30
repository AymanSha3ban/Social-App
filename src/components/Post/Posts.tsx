import PostCard from "./PostCard";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../../apis/Posts/Posts.api";
import { useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import type { PaginatedPosts } from "../../interfaces/interfaces";
import PaginationBtn from "./PaginationBtn";


export default function Posts() {
  const [page , setPage ] = useState(1)

  const {isLoading , isError , data } = useQuery<PaginatedPosts>({ 
    queryKey: ['posts'  , page ] ,
    queryFn : () => getPosts(page) ,
    placeholderData : keepPreviousData
  }) ;
 

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
      {data && (
        <PaginationBtn
          page={page}
          setPage={setPage}
          data={data}
        />
      )}
      {data?.data.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </div>
  );
}