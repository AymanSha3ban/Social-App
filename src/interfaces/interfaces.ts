

export interface CounterContextType {
    counter: number;
    incrementCounter: () => void;
}

export interface AuthContextType {
    isAuthed: string | null;
    setIsAuthed: (isAuthed: string | null) => void;
}

export interface DarkModeContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export interface PostType {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
}