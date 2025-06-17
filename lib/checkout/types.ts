import { z } from 'zod';

// Enum Schemas
export const ShippingMethodSchema = z.enum(['STANDARD', 'EXPRESS']);
export const PaymentMethodSchema = z.enum(['CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER']);
export const OrderStatusSchema = z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']);
export const CouponTypeSchema = z.enum(['PERCENTAGE', 'FIXED']);

// Interface Schemas
export const ShippingAddressSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  userId: z.string().min(1).optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().min(1).optional(),
  address: z.string().min(1, 'Address is required'),
  apartment: z.string().min(1).optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1).optional(),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(1).optional(),
  createdAt: z.string().datetime({ message: 'Invalid datetime format' }),
  updatedAt: z.string().datetime({ message: 'Invalid datetime format' }),
});

export const BillingAddressSchema = ShippingAddressSchema;

export const OrderItemSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  orderId: z.string().min(1, 'Order ID is required'),
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().min(1, 'Variant ID is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
  price: z.number().nonnegative('Price must be non-negative'),
  createdAt: z.string().datetime({ message: 'Invalid datetime format' }),
  updatedAt: z.string().datetime({ message: 'Invalid datetime format' }),
});

export const OrderSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  userId: z.string().min(1).optional(),
  shippingAddressId: z.string().min(1, 'Shipping address ID is required'),
  billingAddressId: z.string().min(1).optional(),
  shippingAddress: ShippingAddressSchema,
  billingAddress: BillingAddressSchema.optional(),
  shippingMethod: ShippingMethodSchema,
  shippingCost: z.number().nonnegative('Shipping cost must be non-negative'),
  paymentMethod: PaymentMethodSchema,
  subtotal: z.number().nonnegative('Subtotal must be non-negative'),
  total: z.number().nonnegative('Total must be non-negative'),
  status: OrderStatusSchema,
  couponCode: z.string().min(1).optional(),
  giftOption: z.string().min(1).optional(),
  additionalNotes: z.string().min(1).optional(),
  createdAt: z.string().datetime({ message: 'Invalid datetime format' }),
  updatedAt: z.string().datetime({ message: 'Invalid datetime format' }),
  orderItems: z.array(OrderItemSchema).min(1, 'At least one order item is required'),
});

export const CouponSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  code: z.string().min(1, 'Code is required'),
  discount: z.number().positive('Discount must be positive'),
  type: CouponTypeSchema,
  validFrom: z.string().datetime({ message: 'Invalid datetime format' }),
  validUntil: z.string().datetime({ message: 'Invalid datetime format' }).optional(),
  maxUses: z.number().int().positive('Max uses must be positive').optional(),
  usedCount: z.number().int().nonnegative('Used count must be non-negative'),
  createdAt: z.string().datetime({ message: 'Invalid datetime format' }),
  updatedAt: z.string().datetime({ message: 'Invalid datetime format' }),
});

export const CheckoutStateSchema = z.object({
  shippingAddress: ShippingAddressSchema.partial(),
  billingAddress: BillingAddressSchema.partial(),
  shippingMethod: ShippingMethodSchema,
  paymentMethod: PaymentMethodSchema,
  orderItems: z.array(OrderItemSchema).min(1, 'At least one order item is required'),
  couponCode: z.string().min(1).optional(),
  giftOption: z.string().min(1).optional(),
  additionalNotes: z.string().min(1).optional(),
});

// Inferred Types
export type ShippingMethod = z.infer<typeof ShippingMethodSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type CouponType = z.infer<typeof CouponTypeSchema>;
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;
export type BillingAddress = z.infer<typeof BillingAddressSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type Coupon = z.infer<typeof CouponSchema>;
export type CheckoutState = z.infer<typeof CheckoutStateSchema>;