import jwt from 'jsonwebtoken'
import { User } from '@prisma/client'

export interface JWTPayload {
  userId: string
  email: string
  plan: 'FREE' | 'PREMIUM'
  iat: number
  exp: number
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export class JWTManager {
  private static readonly ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || process.env.NEXTAUTH_SECRET || 'your-access-secret'
  private static readonly REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || process.env.NEXTAUTH_SECRET || 'your-refresh-secret'
  private static readonly ACCESS_TOKEN_EXPIRY = '15m'
  private static readonly REFRESH_TOKEN_EXPIRY = '7d'

  static generateTokens(user: User): TokenPair {
    const payload = {
      userId: user.id,
      email: user.email,
      plan: user.plan
    }

    const accessToken = jwt.sign(
      payload,
      this.ACCESS_TOKEN_SECRET,
      { expiresIn: this.ACCESS_TOKEN_EXPIRY }
    )

    const refreshToken = jwt.sign(
      payload,
      this.REFRESH_TOKEN_SECRET,
      { expiresIn: this.REFRESH_TOKEN_EXPIRY }
    )

    return { accessToken, refreshToken }
  }

  static verifyAccessToken(token: string): JWTPayload | null {
    try {
      const payload = jwt.verify(token, this.ACCESS_TOKEN_SECRET) as JWTPayload
      return payload
    } catch (error) {
      console.error('Access token verification failed:', error)
      return null
    }
  }

  static verifyRefreshToken(token: string): JWTPayload | null {
    try {
      const payload = jwt.verify(token, this.REFRESH_TOKEN_SECRET) as JWTPayload
      return payload
    } catch (error) {
      console.error('Refresh token verification failed:', error)
      return null
    }
  }

  static refreshAccessToken(refreshToken: string): TokenPair | null {
    const payload = this.verifyRefreshToken(refreshToken)
    if (!payload) return null

    // Generate new tokens
    const newTokens = this.generateTokens({
      id: payload.userId,
      email: payload.email,
      plan: payload.plan
    } as User)

    return newTokens
  }
}