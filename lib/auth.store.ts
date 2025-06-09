import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the store's interface for type safety
interface AuthStore {
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthState: (userId: string | null) => void;
  clearAuthState: () => void;
}

// Create the Zustand store
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      userId: null,
      user: null,
      isAuthenticated: false,
      isLoading: true, // Start with loading state for Clerk initialization
      setAuthState: (userId) =>
        set({
          userId,
          isAuthenticated: !!userId, // Set to true if userId exists
          isLoading: false,
        }),
      clearAuthState: () =>
        set({
          userId: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: 'auth-storage', // Key for localStorage
      storage: createJSONStorage(() => localStorage), // Persist to localStorage
    }
  )
);