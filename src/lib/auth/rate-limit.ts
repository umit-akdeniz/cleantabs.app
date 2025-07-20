import { prisma } from '@/lib/prisma'

interface RateLimitConfig {
  windowMs: number
  maxAttempts: number
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
}

export class RateLimitService {
  private static readonly configs = {
    login: { windowMs: 15 * 60 * 1000, maxAttempts: 5 }, // 5 attempts per 15 minutes
    globalLogin: { windowMs: 60 * 60 * 1000, maxAttempts: 100 }, // 100 attempts per hour per IP
    passwordReset: { windowMs: 60 * 60 * 1000, maxAttempts: 3 }, // 3 attempts per hour
    emailVerification: { windowMs: 60 * 60 * 1000, maxAttempts: 5 }, // 5 attempts per hour
    magicLink: { windowMs: 60 * 60 * 1000, maxAttempts: 3 }, // 3 attempts per hour
  }

  // Login rate limiting (per email)
  static async checkLoginRateLimit(email: string, ipAddress: string): Promise<RateLimitResult> {
    const config = this.configs.login
    const windowStart = new Date(Date.now() - config.windowMs)

    // Check email-based rate limit
    const emailAttempts = await prisma.authEvent.count({
      where: {
        type: 'LOGIN_FAILED',
        createdAt: { gte: windowStart },
        details: {
          path: ['email'],
          equals: email
        }
      }
    })

    if (emailAttempts >= config.maxAttempts) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + config.windowMs
      }
    }

    // Check IP-based rate limit
    const ipResult = await this.checkIpRateLimit(ipAddress, 'login')
    if (!ipResult.allowed) {
      return ipResult
    }

    return {
      allowed: true,
      remaining: config.maxAttempts - emailAttempts,
      resetTime: Date.now() + config.windowMs
    }
  }

  // IP-based rate limiting
  static async checkIpRateLimit(ipAddress: string, action: keyof typeof RateLimitService.configs): Promise<RateLimitResult> {
    const config = this.configs[action] || this.configs.login
    const windowStart = new Date(Date.now() - config.windowMs)

    const attempts = await prisma.authEvent.count({
      where: {
        ipAddress,
        createdAt: { gte: windowStart },
        ...(action === 'login' && { type: 'LOGIN_FAILED' })
      }
    })

    const allowed = attempts < config.maxAttempts

    return {
      allowed,
      remaining: Math.max(0, config.maxAttempts - attempts),
      resetTime: Date.now() + config.windowMs
    }
  }

  // Password reset rate limiting
  static async checkPasswordResetRateLimit(email: string, ipAddress: string): Promise<RateLimitResult> {
    const config = this.configs.passwordReset
    const windowStart = new Date(Date.now() - config.windowMs)

    // Check both email and IP
    const [emailAttempts, ipAttempts] = await Promise.all([
      prisma.authEvent.count({
        where: {
          type: 'PASSWORD_RESET',
          createdAt: { gte: windowStart },
          details: {
            path: ['email'],
            equals: email
          }
        }
      }),
      this.checkIpRateLimit(ipAddress, 'passwordReset')
    ])

    if (!ipAttempts.allowed || emailAttempts >= config.maxAttempts) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + config.windowMs
      }
    }

    return {
      allowed: true,
      remaining: Math.min(config.maxAttempts - emailAttempts, ipAttempts.remaining),
      resetTime: Date.now() + config.windowMs
    }
  }

  // Email verification rate limiting
  static async checkEmailVerificationRateLimit(email: string, ipAddress: string): Promise<RateLimitResult> {
    const config = this.configs.emailVerification
    const windowStart = new Date(Date.now() - config.windowMs)

    const [emailAttempts, ipAttempts] = await Promise.all([
      prisma.authEvent.count({
        where: {
          type: 'EMAIL_VERIFICATION',
          createdAt: { gte: windowStart },
          details: {
            path: ['email'],
            equals: email
          }
        }
      }),
      this.checkIpRateLimit(ipAddress, 'emailVerification')
    ])

    if (!ipAttempts.allowed || emailAttempts >= config.maxAttempts) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + config.windowMs
      }
    }

    return {
      allowed: true,
      remaining: Math.min(config.maxAttempts - emailAttempts, ipAttempts.remaining),
      resetTime: Date.now() + config.windowMs
    }
  }

  // Magic link rate limiting
  static async checkMagicLinkRateLimit(email: string, ipAddress: string): Promise<RateLimitResult> {
    const config = this.configs.magicLink
    const windowStart = new Date(Date.now() - config.windowMs)

    const [emailAttempts, ipAttempts] = await Promise.all([
      prisma.user.count({
        where: {
          email,
          magicLinkExpiry: { gte: windowStart }
        }
      }),
      this.checkIpRateLimit(ipAddress, 'magicLink')
    ])

    if (!ipAttempts.allowed || emailAttempts >= config.maxAttempts) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + config.windowMs
      }
    }

    return {
      allowed: true,
      remaining: Math.min(config.maxAttempts - emailAttempts, ipAttempts.remaining),
      resetTime: Date.now() + config.windowMs
    }
  }

  // Clean up old rate limit records
  static async cleanupOldRecords(): Promise<void> {
    const maxAge = Math.max(...Object.values(this.configs).map(c => c.windowMs))
    const cutoff = new Date(Date.now() - maxAge * 2) // Keep records for 2x the longest window

    await prisma.authEvent.deleteMany({
      where: {
        createdAt: { lt: cutoff }
      }
    })
  }

  // Get remaining attempts for display
  static async getRemainingAttempts(email: string, ipAddress: string, action: keyof typeof RateLimitService.configs = 'login'): Promise<number> {
    const result = action === 'login' 
      ? await this.checkLoginRateLimit(email, ipAddress)
      : await this.checkIpRateLimit(ipAddress, action)
    
    return result.remaining
  }

  // Check if user/IP is currently rate limited
  static async isRateLimited(email: string, ipAddress: string, action: keyof typeof RateLimitService.configs = 'login'): Promise<boolean> {
    const result = action === 'login'
      ? await this.checkLoginRateLimit(email, ipAddress)
      : await this.checkIpRateLimit(ipAddress, action)
    
    return !result.allowed
  }
}