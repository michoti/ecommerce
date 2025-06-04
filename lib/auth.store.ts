import { create } from 'zustand';
import { AuthState } from '@/lib/modules/types';

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  setUserId: (userId: string | null) => set({ userId }),
}));