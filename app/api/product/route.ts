import db from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await db.product.findMany({
      include: {
        variants: true,
        reviews: true,
        collections: { include: { category: true } },
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
}