import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user?: User;
  isAuthenticated: boolean;
  unreadNotifications: number;
  signIn: (user: User) => void;
  signUp: (user: User) => void;
  signOut: () => void;
  setUnreadNotifications: (count: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: undefined,
      isAuthenticated: false,
      unreadNotifications: 0,
      signIn: (user) => set({ user, isAuthenticated: true, unreadNotifications: 0 }),
      signUp: (user) => set({ user, isAuthenticated: true, unreadNotifications: 0 }),
      signOut: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
        }
        set({ user: undefined, isAuthenticated: false, unreadNotifications: 0 });
      },
      setUnreadNotifications: (count) => set({ unreadNotifications: count }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
