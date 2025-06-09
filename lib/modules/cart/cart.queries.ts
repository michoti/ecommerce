import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { useCartStore } from './cart.store';
import { Cart, CartItemInput } from './cart.types';
import { toast } from 'sonner';

const fetchCart = async (userId: string | null): Promise<Cart | null> => {
  if (!userId) return null;
  const response = await fetch('/api/cart');
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch cart');
  }
  const data = await response.json();
  return data.id ? data : null;
};

const addToCart = async (userId: string | null, input: CartItemInput): Promise<Cart> => {
  if (!userId) {
    try {
      await useCartStore.getState().addItem(input.variantId, input.quantity);
      const cart = useCartStore.getState().cart!;
      return cart;
    } catch (error) {
      throw new Error(error.message || 'Failed to add to guest cart');
    }
  }
  const response = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add to cart');
  }
  return response.json();
};

const updateCartItem = async (userId: string | null, cartId: string, cartItemId: string, quantity: number): Promise<Cart> => {
  if (!userId) {
    try {
      await useCartStore.getState().updateItemQuantity(cartItemId, quantity);
      return useCartStore.getState().cart!;
    } catch (error) {
      throw new Error(error.message || 'Failed to update guest cart item');
    }
  }
  const response = await fetch(`/api/cart/${cartId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartItemId, quantity }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update cart item');
  }
  return response.json();
};

const removeCartItem = async (userId: string | null, cartId: string, cartItemId: string): Promise<Cart> => {
  if (!userId) {
    try {
      await useCartStore.getState().removeItem(cartItemId);
      return useCartStore.getState().cart!;
    } catch (error) {
      throw new Error(error.message || 'Failed to remove guest cart item');
    }
  }
  const response = await fetch(`/api/cart/${cartId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartItemId }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to remove cart item');
  }
  return response.json();
};

const mergeCart = async (userId: string, items: CartItemInput[]): Promise<Cart> => {
  if (items.length === 0) {
    const response = await fetch('/api/cart');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch cart');
    }
    return response.json();
  }
  const response = await fetch('/api/cart/merge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to merge cart');
  }
  return response.json();
};

export const useCartQuery = () => {
   const { userId } = useAuth();
  // const userId = null;
  return useQuery<Cart | null, Error>({
    queryKey: ['cart', userId],
    queryFn: () => fetchCart(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddToCartMutation = () => {
  const { userId } = useAuth();
  // const userId = null;
  const queryClient = useQueryClient();
  return useMutation<Cart, Error, CartItemInput>({
    mutationFn: (input) => addToCart(userId, input),
    onMutate: async (input) => {
      if (userId) {
        await queryClient.cancelQueries({ queryKey: ['cart', userId] });
        const previousCart = queryClient.getQueryData<Cart | null>(['cart', userId]);
        const optimisticCart = {
          ...previousCart,
          id: previousCart?.id || 'temp-id',
          items: [
            ...(previousCart?.items || []),
            {
              id: `temp-${Date.now()}`,
              variantId: input.variantId,
              quantity: input.quantity,
            },
          ],
        };
        queryClient.setQueryData(['cart', userId], optimisticCart);
        return { previousCart };
      }
    },
    onSuccess: (cart) => {
      if (userId) {
        queryClient.setQueryData(['cart', userId], cart);
        useCartStore.getState().setCart(cart);
      }
      toast.success('Item added to cart');
    },
    onError: (error, _, context) => {
      if (userId && context?.previousCart !== undefined) {
        queryClient.setQueryData(['cart', userId], context.previousCart);
      }
      toast.error(error.message || 'Failed to add to cart');
    },
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      }
    },
  });
};

export const useUpdateCartItemMutation = () => {
  const { userId } = useAuth();
  // const userId = null;
  const queryClient = useQueryClient();
  return useMutation<Cart, Error, { cartId: string; cartItemId: string; quantity: number }>({
    mutationFn: ({ cartId, cartItemId, quantity }) => updateCartItem(userId, cartId, cartItemId, quantity),
    onMutate: async ({ cartId, cartItemId, quantity }) => {
      if (userId) {
        await queryClient.cancelQueries({ queryKey: ['cart', userId] });
        const previousCart = queryClient.getQueryData<Cart | null>(['cart', userId]);
        const optimisticCart = {
          ...previousCart,
          id: previousCart?.id || cartId,
          items: previousCart?.items.map(item =>
            item.id === cartItemId ? { ...item, quantity } : item
          ) || [],
        };
        queryClient.setQueryData(['cart', userId], optimisticCart);
        return { previousCart };
      }
    },
    onSuccess: (cart) => {
      if (userId) {
        queryClient.setQueryData(['cart', userId], cart);
        useCartStore.getState().setCart(cart);
      }
      toast.success('Cart item updated');
    },
    onError: (error, _, context) => {
      if (userId && context?.previousCart !== undefined) {
        queryClient.setQueryData(['cart', userId], context.previousCart);
      }
      toast.error(error.message || 'Failed to update cart item');
    },
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      }
    },
  });
};

export const useRemoveCartItemMutation = () => {
   const { userId } = useAuth();
  // const userId = null;
  const queryClient = useQueryClient();
  return useMutation<Cart, Error, { cartId: string; cartItemId: string }>({
    mutationFn: ({ cartId, cartItemId }) => removeCartItem(userId, cartId, cartItemId),
    onMutate: async ({ cartId, cartItemId }) => {
      if (userId) {
        await queryClient.cancelQueries({ queryKey: ['cart', userId] });
        const previousCart = queryClient.getQueryData<Cart | null>(['cart', userId]);
        const optimisticCart = {
          ...previousCart,
          id: previousCart?.id || cartId,
          items: previousCart?.items.filter(item => item.id !== cartItemId) || [],
        };
        queryClient.setQueryData(['cart', userId], optimisticCart);
        return { previousCart };
      }
    },
    onSuccess: (cart) => {
      if (userId) {
        queryClient.setQueryData(['cart', userId], cart);
        useCartStore.getState().setCart(cart);
      }
      toast.success('Item removed from cart');
    },
    onError: (error, _, context) => {
      if (userId && context?.previousCart !== undefined) {
        queryClient.setQueryData(['cart', userId], context.previousCart);
      }
      toast.error(error.message || 'Failed to remove cart item');
    },
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      }
    },
  });
};

export const useMergeCartMutation = () => {
   const { userId } = useAuth();
   // const userId = null;
  const queryClient = useQueryClient();
  return useMutation<Cart, Error, CartItemInput[]>({
    mutationFn: (items) => mergeCart(userId!, items),
    onSuccess: (cart) => {
      queryClient.setQueryData(['cart', userId], cart);
      useCartStore.getState().mergeCart(cart);
      toast.success('Cart merged successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to merge cart');
    },
  });
};