import { Link } from "react-router-dom";
import type { PostType, UserType } from "../../interfaces/interfaces";
import { getUser, getLoginedUser } from "../../apis/Auth/Users.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePost, updateReactions } from "../../apis/Posts/Posts.api";

export default function PostCard({ post }: { post: PostType }) {
  const { data: author } = useQuery<UserType | undefined>({
    queryKey: ["user", String(post.userId)],
    queryFn: () => getUser(post.userId),
    enabled: Boolean(post.userId),
  });

  const { data: loginUser } = useQuery<UserType>({
    queryKey: ["LoginedUser"],
    queryFn: getLoginedUser,
  });

  const queryClient = useQueryClient();

  const { mutate: mutateDelete, isPending: isDeletePending } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  const { mutate: mutateReactions } = useMutation({
    mutationFn: updateReactions,

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["post", String(newData.postId)] });

      const previousPostsData = queryClient.getQueryData(["posts"]);
      const previousPostData = queryClient.getQueryData(["post", String(newData.postId)]);

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
                    likedBy: newData.likedBy,
                  }
                : p
            ),
          })),
        };
      });

      queryClient.setQueryData(["post", String(newData.postId)], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          reactions: newData.reactions,
          likedBy: newData.likedBy,
        };
      });

      return { previousPostsData, previousPostData };
    },

    onError: (_error, newData, context) => {
      if (context?.previousPostsData) {
        queryClient.setQueryData(["posts"], context.previousPostsData);
      }
      if (context?.previousPostData) {
        queryClient.setQueryData(["post", String(newData.postId)], context.previousPostData);
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", String(variables.postId)] });
    },
  });

  const isOwnPost =
    loginUser?.id != null && String(loginUser.id) === String(post.userId);

  const handleDelete = () => {
    if (post.id == null) return;
    mutateDelete(String(post.id));
  };

  const isLiked = loginUser?.id
    ? post.likedBy?.includes(String(loginUser.id))
    : false;

  const toggleLike = () => {
    if (!loginUser?.id) return;

    const userIdStr = String(loginUser.id);
    const currentLikedBy = post.likedBy || [];
    const currentlyLiked = currentLikedBy.includes(userIdStr);

    const newLikedBy = currentlyLiked
      ? currentLikedBy.filter((id) => id !== userIdStr)
      : [...currentLikedBy, userIdStr];

    const newLikesCount = currentlyLiked
      ? Math.max(0, post.reactions.likes - 1)
      : post.reactions.likes + 1;

    mutateReactions({
      postId: String(post.id),
      reactions: {
        ...post.reactions,
        likes: newLikesCount,
      },
      likedBy: newLikedBy,
    });
  };

  const authorName = author
    ? `${author.firstName} ${author.lastName}`
    : `Creator`;

  const authorAvatar =
    author?.image || `https://i.pravatar.cc/150?u=${post.userId || post.id}`;

  return (
    <div className="bg-white dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700/80 overflow-hidden transition-all duration-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-700/60">
        <Link
          to={`/profile/${post.userId}`}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <img
            src={authorAvatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover bg-gray-200 border border-gray-200 dark:border-gray-700 group-hover:scale-105 transition-transform"
          />
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {authorName}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>@{author?.username || `user_${String(post.userId).slice(-4)}`}</span>
              {post.categoryName && (
                <>
                  <span>•</span>
                  <span className="text-purple-600 dark:text-purple-400 font-medium">
                    {post.categoryName}
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {post.price != null && (
            <span className="text-xs px-2.5 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 font-semibold rounded-full border border-purple-200/50 dark:border-purple-800/50">
              {post.price} EGP
            </span>
          )}
          {isOwnPost && (
            <button
              className="text-gray-400 hover:text-red-500 text-xs px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
              onClick={handleDelete}
              disabled={isDeletePending}
              title="Delete Post"
            >
              {isDeletePending ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fa-regular fa-trash-can"></i>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        <Link to={`/posts/${post.id}`}>
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white leading-snug hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm line-clamp-3">
          {post.body}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="text-purple-600 dark:text-purple-400 text-xs font-medium bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/60 transition"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {post.mediaURL && (
        <Link to={`/posts/${post.id}`} className="block overflow-hidden group">
          <img
            src={post.mediaURL}
            alt="Post Cover"
            className="w-full max-h-96 object-cover bg-gray-100 dark:bg-gray-900 group-hover:scale-101 transition-transform duration-300"
            onError={(e) => {
              // Graceful fallback if external image fails
              e.currentTarget.src = `https://picsum.photos/seed/${post.id}/800/400`;
            }}
          />
        </Link>
      )}

      <div className="p-4 border-t border-gray-50 dark:border-gray-700/60 flex justify-between items-center text-gray-600 dark:text-gray-300 text-sm">
        <div className="flex gap-6">
          <button
            type="button"
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isLiked
                ? "text-purple-600 dark:text-purple-400 font-semibold"
                : "hover:text-purple-600 dark:hover:text-purple-400"
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleLike();
            }}
          >
            <i className={`${isLiked ? "fa-solid" : "fa-regular"} fa-thumbs-up text-lg`}></i>
            <span className="font-medium">{post.reactions.likes}</span>
          </button>

          <Link
            to={`/posts/${post.id}`}
            className="flex items-center gap-1.5 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <i className="fa-regular fa-comment text-lg"></i>
            <span className="font-medium">Comments</span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <i className="fa-regular fa-eye"></i>
          <span>{post.views} views</span>
        </div>
      </div>
    </div>
  );
}

