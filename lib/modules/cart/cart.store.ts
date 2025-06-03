import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { productData } from '@/lib/data';
import { CartState, CartItem } from './cart.types';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      setCart: (cart) => set({ cart }),
      addItem: async (variantId: string, quantity: number) => {
        if (quantity <= 0) throw new Error('Quantity must be greater than 0');
        const currentCart = get().cart || { id: 'local', items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        let variant;
        console.log("### AddItem fxn running in cart.store");
        for (const product of Object.values(productData.products)) {
          variant = product.variants.find((v) => v.id === variantId);
          if (variant) {
            if (variant.stock < quantity) throw new Error('Insufficient stock');
            variant = { ...variant, product: { name: product.name, slug: product.slug, images: product.images } };
            break;
          }
        }
        if (!variant) throw new Error('Variant not found');
        const existingItem = currentCart.items.find((i) => i.variantId === variantId);
        let updatedItems: CartItem[];
        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (variant.stock < newQuantity) throw new Error('Insufficient stock');
          updatedItems = currentCart.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: newQuantity } : i
          );
        } else {
          updatedItems = [...currentCart.items, { id: `temp_${Date.now()}`, variantId, quantity, variant }];
        }
        set({ cart: { ...currentCart, items: updatedItems, updatedAt: new Date().toISOString() } });
      },
      updateItemQuantity: async (cartItemId: string, quantity: number) => {
        if (quantity <= 0) throw new Error('Quantity must be greater than 0');
        const currentCart = get().cart;
        if (!currentCart) return;
        const item = currentCart.items.find((i) => i.id === cartItemId);
        if (!item) throw new Error('Item not found');
        if (item.variant.stock < quantity) throw new Error('Insufficient stock');
        const updatedItems = currentCart.items.map((i) =>
          i.id === cartItemId ? { ...i, quantity } : i
        );
        set({ cart: { ...currentCart, items: updatedItems, updatedAt: new Date().toISOString() } });
      },
      removeItem: async (cartItemId: string) => {
        const currentCart = get().cart;
        if (!currentCart) return;
        const updatedItems = currentCart.items.filter((i) => i.id !== cartItemId);
        set({ cart: { ...currentCart, items: updatedItems, updatedAt: new Date().toISOString() } });
      },
      clearCart: () => set({ cart: null }),
      mergeCart: (serverCart) => {
        const currentCart = get().cart;
        console.log("### This is the current cart in mergeCart in the cart.store file :", currentCart);
        if (!currentCart || currentCart.id !== 'local') {
          set({ cart: serverCart });
          return;
        }
        const mergedItems: CartItem[] = [...serverCart.items];
        for (const localItem of currentCart.items) {
          const existing = mergedItems.find((i) => i.variantId === localItem.variantId);
          if (existing) {
            existing.quantity = Math.min(
              existing.quantity + localItem.quantity,
              localItem.variant.stock
            );
          } else {
            mergedItems.push(localItem);
          }
        }
        set({ cart: { ...serverCart, items: mergedItems } });
      },
    }),
    {
      name: 'cart-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);