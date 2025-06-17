import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useMergeCartMutation } from './cart.queries';
import { useCartStore } from './cart.store';
import { toast } from 'sonner';

export const useCartMerge = () => {
  const { userId } = useAuth();
  // const userId = null;
  const mergeCartMutation = useMergeCartMutation();
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  
  // Use ref to track if merge has been attempted for current cart
  const mergeAttemptedRef = useRef<string | null>(null);

  // Memoized function to clear expired cart
  const clearExpiredCart = useCallback(() => {
    if (!cart || cart.id !== 'local') return;
    
    const lastUpdated = new Date(cart.updatedAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      clearCart();
      toast.info('Local cart cleared due to inactivity.');
      return true; // Indicate cart was cleared
    }
    return false;
  }, [cart, clearCart]);

  // Memoized function to handle cart merge
  const handleCartMerge = useCallback(() => {
    if (!userId || !cart || cart.id !== 'local' || cart.items.length === 0) {
      return;
    }

    // Create a unique identifier for this cart state
    const cartStateId = `${cart.id}-${cart.items.length}-${cart.updatedAt}`;
    
    // Prevent duplicate merge attempts for the same cart state
    if (mergeAttemptedRef.current === cartStateId) {
      return;
    }

    // Don't merge if already in progress
    if (mergeCartMutation.isPending) {
      return;
    }

    console.log("Cart merging in useCartMerge hook !!!");
    
    // Mark this cart state as merge attempted
    mergeAttemptedRef.current = cartStateId;

    const cartItems = cart.items.map((item) => ({ 
      variantId: item.variantId, 
      quantity: item.quantity 
    }));

    mergeCartMutation.mutate(cartItems, {
      onSuccess: () => {
        toast.success('Cart merged successfully');
        // Reset merge attempt tracking on success
        mergeAttemptedRef.current = null;
      },
      onError: (error) => {
        toast.error(`Failed to merge cart: ${error.message}`);
        // Reset merge attempt tracking on error to allow retry
        mergeAttemptedRef.current = null;
      },
    });
  }, [userId, cart, mergeCartMutation]);

  useEffect(() => {
    // First, clear expired cart if needed
    const cartWasCleared = clearExpiredCart();
    
    // Only attempt merge if cart wasn't cleared
    if (!cartWasCleared) {
      handleCartMerge();
    }
  }, [clearExpiredCart, handleCartMerge]);

  // Reset merge attempt tracking when user changes
  useEffect(() => {
    mergeAttemptedRef.current = null;
  }, [userId]);

  // Debug logging
  useEffect(() => {
    console.log("Cart from useCartMerge:", cart);
  }, [cart]);

  return { 
    isMerging: mergeCartMutation.isPending, 
    mergeError: mergeCartMutation.error,
    // Additional helpful state
    canMerge: !!(userId && cart && cart.id === 'local' && cart.items.length > 0),
    hasAttemptedMerge: mergeAttemptedRef.current !== null,
  };
};