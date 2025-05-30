import db from '@/lib/prismadb';
import { Cart, CartItem } from '@/app/generated/prisma';
import { CartItemInput } from './cart.types';
import { BadRequestError, NotFoundError } from './errors';

export class CartService {

  async createCart(userId?: string): Promise<Cart> {
    if (userId) {
      const existingCart = await db.cart.findUnique({ where: { userId } });
      if (existingCart) {
        throw new BadRequestError('Cart already exists for this user');
      }
    }

    return db.cart.create({
      data: {
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async getCartByUserId(userId?: string): Promise<Cart | null> {
    if (!userId) return null;
    return db.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              select: {
                id: true,
                shade: true,
                size: true,
                price: true,
                stock: true,
                product: {
                  select: { name: true, slug: true, images: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async addItemToCart(userId: string | undefined, variantId: string, quantity: number): Promise<CartItem> {
    if (quantity <= 0) {
      throw new BadRequestError('Quantity must be greater than 0');
    }

    const variant = await db.variant.findUnique({ where: { id: variantId } });
    if (!variant) {
      throw new NotFoundError('Variant not found');
    }
    if (variant.stock < quantity) {
      throw new BadRequestError('Insufficient stock');
    }

    if (!userId) {
      throw new BadRequestError('Anonymous cart should be handled locally');
    }

    let cart = await this.getCartByUserId(userId);
    if (!cart) {
      cart = await this.createCart(userId);
    }

    const existingItem = await db.cartItem.findFirst({
      where: { cartId: cart.id, variantId },
    });

    if (existingItem) {
      return db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    }

    return db.cartItem.create({
      data: {
        cartId: cart.id,
        variantId,
        quantity,
      },
    });
  }

  async updateCartItemQuantity(cartItemId: string, quantity: number): Promise<CartItem> {
    if (quantity <= 0) {
      throw new BadRequestError('Quantity must be greater than 0');
    }

    const cartItem = await db.cartItem.findUnique({
      where: { id: cartItemId },
      include: { variant: true },
    });
    if (!cartItem) {
      throw new NotFoundError('Cart item not found');
    }
    if (cartItem.variant.stock < quantity) {
      throw new BadRequestError('Insufficient stock');
    }

    return db.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  async removeCartItem(cartItemId: string): Promise<void> {
    const cartItem = await db.cartItem.findUnique({ where: { id: cartItemId } });
    if (!cartItem) {
      throw new NotFoundError('Cart item not found');
    }

    await db.cartItem.delete({ where: { id: cartItemId } });
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.getCartByUserId(userId);
    if (!cart) {
      throw new NotFoundError('Cart not found');
    }

    await db.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  async deleteCart(userId: string): Promise<void> {
    const cart = await this.getCartByUserId(userId);
    if (!cart) {
      throw new NotFoundError('Cart not found');
    }

    await db.cart.delete({ where: { id: cart.id } });
  }

  async mergeLocalCart(userId: string, localItems: CartItemInput[]): Promise<Cart> {
    let cart = await this.getCartByUserId(userId);
    if (!cart) {
      cart = await this.createCart(userId);
    }

    for (const item of localItems) {
      const variant = await db.variant.findUnique({ where: { id: item.variantId } });
      if (variant && variant.stock >= item.quantity) {
        const existingItem = await db.cartItem.findFirst({
          where: { cartId: cart.id, variantId: item.variantId },
        });

        if (existingItem) {
          await db.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + item.quantity },
          });
        } else {
          await db.cartItem.create({
            data: {
              cartId: cart.id,
              variantId: item.variantId,
              quantity: item.quantity,
            },
          });
        }
      }
    }

    return this.getCartByUserId(userId) as Promise<Cart>;
  }
}