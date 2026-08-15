import { createContext } from "react";
import type { PostContextType } from "../../interfaces/interfaces";
export const PostContext = createContext<PostContextType|null>(null);