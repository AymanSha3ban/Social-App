import { useState  , type ReactNode} from "react"
import {AuthContext} from './createdContext/AuthContext'

export default function AuthProvider({ children }: { children: ReactNode }){
    const [isAuthed , setIsAuthed] = useState<string | null>(()=>{
        return localStorage.getItem('accessToken') ;
    }) ;
    
    return(
        <AuthContext.Provider value={{ isAuthed , setIsAuthed }}>
            {children}
        </AuthContext.Provider>
    )
}