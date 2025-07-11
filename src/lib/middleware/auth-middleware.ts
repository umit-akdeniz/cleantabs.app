import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export class AuthMiddleware {
  private static readonly PUBLIC_ROUTES = [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/auth/error',
    '/auth/verify-request',
    '/pricing',
    '/privacy',
    '/terms',
    '/blog',
    '/import',
    '/showcase',
    '/api-docs',
    '/features',
    '/about',
    '/help',
  ]

  private static readonly API_PUBLIC_ROUTES = [
    '/api/auth',
    '/api/stripe/webhook',
    '/api/register',
    '/api/health',
  ]

  private static readonly ADMIN_ROUTES = [
    '/secure-admin',
    '/api/admin',
  ]

  static async handle(request: NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl
    
    // Check if this is a public route
    if (this.isPublicRoute(pathname)) {
      return NextResponse.next()
    }

    // Get token
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })

    // Handle admin routes
    if (this.isAdminRoute(pathname)) {
      return this.handleAdminRoute(request, token)
    }

    // Handle protected routes
    if (!token) {
      return this.redirectToSignIn(request)
    }

    // Validate token
    if (!this.isValidToken(token)) {
      return this.redirectToSignIn(request)
    }

    // Add security headers
    const response = NextResponse.next()
    this.addSecurityHeaders(response)
    
    return response
  }

  private static isPublicRoute(pathname: string): boolean {
    // Check exact matches
    if (this.PUBLIC_ROUTES.includes(pathname)) {
      return true
    }

    // Check patterns
    const publicPatterns = [
      /^\/blog\/[^/]+$/,
      /^\/guides\/[^/]+$/,
      /^\/api\/auth\/.*/,
      /^\/api\/stripe\/webhook$/,
      /^\/api\/register$/,
      /^\/api\/health$/,
      /^\/api\/og.*$/,
    ]

    return publicPatterns.some(pattern => pattern.test(pathname))
  }

  private static isAdminRoute(pathname: string): boolean {
    return this.ADMIN_ROUTES.some(route => pathname.startsWith(route))
  }

  private static handleAdminRoute(request: NextRequest, token: any): NextResponse {
    const adminEmail = 'umitakdenizjob@gmail.com'
    
    if (!token || token.email !== adminEmail) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    const response = NextResponse.next()
    this.addSecurityHeaders(response)
    return response
  }

  private static redirectToSignIn(request: NextRequest): NextResponse {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(signInUrl)
  }

  private static isValidToken(token: any): boolean {
    if (!token?.email) {
      return false
    }

    // Check if token is explicitly marked as invalid
    if (token.isValid === false) {
      return false
    }

    // Check token age (optional)
    if (token.lastValidated) {
      const now = Date.now()
      const tokenAge = now - token.lastValidated
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours
      
      if (tokenAge > maxAge) {
        console.log('Token is too old, needs revalidation')
        // Token will be revalidated in JWT callback
      }
    }

    return true
  }

  private static addSecurityHeaders(response: NextResponse): void {
    // Security headers
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    
    // HTTPS enforcement in production
    if (process.env.NODE_ENV === 'production') {
      response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      )
    }
    
    // Content Security Policy
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' js.stripe.com checkout.stripe.com https://www.googletagmanager.com; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https: *.googleapis.com *.gstatic.com *.github.com; " +
      "font-src 'self' data: fonts.googleapis.com fonts.gstatic.com; " +
      "connect-src 'self' api.stripe.com checkout.stripe.com *.google.com *.github.com *.githubusercontent.com https://www.google-analytics.com;"
    )
  }
}