import {create} from 'zustand'
import type { UserType } from '../interfaces/interfaces';

type AuthStore = {
  user: UserType | null;
  isAuthenticated: boolean;

  login: (user: UserType) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set)=>({
    user: null,
    isAuthenticated: false,

    login: (user) => {
        set({
        user,
        isAuthenticated: true,
        });
    },

    logout: () => {
        set({
        user: null,
        isAuthenticated: false,
        });
    },
}))