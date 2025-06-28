import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Rate limiting için basic protection
    const userAgent = req.headers.get('user-agent') || '';
    
    // Bot protection
    if (userAgent.includes('bot') || userAgent.includes('crawler')) {
      return new NextResponse('Access denied', { status: 403 });
    }

    // API routes için additional security
    if (req.nextUrl.pathname.startsWith('/api/')) {
      const origin = req.headers.get('origin');
      const host = req.headers.get('host');
      
      // CSRF protection için origin kontrolü
      if (req.method !== 'GET' && origin && !origin.includes(host!)) {
        return new NextResponse('CSRF protection', { status: 403 });
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Public routes
        if (req.nextUrl.pathname.startsWith('/auth/')) return true;
        if (req.nextUrl.pathname.startsWith('/api/auth/')) return true;
        if (req.nextUrl.pathname.startsWith('/api/stripe/webhook')) return true;
        if (req.nextUrl.pathname === '/pricing') return true;
        
        // Protected routes require authentication
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