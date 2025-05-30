import db from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { variantId: string } }) {
  try {
    const variant = await db.variant.findUnique({
      where: { id: params.variantId },
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
    });
    if (!variant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
    }
    return NextResponse.json(variant);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}