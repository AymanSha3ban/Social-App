

export interface CounterContextType {
    counter: number;
    incrementCounter: () => void;
}

export interface AuthContextType {
    isAuthed: string | null;
    setIsAuthed: (isAuthed: string | null) => void;
}