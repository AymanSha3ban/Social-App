import { type ReactNode} from "react"
import {PostContext} from './createdContext/PostContext'
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../apis/Posts/Posts.api";


export default function AuthProvider({ children }: { children: ReactNode }){
    const {isLoading , isError , data ,refetch } = useQuery({ queryKey: ['posts'] , queryFn : getPosts}) ;

 

    return(
        <PostContext.Provider value={{ isLoading, isError, data , refetch}}>
            {children}
        </PostContext.Provider>
    )
}