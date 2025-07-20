import { NextRequest } from 'next/server'
import { JWTManager } from '@/lib/auth/jwt'
import { AuthDatabase } from '@/lib/auth/database'
import { APIErrorHandler, withErrorHandler } from '@/lib/api/error-handler'
import { z } from 'zod'

export const runtime = 'nodejs'

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
})

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await request.json()
  const { refreshToken } = refreshSchema.parse(body)

  // Verify refresh token
  const payload = JWTManager.verifyRefreshToken(refreshToken)
  if (!payload) {
    return APIErrorHandler.unauthorized('Invalid or expired refresh token')
  }

  // Get user from database to ensure they still exist
  const authDb = AuthDatabase.getInstance()
  const user = await authDb.findUserById(payload.userId)
  
  if (!user) {
    return APIErrorHandler.notFound('User')
  }

  // Generate new tokens
  const tokens = JWTManager.generateTokens({
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    emailVerified: user.emailVerified,
    image: user.image,
    password: user.password,
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

  return APIErrorHandler.success({
    tokens,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      emailVerified: user.emailVerified
    }
  })
})