import { useParams, useNavigate } from "react-router-dom";
import { getPost } from "../apis/Posts/Posts.api";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../components/Post/PostCard";
import type { PostType } from "../interfaces/interfaces";
import CommentCard from "../components/CommentCard";
import { PostSkeleton } from "../components/UI/Skeletons";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoading, isError, data } = useQuery<PostType>({
    queryKey: ["post", id],
    queryFn: () => getPost(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 p-4 max-w-2xl mx-auto">
        <PostSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col justify-center items-center py-20 gap-4">
        <p className="text-gray-500 dark:text-gray-400">
          Post not found or error loading post.
        </p>
        <button
          onClick={() => navigate("/home")}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition"
        >
          <i className="fas fa-arrow-left"></i>
          <span>Back</span>
        </button>
      </div>
      <PostCard post={data} />
      {/* comments */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <CommentCard />
      </div>
    </div>
  );
}

