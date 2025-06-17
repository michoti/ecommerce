import { CheckoutState, Order, PaymentMethod, ShippingMethod } from '@/lib/checkout/types';
import db from '@/lib/prismadb';
import { NextResponse } from 'next/server';

// Map types.ts enums to Prisma enums
const mapShippingMethod = (method: ShippingMethod): string => {
  switch (method) {
    case 'STANDARD':
      return 'FLAT';
    case 'EXPRESS':
      return 'EXPRESS';
    default:
      throw new Error('Invalid shipping method');
  }
};

const mapPaymentMethod = (method: PaymentMethod): string => {
  switch (method) {
    case 'CREDIT_CARD':
      return 'CARD';
    case 'PAYPAL':
    case 'BANK_TRANSFER':
      return 'CASH'; // Map non-CARD methods to CASH for simplicity
    default:
      throw new Error('Invalid payment method');
  }
};

export async function POST(request: Request) {
  try {
    const checkout: CheckoutState = await request.json();

    // Validate required fields
    if (!checkout.shippingAddress || !checkout.billingAddress || !checkout.orderItems?.length) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Create shipping address
    const shippingAddress = await db.shippingAddress.create({
      data: {
        userId: checkout.shippingAddress.userId,
        firstName: checkout.shippingAddress.firstName!,
        lastName: checkout.shippingAddress.lastName!,
        company: checkout.shippingAddress.company,
        address: checkout.shippingAddress.address!,
        apartment: checkout.shippingAddress.apartment,
        city: checkout.shippingAddress.city!,
        state: checkout.shippingAddress.state,
        zipCode: checkout.shippingAddress.zipCode!,
        country: checkout.shippingAddress.country!,
        phone: checkout.shippingAddress.phone,
      },
    });

    // Create billing address
    const billingAddress = await db.billingAddress.create({
      data: {
        userId: checkout.billingAddress.userId,
        firstName: checkout.billingAddress.firstName!,
        lastName: checkout.billingAddress.lastName!,
        company: checkout.billingAddress.company,
        address: checkout.billingAddress.address!,
        apartment: checkout.billingAddress.apartment,
        city: checkout.billingAddress.city!,
        state: checkout.billingAddress.state,
        zipCode: checkout.billingAddress.zipCode!,
        country: checkout.billingAddress.country!,
        phone: checkout.billingAddress.phone,
      },
    });

    // Calculate totals (example logic, adjust as needed)
    const subtotal = checkout.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = checkout.shippingMethod === 'EXPRESS' ? 15.0 : 5.0; // Example
    const total = subtotal + shippingCost;

    // Create order
    const order = await db.order.create({
      data: {
        userId: checkout.shippingAddress.userId,
        shippingAddressId: shippingAddress.id,
        billingAddressId: billingAddress.id,
        shippingMethod: mapShippingMethod(checkout.shippingMethod),
        shippingCost: shippingCost,
        paymentMethod: mapPaymentMethod(checkout.paymentMethod),
        subtotal: subtotal,
        total: total,
        status: 'PENDING',
        couponCode: checkout.couponCode,
        giftOption: checkout.giftOption,
        additionalNotes: checkout.additionalNotes,
        orderItems: {
          create: checkout.orderItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        shippingAddress: true,
        billingAddress: true,
        orderItems: true,
      },
    });

    // Map Prisma Order to types.ts Order
    const response: Order = {
      id: order.id,
      userId: order.userId,
      shippingAddressId: order.shippingAddressId,
      billingAddressId: order.billingAddressId,
      shippingAddress: {
        id: order.shippingAddress.id,
        userId: order.shippingAddress.userId,
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        company: order.shippingAddress.company,
        address: order.shippingAddress.address,
        apartment: order.shippingAddress.apartment,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        zipCode: order.shippingAddress.zipCode,
        country: order.shippingAddress.country,
        phone: order.shippingAddress.phone,
        createdAt: order.shippingAddress.createdAt.toISOString(),
        updatedAt: order.shippingAddress.updatedAt.toISOString(),
      },
      billingAddress: {
        id: order.billingAddress.id,
        userId: order.billingAddress.userId,
        firstName: order.billingAddress.firstName,
        lastName: order.billingAddress.lastName,
        company: order.billingAddress.company,
        address: order.billingAddress.address,
        apartment: order.billingAddress.apartment,
        city: order.billingAddress.city,
        state: order.billingAddress.state,
        zipCode: order.billingAddress.zipCode,
        country: order.billingAddress.country,
        phone: order.billingAddress.phone,
        createdAt: order.billingAddress.createdAt.toISOString(),
        updatedAt: order.billingAddress.updatedAt.toISOString(),
      },
      shippingMethod: checkout.shippingMethod, // Return frontend enum
      shippingCost: Number(order.shippingCost),
      paymentMethod: checkout.paymentMethod, // Return frontend enum
      subtotal: Number(order.subtotal),
      total: Number(order.total),
      status: order.status,
      couponCode: order.couponCode,
      giftOption: order.giftOption,
      additionalNotes: order.additionalNotes,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      orderItems: order.orderItems.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: Number(item.price),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    };

    return NextResponse.json({ order: response, clientSecret: null });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ message: error.message || 'Failed to create order' }, { status: 500 });
  }
}