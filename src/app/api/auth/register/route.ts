import { NextRequest } from 'next/server'
import { AuthDatabase } from '@/lib/auth/database'
import { JWTManager } from '@/lib/auth/jwt'
import { APIErrorHandler, withErrorHandler, AppError } from '@/lib/api/error-handler'
import { z } from 'zod'

export const runtime = 'nodejs'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  plan: z.enum(['FREE', 'PREMIUM']).optional()
})

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await request.json()
  const { email, name, password, plan } = registerSchema.parse(body)

  const authDb = AuthDatabase.getInstance()
  
  // Check if user already exists
  const existingUser = await authDb.findUserByEmail(email)
  if (existingUser) {
    throw new AppError('User already exists with this email', 409)
  }

  // Create new user
  const user = await authDb.createUser({
    email,
    name,
    password,
    plan: plan || 'FREE'
  })

  // Sample data creation removed for production

  // Send welcome email
  try {
    const { sendWelcomeEmail } = require('@/lib/email')
    await sendWelcomeEmail(user.email, user.name)
    console.log(`✅ Welcome email sent to: ${user.email}`)
  } catch (error) {
    console.error('⚠️ Error sending welcome email:', error)
    // Don't fail registration if email sending fails
  }

  // Generate JWT tokens
  const tokens = JWTManager.generateTokens({
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    emailVerified: user.emailVerified,
    image: user.image,
    password: user.password,
    fcmToken: user.fcmToken,
    fcmTokenUpdated: user.fcmTokenUpdated,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    resetPasswordToken: user.resetPasswordToken,
    resetPasswordExpiry: user.resetPasswordExpiry || null,
    verificationToken: user.verificationToken,
    verificationTokenExpiry: user.verificationTokenExpiry || null,
    verificationCode: user.verificationCode,
    verificationCodeExpiry: user.verificationCodeExpiry || null,
    stripeCustomerId: user.stripeCustomerId,
    stripeSubscriptionId: user.stripeSubscriptionId
  })

  // Return success response
  return APIErrorHandler.success({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      emailVerified: user.emailVerified
    },
    tokens
  }, 201)
})