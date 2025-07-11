import { signOut } from 'next-auth/react'
import { ClientSessionManager } from './session'

export async function performCompleteSignOut(callbackUrl: string = '/auth/signin'): Promise<void> {
  try {
    console.log('🔄 Performing complete sign out...')
    
    // Clear all storage first
    ClientSessionManager.clearAllStorage()
    
    // Sign out with NextAuth
    await signOut({
      callbackUrl,
      redirect: true
    })
    
    // Force reload as fallback
    setTimeout(() => {
      window.location.href = callbackUrl
    }, 100)
    
  } catch (error) {
    console.error('Error during sign out:', error)
    // Fallback: force redirect
    window.location.href = callbackUrl
  }
}

export function initializeUserSession(user: any): void {
  ClientSessionManager.initializeUserSession(user)
}

export function validateSession(): boolean {
  return ClientSessionManager.validateLocalSession()
}

export function clearAllStorageData(): void {
  ClientSessionManager.clearAllStorage()
}

// Password validation utility
export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Email validation utility
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Name validation utility
export function validateName(name: string): boolean {
  return name.trim().length >= 2
}