import { useMutation } from '@tanstack/react-query';
import { useCheckoutStore } from './useCheckoutStore';
import { sendOrderConfirmationEmail } from './email.service';
import { Order, CheckoutState } from './types';
import { useCreateOrderMutation } from './order.service';
import { useCreateShippingAddressMutation, useCreateBillingAddressMutation } from './shipping.service';

interface CheckoutResponse {
  order: Order;
  clientSecret: string;
}

export const useCheckout = () => {
  const { checkout, reset } = useCheckoutStore();
  const createOrderMutation = useCreateOrderMutation();
  const createShippingAddressMutation = useCreateShippingAddressMutation();
  const createBillingAddressMutation = useCreateBillingAddressMutation();

  const checkoutMutation = useMutation({
    mutationFn: async (): Promise<CheckoutResponse> => {
      // Validate required fields
      if (!checkout.shippingAddress.firstName || !checkout.shippingAddress.address) {
        throw new Error('Shipping address is incomplete');
      }

      // Create shipping address
      const shippingAddress = await createShippingAddressMutation.mutateAsync(checkout.shippingAddress);

      // Create billing address if different
      let billingAddress;
      if (checkout.billingAddress && Object.keys(checkout.billingAddress).length > 0) {
        billingAddress = await createBillingAddressMutation.mutateAsync(checkout.billingAddress);
      }

      // Create order
      const orderData: CheckoutState = {
        ...checkout,
        shippingAddressId: shippingAddress.id,
        billingAddressId: billingAddress?.id,
      };

      const result = await createOrderMutation.mutateAsync(orderData);

      // Send confirmation email
      // await sendOrderConfirmationEmail(result.order);

      // Reset checkout state
      reset();

      return result;
    },
    onError: (error) => {
      console.error('Checkout failed:', error);
    },
  });

  return {
    checkout,
    checkoutMutation,
    isLoading: createOrderMutation.isLoading || createShippingAddressMutation.isLoading || createBillingAddressMutation.isLoading,
    error: createOrderMutation.error || createShippingAddressMutation.error || createBillingAddressMutation.error,
  };
};