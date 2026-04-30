'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setSession: (accessToken: string, user: User) => void;
  updateAccessToken: (accessToken: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setSession: (accessToken, user) =>
        set({
          accessToken,
          user,
        }),
      updateAccessToken: (accessToken) => set({ accessToken }),
      clearSession: () =>
        set({
          accessToken: null,
          user: null,
        }),
    }),
    {
      name: 'ums-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    },
  ),
);
