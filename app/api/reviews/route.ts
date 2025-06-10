import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import db from '@/lib/prismadb';

export async function POST(request: Request) {
    
try {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const { productId, rating, comment } = await request.json();

    console.log("## The product Id is :", productId);
    console.log("## The rating is :", rating);
    console.log("## The comment is :", comment);
    

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    console.log("review inputs are valid");

    const review = await db.review.create({
      data: {
        productId,
        rating,
        comment,
        reviewer: userId, // Or fetch user name from Clerk
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit review' },
      { status: 500 },
    );
  }
}