import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <div>
            <nav className="bg-white shadow-sm border-b border-gray-100 fixed w-full z-20 top-0 left-0">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 relative">
                    
                    <Link className="logo" to={'/home'}>
                        <h2 className="text-xl font-bold tracking-widest text-purple-600">Social App</h2>
                    </Link>
                    
                    <button 
                        onClick={handleToggle} 
                        type="button"
                        className="cursor-pointer inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 bg-gray-50 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors"
                        aria-expanded={open}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                    <div className={`${!open ? 'hidden' : 'absolute top-16 right-4 w-52 bg-white shadow-xl border border-gray-100 rounded-xl p-2'} md:block md:static md:w-auto md:shadow-none md:border-none md:bg-transparent md:p-0 z-50 transition-all`}>
                        <ul className="flex flex-col gap-1 md:flex-row md:space-x-4 md:gap-0 font-medium">
                            <li>
                                <Link className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors" to={'/'}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                                    </svg>
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors" to={'/register'}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                    Register
                                </Link>
                            </li>
                            <li>
                                <label className="flex items-center justify-between px-4 py-3 cursor-pointer rounded-lg hover:bg-purple-50 transition-colors group">
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors"></span>
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                    </div>
                                    <span>
                                        <i className="fa-solid fa-sun"></i>
                                        <i className="fa-solid fa-moon"></i>
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