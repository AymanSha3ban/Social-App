import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPost } from "../apis/Posts/Posts.api";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { UserType } from "../interfaces/interfaces";
import { getLoginedUser } from "../apis/Auth/Users.api";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostSchema, type PostSchemaType } from "../schema/PostSchema";
import EmojiPicker, { Theme, type EmojiClickData } from "emoji-picker-react";

export default function CreatePost() {
  const [imgInput, setImgInput] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostSchemaType>({
    resolver: zodResolver(PostSchema),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const bodyValue = watch("body") || "";

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setValue("body", bodyValue + emojiData.emoji);
  };

  const { data: user } = useQuery<UserType>({
    queryKey: ['loginedUser'],
    queryFn: getLoginedUser,
  });

  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      toast.success("Post created successfully!");
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: () => {
      toast.error("Failed to create post. Please try again.");
    },
  });

  const onSubmit = (data: PostSchemaType) => {
    mutate({
      title: data.title,
      body: data.body,
      reactions: {
        likes: 0,
        dislikes: 0,
      },
      mediaURL: data.mediaURL ?? "",
      views: 0,
      userId: Number(user?.id)
    }); 
  };

  return (
    <div className="flex justify-center items-center w-full px-4 my-5">
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl w-full max-w-2xl transition-colors duration-300">
        
        <form onSubmit={handleSubmit(onSubmit)} className="relative flex flex-col gap-3 p-2 sm:p-4">
          
          <textarea 
            id="post-title" 
            rows={1} 
            {...register('title')}
            className="bg-gray-50 dark:bg-slate-800 border border-purple-600/50 text-slate-900 dark:text-slate-100 text-sm rounded-xl outline-none focus:border-2 focus:border-purple-500 block w-full p-3.5 placeholder:text-slate-400 resize-none transition-colors" 
            placeholder="Post title ..." 
          />
          {errors.title && (
            <span className="text-red-500 dark:text-red-400 text-xs font-medium mt-1 ml-1 flex items-center gap-1">
              <i className="fa-solid fa-circle-exclamation"></i>
              {errors.title.message}
            </span>
          )}

          <textarea 
            id="post-body" 
            rows={3} 
            {...register('body')}
            className="bg-gray-50 dark:bg-slate-800 border border-purple-600/50 text-slate-900 dark:text-slate-100 text-sm rounded-xl outline-none focus:border-2 focus:border-purple-500 block w-full p-3.5 placeholder:text-slate-400 resize-none transition-colors" 
            placeholder={`What's on your mind, ${user?.firstName || 'Ayman'}?`} 
          />
          {errors.body && (
            <span className="text-red-500 dark:text-red-400 text-xs font-medium mt-1 ml-1 flex items-center gap-1">
              <i className="fa-solid fa-circle-exclamation"></i>
              {errors.body.message}
            </span>
          )}

          {imgInput && (
            <div className="flex flex-col gap-1.5 animate-fadeIn">
              <label htmlFor="mediaURL" className="text-xs font-medium text-slate-600 dark:text-slate-300 ml-1">
                Media URL (Image / Video) :
              </label>
              <input 
                id="mediaURL" 
                type="text" 
                placeholder="https://example.com/image.jpg"
                {...register('mediaURL')} 
                className="bg-gray-50 dark:bg-slate-800 border border-purple-600/50 text-slate-900 dark:text-slate-100 text-sm rounded-xl outline-none focus:border-2 focus:border-purple-500 block w-full p-3 placeholder:text-slate-400 transition-colors"
              />
              {errors.mediaURL && (
                <span className="text-red-500 dark:text-red-400 text-xs font-medium mt-1 ml-1 flex items-center gap-1">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  {errors.mediaURL.message}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3 mt-2 px-2 transition-colors">
            
            {showEmojiPicker && (
              <div className="absolute top-40 left-40 mb-3 z-50 shadow-2xl">
                <EmojiPicker 
                  onEmojiClick={onEmojiClick} 
                  theme={Theme.AUTO} 
                  width={320}
                  height={380}
                />
              </div>
            )}

            <div className="flex items-center space-x-1">
              <button 
                type="button" 
                onClick={() => setImgInput(!imgInput)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  imgInput ? 'text-purple-600 dark:text-purple-400 bg-gray-100 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
                title="Attach Image/Video"
              >
                <i className="fa-regular fa-image text-lg"></i>
              </button>
              <button 
                type="button" 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Attach Emoji"
              >
                <i className="fa-regular fa-face-smile text-lg"></i>
              </button>
            </div>

            <button 
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-md"
            >
              {isPending ? "Posting..." : "Post"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}