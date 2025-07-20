import { authenticator } from 'otplib'
import { compare, hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

export class AuthService {
  // 2FA Methods
  static generateTOTPSecret(): string {
    return authenticator.generateSecret()
  }

  static verifyTOTP(token: string, secret: string): boolean {
    try {
      return authenticator.verify({ token, secret })
    } catch (error) {
      console.error('TOTP verification error:', error)
      return false
    }
  }

  static generateTOTPUri(email: string, secret: string): string {
    return authenticator.keyuri(email, 'CleanTabs', secret)
  }

  // Password Management
  static async hashPassword(password: string): Promise<string> {
    return await hash(password, 12)
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await compare(password, hashedPassword)
  }

  // Account Management
  static async handleFailedLogin(userId: string, ipAddress: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) return

    const newFailedAttempts = user.failedLoginAttempts + 1
    const maxAttempts = 5
    const lockoutDuration = 30 * 60 * 1000 // 30 minutes

    await prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: newFailedAttempts,
        ...(newFailedAttempts >= maxAttempts && {
          isLocked: true,
          lockoutEnd: new Date(Date.now() + lockoutDuration)
        })
      }
    })

    // Log the failed attempt
    await prisma.authEvent.create({
      data: {
        userId,
        type: 'LOGIN_FAILED',
        success: false,
        ipAddress,
        details: {
          failedAttempts: newFailedAttempts,
          locked: newFailedAttempts >= maxAttempts
        }
      }
    })
  }

  static async resetFailedAttempts(userId: string, ipAddress: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        isLocked: false,
        lockoutEnd: null,
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress
      }
    })
  }

  static async unlockAccount(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isLocked: false,
        lockoutEnd: null,
        failedLoginAttempts: 0
      }
    })

    await prisma.authEvent.create({
      data: {
        userId,
        type: 'ACCOUNT_UNLOCKED',
        success: true,
        details: { method: 'manual' }
      }
    })
  }

  // 2FA Setup
  static async enableTwoFactor(userId: string, secret: string): Promise<string[]> {
    const backupCodes = Array.from({ length: 10 }, () => 
      randomBytes(4).toString('hex').toUpperCase()
    )

    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        twoFactorBackupCodes: backupCodes
      }
    })

    await prisma.authEvent.create({
      data: {
        userId,
        type: 'TWO_FA_ENABLED',
        success: true
      }
    })

    return backupCodes
  }

  static async disableTwoFactor(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: []
      }
    })

    await prisma.authEvent.create({
      data: {
        userId,
        type: 'TWO_FA_DISABLED',
        success: true
      }
    })
  }

  static async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user || !user.twoFactorBackupCodes.includes(code)) {
      return false
    }

    // Remove used backup code
    const updatedCodes = user.twoFactorBackupCodes.filter(c => c !== code)
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorBackupCodes: updatedCodes
      }
    })

    return true
  }

  // Token Management
  static async generatePasswordResetToken(email: string): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) return null

    const token = randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpiry: expiry
      }
    })

    return token
  }

  static async verifyPasswordResetToken(token: string): Promise<string | null> {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpiry: {
          gt: new Date()
        }
      }
    })

    return user?.id || null
  }

  static async resetPassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await this.hashPassword(newPassword)

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null
      }
    })

    await prisma.authEvent.create({
      data: {
        userId,
        type: 'PASSWORD_CHANGE',
        success: true,
        details: { method: 'reset' }
      }
    })
  }

  // Magic Link
  static async generateMagicLinkToken(email: string): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) return null

    const token = randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        magicLinkToken: token,
        magicLinkExpiry: expiry
      }
    })

    return token
  }

  static async verifyMagicLinkToken(token: string): Promise<string | null> {
    const user = await prisma.user.findFirst({
      where: {
        magicLinkToken: token,
        magicLinkExpiry: {
          gt: new Date()
        }
      }
    })

    if (user) {
      // Clear the token after use
      await prisma.user.update({
        where: { id: user.id },
        data: {
          magicLinkToken: null,
          magicLinkExpiry: null
        }
      })
    }

    return user?.id || null
  }

  // Email Verification
  static async generateEmailVerificationToken(email: string): Promise<string> {
    const token = randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.user.update({
      where: { email },
      data: {
        emailVerificationToken: token,
        emailVerificationExpiry: expiry
      }
    })

    return token
  }

  static async verifyEmailToken(token: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpiry: {
          gt: new Date()
        }
      }
    })

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          emailVerificationToken: null,
          emailVerificationExpiry: null
        }
      })

      await prisma.authEvent.create({
        data: {
          userId: user.id,
          type: 'EMAIL_VERIFICATION',
          success: true
        }
      })

      return true
    }

    return false
  }
}