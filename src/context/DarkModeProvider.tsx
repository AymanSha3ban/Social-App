import {useState} from "react";
import { DarkModeContext } from "./createdContext/DarkContex";

export default function DarkModeProvider({children}: {children: React.ReactNode}) {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(()=>{
        const darkMode = localStorage.getItem('darkMode');
        return darkMode === 'true' ? true : false;
    });

    const toggleDarkMode = () => {
        if (isDarkMode === false) {
            localStorage.setItem('darkMode', 'true');
            setIsDarkMode(true);
            console.log(localStorage.getItem('darkMode'));
        } else {
            localStorage.setItem('darkMode', 'false');
            setIsDarkMode(false);
            console.log(localStorage.getItem('darkMode'));
        }
    };
  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
        {children}
    </DarkModeContext.Provider>
  )
}
