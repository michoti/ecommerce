import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import db from '@/lib/prismadb';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { env } from "@/env.mjs"

const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  throw new Error('CLERK_WEBHOOK_SECRET is not set in .env');
}

export async function POST(request: Request) {
  try {
    // Get headers
    const headersList = await headers();
    const svixId = headersList.get('svix-id');
    const svixTimestamp = headersList.get('svix-timestamp');
    const svixSignature = headersList.get('svix-signature');

    // Validate required headers
    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('Missing required svix headers');
      return NextResponse.json(
        { error: 'Missing required webhook headers' }, 
        { status: 400 }
      );
    }

    // Get the raw body for webhook verification
    const payload = await request.text();

    // Verify webhook signature
    const webhook = new Webhook(WEBHOOK_SECRET);
    let event: WebhookEvent;

    try {
      event = webhook.verify(payload, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as WebhookEvent;
    } catch (verificationError) {
      console.error('Webhook signature verification failed:', verificationError);
      return NextResponse.json(
        { error: 'Invalid webhook signature' }, 
        { status: 401 }
      );
    }

    // Process webhook events
    const eventType = event.type;
    console.log(`Processing webhook event: ${eventType}`);

    switch (eventType) {
      case 'user.created': {
        const { id } = event.data;
        
        if (!id) {
          console.error('Missing user ID in user.created event');
          return NextResponse.json(
            { error: 'Invalid event data' }, 
            { status: 400 }
          );
        }

        // Create user in database
        await db.user.create({
          data: {
            id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        console.log(`Successfully created user: ${id}`);
        break;
      }

      case 'user.updated': {
        const { id } = event.data;
        
        if (!id) {
          console.error('Missing user ID in user.updated event');
          return NextResponse.json(
            { error: 'Invalid event data' }, 
            { status: 400 }
          );
        }

        // Update user in database
        // Note: Since your User model only has id, createdAt, updatedAt fields,
        // we only update the updatedAt timestamp
        await db.user.update({
          where: { id },
          data: {
            updatedAt: new Date(),
          },
        });

        console.log(`Successfully updated user: ${id}`);
        break;
      }

      case 'user.deleted': {
        const { id } = event.data;
        
        if (!id) {
          console.error('Missing user ID in user.deleted event');
          return NextResponse.json(
            { error: 'Invalid event data' }, 
            { status: 400 }
          );
        }

       
        await db.user.delete({
          where: { id },
        });

        console.log(`Successfully deleted user: ${id}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
        // Return success even for unhandled events to avoid retries
        break;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully processed ${eventType} event` 
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    
    // Return appropriate error response
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Webhook processing failed', details: error.message }, 
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}