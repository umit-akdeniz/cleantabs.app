import { NextRequest, NextResponse } from 'next/server';
import { createCustomerPortalSession } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
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

    // Get user with Stripe customer ID
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { stripeCustomerId: true }
    });

    if (!dbUser?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'https://cleantabs.app';

    const portalSession = await createCustomerPortalSession({
      customerId: dbUser.stripeCustomerId,
      returnUrl: `${baseUrl}/account`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}