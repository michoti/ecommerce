import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { z } from 'zod';
import { productData } from '@/lib/data';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

const CartItemInputSchema = z.object({
  variantId: z.string(),
  quantity: z.number().int().positive(),
});

const CartItemSchema = z.object({
  id: z.string(),
  variantId: z.string(),
  quantity: z.number().int().positive(),
  variant: z.any(), // Populated client-side
});

const CartSchema = z.object({
  id: z.string(),
  items: z.array(CartItemSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: { items: true },
    });

    if (!cart) {
      return NextResponse.json({ id: null, items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }

    return NextResponse.json({
      id: cart.id,
      items: cart.items.map((item) => ({
        id: item.id,
        variantId: item.variantId,
        quantity: item.quantity,
        variant: findVariant(item.variantId),
      })),
      createdAt: cart.createdAt.toISOString(),
      updatedAt: cart.updatedAt.toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { variantId, quantity } = CartItemInputSchema.parse(body);
    const variant = findVariant(variantId);
    if (!variant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
    }
    if (quantity > variant.stock) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    let cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
          items: { create: [{ variantId, quantity }] },
        },
        include: { items: true },
      });
    } else {
      const existingItem = cart.items.find((item) => item.variantId === variantId);
      if (existingItem) {
        if (existingItem.quantity + quantity > variant.stock) {
          return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
        }
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: { cartId: cart.id, variantId, quantity },
        });
      }
      cart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: { items: true },
      });
    }

    return NextResponse.json({
      id: cart!.id,
      items: cart!.items.map((item) => ({
        id: item.id,
        variantId: item.variantId,
        quantity: item.quantity,
        variant: findVariant(item.variantId),
      })),
      createdAt: cart!.createdAt.toISOString(),
      updatedAt: cart!.updatedAt.toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function findVariant(variantId: string) {
  for (const product of Object.values(productData.products)) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) {
      return { ...variant, product: { name: product.name, slug: product.slug, images: product.images } };
    }
  }
  return null;
}
```