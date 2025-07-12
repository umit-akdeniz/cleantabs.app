import { NextRequest } from 'next/server'
import { JWTManager } from '@/lib/auth/jwt'
import { AuthDatabase } from '@/lib/auth/database'
import { APIErrorHandler, withErrorHandler } from '@/lib/api/error-handler'
import { CacheManager } from '@/lib/cache/cache-manager'

export const runtime = 'nodejs'

export const GET = withErrorHandler(async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!token) {
    return APIErrorHandler.unauthorized('No token provided')
  }

  // Verify token
  const payload = JWTManager.verifyAccessToken(token)
  if (!payload) {
    return APIErrorHandler.unauthorized('Invalid or expired token')
  }

  // Try cache first
  const cacheKey = `user:${payload.userId}:profile`
  const cached = CacheManager.get(cacheKey)
  
  if (cached) {
    return APIErrorHandler.success({ user: cached })
  }

  // Get user from database
  const authDb = AuthDatabase.getInstance()
  const user = await authDb.findUserById(payload.userId)
  
  if (!user) {
    return APIErrorHandler.notFound('User')
  }

  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    emailVerified: user.emailVerified
  }

  // Cache user data for 2 minutes
  CacheManager.set(cacheKey, userData, {
    ttl: 2 * 60 * 1000,
    tags: ['user', `user:${user.id}`]
  })

  return APIErrorHandler.success({ user: userData })
})