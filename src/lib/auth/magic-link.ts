import { AuthService } from './service'
import { AuditService } from './audit'
import { RateLimitService } from './rate-limit'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

interface MagicLinkOptions {
  email: string
  redirectUrl?: string
  ipAddress?: string
  userAgent?: string
}

interface MagicLinkVerifyOptions {
  token: string
  ipAddress?: string
  userAgent?: string
}

export class MagicLinkService {
  private static readonly MAGIC_LINK_EXPIRY = 15 * 60 * 1000 // 15 minutes
  private static readonly BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  /**
   * Send a magic link to the user's email
   */
  static async sendMagicLink(options: MagicLinkOptions): Promise<{ success: boolean; message: string }> {
    const { email, redirectUrl = '/dashboard', ipAddress = 'unknown', userAgent } = options

    try {
      // Rate limiting check
      const rateLimitResult = await RateLimitService.checkMagicLinkRateLimit(email, ipAddress)
      
      if (!rateLimitResult.allowed) {
        await AuditService.logAuthEvent({
          type: 'LOGIN_FAILED',
          success: false,
          email,
          ipAddress,
          userAgent,
          details: { 
            reason: 'Rate limited',
            method: 'magic_link',
            remaining: rateLimitResult.remaining
          }
        })
        
        return {
          success: false,
          message: 'Too many magic link requests. Please try again later.'
        }
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        // Don't reveal if user exists or not for security
        await AuditService.logAuthEvent({
          type: 'LOGIN_FAILED',
          success: false,
          email,
          ipAddress,
          userAgent,
          details: { 
            reason: 'User not found',
            method: 'magic_link'
          }
        })
        
        return {
          success: true, // Return success to prevent email enumeration
          message: 'If an account with this email exists, we\'ve sent you a magic link.'
        }
      }

      // Check if account is locked
      if (user.isLocked && user.lockoutEnd && user.lockoutEnd > new Date()) {
        await AuditService.logAuthEvent({
          userId: user.id,
          type: 'LOGIN_FAILED',
          success: false,
          email,
          ipAddress,
          userAgent,
          details: { 
            reason: 'Account locked',
            method: 'magic_link'
          }
        })
        
        return {
          success: false,
          message: 'Account is temporarily locked. Please try again later.'
        }
      }

      // Generate magic link token
      const token = await AuthService.generateMagicLinkToken(email)
      
      if (!token) {
        throw new Error('Failed to generate magic link token')
      }

      // Create magic link URL
      const magicLinkUrl = `${this.BASE_URL}/auth/magic-link/verify?token=${token}&redirect=${encodeURIComponent(redirectUrl)}`

      // Send email
      await this.sendMagicLinkEmail(email, magicLinkUrl, user.name)

      // Log successful magic link request
      await AuditService.logAuthEvent({
        userId: user.id,
        type: 'LOGIN_SUCCESS',
        success: true,
        email,
        ipAddress,
        userAgent,
        details: { 
          method: 'magic_link_request',
          tokenGenerated: true
        }
      })

      return {
        success: true,
        message: 'Magic link sent to your email address.'
      }

    } catch (error) {
      console.error('Magic link generation error:', error)
      
      await AuditService.logAuthEvent({
        type: 'LOGIN_FAILED',
        success: false,
        email,
        ipAddress,
        userAgent,
        details: { 
          reason: 'System error',
          method: 'magic_link',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      })

      return {
        success: false,
        message: 'Failed to send magic link. Please try again.'
      }
    }
  }

  /**
   * Verify magic link token and authenticate user
   */
  static async verifyMagicLink(options: MagicLinkVerifyOptions): Promise<{
    success: boolean
    message: string
    userId?: string
    user?: any
  }> {
    const { token, ipAddress = 'unknown', userAgent } = options

    try {
      // Verify the token
      const userId = await AuthService.verifyMagicLinkToken(token)
      
      if (!userId) {
        await AuditService.logAuthEvent({
          type: 'LOGIN_FAILED',
          success: false,
          ipAddress,
          userAgent,
          details: { 
            reason: 'Invalid or expired token',
            method: 'magic_link_verify',
            token: token.substring(0, 8) + '...' // Log partial token for debugging
          }
        })
        
        return {
          success: false,
          message: 'Invalid or expired magic link.'
        }
      }

      // Get user details
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          plan: true,
          emailVerified: true,
          twoFactorEnabled: true,
          isLocked: true,
          lockoutEnd: true
        }
      })

      if (!user) {
        await AuditService.logAuthEvent({
          userId,
          type: 'LOGIN_FAILED',
          success: false,
          ipAddress,
          userAgent,
          details: { 
            reason: 'User not found',
            method: 'magic_link_verify'
          }
        })
        
        return {
          success: false,
          message: 'User account not found.'
        }
      }

      // Check if account is locked
      if (user.isLocked && user.lockoutEnd && user.lockoutEnd > new Date()) {
        await AuditService.logAuthEvent({
          userId: user.id,
          type: 'LOGIN_FAILED',
          success: false,
          email: user.email,
          ipAddress,
          userAgent,
          details: { 
            reason: 'Account locked',
            method: 'magic_link_verify'
          }
        })
        
        return {
          success: false,
          message: 'Account is temporarily locked.'
        }
      }

      // Auto-verify email if not already verified
      if (!user.emailVerified) {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() }
        })
        
        await AuditService.logAuthEvent({
          userId: user.id,
          type: 'EMAIL_VERIFICATION',
          success: true,
          email: user.email,
          ipAddress,
          userAgent,
          details: { method: 'magic_link_auto_verify' }
        })
      }

      // Reset failed login attempts
      await AuthService.resetFailedAttempts(user.id, ipAddress)

      // Log successful login
      await AuditService.logAuthEvent({
        userId: user.id,
        type: 'LOGIN_SUCCESS',
        success: true,
        email: user.email,
        ipAddress,
        userAgent,
        details: { method: 'magic_link' }
      })

      return {
        success: true,
        message: 'Successfully authenticated via magic link.',
        userId: user.id,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          plan: user.plan,
          emailVerified: user.emailVerified,
          twoFactorEnabled: user.twoFactorEnabled
        }
      }

    } catch (error) {
      console.error('Magic link verification error:', error)
      
      await AuditService.logAuthEvent({
        type: 'LOGIN_FAILED',
        success: false,
        ipAddress,
        userAgent,
        details: { 
          reason: 'System error',
          method: 'magic_link_verify',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      })

      return {
        success: false,
        message: 'Failed to verify magic link. Please try again.'
      }
    }
  }

  /**
   * Send magic link email
   */
  private static async sendMagicLinkEmail(email: string, magicLinkUrl: string, name?: string): Promise<void> {
    const subject = 'Your CleanTabs Magic Link'
    const displayName = name || 'there'
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${subject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb;">CleanTabs</h1>
            </div>
            
            <h2>Hi ${displayName}!</h2>
            
            <p>You requested a magic link to sign in to your CleanTabs account. Click the button below to sign in instantly:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${magicLinkUrl}" 
                 style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Sign In to CleanTabs
              </a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace;">
              ${magicLinkUrl}
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p><strong>Security Notice:</strong></p>
              <ul>
                <li>This link will expire in 15 minutes</li>
                <li>This link can only be used once</li>
                <li>If you didn't request this, please ignore this email</li>
              </ul>
              
              <p style="margin-top: 20px;">
                Best regards,<br>
                The CleanTabs Team
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    const textContent = `
Hi ${displayName}!

You requested a magic link to sign in to your CleanTabs account.

Click this link to sign in: ${magicLinkUrl}

Security Notice:
- This link will expire in 15 minutes
- This link can only be used once
- If you didn't request this, please ignore this email

Best regards,
The CleanTabs Team
    `

    await sendEmail({
      to: email,
      subject,
      html: htmlContent,
      text: textContent
    })
  }

  /**
   * Clean up expired magic link tokens
   */
  static async cleanupExpiredTokens(): Promise<number> {
    try {
      const result = await prisma.user.updateMany({
        where: {
          magicLinkExpiry: {
            lt: new Date()
          }
        },
        data: {
          magicLinkToken: null,
          magicLinkExpiry: null
        }
      })

      return result.count
    } catch (error) {
      console.error('Failed to cleanup expired magic link tokens:', error)
      return 0
    }
  }

  /**
   * Revoke all magic link tokens for a user
   */
  static async revokeUserMagicLinks(userId: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          magicLinkToken: null,
          magicLinkExpiry: null
        }
      })

      await AuditService.logAuthEvent({
        userId,
        type: 'LOGOUT',
        success: true,
        details: { method: 'magic_link_revoke' }
      })
    } catch (error) {
      console.error('Failed to revoke user magic links:', error)
      throw error
    }
  }
}