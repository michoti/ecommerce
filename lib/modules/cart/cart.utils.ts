import { Cart } from './cart.types';

export const calculateCartTotal = (cart: Cart | null): number => {
  if (!cart || !cart.items) return 0;
  return cart.items.reduce((total, item) => {
    return total + (item.variant.price || 0) * item.quantity;
  }, 0);
};

export const getCartItemCount = (cart: Cart | null): number => {
  if (!cart || !cart.items) return 0;
  return cart.items.reduce((count, item) => count + item.quantity, 0);
};

export const validateCartStock = (cart: Cart | null): { valid: boolean; errors: string[] } => {
  if (!cart || !cart.items) return { valid: true, errors: [] };
  const errors: string[] = [];
  for (const item of cart.items) {
    if (item.quantity > item.variant.stock) {
      errors.push(
        `Insufficient stock for ${item.variant.product.name} (${item.variant.shade || item.variant.size}): ${item.quantity} requested, ${item.variant.stock} available`
      );
    }
  }
  return { valid: errors.length === 0, errors };
};