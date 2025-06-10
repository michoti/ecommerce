import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { CartItemInput } from '@/lib/modules/cart/cart.types';
import { mergeCartItems } from '@/lib/modules/cart/cart.service';

export async function POST(request: Request) {
  try {
    
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const items: CartItemInput[] = body.items || [];

    // Validate input
    if (!Array.isArray(items) || items.some(item => !item.variantId || typeof item.quantity !== 'number')) {
      return NextResponse.json({ message: 'Invalid cart items format' }, { status: 400 });
    }

    // Merge cart items using cart.service.ts
    const cart = await mergeCartItems(userId, items);

    // Return the merged cart
    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error('Error merging cart:', error);
    const message = error instanceof Error ? error.message : 'Failed to merge cart';
    return NextResponse.json({ message }, { status: 500 });
  }
}