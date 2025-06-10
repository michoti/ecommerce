// types/account.ts
export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    phone?: string
    avatar?: string
    createdAt: Date
    updatedAt: Date
  }
  
  export interface Address {
    id: string
    userId: string
    type: 'shipping' | 'billing'
    firstName: string
    lastName: string
    company?: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
    isDefault: boolean
    createdAt: Date
    updatedAt: Date
  }
  
  export interface PaymentMethod {
    id: string
    userId: string
    type: 'card' | 'paypal' | 'bank'
    cardLast4?: string
    cardBrand?: string
    cardExpMonth?: number
    cardExpYear?: number
    isDefault: boolean
    createdAt: Date
  }
  
  export interface Order {
    id: string
    userId: string
    orderNumber: string
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    total: number
    currency: string
    items: OrderItem[]
    shippingAddress: Address
    billingAddress: Address
    createdAt: Date
    updatedAt: Date
  }
  
  export interface OrderItem {
    id: string
    orderId: string
    productId: string
    productName: string
    productImage?: string
    quantity: number
    price: number
    total: number
  }
  
  export interface EmailPreference {
    id: string
    userId: string
    type: 'marketing' | 'order_updates' | 'recommendations' | 'newsletters'
    enabled: boolean
    updatedAt: Date
  }
  
  export interface SecuritySetting {
    id: string
    userId: string
    twoFactorEnabled: boolean
    loginNotifications: boolean
    dataProcessingConsent: boolean
    updatedAt: Date
  }