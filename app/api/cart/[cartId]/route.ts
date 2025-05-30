import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { z } from 'zod';
import { productData } from '@/lib/data';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

const UpdateCartItemSchema = z.object({
  cartItemId: z.string(),
  quantity: z.number().int().positive(),
});

const DeleteCartItemSchema = z.object({
  cartItemId: z.string(),
});

export async function PUT(req: NextRequest, { params }: { params: { cartId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { cartItemId, quantity } = UpdateCartItemSchema.parse(body);
    const cart = await prisma.cart.findUnique({
      where: { id: params.cartId, userId: session.user.id },
      include: { items: true },
    });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const item = cart.items.find((i) => i.id === cartItemId);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const variant = findVariant(item.variantId);
    if (!variant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
    }
    if (quantity > variant.stock) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: params.cartId },
      include: { items: true },
    });

    return NextResponse.json({
      id: updatedCart!.id,
      items: updatedCart!.items.map((item) => ({
        id: item.id,
        variantId: item.variantId,
        quantity: item.quantity,
        variant: findVariant(item.variantId),
      })),
      createdAt: updatedCart!.createdAt.toISOString(),
      updatedAt: updatedCart!.updatedAt.toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { cartId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { cartItemId } = DeleteCartItemSchema.parse(body);
    const cart = await prisma.cart.findUnique({
      where: { id: params.cartId, userId: session.user.id },
      include: { items: true },
    });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const item = cart.items.find((i) => i.id === cartItemId);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: params.cartId },
      include: { items: true },
    });

    return NextResponse.json({
      id: updatedCart!.id,
      items: updatedCart!.items.map((item) => ({
        id: item.id,
        variantId: item.variantId,
        quantity: item.quantity,
        variant: findVariant(item.variantId),
      })),
      createdAt: updatedCart!.createdAt.toISOString(),
      updatedAt: updatedCart!.updatedAt.toISOString(),
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