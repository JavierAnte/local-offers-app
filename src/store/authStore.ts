import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// expo-secure-store has no web implementation (its web build is a stub),
// so fall back to localStorage there — dev/testing only, native still uses
// the real secure storage.
const secureStorage: StateStorage =
  Platform.OS === 'web'
    ? {
        getItem: async (name) => localStorage.getItem(name),
        setItem: async (name, value) => localStorage.setItem(name, value),
        removeItem: async (name) => localStorage.removeItem(name),
      }
    : {
        getItem: async (name) => (await SecureStore.getItemAsync(name)) ?? null,
        setItem: async (name, value) => SecureStore.setItemAsync(name, value),
        removeItem: async (name) => SecureStore.deleteItemAsync(name),
      };

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hasHydrated: true });
      },
    },
  ),
);
