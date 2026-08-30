import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useThemeStore } from "../Stores/useThemeStore";
export default function Layout() {
  const isDarkMode= useThemeStore((state)=> state.isDarkMode);
  return (
    <div className={`${isDarkMode ? 'dark':''} bg-gray-50 dark:bg-gray-900 dark:text-white flex flex-col justify-between items-center w-full min-h-screen transition-colors duration-300`}>
      <Navbar></Navbar>
      <div className="container mt-20 md:mt-24">
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  )
}