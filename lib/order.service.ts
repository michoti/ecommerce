import db from '@/lib/prismadb';
import { Order, Cart, CheckoutFormData } from '@/lib/modules/types';
import Decimal from 'decimal.js';

export const createOrder = async (userId: string, cart: Cart, formData: CheckoutFormData): Promise<Order> => {
  return await db.$transaction(async (tx) => {
    // Validate stock
    for (const item of cart.items) {
      const variant = await tx.variant.findUnique({ where: { id: item.variantId } });
      if (!variant) throw new Error(`Variant ${item.variantId} not found`);
      if (item.quantity > variant.stock) throw new Error(`Insufficient stock for ${item.variant.product.name}`);
      await tx.variant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Create order
    const shippingCost = new Decimal(formData.shippingMethod === 'flat' ? 50 : formData.shippingMethod === 'express' ? 25 : 75);
    const subtotal = cart.items.reduce((sum, item) => sum.add(item.variant.price.times(item.quantity)), new Decimal(0));
    const total = subtotal.add(shippingCost);

    const order = await tx.order.create({
      data: {
        userId,
        status: 'PENDING',
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company || null,
          address: formData.address,
          apartment: formData.apartment || null,
          city: formData.city,
          state: formData.state || null,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
        },
        billingAddress: formData.billingOption === 'same' ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company || null,
          address: formData.address,
          apartment: formData.apartment || null,
          city: formData.city,
          state: formData.state || null,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
        } : {
          firstName: formData.billingFirstName!,
          lastName: formData.billingLastName!,
          company: formData.billingCompany || null,
          address: formData.billingAddress!,
          apartment: formData.billingApartment || null,
          city: formData.billingCity!,
          state: formData.billingState || null,
          zipCode: formData.billingZipCode!,
          country: formData.billingCountry!,
          phone: formData.billingPhone!,
        },
        shippingMethod: formData.shippingMethod,
        shippingCost: shippingCost.toString(),
        total: total.toString(),
        items: {
          create: cart.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            priceAtPurchase: item.variant.price.toString(),
          })),
        },
      },
      include: {
        items: { include: { variant: { include: { product: { select: { name: true, slug: true, images: true } } } } } },
      },
    });

    // Clear cart
    await tx.cart.delete({ where: { id: cart.id } });

    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      items: order.items.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        variantId: item.variantId,
        quantity: item.quantity,
        priceAtPurchase: new Decimal(item.priceAtPurchase.toString()),
        variant: {
          id: item.variant.id,
          productId: item.variant.productId,
          shade: item.variant.shade,
          size: item.variant.size,
          price: new Decimal(item.variant.price.toString()),
          sku: item.variant.sku,
          stock: item.variant.stock,
          product: {
            name: item.variant.product.name,
            slug: item.variant.product.slug,
            images: item.variant.product.images,
          },
        },
      })),
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      shippingMethod: order.shippingMethod,
      shippingCost: new Decimal(order.shippingCost.toString()),
      total: new Decimal(order.total.toString()),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  });
};

export const getOrderById = async (orderId: string, userId: string): Promise<Order | null> => {
  try {
    const order = await db.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: { include: { variant: { include: { product: { select: { name: true, slug: true, images: true } } } } } },
      },
    });
    if (!order) return null;
    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      items: order.items.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        variantId: item.variantId,
        quantity: item.quantity,
        priceAtPurchase: new Decimal(item.priceAtPurchase.toString()),
        variant: {
          id: item.variant.id,
          productId: item.variant.productId,
          shade: item.variant.shade,
          size: item.variant.size,
          price: new Decimal(item.variant.price.toString()),
          sku: item.variant.sku,
          stock: item.variant.stock,
          product: {
            name: item.variant.product.name,
            slug: item.variant.product.slug,
            images: item.variant.product.images,
          },
        },
      })),
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      shippingMethod: order.shippingMethod,
      shippingCost: new Decimal(order.shippingCost.toString()),
      total: new Decimal(order.total.toString()),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  } catch (error) {
    throw new Error(`Failed to fetch order: ${error.message}`);
  }
};