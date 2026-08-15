import { useMutation } from "@tanstack/react-query";
import { addPost } from "../apis/Posts/Posts.api";
import { useContext} from "react";
import { PostContext } from "../context/createdContext/PostContext";
import { useState} from "react";
import { useQuery} from "@tanstack/react-query";
import type { UserType } from "../interfaces/interfaces";
import { getLoginedUser } from "../apis/Auth/Users.api";
import toast from "react-hot-toast";


export default function CreatePost() {
  const context = useContext(PostContext);
  const { refetch } = context || {};

  const {data :user} = useQuery<UserType>({
    queryKey:['loginedUser'] ,
    queryFn: getLoginedUser
  })
  const [PostTitle, setPostTitle] = useState("");
  const [PostBody, setPostBody] = useState("");


  const {isPending , mutate } = useMutation({
    mutationFn : addPost ,
    onSuccess : ()=>{
      setPostTitle("") ;
      setPostBody("") ;
      refetch?.() ;
      toast.success("Post created successfully!");
    },
    onError: () => {
      toast.error("Failed to create post. Please try again.");
    }
  })

   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!PostBody.trim()) return;
    mutate({
      title: PostTitle,
      body: PostBody,
      reactions: {
        likes: 0 ,
        dislikes: 0 ,
      },
      views: 0,
      userId: user?.id ?? 1
    });
  };

 
  return (
    <div className="flex justify-center items-center w-full">
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl w-2xl">
        <div className="flex flex-col gap-2 p-4">
          <textarea 
            id="post-title" 
            rows={1} 
            value={PostTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="bg-neutral-secondary-medium border border-purple-600/50 text-slate-100 text-sm rounded-xl outline-none focus:border-2 focus:border-purple-500 block w-full p-3.5 placeholder:text-slate-400 resize-none " 
            placeholder="Post title ..." 
          />
          <textarea 
            id="post-body" 
            rows={3} 
            value={PostBody}
            onChange={(e) => setPostBody(e.target.value)}
            className="bg-neutral-secondary-medium border border-purple-600/50 text-slate-100 text-sm rounded-xl outline-none focus:border-2 focus:border-purple-500 block w-full p-3.5 placeholder:text-slate-400 resize-none" 
            placeholder="What's on your mind, Ayman?" 
          />
        </div>
        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
          <div className="flex items-center space-x-1">
            <button 
              type="button" 
              className="p-2 text-slate-400 hover:text-purple-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Attach Image"
            >
              <i className="fa-regular fa-image text-lg"></i>
            </button>
            <button 
              type="button" 
              className="p-2 text-slate-400 hover:text-purple-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Attach Emoji"
            >
              <i className="fa-regular fa-face-smile text-lg"></i>
            </button>
          </div>
          <button 
            type="submit"
            disabled={isPending}
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}