import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { AuthDatabase } from './database'
import { ExtendedUser, LoginCredentials } from './types'

export function createCredentialsProvider() {
  return CredentialsProvider({
    id: "credentials",
    name: "credentials",
    credentials: {
      email: { 
        label: "Email", 
        type: "email",
        placeholder: "your@email.com"
      },
      password: { 
        label: "Password", 
        type: "password",
        placeholder: "Your password"
      }
    },
    async authorize(credentials): Promise<ExtendedUser | null> {
      if (!credentials?.email || !credentials?.password) {
        console.log('❌ Missing credentials in authorize')
        return null
      }

      const authDb = AuthDatabase.getInstance()
      
      try {
        console.log('🔍 Authenticating user:', credentials.email)
        
        // Find user by email
        const user = await authDb.findUserByEmail(credentials.email)
        
        if (!user) {
          console.log('❌ User not found:', credentials.email)
          return null
        }
        
        if (!user.password) {
          console.log('❌ User has no password (OAuth-only user):', credentials.email)
          return null
        }

        // Verify password
        const isValidPassword = await authDb.verifyPassword(credentials.password, user.password)
        
        if (!isValidPassword) {
          console.log('❌ Invalid password for user:', credentials.email)
          return null
        }

        console.log('✅ User authenticated successfully:', {
          id: user.id,
          email: user.email,
          plan: user.plan
        })

        // Return user without password
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
        
      } catch (error) {
        console.error('💥 Authentication error:', error)
        return null
      }
    }
  })
}

export function createGoogleProvider() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Google OAuth credentials are not configured')
  }

  return GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authorization: {
      params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
        scope: "openid email profile"
      }
    }
  })
}

export function createGitHubProvider() {
  if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
    throw new Error('GitHub OAuth credentials are not configured')
  }

  return GitHubProvider({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    authorization: {
      params: {
        scope: "user:email"
      }
    }
  })
}