import { useMutation, useQuery } from '@tanstack/react-query';
import { Order, CheckoutState, Coupon } from './types';

interface CreateOrderResponse {
  order: Order;
  clientSecret: string;
}

const fetchCoupon = async (code: string): Promise<Coupon> => {
  const response = await fetch(`/api/coupons/${code}`);
  if (!response.ok) throw new Error('Failed to fetch coupon');
  return response.json();
};

const createOrder = async (checkout: CheckoutState): Promise<CreateOrderResponse> => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(checkout),
  });
  if (!response.ok) throw new Error('Failed to create order');
  return response.json();
};

export const useCouponQuery = (code: string) =>
  useQuery({
    queryKey: ['coupon', code],
    queryFn: () => fetchCoupon(code),
    enabled: !!code,
  });

export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: createOrder,
    onError: (error) => {
      console.error('Order creation failed:', error);
    },
  });