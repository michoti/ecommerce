import { BillingAddress, BillingAddressSchema } from '@/lib/checkout/types';
import db from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const CreateBillingAddressSchema = BillingAddressSchema.omit({
    id: true,
    userId:true,
    createdAt: true,
    updatedAt: true,
});

// Helper function to map Prisma model to API response
function mapAddressToResponse(address: any): BillingAddress {
  return {
    id: address.id,
    userId: address.userId || '',
    firstName: address.firstName,
    lastName: address.lastName,
    company: address.company || '',
    address: address.address,
    apartment: address.apartment || '',
    city: address.city,
    state: address.state || '',
    zipCode: address.zipCode,
    country: address.country,
    phone: address.phone || '',
    createdAt: address.createdAt.toISOString(),
    updatedAt: address.updatedAt.toISOString(),
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

export async function POST(request: Request) {
  try {
    const userId = await requireAuth();
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = CreateBillingAddressSchema.parse(body);
    
    // Create new billing address in database
    const newAddress = await db.billingAddress.create({
      data: {
        userId,
        ...validatedData,
      },
    });
    
    const response = mapAddressToResponse(newAddress);
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating billing address:', error);
    
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
          error: 'Validation failed', 
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          }))
        }, 
        { status: 400 }
      );
    }
    
    // Handle Prisma/database errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Failed to create billing address' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create billing address' }, 
      { status: 500 }
    );
  }
}