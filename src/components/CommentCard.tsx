import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addComments, getComments, deleteComment } from "../apis/Posts/Posts.api";
import type { CommentType , UserType} from "../interfaces/interfaces";
import { useState } from "react";
import { getLoginedUser } from "../apis/Auth/Users.api";
export default function CommentCard() {
  const [commentBody, setCommentBody] = useState("");
  const { id } = useParams();
  const queryClient = useQueryClient();

  const comments = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getComments(Number(id))
  });

  const {data :user} = useQuery<UserType>({
    queryKey:['loginedUser'] ,
    queryFn: getLoginedUser
  })

  const { isPending, mutate } = useMutation({
    mutationFn: addComments,
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ['comments', id] });
      const previousComments = queryClient.getQueryData(['comments', id]);
      
      queryClient.setQueryData(['comments', id], (old: any) => {
        return old ? [...old, { ...newComment, id: Date.now().toString() }] : [{ ...newComment, id: Date.now().toString() }];
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
    if (!commentBody.trim()) return;
    mutate({
      body: commentBody,
      postId: Number(id),
      likes: 0,
      user: {
        id: user?.id ?? 1,
        username: user?.username ?? "guest",
        fullName: user ? `${user.firstName} ${user.lastName}` : "Guest User"}
    });
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="border border-slate-800 rounded-2xl p-4 shadow-xl dark:text-purple font-bold">
        <label htmlFor="message" className="block mb-2.5 text-lg font-medium text-heading">Your Comment</label>
        <textarea 
          id="message" 
          rows={2} 
          className="bg-neutral-secondary-medium border border-purple-600 text-heading text-lg rounded-xl outline-none focus:border-2 focus:border-purple-500 block w-full p-3.5 shadow-xs placeholder:text-body" 
          placeholder="Write your comment here..."  
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
        />        
        <button  
          disabled={isPending}
          type="submit"
          className="p-3 bg-purple text-blue-50 m-2.5 rounded hover:bg-purple-500 cursor-pointer disabled:opacity-50"
        >
          {isPending ? "sending..." : 'Comment'}
        </button>
      </form>

      {comments.data?.map((comment: CommentType) => (
        <div 
          key={comment.id} 
          className="group bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl hover:bg-slate-900/80 hover:border-slate-700/60 transition-all duration-300"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="relative shrink-0">
                <img 
                    src={`https://i.pravatar.cc/150?u=${comment.id}`} 
                    alt="User Avatar" 
                    className="w-10 h-10 rounded-full object-cover bg-gray-200"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
              </div>
              <h4 className="font-semibold text-slate-100 text-sm tracking-tight hover:text-indigo-400 transition-colors cursor-pointer">
                {comment.user?.fullName || "User"}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-indigo-600/20 hover:text-indigo-400 hover:border-indigo-500/30 px-3 py-1.5 rounded-lg border border-slate-700/70 transition-all duration-200">
                <i className="fa-solid fa-thumbs-up text-[11px]"></i>
                <span>{comment.likes}</span>
              </button>
              {String(comment.user?.id) === String(user?.id) && (
                <button 
                  onClick={() => mutateDelete(String(comment.id))}
                  className="flex items-center gap-1.5 text-xs font-medium text-red-400 bg-slate-800/60 hover:bg-red-600/20 hover:text-red-300 hover:border-red-500/30 px-3 py-1.5 rounded-lg border border-slate-700/70 transition-all duration-200"
                >
                  <i className="fa-solid fa-trash text-[11px]"></i>
                </button>
              )}
            </div>
          </div>

          <div className="mt-3.5 pl-13.5">
            <p className="text-slate-300 text-sm leading-relaxed font-normal">
              {comment.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}