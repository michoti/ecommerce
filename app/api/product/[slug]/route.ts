import db from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const product = await db.product.findUnique({
      where: { slug: params.slug },
      include: {
        variants: true,
        reviews: true,
        collections: { include: { category: true } },
      },
    });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
}