import { NextResponse } from 'next/server';
import { updateCartItem, removeCartItem } from '@/lib/modules/cart/cart.service';

export async function PATCH(request: Request, { params }: { params: { cartItemId: string } }) {
  const { userId, quantity } = await request.json();

  try {
    const cart = await updateCartItem(userId, params.cartItemId, quantity);
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { cartItemId: string } }) {
  const { userId } = await request.json();

  try {
    const cart = await removeCartItem(userId, params.cartItemId);
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}