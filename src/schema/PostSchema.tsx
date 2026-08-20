import { z } from "zod";

export const PostSchema = z.object({
  title : z.string().min(3 , "very small title") ,
  body : z.string().min(10 ,"very small body") ,
  mediaURL : z.string().url({ message: "Please Enter correct Image URL" }).optional()
})

export type PostSchemaType =  z.Infer<typeof PostSchema>