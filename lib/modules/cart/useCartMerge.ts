import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useMergeCartMutation } from './cart.queries';
import { useCartStore } from './cart.store';
import { toast } from 'sonner';

export const useCartMerge = () => {
    // const { userId } = useAuth();
    const userId = null;
  const mergeCartMutation = useMergeCartMutation();
  const cart = useCartStore((state) => state.cart);

  console.log("this is the cart from the useCartMerge fxn :", cart)

  useEffect(() => {
    const clearExpiredCart = () => {
      if (!cart || cart.id !== 'local') return;
      const lastUpdated = new Date(cart.updatedAt);
      const now = new Date(); 
      const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
      if (hoursDiff > 24) {
        useCartStore.getState().clearCart();
        toast.info('Local cart cleared due to inactivity.');
      }
    };

    clearExpiredCart();

    if (userId && cart && cart.id === 'local' && cart.items.length > 0) {
      console.log("Cart merging in useCartMerge hook !!!");
      mergeCartMutation.mutate(
        cart.items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
        {
          onSuccess: () => toast.success('Cart merged successfully'),
          onError: (error) => toast.error(`Failed to merge cart: ${error.message}`),
        }
      );
    }
  }, [userId, cart, mergeCartMutation]);

  return { isMerging: mergeCartMutation.isPending, mergeError: mergeCartMutation.error };
};