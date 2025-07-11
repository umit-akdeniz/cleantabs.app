import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "../prisma"
import { createCredentialsProvider, createGoogleProvider, createGitHubProvider } from "./providers"
import { AuthCallbacks } from "./callbacks"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    createCredentialsProvider(),
    createGoogleProvider(),
    createGitHubProvider(),
  ],
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  callbacks: {
    signIn: AuthCallbacks.signIn,
    jwt: AuthCallbacks.jwt,
    session: AuthCallbacks.session,
    redirect: AuthCallbacks.redirect,
  },
  
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/dashboard'
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  debug: process.env.NODE_ENV === 'development',
  
  events: {
    async signIn({ user, account, profile }) {
      console.log(`✅ User signed in: ${user.email} via ${account?.provider}`)
    },
    
    async signOut({ session, token }) {
      console.log(`👋 User signed out: ${session?.user?.email || token?.email}`)
    },
    
    async createUser({ user }) {
      console.log(`🆕 New user created: ${user.email}`)
    },
    
    async session({ session, token }) {
      if (token?.isValid === false) {
        console.log('⚠️ Invalid token detected in session event')
      }
    }
  },
  
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      }
    }
  }
}