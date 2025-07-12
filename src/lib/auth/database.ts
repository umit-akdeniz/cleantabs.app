import { prisma } from '../prisma'
import { ExtendedUser } from './types'
import bcrypt from 'bcryptjs'

// Export prisma instance for other modules
export { prisma }

export class AuthDatabase {
  private static instance: AuthDatabase
  private readonly MAX_RETRIES = 3
  private readonly RETRY_DELAY = 1000

  static getInstance(): AuthDatabase {
    if (!AuthDatabase.instance) {
      AuthDatabase.instance = new AuthDatabase()
    }
    return AuthDatabase.instance
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error
    
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        console.error(`${context} failed (attempt ${attempt}/${this.MAX_RETRIES}):`, error)
        
        if (attempt < this.MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * attempt))
        }
      }
    }
    
    throw lastError!
  }

  async findUserByEmail(email: string): Promise<ExtendedUser | null> {
    return this.withRetry(async () => {
      console.log('🔍 Database: Searching for user with email:', email.toLowerCase().trim())
      const user = await prisma.user.findUnique({
        where: { 
          email: email.toLowerCase().trim() 
        },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          plan: true,
          password: true,
          emailVerified: true
        }
      })
      
      console.log('🔍 Database: User found:', user ? 'Yes' : 'No')
      return user as ExtendedUser | null
    }, 'findUserByEmail')
  }

  async findUserById(id: string): Promise<ExtendedUser | null> {
    return this.withRetry(async () => {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          plan: true,
          password: true,
          emailVerified: true
        }
      })
      
      return user as ExtendedUser | null
    }, 'findUserById')
  }

  async createUser(data: {
    email: string
    name: string
    password: string
    plan?: 'FREE' | 'PREMIUM'
  }): Promise<ExtendedUser> {
    return this.withRetry(async () => {
      const hashedPassword = await bcrypt.hash(data.password, 12)
      
      const user = await prisma.user.create({
        data: {
          email: data.email.toLowerCase().trim(),
          name: data.name.trim(),
          password: hashedPassword,
          plan: data.plan || 'FREE',
          emailVerified: new Date()
        },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          plan: true,
          password: true,
          emailVerified: true
        }
      })
      
      return user as ExtendedUser
    }, 'createUser')
  }

  async updateUser(id: string, data: Partial<ExtendedUser>): Promise<ExtendedUser> {
    return this.withRetry(async () => {
      const user = await prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          plan: true,
          password: true,
          emailVerified: true
        }
      })
      
      return user as ExtendedUser
    }, 'updateUser')
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword)
    } catch (error) {
      console.error('Password verification failed:', error)
      return false
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      console.error('Database connection test failed:', error)
      return false
    }
  }

  async createPasswordResetToken(userId: string, token: string, expiry: Date): Promise<void> {
    return this.withRetry(async () => {
      await prisma.user.update({
        where: { id: userId },
        data: {
          resetPasswordToken: token,
          resetPasswordExpiry: expiry
        }
      })
    }, 'createPasswordResetToken')
  }

  async findUserByResetToken(token: string): Promise<ExtendedUser & { resetPasswordExpiry?: Date } | null> {
    return this.withRetry(async () => {
      const user = await prisma.user.findUnique({
        where: { resetPasswordToken: token },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          plan: true,
          password: true,
          emailVerified: true,
          resetPasswordExpiry: true
        }
      })
      
      return user as ExtendedUser & { resetPasswordExpiry?: Date } | null
    }, 'findUserByResetToken')
  }

  async updatePasswordAndClearResetToken(userId: string, newPassword: string): Promise<void> {
    return this.withRetry(async () => {
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpiry: null
        }
      })
    }, 'updatePasswordAndClearResetToken')
  }
}