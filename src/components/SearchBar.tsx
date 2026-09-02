import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "../apis/Auth/Users.api";
import { searchPosts } from "../apis/Posts/Posts.api";
import { Link } from "react-router-dom";
import type { UserType, PostType } from "../interfaces/interfaces";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: users, isLoading: usersLoading } = useQuery<UserType[]>({
    queryKey: ['searchUsers', query],
    queryFn: () => searchUsers(query),
    enabled: query.length > 0,
  });

  const { data: postsData, isLoading: postsLoading } = useQuery<{data: PostType[]}>({
    queryKey: ['searchPosts', query],
    queryFn: () => searchPosts(query),
    enabled: query.length > 0,
  });

  // Depending on how json-server handles it, if it returns an array directly:
  const posts = Array.isArray(postsData) ? postsData : (postsData?.data || []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLoading = usersLoading || postsLoading;
  const hasResults = (users && users.length > 0) || (posts && posts.length > 0);

  return (
    <div className="relative w-full max-w-sm hidden md:block" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <i className="fas fa-search text-gray-400"></i>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-full focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-2.5 transition-colors"
          placeholder="Search users or posts..."
        />
      </div>

      {isOpen && query.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 scrollbar-none">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <i className="fas fa-spinner fa-spin mr-2"></i> Searching...
            </div>
          ) : hasResults ? (
            <div className="p-2 space-y-4">
              {users && users.length > 0 && (
                <div>
                  <h4 className="px-2 text-xs font-bold text-gray-500 uppercase mb-2">Users</h4>
                  {users.map(u => (
                    <Link 
                      key={u.id} 
                      to={`/profile/${u.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
                    >
                      <img src={u.image || `https://i.pravatar.cc/150?u=${u.id}`} className="w-8 h-8 rounded-full" alt="avatar"/>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{u.firstName} {u.lastName}</p>
                        <p className="text-xs text-gray-500">@{u.username}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {posts && posts.length > 0 && (
                <div>
                  <h4 className="px-2 text-xs font-bold text-gray-500 uppercase mb-2">Posts</h4>
                  {posts.map(p => (
                    <Link 
                      key={p.id} 
                      to={`/posts/${p.id}`}
                      onClick={() => setIsOpen(false)}
                      className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
                    >
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{p.title}</p>
                      <p className="text-xs text-gray-500 truncate">{p.body}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
