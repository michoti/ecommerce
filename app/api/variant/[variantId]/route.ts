import db from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { variantId: string } }) {
  try {
    const variant = await db.variant.findUnique({
      where: { id: params.variantId },
      include: { product: true },
    });
    if (!variant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
    }
    return NextResponse.json(variant);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
}