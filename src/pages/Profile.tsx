import { useQuery } from "@tanstack/react-query";
import { getLoginedUser } from "../apis/Auth/Users.api";
import type { PaginatedPosts, UserType } from "../interfaces/interfaces";
import PostCard from "../components/Post/PostCard";
import { useState } from "react";
import { getUserPosts } from "../apis/Posts/Posts.api";
import { keepPreviousData } from "@tanstack/react-query";
import PaginationBtn from "../components/Post/PaginationBtn";

export default function Profile() {
  const { data: user, isLoading, isError } = useQuery<UserType>({
    queryKey: ['LoginedUser'],
    queryFn: getLoginedUser
  });

  const [page , setPage ] = useState(1)
  const userId  = user?.id ; 
 const { isLoading: postLoading, isError: postError, data } =
  useQuery<PaginatedPosts>({
    queryKey: ['userPosts', userId, page],
    queryFn: () => getUserPosts(page, userId!),
    enabled: !!userId,
    placeholderData: keepPreviousData,
  });

  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');

  if (isLoading || postLoading) {
    return (
      <div className="flex justify-center items-center py-20 bg-gray-100 dark:bg-[#0b1120] min-h-screen">
        <i className="fas fa-spinner fa-spin text-4xl text-purple-600 dark:text-purple-400"></i>
      </div>
    );
  }

  if (isError || postError) {
    return (
      <div className="flex justify-center items-center py-20 bg-gray-100 dark:bg-[#0b1120] min-h-screen"> 
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Error fetching profile data. Please try again later.
        </p>
      </div>
    );
  }

  const { image, firstName, lastName, username, email, phone, gender, address, id, coverPath } = user ?? {};
  const posts = data?.data;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0b1120] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="bg-white dark:bg-[#151c2c] shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4">
          
          <div className="relative h-48 sm:h-80 w-full rounded-b-xl overflow-hidden bg-linear-to-r from-purple-600 via-indigo-600 to-purple-800">
            <img 
              src={coverPath} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
            <button className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 backdrop-blur-md transition">
              <i className="fas fa-camera"></i>
              <span>Edit Cover</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-end justify-between px-4 pb-4 -mt-16 sm:-mt-20 gap-4 mb-2">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
              
              <div className="relative group">
                <img 
                  src={image ? image : `https://i.pravatar.cc/150?u=${id}`} 
                  alt={firstName} 
                  className="w-36 h-36 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white dark:border-[#151c2c] shadow-xl bg-gray-200 dark:bg-gray-800" 
                />
                <button className="absolute bottom-2 right-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white p-2.5 rounded-full shadow-md transition">
                  <i className="fas fa-camera text-sm"></i>
                </button>
              </div>

              <div className="mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {firstName} {lastName}
                </h1>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mt-0.5">
                  @{username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  500 friends • Frontend Developer
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition shadow-md">
                <i className="fas fa-plus"></i>
                <span>Add Story</span>
              </button>
              <button className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition">
                <i className="fas fa-pen"></i>
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          <div className="flex border-t border-gray-200 dark:border-gray-800 gap-2 pt-1">
            <button 
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-3 font-semibold text-sm border-b-2 transition ${activeTab === 'posts' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg'}`}
            >
              Posts
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`px-4 py-3 font-semibold text-sm border-b-2 transition ${activeTab === 'about' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg'}`}
            >
              About
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {
          activeTab === 'about' ?
            <div className="md:col-span-1 space-y-4">
            <div className="bg-white dark:bg-[#151c2c] p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold mb-3">Intro</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Frontend Developer passionate about React and Tailwind CSS 🚀
              </p>
              <div className="space-y-3 text-sm border-t border-gray-100 dark:border-gray-800 pt-4">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <i className="fas fa-envelope w-5 text-purple-500"></i>
                  <span className="truncate">{email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <i className="fas fa-phone w-5 text-purple-500"></i>
                  <span>{phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <i className="fas fa-venus-mars w-5 text-purple-500"></i>
                  <span className="capitalize">{gender}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <i className="fas fa-map-marker-alt w-5 text-purple-500"></i>
                  <span>{address?.city}, {address?.country}</span>
                </div>
              </div>
            </div>
          </div>
          :
          <div className="md:col-span-2 space-y-4">
            {data && (
              <PaginationBtn
                page={page}
                setPage={setPage}
                data={data}
              />
            )}
            {posts?.map((post) => (
              <PostCard post={post} key={post.id} />
            ))}

          </div>
        }
      </div>
    </div>
  );
}