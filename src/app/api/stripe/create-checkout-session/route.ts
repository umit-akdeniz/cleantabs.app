import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, STRIPE_PRICES } from '@/lib/stripe';
import { MiddlewareUtils } from '@/lib/auth/middleware-utils';

export async function POST(request: NextRequest) {
  // Return early if Stripe is not configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Payments not available' },
      { status: 503 }
    );
  }
  
  try {
    const user = await MiddlewareUtils.getAuthenticatedUser(request);
    
    if (!user) {
      return MiddlewareUtils.unauthorizedResponse();
    }

    const { priceType } = await request.json();
    
    if (!priceType || !STRIPE_PRICES[priceType as keyof typeof STRIPE_PRICES]) {
      return NextResponse.json(
        { error: 'Invalid price type' },
        { status: 400 }
      );
    }

    const priceId = STRIPE_PRICES[priceType as keyof typeof STRIPE_PRICES];
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    const checkoutSession = await createCheckoutSession({
      priceId,
      successUrl: `${baseUrl}/account?success=true`,
      cancelUrl: `${baseUrl}/account?canceled=true`,
      customerEmail: user.email,
      userId: user.userId,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}