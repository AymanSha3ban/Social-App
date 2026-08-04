import { createContext } from "react";
import type { DarkModeContextType } from "../../interfaces/interfaces";
export const DarkModeContext = createContext<DarkModeContextType | null>(null);