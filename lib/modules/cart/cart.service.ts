import db from '@/lib/prismadb';
import { Cart, CartItemInput } from './cart.types';



export const getCart = async (userId: string | null): Promise<Cart | null> => {
  if (!userId) return null;
  try {
    const cart = await db.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            variant: { include: { product: true } },
          },
        },
      },
    });
    return cart
      ? {
          id: cart.id,
          userId: cart.userId,
          items: cart.items.map((item) => ({
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
          createdAt: cart.createdAt.toISOString(),
          updatedAt: cart.updatedAt.toISOString(),
        }
      : null;
  } catch (error) {
    throw new Error(`Failed to fetch cart: ${error.message}`);
  } finally {
    await db.$disconnect();
  }
};

export const addToCart = async (userId: string | null, input: CartItemInput): Promise<Cart> => {
  try {
    const variant = await db.variant.findUnique({ where: { id: input.variantId } });
    if (!variant) {
      throw new Error('Variant not found');
    }
    if (input.quantity > variant.stock) {
      throw new Error('Insufficient stock');
    }

    let cart = await db.cart.findFirst({ where: { userId } });
    if (!cart && userId) {
      cart = await db.cart.create({ data: { userId } });
    }

    if (!cart) {
      throw new Error('Cart not found');
    }

    const existingItem = await db.cartItem.findFirst({
      where: { cartId: cart.id, variantId: input.variantId },
    });

    if (existingItem) {
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + input.quantity },
      });
    } else {
      await db.cartItem.create({
        data: { cartId: cart.id, variantId: input.variantId, quantity: input.quantity },
      });
    }

    const updatedCart = await db.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            variant: { include: { product: true } },
          },
        },
      },
    });

    if (!updatedCart) {
      throw new Error('Failed to fetch updated cart');
    }

    return {
      id: updatedCart.id,
      userId: updatedCart.userId,
      items: updatedCart.items.map((item) => ({
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
      createdAt: updatedCart.createdAt.toISOString(),
      updatedAt: updatedCart.updatedAt.toISOString(),
    };
  } catch (error) {
    throw new Error(`Failed to add to cart: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
};

export const updateCartItem = async (userId: string | null, cartItemId: string, quantity: number): Promise<Cart> => {
  try {
    const cartItem = await db.cartItem.findUnique({
      where: { id: cartItemId },
      include: { variant: true },
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    if (quantity > cartItem.variant.stock) {
      throw new Error('Insufficient stock');
    }

    await db.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    const cart = await db.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: {
            variant: { include: { product: true } },
          },
        },
      },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    return {
      id: cart.id,
      userId: cart.userId,
      items: cart.items.map((item) => ({
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
      createdAt: cart.createdAt.toISOString(),
      updatedAt: cart.updatedAt.toISOString(),
    };
  } catch (error) {
    throw new Error(`Failed to update cart item: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
};

export const removeCartItem = async (userId: string | null, cartItemId: string): Promise<Cart> => {
  try {
    const cartItem = await db.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    await db.cartItem.delete({ where: { id: cartItemId } });

    const cart = await db.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: {
            variant: { include: { product: true } },
          },
        },
      },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    return {
      id: cart.id,
      userId: cart.userId,
      items: cart.items.map((item) => ({
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
      createdAt: cart.createdAt.toISOString(),
      updatedAt: cart.updatedAt.toISOString(),
    };
  } catch (error) {
    throw new Error(`Failed to remove cart item: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
};

export const mergeCart = async (userId: string, items: CartItemInput[]): Promise<Cart> => {
  try {
    for (const item of items) {
      await addToCart(userId, item);
    }
    const cart = await getCart(userId);
    if (!cart) {
      throw new Error('Failed to fetch merged cart');
    }
    return cart;
  } catch (error) {
    throw new Error(`Failed to merge cart: ${error.message}`);
  }
};