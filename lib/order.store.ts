import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OrderState, Order, Cart, CheckoutFormData } from '@/lib/modules/types';
import { createOrder } from '@/lib/modules/order.service';
import { toast } from 'sonner';

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      order: null,
      setOrder: (order: Order | null) => set({ order }),
      createOrder: async (cart: Cart, formData: CheckoutFormData) => {
        try {
          if (!cart.userId) throw new Error('User must be authenticated');
          const order = await createOrder(cart.userId, cart, formData);
          set({ order });
          toast.success('Order placed successfully');
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Failed to create order');
          throw error;
        }
      },
      clearOrder: () => set({ order: null }),
    }),
    {
      name: 'order-storage',
      partialize: (state) => ({ order: state.order }),
    }
  )
);