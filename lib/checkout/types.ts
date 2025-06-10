export enum ShippingMethod {
    STANDARD = 'STANDARD',
    EXPRESS = 'EXPRESS',
  }
  
  export enum PaymentMethod {
    CREDIT_CARD = 'CREDIT_CARD',
    PAYPAL = 'PAYPAL',
    BANK_TRANSFER = 'BANK_TRANSFER',
  }
  
  export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
  }
  
  export enum CouponType {
    PERCENTAGE = 'PERCENTAGE',
    FIXED = 'FIXED',
  }
  
  export interface ShippingAddress {
    id: string;
    userId?: string;
    firstName: string;
    lastName: string;
    company?: string;
    address: string;
    apartment?: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
    phone?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface BillingAddress extends ShippingAddress {}
  
  export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    variantId: string;
    quantity: number;
    price: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Order {
    id: string;
    userId?: string;
    shippingAddressId: string;
    billingAddressId?: string;
    shippingAddress: ShippingAddress;
    billingAddress?: BillingAddress;
    shippingMethod: ShippingMethod;
    shippingCost: number;
    paymentMethod: PaymentMethod;
    subtotal: number;
    total: number;
    status: OrderStatus;
    couponCode?: string;
    giftOption?: string;
    additionalNotes?: string;
    createdAt: string;
    updatedAt: string;
    orderItems: OrderItem[];
  }
  
  export interface Coupon {
    id: string;
    code: string;
    discount: number;
    type: CouponType;
    validFrom: string;
    validUntil?: string;
    maxUses?: number;
    usedCount: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CheckoutState {
    shippingAddress: Partial<ShippingAddress>;
    billingAddress: Partial<BillingAddress>;
    shippingMethod: ShippingMethod;
    paymentMethod: PaymentMethod;
    orderItems: OrderItem[];
    couponCode?: string;
    giftOption?: string;
    additionalNotes?: string;
  }