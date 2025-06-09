import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';
import { CartState, CartItem, Variant } from './cart.types';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      setCart: (cart) => set({ cart }),
      addItem: async (variantId: string, quantity: number) => {
        try {
          if (quantity <= 0) throw new Error('Quantity must be greater than 0');
          const response = await fetch(`/api/variant/${variantId}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Variant not found');
          }
          const variant: Variant = await response.json();
          if (variant.stock < quantity) throw new Error(`Only ${variant.stock} items in stock`);
          const currentCart = get().cart || { id: 'local', userId: null, items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
          const existingItem = currentCart.items.find((i) => i.variantId === variantId);
          let updatedItems: CartItem[];
          if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (variant.stock < newQuantity) throw new Error(`Only ${variant.stock} items in stock`);
            updatedItems = currentCart.items.map((i) =>
              i.variantId === variantId ? { ...i, quantity: newQuantity } : i
            );
          } else {
            updatedItems = [...currentCart.items, { id: `temp_${Date.now()}`, variantId, quantity, variant }];
          }
          set({ cart: { ...currentCart, items: updatedItems, updatedAt: new Date().toISOString() } });
        } catch (error) {
          toast.error(error.message || 'Failed to add item');
          throw error;
        }
      },
      updateItemQuantity: async (cartItemId: string, quantity: number) => {
        try {
          if (quantity <= 0) throw new Error('Quantity must be greater than 0');
          const currentCart = get().cart;
          if (!currentCart) throw new Error('Cart not found');
          const item = currentCart.items.find((i) => i.id === cartItemId);
          if (!item) throw new Error('Item not found');
          const response = await fetch(`/api/variant/${item.variantId}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Variant not found');
          }
          const variant: Variant = await response.json();
          if (variant.stock < quantity) throw new Error(`Only ${variant.stock} items in stock`);
          const updatedItems = currentCart.items.map((i) =>
            i.id === cartItemId ? { ...i, quantity } : i
          );
          set({ cart: { ...currentCart, items: updatedItems, updatedAt: new Date().toISOString() } });
        } catch (error) {
          toast.error(error.message || 'Failed to update item');
          throw error;
        }
      },
      removeItem: async (cartItemId: string) => {
        try {
          const currentCart = get().cart;
          if (!currentCart) throw new Error('Cart not found');
          const updatedItems = currentCart.items.filter((i) => i.id !== cartItemId);
          set({ cart: { ...currentCart, items: updatedItems, updatedAt: new Date().toISOString() } });
        } catch (error) {
          toast.error(error.message || 'Failed to remove item');
          throw error;
        }
      },
      clearCart: () => {
        set({ cart: null });
        toast.success('Cart cleared');
      },
      mergeCart: async (serverCart: Cart) => {
        try {
          const currentCart = get().cart;
          if (!currentCart || currentCart.id !== 'local') {
            set({ cart: serverCart });
            return;
          }
          const mergedItems: CartItem[] = [];
          for (const item of serverCart.items) {
            const response = await fetch(`/api/variant/${item.variantId}`);
            if (!response.ok) continue;
            const variant: Variant = await response.json();
            if (variant.stock >= item.quantity) {
              mergedItems.push(item);
            }
          }
          for (const localItem of currentCart.items) {
            const existing = mergedItems.find((i) => i.variantId === localItem.variantId);
            const response = await fetch(`/api/variant/${localItem.variantId}`);
            if (!response.ok) continue;
            const variant: Variant = await response.json();
            if (existing) {
              existing.quantity = Math.min(existing.quantity + localItem.quantity, variant.stock);
            } else if (variant.stock >= localItem.quantity) {
              mergedItems.push(localItem);
            }
          }
          set({ cart: { ...serverCart, items: mergedItems } });
          toast.success('Cart merged successfully');
        } catch (error) {
          toast.error(error.message || 'Failed to merge cart');
          throw error;
        }
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);