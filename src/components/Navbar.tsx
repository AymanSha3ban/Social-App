import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/createdContext/AuthContext";
import { DarkModeContext } from "../context/createdContext/DarkContex";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { isAuthed, setIsAuthed } = useContext(AuthContext)!;
    const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext)!;
    const navigate = useNavigate();
    
    const handleToggle = () => {
        setOpen(!open);
    };
    
    const handleLogout = () => {
        setIsAuthed(null);
        localStorage.removeItem('accessToken');
        navigate('/login');
        console.log("User logged out successfully");
    }

    return (
        <div className=" w-full">
            <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm border-b border-gray-100 dark:border-gray-800 fixed w-full z-20 top-0 left-0 transition-colors duration-300">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 relative">
                    
                    <Link to="/home" className="logo text-xl font-bold tracking-widest text-purple-600 dark:text-purple-500">Social App</Link>
                    
                    <button 
                        onClick={handleToggle} 
                        type="button"
                        className="cursor-pointer inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 transition-colors"
                        aria-expanded={open}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                    <div className={`${!open ? 'hidden' : 'absolute top-16 right-4 w-52 bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-700 rounded-xl p-2'} md:block md:static md:w-auto md:shadow-none md:border-none md:bg-transparent md:p-0 z-50 transition-all`}>
                        <ul className="flex flex-col gap-1 md:flex-row md:space-x-4 md:gap-0 font-medium">
                            
                            {isAuthed ? (
                                <>
                                    <li>
                                        <Link className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-800 hover:text-purple-700 dark:hover:text-purple-400 transition-colors" to={'/home'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                            </svg>
                                            Home
                                        </Link>
                                    </li>
                                    <li onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 hover:text-red-700 dark:hover:text-red-400 transition-colors cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                        </svg>  
                                        <span>Logout</span>
                                    </li>
                                </>
                            ) :
                            (
                                <>
                                    <li>
                                        <Link className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-800 hover:text-purple-700 dark:hover:text-purple-400 transition-colors" to={'/'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                                            </svg>
                                            Login
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-800 hover:text-purple-700 dark:hover:text-purple-400 transition-colors" to={'/register'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                            </svg>
                                            Register
                                        </Link>
                                    </li>
                                </>
                            )}
                            
                            <li>
                                <label className="flex items-center justify-between px-4 py-3 cursor-pointer rounded-lg hover:bg-purple-50 dark:hover:bg-gray-800 transition-colors group">
                                    <div className="relative" onChange={toggleDarkMode}>
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                    </div>
                                    <span className="flex gap-2 text-gray-700 dark:text-gray-300 ml-3">
                                        {isDarkMode ? <i className="fa-solid fa-sun"></i>
                                        : <i className="fa-solid fa-moon"></i>}
                                    </span>
                                </label>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}