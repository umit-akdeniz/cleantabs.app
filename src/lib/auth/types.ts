import { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      plan: "FREE" | "PREMIUM"
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    plan: "FREE" | "PREMIUM"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    plan: "FREE" | "PREMIUM"
    isValid?: boolean
    lastValidated?: number
  }
}

export interface ExtendedUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
  plan: "FREE" | "PREMIUM"
  password?: string | null
  emailVerified?: Date | null
}

export interface AuthError {
  type: 'AUTH_ERROR' | 'DATABASE_ERROR' | 'VALIDATION_ERROR'
  message: string
  code?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}