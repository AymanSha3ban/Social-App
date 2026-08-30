import Stories from "../components/Story/Stories";
import CreatePost from "../components/Post/CreatePost";
import Posts from "../components/Post/Posts";
import Frinds from "../components/Frinds";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../Stores/useAuthStore";

export default function Home() {
  const logout  = useAuthStore(state=>state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0b1120] text-gray-900 dark:text-gray-100 transition-colors duration-300 py-6">
      
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <aside className="hidden lg:block lg:col-span-1 space-y-4 sticky top-24 h-fit">
          <Frinds />
        </aside>

        <main className="col-span-1 lg:col-span-2 space-y-6">
          
          <section className="bg-white dark:bg-[#151c2c] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <Stories />
          </section>

          <section>
            <CreatePost />
          </section>

          <section className="space-y-4">
            <Posts /> 
          </section>
        </main>

        <aside className="hidden lg:block lg:col-span-1 flex-col justify-between sticky top-24 h-[calc(100vh-7rem)] pb-4">
          <div className="space-y-4 overflow-y-auto scrollbar-none pr-1">
            <div className="bg-white dark:bg-[#151c2c] p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-sm text-gray-500 dark:text-gray-400 mb-3">Trending Topics</h3>
              <div className="space-y-3 text-xs">
                <div className="cursor-pointer hover:underline">
                  <p className="text-gray-400">Technology · Trending</p>
                  <p className="font-bold text-sm">#ReactJS</p>
                </div>
                <div className="cursor-pointer hover:underline">
                  <p className="text-gray-400">Web Development · Trending</p>
                  <p className="font-bold text-sm">#TailwindCSS</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#151c2c] p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-sm text-gray-500 dark:text-gray-400 mb-3">Suggested for you</h3>
              <p className="text-xs text-gray-500">No suggestions right now.</p>
            </div>
          </div>

          <div 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-[#151c2c] rounded-2xl border border-gray-200 dark:border-gray-800 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer shadow-sm mt-4 shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>  
            <span className="font-medium">Logout</span>
          </div>
        </aside>

      </div>
    </div>
  );
}