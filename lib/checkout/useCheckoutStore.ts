import { create } from 'zustand';
import { CheckoutState, ShippingMethod, PaymentMethod, OrderItem, ShippingAddress, BillingAddress } from './types';

interface CheckoutStore {
  checkout: CheckoutState;
  setShippingAddress: (address: Partial<ShippingAddress>) => void;
  setBillingAddress: (address: Partial<BillingAddress>) => void;
  setShippingMethod: (method: ShippingMethod) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setOrderItems: (items: OrderItem[]) => void;
  setCouponCode: (code: string | undefined) => void;
  setGiftOption: (option: string | undefined) => void;
  setAdditionalNotes: (notes: string | undefined) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  checkout: {
    shippingAddress: {},
    billingAddress: {},
    shippingMethod: ShippingMethod.STANDARD,
    paymentMethod: PaymentMethod.CREDIT_CARD,
    orderItems: [],
  },
  setShippingAddress: (address) =>
    set((state) => ({
      checkout: { ...state.checkout, shippingAddress: { ...state.checkout.shippingAddress, ...address } },
    })),
  setBillingAddress: (address) =>
    set((state) => ({
      checkout: { ...state.checkout, billingAddress: { ...state.checkout.billingAddress, ...address } },
    })),
  setShippingMethod: (method) =>
    set((state) => ({ checkout: { ...state.checkout, shippingMethod: method } })),
  setPaymentMethod: (method) =>
    set((state) => ({ checkout: { ...state.checkout, paymentMethod: method } })),
  setOrderItems: (items) =>
    set((state) => ({ checkout: { ...state.checkout, orderItems: items } })),
  setCouponCode: (code) =>
    set((state) => ({ checkout: { ...state.checkout, couponCode: code } })),
  setGiftOption: (option) =>
    set((state) => ({ checkout: { ...state.checkout, giftOption: option } })),
  setAdditionalNotes: (notes) =>
    set((state) => ({ checkout: { ...state.checkout, additionalNotes: notes } })),
  reset: () =>
    set({
      checkout: {
        shippingAddress: {},
        billingAddress: {},
        shippingMethod: ShippingMethod.STANDARD,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        orderItems: [],
      },
    }),
}));