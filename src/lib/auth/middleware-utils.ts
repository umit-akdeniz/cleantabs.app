import { NextRequest } from 'next/server'
import { JWTManager } from './jwt'

export interface AuthenticatedUser {
  userId: string
  email: string
  plan: 'FREE' | 'PREMIUM'
}

export class MiddlewareUtils {
  /**
   * Extract user info from middleware headers or JWT token
   */
  static async getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
    // First try to get from middleware headers (if middleware processed the request)
    const userId = request.headers.get('x-user-id')
    const email = request.headers.get('x-user-email')
    const plan = request.headers.get('x-user-plan') as 'FREE' | 'PREMIUM'

    if (userId && email && plan) {
      return { userId, email, plan }
    }

    // Fallback: extract and verify JWT token directly
    const token = this.extractToken(request)
    
    if (!token) {
      return null
    }

    const payload = JWTManager.verifyAccessToken(token)
    if (!payload) {
      return null
    }

    return {
      userId: payload.userId,
      email: payload.email,
      plan: payload.plan
    }
  }

  /**
   * Extract JWT token from request
   */
  static extractToken(request: NextRequest): string | null {
    // Try forwarded token from middleware first (for API routes)
    const forwardedToken = request.headers.get('x-forwarded-token')
    if (forwardedToken) {
      return forwardedToken
    }

    // Try Authorization header
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }

    // Try cookies as fallback
    const cookieToken = request.cookies.get('accessToken')?.value
    if (cookieToken) {
      return cookieToken
    }

    return null
  }

  /**
   * Check if user is admin
   */
  static isAdmin(user: AuthenticatedUser | null): boolean {
    return user?.email === 'umitakdenizjob@gmail.com'
  }

  /**
   * Create standardized unauthorized response
   */
  static unauthorizedResponse(message = 'Unauthorized') {
    return new Response(JSON.stringify({ 
      success: false, 
      error: message 
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  /**
   * Create standardized forbidden response
   */
  static forbiddenResponse(message = 'Forbidden') {
    return new Response(JSON.stringify({ 
      success: false, 
      error: message 
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}