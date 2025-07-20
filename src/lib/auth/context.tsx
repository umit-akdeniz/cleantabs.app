'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authClient, User } from './client'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Initialize after hydration
  useEffect(() => {
    authClient.init()
    setIsHydrated(true)
  }, [])

  // Load user after hydration
  useEffect(() => {
    if (!isHydrated) return

    const loadUser = async () => {
      setIsLoading(true)
      try {
        // First check localStorage for cached user
        const cachedUser = authClient.getUser()
        const tokens = authClient.getTokens()
        
        console.log('🔍 Auth loading:', { cachedUser, hasTokens: !!tokens });
        
        if (cachedUser && tokens && !authClient.isTokenExpired()) {
          // Set user immediately from cache
          setUser(cachedUser)
          setIsLoading(false)
          console.log('✅ User loaded from cache:', cachedUser);
          
          // Then verify with server in background
          try {
            const serverUser = await authClient.getCurrentUser()
            if (serverUser) {
              setUser(serverUser)
              console.log('✅ User verified from server:', serverUser);
            } else {
              // Server says no user, clear local data
              console.log('❌ Server verification failed, clearing user');
              setUser(null)
            }
          } catch (error) {
            console.error('Background user verification failed:', error)
            // Don't clear user on background verification failure
          }
        } else {
          // No cached user or expired token
          console.log('❌ No cached user or expired token');
          setUser(null)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Failed to load user:', error)
        setUser(null)
        setIsLoading(false)
      }
    }

    loadUser()
  }, [isHydrated])

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('Attempting login for:', email)
      const { user: loggedInUser } = await authClient.login(email, password)
      console.log('Login successful, user:', loggedInUser)
      setUser(loggedInUser)
    } catch (err) {
      console.error('Login error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { user: registeredUser } = await authClient.register(name, email, password)
      setUser(registeredUser)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      await authClient.logout()
      setUser(null)
      setError(null)
    } catch (err) {
      console.error('Logout error:', err)
      // Even if logout fails, clear local state
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  }

  // Don't render children until hydrated to prevent mismatch
  if (!isHydrated) {
    return (
      <AuthContext.Provider value={{
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        login,
        register,
        logout,
        clearError,
      }}>
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}