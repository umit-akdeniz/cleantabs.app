import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const response = NextResponse.next();
    
    // Security Headers - Production Ready
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // HTTPS Enforcement (production only)
    if (process.env.NODE_ENV === 'production') {
      response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      );
    }
    
    // Content Security Policy - Secure but functional
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' js.stripe.com checkout.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: *.googleapis.com *.gstatic.com; font-src 'self' data: fonts.googleapis.com fonts.gstatic.com; connect-src 'self' api.stripe.com checkout.stripe.com *.google.com *.github.com;"
    );

    // Rate limiting için basic protection
    const userAgent = req.headers.get('user-agent') || '';
    
    // Enhanced Bot protection - Allow legitimate bots
    const maliciousBots = ['scrapy', 'curl', 'wget', 'python-requests'];
    if (maliciousBots.some(bot => userAgent.toLowerCase().includes(bot))) {
      return new NextResponse('Access denied', { status: 403 });
    }

    // API routes için additional security
    if (req.nextUrl.pathname.startsWith('/api/')) {
      const origin = req.headers.get('origin');
      const host = req.headers.get('host');
      
      // CSRF protection - mais flexible pour Stripe webhooks
      if (req.method !== 'GET' && !req.nextUrl.pathname.includes('/webhook') && origin && !origin.includes(host!)) {
        return new NextResponse('CSRF protection', { status: 403 });
      }
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Public routes that don't require authentication
        if (req.nextUrl.pathname === '/') return true; // Landing page
        if (req.nextUrl.pathname.startsWith('/auth/')) return true;
        if (req.nextUrl.pathname.startsWith('/api/auth/')) return true;
        if (req.nextUrl.pathname.startsWith('/api/stripe/webhook')) return true;
        if (req.nextUrl.pathname === '/pricing') return true;
        if (req.nextUrl.pathname === '/privacy') return true;
        if (req.nextUrl.pathname === '/terms') return true;
        if (req.nextUrl.pathname === '/blog') return true;
        if (req.nextUrl.pathname.startsWith('/blog/')) return true;
        if (req.nextUrl.pathname === '/import') return true;
        if (req.nextUrl.pathname === '/showcase') return true;
        if (req.nextUrl.pathname === '/api-docs') return true;
        if (req.nextUrl.pathname === '/features') return true;
        if (req.nextUrl.pathname === '/about') return true;
        if (req.nextUrl.pathname === '/help') return true;
        if (req.nextUrl.pathname.startsWith('/guides/')) return true;
        
        // Protected routes require authentication (dashboard, account, etc.)
        return !!token;
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}