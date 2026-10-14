import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addComments, getComments, deleteComment } from "../apis/Posts/Posts.api";
import type { CommentType, UserType } from "../interfaces/interfaces";
import { useState } from "react";
import { getLoginedUser } from "../apis/Auth/Users.api";

export default function CommentCard() {
  const [commentBody, setCommentBody] = useState("");
  const { id } = useParams();
  const queryClient = useQueryClient();

  const comments = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getComments(id || ""),
    enabled: Boolean(id),
  });

  const { data: user } = useQuery<UserType>({
    queryKey: ['LoginedUser'],
    queryFn: getLoginedUser,
  });

  const { isPending, mutate } = useMutation({
    mutationFn: addComments,
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ['comments', id] });
      const previousComments = queryClient.getQueryData(['comments', id]);
      
      queryClient.setQueryData(['comments', id], (old: any) => {
        return old ? [newComment, ...old] : [newComment];
      });
      
      return { previousComments };
    },
    onError: (_err, _newComment, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', id], context.previousComments);
      }
    },
    onSettled: () => {
      setCommentBody("");
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
    }
  });

  const { mutate: mutateDelete } = useMutation({
    mutationFn: deleteComment,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['comments', id] });
      const previousComments = queryClient.getQueryData(['comments', id]);
      
      queryClient.setQueryData(['comments', id], (old: any) => {
        return old ? old.filter((c: CommentType) => String(c.id) !== String(deletedId)) : [];
      });
      
      return { previousComments };
    },
    onError: (_err, _deletedId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', id], context.previousComments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim() || !id) return;
    mutate({
      body: commentBody.trim(),
      postId: id,
      likes: 0,
      user: {
        id: user?.id ?? "guest",
        username: user?.username ?? "guest",
        fullName: user ? `${user.firstName} ${user.lastName}` : "Guest User",
        avatar: user?.image || `https://i.pravatar.cc/150?u=${user?.id || "guest"}`,
      },
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors">
        <label htmlFor="message" className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
          Leave a comment
        </label>
        <textarea 
          id="message" 
          rows={2} 
          className="bg-gray-50 dark:bg-slate-800/80 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 text-sm rounded-xl outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 block w-full p-3 transition" 
          placeholder="Share your thoughts..."  
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
        />        
        <div className="flex justify-end mt-2">
          <button  
            disabled={isPending || !commentBody.trim()}
            type="submit"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl cursor-pointer disabled:opacity-50 transition shadow-sm"
          >
            {isPending ? "Posting..." : "Comment"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {comments.data?.map((comment: CommentType) => (
          <div 
            key={comment.id} 
            className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition hover:border-slate-700"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={comment.user?.avatar || `https://i.pravatar.cc/150?u=${comment.user?.id || comment.id}`} 
                  alt="User Avatar" 
                  className="w-9 h-9 rounded-full object-cover bg-gray-200 border border-gray-200 dark:border-gray-700"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-slate-100 text-xs">
                    {comment.user?.fullName || "Community Member"}
                  </h4>
                  <span className="text-[10px] text-gray-400">
                    @{comment.user?.username || "user"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <i className="fa-regular fa-thumbs-up text-[11px]"></i>
                  <span>{comment.likes}</span>
                </span>
                {String(comment.user?.id) === String(user?.id) && (
                  <button 
                    onClick={() => mutateDelete(String(comment.id))}
                    className="text-xs text-gray-400 hover:text-red-500 p-1 transition cursor-pointer"
                    title="Delete Comment"
                  >
                    <i className="fa-solid fa-trash text-[11px]"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="mt-2 pl-12 text-xs text-gray-700 dark:text-slate-300 leading-relaxed">
              <p>{comment.body}</p>
            </div>
          </div>
        ))}

        {comments.data?.length === 0 && (
          <p className="text-center text-xs text-gray-400 py-4">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}