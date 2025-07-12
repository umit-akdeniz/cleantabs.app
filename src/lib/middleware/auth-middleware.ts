import { NextRequest, NextResponse } from 'next/server'
import { JWTManager } from '../auth/jwt'
import { RateLimiter } from './rate-limiter'

export class AuthMiddleware {
  private static readonly PUBLIC_ROUTES = [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/auth/error',
    '/auth/verify-request',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify',
    '/auth/verified',
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
    '/test-auth.html',
  ]

  private static readonly API_PUBLIC_ROUTES = [
    '/api/auth',
    '/api/stripe/webhook',
    '/api/health',
    '/api/og',
  ]

  private static readonly API_PROTECTED_ROUTES = [
    '/api/categories',
    '/api/sites',
    '/api/subcategories',
    '/api/reminders',
    '/api/bookmarks',
    '/api/export',
  ]

  private static readonly ADMIN_ROUTES = [
    '/secure-admin',
    '/api/admin',
  ]

  static async handle(request: NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl
    
    // Apply rate limiting first
    const rateLimitResponse = await RateLimiter.limit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }
    
    // Check if this is a public route
    if (this.isPublicRoute(pathname)) {
      const response = NextResponse.next()
      return RateLimiter.addHeaders(response, request)
    }

    // Get JWT token from Authorization header or cookie
    const token = this.extractToken(request)

    // Handle admin routes
    if (this.isAdminRoute(pathname)) {
      return this.handleAdminRoute(request, token)
    }

    // Handle API protected routes differently
    if (this.isApiProtectedRoute(pathname)) {
      return this.handleApiRoute(request, token)
    }

    // Handle protected web routes
    if (!token) {
      return this.redirectToSignIn(request)
    }

    // For web routes, we'll trust the token temporarily and let the page components verify it
    // This avoids the Edge Runtime crypto module issue
    const response = NextResponse.next()
    
    // Pass token through headers for client-side verification
    response.headers.set('x-forwarded-token', token)
    
    // Add security headers
    this.addSecurityHeaders(response)
    
    // Add rate limit headers
    return RateLimiter.addHeaders(response, request)
  }

  private static extractToken(request: NextRequest): string | null {
    // Try Authorization header first
    const authHeader = request.headers.get('authorization')
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }

    // Try cookies as fallback - check multiple possible cookie names
    const cookieToken = request.cookies.get('accessToken')?.value ||
                       request.cookies.get('access_token')?.value ||
                       request.cookies.get('auth_token')?.value
    if (cookieToken) {
      return cookieToken
    }

    return null
  }

  private static isPublicRoute(pathname: string): boolean {
    // Check exact matches
    if (this.PUBLIC_ROUTES.includes(pathname)) {
      return true
    }

    // Check API public routes
    if (this.API_PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
      return true
    }

    // Check patterns
    const publicPatterns = [
      /^\/blog\/[^/]+$/,
      /^\/guides\/[^/]+$/,
      /^\/api\/auth\/.*/,
      /^\/api\/stripe\/webhook$/,
      /^\/api\/health$/,
      /^\/api\/og.*$/,
      /^\/favicon\.ico$/,
      /^\/manifest\.json$/,
      /^\/robots\.txt$/,
      /^\/sitemap\.xml$/,
      /^\/icon-.*\.png$/,
      /^\/apple-touch-icon.*\.png$/,
      /^\/_next\/static\/.*/,
      /^\/_next\/image\/.*/,
      /^\/public\/.*/,
    ]

    return publicPatterns.some(pattern => pattern.test(pathname))
  }

  private static isAdminRoute(pathname: string): boolean {
    return this.ADMIN_ROUTES.some(route => pathname.startsWith(route))
  }

  private static isApiProtectedRoute(pathname: string): boolean {
    return this.API_PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  }

  private static handleApiRoute(request: NextRequest, token: string | null): NextResponse {
    // For API routes, we don't verify the token in middleware (Edge Runtime limitation)
    // Instead, we pass the token through and let the API routes handle verification
    // using MiddlewareUtils.getAuthenticatedUser() which runs in Node.js runtime
    
    const response = NextResponse.next()
    
    // Pass token through headers for API routes to handle verification
    if (token) {
      response.headers.set('x-forwarded-token', token)
    }
    
    this.addSecurityHeaders(response)
    return response
  }

  private static handleAdminRoute(request: NextRequest, token: string | null): NextResponse {
    if (!token) {
      return this.redirectToSignIn(request)
    }

    // For admin routes, pass token through and let the page verify admin permissions
    // This avoids the Edge Runtime crypto module issue
    const response = NextResponse.next()
    response.headers.set('x-forwarded-token', token)
    response.headers.set('x-admin-route', 'true')
    
    this.addSecurityHeaders(response)
    return response
  }

  private static redirectToSignIn(request: NextRequest): NextResponse {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(signInUrl)
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