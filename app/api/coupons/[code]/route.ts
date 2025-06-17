import { NextResponse } from 'next/server';
import db from '@/lib/prismadb';
import { Coupon } from '@/lib/checkout/types';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

// Zod schema for route params validation
const CouponParamsSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').max(50),
});

// Helper function to map Prisma model to API response
function mapCouponToResponse(coupon: any): Coupon {
  return {
    id: coupon.id,
    code: coupon.code,
    discount: Number(coupon.discount), // Convert Decimal to number
    type: coupon.type,
    validFrom: coupon.validFrom.toISOString(),
    validUntil: coupon.validUntil?.toISOString() || null,
    maxUses: coupon.maxUses,
    usedCount: coupon.usedCount,
    createdAt: coupon.createdAt.toISOString(),
    updatedAt: coupon.updatedAt.toISOString(),
  };
}

// Helper function for authentication
async function requireAuth() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Authentication required');
  }
  
  return userId;
}

// Helper function to validate coupon availability
function validateCouponAvailability(coupon: any): string | null {
  const now = new Date();
  
  // Check if coupon is still valid (not expired)
  if (coupon.validUntil && new Date(coupon.validUntil) < now) {
    return 'Coupon has expired';
  }
  
  // Check if coupon is active (valid from date)
  if (new Date(coupon.validFrom) > now) {
    return 'Coupon is not yet active';
  }
  
  // Check if coupon has reached maximum uses
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return 'Coupon has reached maximum usage limit';
  }
  
  return null; // Coupon is valid
}

export async function GET(
  request: Request, 
  { params }: { params: { code: string } }
) {
  try {
    await requireAuth();
    
    // Validate route parameters
    const validatedParams = CouponParamsSchema.parse(params);
    const { code } = validatedParams;
    
    // Find coupon in database
    const coupon = await db.coupon.findUnique({
      where: { 
        code: code.toUpperCase() // Normalize to uppercase for consistency
      },
    });
    
    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' }, 
        { status: 404 }
      );
    }
    
    // Validate coupon availability
    const validationError = validateCouponAvailability(coupon);
    if (validationError) {
      return NextResponse.json(
        { error: validationError }, 
        { status: 400 }
      );
    }
    
    const response = mapCouponToResponse(coupon);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching coupon:', error);
    
    // Handle authentication errors
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid coupon code format', 
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          }))
        }, 
        { status: 400 }
      );
    }
    
    // Handle database/other errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Failed to fetch coupon' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch coupon' }, 
      { status: 500 }
    );
  }
}