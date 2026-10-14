import { useState } from "react";
import PostCard from "./PostCard";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getPosts, getCategories } from "../../apis/Posts/Posts.api";
import { PostSkeleton } from "../UI/Skeletons";
import type { CategoryType } from "../../interfaces/interfaces";

export default function Posts() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  // Fetch live categories from Route Misr for feed filtering
  const { data: categories } = useQuery<CategoryType[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10,
  });

  const {
    isLoading,
    isError,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts", selectedCategory],
    queryFn: ({ pageParam }) => getPosts(pageParam, selectedCategory),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.next;
    },
  });

  const allPosts = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Feed Categories Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 px-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory(undefined)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === undefined
              ? "bg-purple-600 text-white shadow-sm shadow-purple-500/30"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-950/30"
          }`}
        >
          All Feed
        </button>
        {categories?.slice(0, 8).map((cat) => {
          const isSelected = selectedCategory === cat._id;
          return (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? "bg-purple-600 text-white shadow-sm shadow-purple-500/30"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-950/30"
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-6">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : isError ? (
        <div className="flex flex-col justify-center items-center py-16 bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-800 gap-3">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Error fetching posts from live API.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-purple-600 text-white text-xs font-medium rounded-xl hover:bg-purple-700 transition"
          >
            Try Again
          </button>
        </div>
      ) : allPosts.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-16 bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-800 text-center px-4">
          <i className="fa-regular fa-folder-open text-3xl text-gray-400 mb-2"></i>
          <p className="text-gray-600 dark:text-gray-300 text-sm font-semibold">No posts found</p>
          <p className="text-gray-400 text-xs mt-1">Try selecting another category or create a new post.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {allPosts.map((post) => (
            <PostCard post={post} key={post.id} />
          ))}

          {hasNextPage && (
            <div className="flex justify-center pt-2">
              <button
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
                className="
                  px-6 py-2.5
                  rounded-xl
                  text-sm font-semibold
                  text-white
                  bg-purple-600
                  shadow-md shadow-purple-500/20
                  hover:bg-purple-700
                  hover:shadow-purple-500/30
                  hover:scale-102
                  dark:bg-purple-700
                  dark:hover:bg-purple-600
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  disabled:hover:scale-100
                  transition-all duration-200 cursor-pointer
                "
              >
                {isFetchingNextPage ? (
                  <span className="flex items-center gap-2">
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Loading more...</span>
                  </span>
                ) : (
                  "Load More Posts"
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}