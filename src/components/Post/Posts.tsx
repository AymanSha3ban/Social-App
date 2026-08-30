import PostCard from "./PostCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../../apis/Posts/Posts.api";


export default function Posts() {

  const {
    isLoading , 
    isError , 
    data , 
    fetchNextPage , 
    hasNextPage ,
    isFetchingNextPage 
  } = useInfiniteQuery({ 
    queryKey: ['posts'] ,
    queryFn : ({pageParam}) => getPosts(pageParam),
    initialPageParam : 1 ,
    getNextPageParam :(lastPage)=>{
      return lastPage.next ;
    }
  }) ;
  console.log(data)

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
      {data?.pages.map((page) =>
        page.data.map((post)=><PostCard post={post} key={post.id} />) ) }
      <button
        disabled={!hasNextPage || isFetchingNextPage}
        onClick={() => fetchNextPage()}
        className="
          w-40 m-auto
          px-5 py-2.5
          rounded-xl
          text-sm font-semibold
          text-white
          bg-purple-600
          shadow-lg shadow-purple-500/30

          hover:bg-purple-700
          hover:shadow-purple-500/40
          hover:scale-105

          dark:bg-purple-700
          dark:hover:bg-purple-600
          dark:shadow-purple-900/50

          disabled:opacity-50
          disabled:cursor-not-allowed
          disabled:hover:scale-100
          disabled:hover:bg-purple-600
          disabled:shadow-none

          transition-all duration-300
        "
      >
        {isFetchingNextPage
          ? "Loading..."
          : hasNextPage
            ? "Load More"
            : "No more posts"}
      </button>
    </div>
  );
}