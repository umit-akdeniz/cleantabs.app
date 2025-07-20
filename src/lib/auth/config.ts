import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { AuthService } from "./service"
import { RateLimitService } from "./rate-limit"
import { AuditService } from "./audit"
import type { NextAuthConfig } from "next-auth"

const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        totp: { label: "2FA Code", type: "text" },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const ip = request?.headers?.get("x-forwarded-for") || 
                   request?.headers?.get("x-real-ip") || 
                   "unknown"

        try {
          // Rate limiting check
          const rateLimitResult = await RateLimitService.checkLoginRateLimit(
            credentials.email as string, 
            ip
          )

          if (!rateLimitResult.allowed) {
            await AuditService.logAuthEvent({
              type: "LOGIN_FAILED",
              success: false,
              email: credentials.email as string,
              ipAddress: ip,
              details: { reason: "Rate limited" }
            })
            throw new Error("Too many login attempts. Please try again later.")
          }

          // Find user
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })

          if (!user || !user.password) {
            await AuditService.logAuthEvent({
              userId: user?.id,
              type: "LOGIN_FAILED",
              success: false,
              email: credentials.email as string,
              ipAddress: ip,
              details: { reason: "Invalid credentials" }
            })
            return null
          }

          // Check if account is locked
          if (user.isLocked && user.lockoutEnd && user.lockoutEnd > new Date()) {
            await AuditService.logAuthEvent({
              userId: user.id,
              type: "LOGIN_FAILED",
              success: false,
              email: credentials.email as string,
              ipAddress: ip,
              details: { reason: "Account locked" }
            })
            throw new Error("Account is locked. Please try again later.")
          }

          // Verify password
          const isPasswordValid = await compare(
            credentials.password as string, 
            user.password
          )

          if (!isPasswordValid) {
            // Handle failed login attempt
            await AuthService.handleFailedLogin(user.id, ip)
            return null
          }

          // Check 2FA if enabled
          if (user.twoFactorEnabled && user.twoFactorSecret) {
            if (!credentials.totp) {
              throw new Error("2FA code required")
            }

            const isTotpValid = AuthService.verifyTOTP(
              credentials.totp as string, 
              user.twoFactorSecret
            )

            if (!isTotpValid) {
              await AuditService.logAuthEvent({
                userId: user.id,
                type: "TWO_FA_FAILED",
                success: false,
                email: credentials.email as string,
                ipAddress: ip,
                details: { reason: "Invalid 2FA code" }
              })
              throw new Error("Invalid 2FA code")
            }

            await AuditService.logAuthEvent({
              userId: user.id,
              type: "TWO_FA_SUCCESS",
              success: true,
              email: credentials.email as string,
              ipAddress: ip
            })
          }

          // Reset failed attempts on successful login
          await AuthService.resetFailedAttempts(user.id, ip)

          // Log successful login
          await AuditService.logAuthEvent({
            userId: user.id,
            type: "LOGIN_SUCCESS",
            success: true,
            email: credentials.email as string,
            ipAddress: ip
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            plan: user.plan,
            image: user.image,
            emailVerified: user.emailVerified,
            twoFactorEnabled: user.twoFactorEnabled,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.role = user.role
        token.plan = user.plan
        token.twoFactorEnabled = user.twoFactorEnabled
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token = { ...token, ...session }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.plan = token.plan as string
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean
      }

      return session
    },
    async signIn({ user, account, profile, credentials }) {
      // Handle OAuth providers
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (existingUser && !existingUser.emailVerified) {
            // Auto-verify email for OAuth providers
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { emailVerified: new Date() }
            })
          }

          await AuditService.logAuthEvent({
            userId: existingUser?.id,
            type: "LOGIN_SUCCESS",
            success: true,
            email: user.email!,
            details: { provider: account.provider }
          })

          return true
        } catch (error) {
          console.error("OAuth sign in error:", error)
          return false
        }
      }

      return true
    },
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  events: {
    async signOut({ session, token }) {
      if (session?.user?.id || token?.sub) {
        await AuditService.logAuthEvent({
          userId: session?.user?.id || token?.sub,
          type: "LOGOUT",
          success: true,
        })
      }
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)