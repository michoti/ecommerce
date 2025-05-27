import { PrismaClient, Cart } from '../app/generated/prisma';

const prisma = new PrismaClient();

export class CartService {
  async getCartByUserId(userId: number): Promise<Cart | null> {
    try {
      return await prisma.cart.findUnique({
        where: { userId },
        include: { cartItems: { include: { product: true } } },
      });
    } catch (error) {
      throw new Error(`Failed to fetch cart for user ${userId}: ${error.message}`);
    }
  }

  async createCart(userId: number): Promise<Cart> {
    try {
      return await prisma.cart.create({
        data: { userId },
        include: { cartItems: { include: { product: true } } },
      });
    } catch (error) {
      throw new Error(`Failed to create cart for user ${userId}: ${error.message}`);
    }
  }

  async addItemToCart(userId: number, productId: number, quantity: number): Promise<Cart> {
    try {
      let cart = await prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        cart = await this.createCart(userId);
      }

      const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId },
      });

      if (existingItem) {
        return await prisma.cart.update({
          where: { id: cart.id },
          data: {
            cartItems: {
              update: {
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
              },
            },
          },
          include: { cartItems: { include: { product: true } } },
        });
      }

      return await prisma.cart.update({
        where: { id: cart.id },
        data: {
          cartItems: {
            create: { productId, quantity },
          },
        },
        include: { cartItems: { include: { product: true } } },
      });
    } catch (error) {
      throw new Error(`Failed to add item to cart: ${error.message}`);
    }
  }

  async updateCartItem(userId: number, cartItemId: number, quantity: number): Promise<Cart> {
    try {
      const cart = await prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        throw new Error(`Cart not found for user ${userId}`);
      }

      return await prisma.cart.update({
        where: { id: cart.id },
        data: {
          cartItems: {
            update: {
              where: { id: cartItemId },
              data: { quantity },
            },
          },
        },
        include: { cartItems: { include: { product: true } } },
      });
    } catch (error) {
      throw new Error(`Failed to update cart item ${cartItemId}: ${error.message}`);
    }
  }

  async removeCartItem(userId: number, cartItemId: number): Promise<Cart> {
    try {
      const cart = await prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        throw new Error(`Cart not found for user ${userId}`);
      }

      return await prisma.cart.update({
        where: { id: cart.id },
        data: {
          cartItems: {
            delete: { id: cartItemId },
          },
        },
        include: { cartItems: { include: { product: true } } },
      });
    } catch (error) {
      throw new Error(`Failed to remove cart item ${cartItemId}: ${error.message}`);
    }
  }

  async clearCart(userId: number): Promise<Cart> {
    try {
      const cart = await prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        throw new Error(`Cart not found for user ${userId}`);
      }

      return await prisma.cart.update({
        where: { id: cart.id },
        data: {
          cartItems: {
            deleteMany: {},
          },
        },
        include: { cartItems: { include: { product: true } } },
      });
    } catch (error) {
      throw new Error(`Failed to clear cart for user ${userId}: ${error.message}`);
    }
  }

  async getCartTotal(userId: number): Promise<number> {
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { cartItems: { include: { product: true } } },
      });
      if (!cart) {
        return 0;
      }

      return cart.cartItems.reduce((total, item) => {
        return total + item.quantity * item.product.price;
      }, 0);
    } catch (error) {
      throw new Error(`Failed to calculate cart total for user ${userId}: ${error.message}`);
    }
  }

  async getCartItemCount(userId: number): Promise<number> {
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { cartItems: true },
      });
      if (!cart) {
        return 0;
      }

      return cart.cartItems.reduce((count, item) => count + item.quantity, 0);
    } catch (error) {
      throw new Error(`Failed to count cart items for user ${userId}: ${error.message}`);
    }
  }

  async checkProductInCart(userId: number, productId: number): Promise<boolean> {
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { cartItems: { where: { productId } } },
      });
      if (!cart) {
        return false;
      }

      return cart.cartItems.length > 0;
    } catch (error) {
      throw new Error(`Failed to check product ${productId} in cart: ${error.message}`);
    }
  }
}