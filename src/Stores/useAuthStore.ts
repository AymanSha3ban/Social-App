import {create} from 'zustand'
import {persist} from 'zustand/middleware';
import type { UserType } from '../interfaces/interfaces';

type AuthStore = {
  user: UserType | null;
  login: (user: UserType) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set)=>({
            user: null,
            login: (user) => {
                set({
                user,
                });
            },

            logout: () => {
                set({
                user: null,
                });
            },
        }),
        {
            name:"auth-storage"
        }
    )
)