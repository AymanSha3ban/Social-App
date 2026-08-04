import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useContext } from "react";
import { DarkModeContext } from "../context/createdContext/DarkContex";
export default function Layout() {
  const {isDarkMode} = useContext(DarkModeContext)!;
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