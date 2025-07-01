import Stripe from 'stripe';

// Only initialize Stripe if secret key is available
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    })
  : null;

// Product prices - these should match your Stripe dashboard
export const STRIPE_PRICES = {
  premium_monthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || 'price_1234567890',
  premium_yearly: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || 'price_0987654321',
} as const;

export const createCheckoutSession = async ({
  priceId,
  successUrl,
  cancelUrl,
  customerEmail,
  userId,
}: {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  userId: string;
}) => {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata: {
      userId,
    },
    allow_promotion_codes: true,
    billing_address_collection: 'required',
  });

  return session;
};

export const createCustomerPortalSession = async ({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) => {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
};

export const getSubscription = async (subscriptionId: string) => {
  if (!stripe) {
    console.error('Stripe is not configured');
    return null;
  }
  
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    return null;
  }
};