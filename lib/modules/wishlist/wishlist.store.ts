import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { WishlistItem } from '../cart/cart.types';

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (variantId: string) => void;
  isInWishlist: (variantId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          if (state.items.some((i) => i.variantId === item.variantId)) {
            return state;
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        })),
      isInWishlist: (variantId) => get().items.some((item) => item.variantId === variantId),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);