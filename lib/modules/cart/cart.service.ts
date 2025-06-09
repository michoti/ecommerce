import db from '@/lib/prismadb';
import { Cart, CartItemInput } from './cart.types';

// Reusable function to map Prisma cart to Cart type
const mapPrismaCartToCart = (prismaCart: any): Cart => ({
  id: prismaCart.id,
  userId: prismaCart.userId,
  items: prismaCart.items.map((item: any) => ({
    id: item.id,
    variantId: item.variantId,
    quantity: item.quantity,
    variant: {
      id: item.variant.id,
      productId: item.variant.productId,
      shade: item.variant.shade,
      size: item.variant.size,
      price: item.variant.price,
      sku: item.variant.sku,
      stock: item.variant.stock,
      product: {
        name: item.variant.product.name,
        slug: item.variant.product.slug,
        images: item.variant.product.images,
      },
    },
  })),
  createdAt: prismaCart.createdAt.toISOString(),
  updatedAt: prismaCart.updatedAt.toISOString(),
});

export const getCart = async (userId: string | null): Promise<Cart | null> => {
  if (!userId) return null;
  try {
    const cart = await db.cart.findFirst({
      where: { userId },
      include: { items: { include: { variant: { include: { product: true } } } } },
    });
    return cart ? mapPrismaCartToCart(cart) : null;
  } catch (error) {
    throw new Error(`Failed to fetch cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const addToCart = async (userId: string | null, input: CartItemInput): Promise<Cart> => {
  if (!userId) throw new Error('Authentication required to add to cart');
  try {
    return await db.$transaction(async (tx) => {
      const variant = await tx.variant.findUnique({ where: { id: input.variantId } });
      if (!variant) throw new Error('Variant not found');
      if (input.quantity > variant.stock) throw new Error('Insufficient stock');

      let cart = await tx.cart.findFirst({ where: { userId } });
      if (!cart) {
        cart = await tx.cart.create({ data: { userId } });
      }

      const existingItem = await tx.cartItem.findFirst({
        where: { cartId: cart.id, variantId: input.variantId },
      });

      if (existingItem) {
        await tx.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + input.quantity },
        });
      } else {
        await tx.cartItem.create({
          data: { cartId: cart.id, variantId: input.variantId, quantity: input.quantity },
        });
      }

      const updatedCart = await tx.cart.findUnique({
        where: { id: cart.id },
        include: { items: { include: { variant: { include: { product: true } } } } },
      });

      if (!updatedCart) throw new Error('Failed to fetch updated cart');
      return mapPrismaCartToCart(updatedCart);
    });
  } catch (error) {
    throw new Error(`Failed to add to cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const updateCartItem = async (userId: string | null, cartItemId: string, quantity: number): Promise<Cart> => {
  if (!userId) throw new Error('Authentication required to update cart item');
  try {
    return await db.$transaction(async (tx) => {
      const cartItem = await tx.cartItem.findUnique({
        where: { id: cartItemId },
        include: { cart: true, variant: true },
      });

      if (!cartItem) throw new Error('Cart item not found');
      if (cartItem.cart.userId !== userId) throw new Error('Unauthorized access to cart item');
      if (quantity > cartItem.variant.stock) throw new Error('Insufficient stock');

      await tx.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });

      const cart = await tx.cart.findUnique({
        where: { id: cartItem.cartId },
        include: { items: { include: { variant: { include: { product: true } } } } },
      });

      if (!cart) throw new Error('Cart not found');
      return mapPrismaCartToCart(cart);
    });
  } catch (error) {
    throw new Error(`Failed to update cart item: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const removeCartItem = async (userId: string | null, cartItemId: string): Promise<Cart> => {
  if (!userId) throw new Error('Authentication required to remove cart item');
  try {
    return await db.$transaction(async (tx) => {
      const cartItem = await tx.cartItem.findUnique({
        where: { id: cartItemId },
        include: { cart: true },
      });

      if (!cartItem) throw new Error('Cart item not found');
      if (cartItem.cart.userId !== userId) throw new Error('Unauthorized access to cart item');

      await tx.cartItem.delete({ where: { id: cartItemId } });

      const cart = await tx.cart.findUnique({
        where: { id: cartItem.cartId },
        include: { items: { include: { variant: { include: { product: true } } } } },
      });

      if (!cart) throw new Error('Cart not found');

      if (cart.items.length === 0) {
        await tx.cart.delete({ where: { id: cart.id } });
        return { id: cart.id, userId: cart.userId, items: [], createdAt: cart.createdAt.toISOString(), updatedAt: cart.updatedAt.toISOString() };
      }

      return mapPrismaCartToCart(cart);
    });
  } catch (error) {
    throw new Error(`Failed to remove cart item: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const mergeCartItems = async (userId: string, items: CartItemInput[]): Promise<Cart> => {
  if (!userId) throw new Error('Authentication required to merge cart');
  try {
    return await db.$transaction(async (tx) => {
      let cart = await tx.cart.findFirst({ where: { userId } });
      if (!cart) {
        cart = await tx.cart.create({ data: { userId } });
      }

      const variantIds = items.map((item) => item.variantId);
      const variants = await tx.variant.findMany({
        where: { id: { in: variantIds } },
        select: { id: true, stock: true },
      });

      const variantMap = new Map(variants.map((v) => [v.id, v.stock]));
      for (const item of items) {
        const stock = variantMap.get(item.variantId);
        if (stock === undefined) throw new Error(`Variant ${item.variantId} not found`);
        if (item.quantity > stock) throw new Error(`Insufficient stock for variant ${item.variantId}`);
      }

      const existingItems = await tx.cartItem.findMany({
        where: { cartId: cart.id, variantId: { in: variantIds } },
      });

      const existingItemMap = new Map(existingItems.map((item) => [item.variantId, item]));

      const upsertItems = items.map((item) => {
        const existing = existingItemMap.get(item.variantId);
        if (existing) {
          return tx.cartItem.update({
            where: { id: existing.id },
            data: { quantity: existing.quantity + item.quantity },
          });
        }
        return tx.cartItem.create({
          data: { cartId: cart.id, variantId: item.variantId, quantity: item.quantity },
        });
      });

      await Promise.all(upsertItems);

      const updatedCart = await tx.cart.findUnique({
        where: { id: cart.id },
        include: { items: { include: { variant: { include: { product: true } } } } },
      });

      if (!updatedCart) throw new Error('Failed to fetch merged cart');
      return mapPrismaCartToCart(updatedCart);
    });
  } catch (error) {
    throw new Error(`Failed to merge cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};