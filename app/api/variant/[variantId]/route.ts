import db from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { variantId: string } }
) {
  try {
    // Validate params.variantId
    if (!params.variantId || typeof params.variantId !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing variantId' }, { status: 400 });
    }

    const variant = await db.variant.findUnique({
      where: { id: params.variantId },
      include: { product: true },
    });

    if (!variant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
    }

    return NextResponse.json(variant);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}