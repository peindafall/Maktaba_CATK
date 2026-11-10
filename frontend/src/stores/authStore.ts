import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User | null) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// Les tokens JWT sont stockés UNE seule fois (localStorage « access_token » / « refresh_token »,
// voir services/api.ts). Avant, ils étaient dupliqués ici aussi.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (userData) =>
        set((state) => ({ user: state.user ? { ...state.user, ...userData } : null })),
    }),
    {
      name: 'catk-auth-storage',
      version: 2,
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
      migrate: (persisted) => {
        const p = (persisted || {}) as Partial<AuthState>;
        return { user: p.user ?? null, isAuthenticated: !!p.isAuthenticated && !!localStorage.getItem('access_token') };
      },
    }
  )
);
