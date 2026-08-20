import { useState } from "react";
import Posts from "../components/Post/Posts";
import  CreatePost from "../components/CreatePost";
import Stories from "../components/Story/Stories";


export default function Home() {
  const [add,setAdd] = useState(false) ;
  return (
    <div className="w-full text-gray-900 dark:text-gray-100 py-10">
      <Stories/>


      <div className="flex flex-col w-full justify-center items-center">
        <button className="border-2 border-purple p-2 rounded-2xl bg-purple-900 cursor-pointer hover:bg-purple-600 transition duration-300" onClick={()=>setAdd(!add)}>Create Post</button>
      </div>
      {add&& <CreatePost/>}


      <Posts />
    </div>
  )
}