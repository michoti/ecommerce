import { Variant, Product } from '@/lib/data';

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  variant: Variant & { product: Pick<Product, 'name' | 'slug' | 'images'> };
}

export interface Cart {
  id: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItemInput {
  variantId: string;
  quantity: number;
}

export interface CartState {
  cart: Cart | null;
  setCart: (cart: Cart | null) => void;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItemQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => void;
  mergeCart: (serverCart: Cart) => void;
}