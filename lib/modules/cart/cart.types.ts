export interface Variant {
  id: string;
  productId: string;
  shade?: string;
  size?: string;
  price: number;
  sku: string;
  stock: number;
  product: {
    name: string;
    slug: string;
    images: string[];
  };
}

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  variant: Variant;
}

export interface Cart {
  id: string;
  userId?: string | null;
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

export interface WishlistItem {
  id: string;
  variantId: string;
  variant: Variant;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  finish?: string;
  coverage?: string;
  avgRating: number;
  featured: boolean;
  images: string[];
  variants: Variant[];
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    reviewer: string;
    date: string;
  }>;
  collections: Array<{
    id: string;
    name: string;
    category: { id: string; name: string };
  }>;
}

export interface Category {
  id: string;
  name: string;
  collections: Array<{
    id: string;
    name: string;
    products: Product[];
  }>;
}

export interface SearchResponse {
  results: Product[];
  count: number;
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  lastUpdated: string;
}