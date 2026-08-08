import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostComments } from "../apis/Posts/Posts.api";
import type { CommentType } from "../interfaces/interfaces";

export default function CommentCard() {
  const { id } = useParams();
  const comments = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getPostComments(Number(id))
  });

  return (
    <div className="space-y-4">
      {comments.data?.comments.map((comment: CommentType) => (
        <div 
          key={comment.id} 
          className="group bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl hover:bg-slate-900/80 hover:border-slate-700/60 transition-all duration-300"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="relative flex-shrink-0">
                <img 
                    src={`https://i.pravatar.cc/150?u=${comment.id }`} // link to make  avatar based on userId
                    alt="User Avatar" 
                    className="w-10 h-10 rounded-full object-cover bg-gray-200"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
              </div>
              <h4 className="font-semibold text-slate-100 text-sm tracking-tight hover:text-indigo-400 transition-colors cursor-pointer">
                    {comment.user.fullName}
              </h4>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-indigo-600/20 hover:text-indigo-400 hover:border-indigo-500/30 px-3 py-1.5 rounded-lg border border-slate-700/70 transition-all duration-200">
              <i className="fa-solid fa-thumbs-up text-[11px]"></i>
              <span>{comment.likes}</span>
            </button>
          </div>

          <div className="mt-3.5 pl-[54px]">
            <p className="text-slate-300 text-sm leading-relaxed font-normal">
              {comment.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}