import { getServerSession } from "next-auth"
import { authOptions } from "./config"
import { ExtendedUser } from "./types"

export class SessionManager {
  
  static async getSession() {
    try {
      const session = await getServerSession(authOptions)
      return session
    } catch (error) {
      console.error('Error getting session:', error)
      return null
    }
  }

  static async getCurrentUser(): Promise<ExtendedUser | null> {
    try {
      const session = await this.getSession()
      
      if (!session?.user?.email) {
        return null
      }

      // AuthDatabase'den kullanıcı bilgilerini al
      const { AuthDatabase } = await import('./database')
      const authDb = AuthDatabase.getInstance()
      
      const user = await authDb.findUserByEmail(session.user.email)
      return user
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  static async requireAuth(): Promise<ExtendedUser> {
    const user = await this.getCurrentUser()
    
    if (!user) {
      throw new Error('Authentication required')
    }
    
    return user
  }

  static async requirePlan(plan: 'FREE' | 'PREMIUM'): Promise<ExtendedUser> {
    const user = await this.requireAuth()
    
    if (user.plan !== plan && plan === 'PREMIUM') {
      throw new Error('Premium subscription required')
    }
    
    return user
  }

  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession()
    return !!session?.user
  }

  static async getUserId(): Promise<string | null> {
    const session = await this.getSession()
    return session?.user?.id || null
  }
}

// Client-side session utilities
export class ClientSessionManager {
  
  static clearAllStorage(): void {
    if (typeof window === 'undefined') return
    
    try {
      // Clear localStorage
      localStorage.clear()
      
      // Clear sessionStorage
      sessionStorage.clear()
      
      // Clear specific auth keys
      const authKeys = [
        'next-auth.session-token',
        'next-auth.callback-url',
        'next-auth.csrf-token',
        'next-auth.pkce.code_verifier',
        'user_preferences',
        'dashboard_settings'
      ]
      
      authKeys.forEach(key => {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
      })
      
      // Clear cookies
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=")
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
        if (name) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.cleantabs.app`
        }
      })
      
      console.log('✅ All storage cleared')
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  }

  static initializeUserSession(user: any): void {
    if (typeof window === 'undefined') return
    
    try {
      const userPreferences = {
        theme: 'system',
        lastLogin: new Date().toISOString(),
        userId: user.id,
        email: user.email,
        plan: user.plan
      }
      
      localStorage.setItem('user_preferences', JSON.stringify(userPreferences))
      console.log('✅ User session initialized')
    } catch (error) {
      console.error('Error initializing user session:', error)
    }
  }

  static validateLocalSession(): boolean {
    if (typeof window === 'undefined') return false
    
    try {
      const userPrefs = localStorage.getItem('user_preferences')
      if (!userPrefs) return false
      
      const prefs = JSON.parse(userPrefs)
      
      // Check if session is too old (24 hours)
      const lastLogin = new Date(prefs.lastLogin)
      const now = new Date()
      const hoursDiff = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60)
      
      if (hoursDiff > 24) {
        console.log('Session expired, clearing data')
        this.clearAllStorage()
        return false
      }
      
      return true
    } catch (error) {
      console.error('Error validating session:', error)
      return false
    }
  }
}