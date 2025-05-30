import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { useCartStore } from './cart.store';
import { Cart, CartItemInput } from './cart.types';
import { toast } from 'sonner';

const fetchCart = async (userId: string | null): Promise<Cart | null> => {
  if (!userId) return null;
  const response = await fetch('/api/src/cart');
  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }
  const data = await response.json();
  return data.id ? data : null;
};

const addToCart = async (userId: string | null, input: CartItemInput): Promise<Cart> => {
  if (!userId) {
    await useCartStore.getState().addItem(input.variantId, input.quantity);
    return useCartStore.getState().cart!;
  }
  const response = await fetch('/api/src/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error('Failed to add to cart');
  }
  return response.json();
};

const updateCartItem = async (userId: string | null, cartId: string, cartItemId: string, quantity: number): Promise<Cart> => {
  if (!userId) {
    await useCartStore.getState().updateItemQuantity(cartItemId, quantity);
    return useCartStore.getState().cart!;
  }
  const response = await fetch(`/api/src/cart/${cartId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartItemId, quantity }),
  });
  if (!response.ok) {
    throw new Error('Failed to update cart item');
  }
  return response.json();
};

const removeCartItem = async (userId: string | null, cartId: string, cartItemId: string): Promise<Cart> => {
  if (!userId) {
    await useCartStore.getState().removeItem(cartItemId);
    return useCartStore.getState().cart!;
  }
  const response = await fetch(`/api/src/cart/${cartId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartItemId }),
  });
  if (!response.ok) {
    throw new Error('Failed to remove cart item');
  }
  return response.json();
};

const mergeCart = async (userId: string, items: CartItemInput[]): Promise<Cart> => {
  for (const item of items) {
    const response = await fetch('/api/src/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error('Failed to merge cart item');
    }
  }
  const response = await fetch('/api/src/cart');
  if (!response.ok) {
    throw new Error('Failed to fetch merged cart');
  }
  return response.json();
};

export const useCartQuery = () => {
  const { userId } = useAuth();
  return useQuery<Cart | null, Error>({
    queryKey: ['cart', userId],
    queryFn: () => fetchCart(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddToCartMutation = () => {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<Cart, Error, CartItemInput>({
    mutationFn: (input) => addToCart(userId, input),
    onSuccess: (cart) => {
      if (userId) {
        queryClient.setQueryData(['cart', userId], cart);
        useCartStore.getState().setCart(cart);
      }
      toast.success('Item added to cart');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateCartItemMutation = () => {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<Cart, Error, { cartId: string; cartItemId: string; quantity: number }>({
    mutationFn: ({ cartId, cartItemId, quantity }) => updateCartItem(userId, cartId, cartItemId, quantity),
    onSuccess: (cart) => {
      if (userId) {
        queryClient.setQueryData(['cart', userId], cart);
        useCartStore.getState().setCart(cart);
      }
      toast.success('Cart item updated');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useRemoveCartItemMutation = () => {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<Cart, Error, { cartId: string; cartItemId: string }>({
    mutationFn: ({ cartId, cartItemId }) => removeCartItem(userId, cartId, cartItemId),
    onSuccess: (cart) => {
      if (userId) {
        queryClient.setQueryData(['cart', userId], cart);
        useCartStore.getState().setCart(cart);
      }
      toast.success('Item removed from cart');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useMergeCartMutation = () => {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<Cart, Error, CartItemInput[]>({
    mutationFn: (items) => mergeCart(userId!, items),
    onSuccess: (cart) => {
      queryClient.setQueryData(['cart', userId], cart);
      useCartStore.getState().mergeCart(cart);
      toast.success('Cart merged successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};