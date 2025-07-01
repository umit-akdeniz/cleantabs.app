# CleanTabs Production Deployment Guide

## Prerequisites

1. **Google Cloud Console Setup**
   - Create a new project in Google Cloud Console
   - Enable Google+ API and Google People API
   - Create OAuth 2.0 credentials
   - Add your production domain to authorized origins
   - Add `/api/auth/callback/google` to authorized redirect URIs

2. **Database Setup**
   - Set up PostgreSQL database (recommended: Vercel Postgres, Supabase, or Railway)
   - Get connection string

## Environment Variables

Create `.env.production` with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth (optional)
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Email Configuration
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PRICE_ID="price_..."

# Security
ENCRYPTION_KEY="your-32-character-encryption-key"
```

## Deployment Steps

### 1. Prepare Environment Variables

First, you need to set up all required credentials:

**Google OAuth Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add production domain to authorized origins: `https://yourdomain.com`
6. Add redirect URI: `https://yourdomain.com/api/auth/callback/google`

**GitHub OAuth Setup:**
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Set Homepage URL: `https://yourdomain.com`
4. Set Authorization callback URL: `https://yourdomain.com/api/auth/callback/github`

**Stripe Setup:**
1. Create [Stripe account](https://stripe.com)
2. Create products in Stripe Dashboard
3. Copy Live API keys
4. Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
5. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

### 2. Update Environment Files

Update `.env.production` with real credentials:

```env
# Replace with your actual values
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GITHUB_ID="your_github_client_id"
GITHUB_SECRET="your_github_client_secret"
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PREMIUM_MONTHLY_PRICE_ID="price_..."
STRIPE_PREMIUM_YEARLY_PRICE_ID="price_..."
```

### 3. Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Push schema to production database (includes new Stripe fields)
npx prisma db push
```

### 4. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Set environment variables in Vercel dashboard
# Copy all variables from .env.production
```


### 3. Email Setup

1. **Gmail Setup** (for notifications):
   - Enable 2-factor authentication
   - Generate app password
   - Use app password in EMAIL_SERVER_PASSWORD

2. **Custom Domain Email** (recommended):
   - Use services like SendGrid, Mailgun, or AWS SES
   - Update EMAIL_SERVER_* variables accordingly

### 4. Stripe Setup (for payments)

1. Create Stripe account
2. Set up products and pricing
3. Configure webhook endpoints
4. Update environment variables

### 5. Domain Configuration

1. Point domain to Vercel
2. Configure SSL certificate
3. Update NEXTAUTH_URL
4. Update Google OAuth authorized origins

## Security Checklist

- [ ] Strong NEXTAUTH_SECRET generated (use: `openssl rand -base64 32`)
- [ ] Database credentials secured
- [ ] Environment variables properly set in Vercel dashboard
- [ ] HTTPS enabled
- [ ] OAuth redirect URIs configured correctly
- [ ] Stripe webhook endpoints secured
- [ ] Stripe webhook secret configured
- [ ] Live Stripe keys (not test keys) in production
- [ ] Domain verified in Vercel

## Post-Deployment

1. Test Google OAuth login
2. Test email functionality
3. Test payment flow (if implemented)
4. Monitor error logs
5. Set up monitoring (optional: Sentry, LogRocket)

## Maintenance

- Regular database backups
- Monitor usage and costs
- Update dependencies regularly
- Security updates