import { NextRequest, NextResponse } from 'next/server'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  message?: string
  statusCode?: number
  headers?: boolean
}

export class RateLimiter {
  private static store: RateLimitStore = {}
  private static readonly DEFAULT_CONFIG: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests, please try again later',
    statusCode: 429,
    headers: true
  }

  // Different rate limits for different endpoints
  private static readonly ENDPOINT_CONFIGS: Record<string, RateLimitConfig> = {
    // Authentication endpoints - stricter limits
    '/api/auth/login': {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // 5 login attempts per 15 minutes
      message: 'Too many login attempts, please try again later'
    },
    '/api/auth/register': {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3, // 3 registration attempts per hour
      message: 'Too many registration attempts, please try again later'
    },
    '/api/auth/forgot-password': {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3, // 3 password reset attempts per hour
      message: 'Too many password reset attempts, please try again later'
    },
    '/api/auth/refresh': {
      windowMs: 5 * 60 * 1000, // 5 minutes
      maxRequests: 10, // 10 refresh attempts per 5 minutes
      message: 'Too many token refresh attempts, please try again later'
    },
    
    // API endpoints - moderate limits
    '/api/sites': {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 30, // 30 requests per minute
      message: 'Too many site API requests, please slow down'
    },
    '/api/categories': {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 20, // 20 requests per minute
      message: 'Too many category API requests, please slow down'
    },
    '/api/subcategories': {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 20, // 20 requests per minute
      message: 'Too many subcategory API requests, please slow down'
    },
    
    // Admin endpoints - very strict limits
    '/api/admin': {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10, // 10 admin requests per minute
      message: 'Too many admin requests, please slow down'
    },
    
    // General API fallback
    '/api': {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 60, // 60 requests per minute
      message: 'API rate limit exceeded, please slow down'
    }
  }

  /**
   * Apply rate limiting to a request
   */
  static async limit(request: NextRequest): Promise<NextResponse | null> {
    const pathname = request.nextUrl.pathname
    const config = this.getConfigForPath(pathname)
    
    if (!config) {
      return null // No rate limiting for this path
    }

    const key = this.generateKey(request, pathname)
    const now = Date.now()
    
    // Clean up expired entries periodically
    this.cleanup()
    
    // Get or create rate limit entry
    const entry = this.store[key] || {
      count: 0,
      resetTime: now + config.windowMs
    }

    // Reset if window has expired
    if (now > entry.resetTime) {
      entry.count = 0
      entry.resetTime = now + config.windowMs
    }

    // Increment request count
    entry.count++
    this.store[key] = entry

    // Check if limit exceeded
    if (entry.count > config.maxRequests) {
      const response = NextResponse.json(
        {
          success: false,
          error: config.message || this.DEFAULT_CONFIG.message,
          retryAfter: Math.ceil((entry.resetTime - now) / 1000)
        },
        { status: config.statusCode || this.DEFAULT_CONFIG.statusCode }
      )

      // Add rate limit headers
      if (config.headers !== false) {
        response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
        response.headers.set('X-RateLimit-Remaining', '0')
        response.headers.set('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000).toString())
        response.headers.set('Retry-After', Math.ceil((entry.resetTime - now) / 1000).toString())
      }

      return response
    }

    return null // Request allowed
  }

  /**
   * Add rate limit headers to successful responses
   */
  static addHeaders(response: NextResponse, request: NextRequest): NextResponse {
    const pathname = request.nextUrl.pathname
    const config = this.getConfigForPath(pathname)
    
    if (!config || config.headers === false) {
      return response
    }

    const key = this.generateKey(request, pathname)
    const entry = this.store[key]
    
    if (entry) {
      const remaining = Math.max(0, config.maxRequests - entry.count)
      response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
      response.headers.set('X-RateLimit-Remaining', remaining.toString())
      response.headers.set('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000).toString())
    }

    return response
  }

  /**
   * Get rate limit configuration for a specific path
   */
  private static getConfigForPath(pathname: string): RateLimitConfig | null {
    // Try exact match first
    for (const [path, config] of Object.entries(this.ENDPOINT_CONFIGS)) {
      if (pathname === path || pathname.startsWith(path + '/')) {
        return { ...this.DEFAULT_CONFIG, ...config }
      }
    }

    // Check if it's an API route that should have general rate limiting
    if (pathname.startsWith('/api/')) {
      return { ...this.DEFAULT_CONFIG, ...this.ENDPOINT_CONFIGS['/api'] }
    }

    return null
  }

  /**
   * Generate a unique key for rate limiting
   * Uses IP address and user ID if available
   */
  private static generateKey(request: NextRequest, pathname: string): string {
    // Get IP address (considering proxies)
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const ip = forwardedFor?.split(',')[0] || realIP || 'unknown'
    
    // Get user ID if available (from middleware headers)
    const userId = request.headers.get('x-user-id')
    
    // Create unique key
    const baseKey = userId ? `user:${userId}` : `ip:${ip}`
    return `${baseKey}:${pathname}`
  }

  /**
   * Clean up expired entries from store
   */
  private static cleanup(): void {
    const now = Date.now()
    
    // Only cleanup every 5 minutes to avoid performance impact
    const lastCleanup = (global as any).__rateLimitLastCleanup || 0
    if (now - lastCleanup < 5 * 60 * 1000) {
      return
    }

    for (const [key, entry] of Object.entries(this.store)) {
      if (now > entry.resetTime) {
        delete this.store[key]
      }
    }

    ;(global as any).__rateLimitLastCleanup = now
  }

  /**
   * Get current rate limit status for debugging
   */
  static getStatus(request: NextRequest, pathname: string): {
    key: string
    count: number
    limit: number
    remaining: number
    resetTime: number
  } | null {
    const config = this.getConfigForPath(pathname)
    if (!config) return null

    const key = this.generateKey(request, pathname)
    const entry = this.store[key]
    
    if (!entry) {
      return {
        key,
        count: 0,
        limit: config.maxRequests,
        remaining: config.maxRequests,
        resetTime: Date.now() + config.windowMs
      }
    }

    return {
      key,
      count: entry.count,
      limit: config.maxRequests,
      remaining: Math.max(0, config.maxRequests - entry.count),
      resetTime: entry.resetTime
    }
  }

  /**
   * Reset rate limit for a specific key (admin function)
   */
  static reset(key: string): boolean {
    if (this.store[key]) {
      delete this.store[key]
      return true
    }
    return false
  }

  /**
   * Get all active rate limit entries (admin function)
   */
  static getAll(): RateLimitStore {
    return { ...this.store }
  }
}