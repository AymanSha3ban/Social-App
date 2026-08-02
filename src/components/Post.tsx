import axios from "axios"


export default function Post() {

    const test = async() =>{
        const posts = await axios.get('https://dummyjson.com/posts') ;
        console.log(posts)
        return posts
    }
    test()
    
  return (
    <div>
        posts 
    </div>
  )
}
