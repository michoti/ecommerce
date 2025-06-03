import { NextResponse } from 'next/server';
import { addToCart, getCart } from '@/lib/modules/cart/cart.service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    const cart = await getCart(userId);
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId, variantId, quantity } = await request.json();

  try {
    const cart = await addToCart(userId, { variantId, quantity });
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}