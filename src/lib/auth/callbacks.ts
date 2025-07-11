import { AuthDatabase } from './database'
import type { Account, User, Profile, Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import { ExtendedUser } from './types'

export class AuthCallbacks {
  private static authDb = AuthDatabase.getInstance()

  static async signIn({ user, account, profile }: { user: User; account: Account | null; profile?: Profile }): Promise<boolean> {
    try {
      console.log('🔐 SignIn callback:', {
        provider: account?.provider,
        email: user.email,
        id: user.id
      })

      // OAuth providers için özel işlemler
      if (account?.provider === 'google' || account?.provider === 'github') {
        if (!user.email) {
          console.log('❌ OAuth user has no email')
          return false
        }

        // Kullanıcıyı bul veya oluştur
        let existingUser = await this.authDb.findUserByEmail(user.email)
        
        if (!existingUser) {
          console.log('🆕 Creating new OAuth user:', user.email)
          existingUser = await this.authDb.createUser({
            email: user.email,
            name: user.name || user.email.split('@')[0],
            password: '', // OAuth users don't have passwords
            plan: 'FREE'
          })
        } else {
          console.log('✅ OAuth user exists, updating info')
          // Update user info if needed
          await this.authDb.updateUser(existingUser.id, {
            name: user.name || existingUser.name,
            image: user.image || existingUser.image
          })
        }
      }

      return true
    } catch (error) {
      console.error('💥 SignIn callback error:', error)
      return false
    }
  }

  static async jwt({ token, user, account, trigger }: { token: JWT; user?: User; account?: Account | null; trigger?: string }): Promise<JWT> {
    try {
      console.log('🎫 JWT callback:', {
        hasUser: !!user,
        hasToken: !!token,
        email: token?.email,
        trigger
      })

      // İlk giriş - user objesi mevcut
      if (user) {
        console.log('👤 First login, setting up token')
        return {
          ...token,
          id: user.id,
          plan: (user as ExtendedUser).plan || 'FREE',
          isValid: true,
          lastValidated: Date.now()
        }
      }

      // Mevcut token'i validate et
      if (token?.email) {
        // Her 5 dakikada bir validate et
        const now = Date.now()
        const lastValidated = token.lastValidated || 0
        const shouldRevalidate = now - lastValidated > 5 * 60 * 1000 // 5 minutes

        if (shouldRevalidate) {
          console.log('🔍 Revalidating token for:', token.email)
          
          const dbUser = await this.authDb.findUserByEmail(token.email)
          
          if (!dbUser) {
            console.log('❌ User not found in database during revalidation')
            return {
              ...token,
              isValid: false
            }
          }

          // Token'i güncelle
          return {
            ...token,
            id: dbUser.id,
            plan: dbUser.plan,
            name: dbUser.name,
            picture: dbUser.image,
            isValid: true,
            lastValidated: now
          }
        }
      }

      return token
    } catch (error) {
      console.error('💥 JWT callback error:', error)
      return {
        ...token,
        isValid: false
      }
    }
  }

  static async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
    try {
      console.log('🔒 Session callback:', {
        hasToken: !!token,
        isValid: token?.isValid,
        email: token?.email
      })

      // Token geçersizse minimal session döndür
      if (!token?.email || token.isValid === false) {
        console.log('❌ Invalid token, returning minimal session')
        return {
          ...session,
          user: {
            id: '',
            email: '',
            name: '',
            image: '',
            plan: 'FREE'
          }
        }
      }

      // Session'i güncelle
      if (session?.user) {
        session.user.id = token.id || token.sub || ''
        session.user.plan = token.plan || 'FREE'
        session.user.name = token.name || session.user.name
        session.user.image = token.picture || session.user.image
      }

      console.log('✅ Session created:', {
        id: session.user?.id,
        email: session.user?.email,
        plan: session.user?.plan
      })

      return session
    } catch (error) {
      console.error('💥 Session callback error:', error)
      return {
        ...session,
        user: {
          id: '',
          email: '',
          name: '',
          image: '',
          plan: 'FREE'
        }
      }
    }
  }

  static async redirect({ url, baseUrl }: { url: string; baseUrl: string }): Promise<string> {
    console.log('🔄 Redirect callback:', { url, baseUrl })
    
    // Relative URL'ler için baseUrl ekle
    if (url.startsWith('/')) {
      return `${baseUrl}${url}`
    }
    
    // Aynı origin'den gelen URL'ler için
    if (new URL(url).origin === baseUrl) {
      return url
    }
    
    // Varsayılan olarak dashboard'a yönlendir
    return `${baseUrl}/dashboard`
  }
}