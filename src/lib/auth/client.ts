'use client'

export interface User {
  id: string
  email: string
  name: string
  plan: 'FREE' | 'PREMIUM'
  emailVerified: Date | null
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

class AuthClient {
  private static instance: AuthClient
  private isHydrated = false

  static getInstance(): AuthClient {
    if (!AuthClient.instance) {
      AuthClient.instance = new AuthClient()
    }
    return AuthClient.instance
  }

  // Initialize after hydration
  init(): void {
    if (typeof window !== 'undefined') {
      this.isHydrated = true
    }
  }

  // Safe localStorage access
  private safeLocalStorage = {
    getItem: (key: string): string | null => {
      if (!this.isHydrated || typeof window === 'undefined') return null
      try {
        return localStorage.getItem(key)
      } catch {
        return null
      }
    },
    setItem: (key: string, value: string): void => {
      if (!this.isHydrated || typeof window === 'undefined') return
      try {
        localStorage.setItem(key, value)
      } catch (error) {
        console.error('Failed to save to localStorage:', error)
      }
    },
    removeItem: (key: string): void => {
      if (!this.isHydrated || typeof window === 'undefined') return
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.error('Failed to remove from localStorage:', error)
      }
    }
  }

  // Token management
  getTokens(): AuthTokens | null {
    const accessToken = this.safeLocalStorage.getItem('accessToken')
    const refreshToken = this.safeLocalStorage.getItem('refreshToken')
    
    if (accessToken && refreshToken) {
      return { accessToken, refreshToken }
    }
    return null
  }

  setTokens(tokens: AuthTokens): void {
    this.safeLocalStorage.setItem('accessToken', tokens.accessToken)
    this.safeLocalStorage.setItem('refreshToken', tokens.refreshToken)
    
    // Also set as httpOnly cookie for middleware
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      // Set as regular cookie for middleware to read
      const isSecure = window.location.protocol === 'https:'
      document.cookie = `accessToken=${tokens.accessToken}; path=/; SameSite=Lax; Secure=${isSecure}`
    }
  }

  clearTokens(): void {
    this.safeLocalStorage.removeItem('accessToken')
    this.safeLocalStorage.removeItem('refreshToken')
    this.safeLocalStorage.removeItem('user')
    
    // Also clear cookies
    if (typeof document !== 'undefined') {
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  }

  // User data management
  getUser(): User | null {
    const userData = this.safeLocalStorage.getItem('user')
    if (userData) {
      try {
        return JSON.parse(userData)
      } catch {
        return null
      }
    }
    return null
  }

  setUser(user: User): void {
    this.safeLocalStorage.setItem('user', JSON.stringify(user))
  }

  clearUser(): void {
    this.safeLocalStorage.removeItem('user')
  }

  // API calls
  async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Login failed')
    }

    // Save tokens and user
    this.setTokens(data.data.tokens)
    this.setUser(data.data.user)

    return data.data
  }

  async register(name: string, email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Registration failed')
    }

    // Save tokens and user
    this.setTokens(data.data.tokens)
    this.setUser(data.data.user)

    return data.data
  }

  async logout(): Promise<void> {
    const tokens = this.getTokens()
    
    try {
      if (tokens) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokens.accessToken}`,
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      this.clearTokens()
      this.clearUser()
    }
  }

  async refreshToken(): Promise<AuthTokens | null> {
    const tokens = this.getTokens()
    if (!tokens) return null

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      })

      const data = await response.json()

      if (data.success) {
        this.setTokens(data.data.tokens)
        this.setUser(data.data.user)
        return data.data.tokens
      }
    } catch (error) {
      console.error('Token refresh error:', error)
    }

    // If refresh fails, clear everything
    this.clearTokens()
    this.clearUser()
    return null
  }

  async getCurrentUser(): Promise<User | null> {
    const tokens = this.getTokens()
    if (!tokens) return null

    try {
      // For simple tokens, use simple-me endpoint
      const endpoint = tokens.accessToken.startsWith('simple_token_') 
        ? '/api/auth/simple-me'
        : '/api/auth/me'

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
        },
      })

      if (response.status === 401) {
        // Token expired, try refresh
        const newTokens = await this.refreshToken()
        if (newTokens) {
          // Retry with new token
          const retryEndpoint = newTokens.accessToken.startsWith('simple_token_') 
            ? '/api/auth/simple-me'
            : '/api/auth/me'
            
          const retryResponse = await fetch(retryEndpoint, {
            headers: {
              'Authorization': `Bearer ${newTokens.accessToken}`,
            },
          })
          
          if (retryResponse.ok) {
            const retryData = await retryResponse.json()
            if (retryData.success) {
              this.setUser(retryData.data.user)
              return retryData.data.user
            }
          }
        }
        return null
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        this.setUser(data.data.user)
        return data.data.user
      }
    } catch (error) {
      console.error('Get user error:', error)
      this.clearTokens()
      this.clearUser()
    }

    return null
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getTokens() !== null
  }

  // Check if tokens are expired (basic check)
  isTokenExpired(): boolean {
    const tokens = this.getTokens()
    if (!tokens) return true

    // Handle simple tokens (these don't expire for now)
    if (tokens.accessToken.startsWith('simple_token_')) {
      return false
    }

    try {
      // JWT token check
      const payload = JSON.parse(atob(tokens.accessToken.split('.')[1]))
      return Date.now() >= payload.exp * 1000
    } catch {
      // If we can't parse it, assume it's expired
      return true
    }
  }
}

export const authClient = AuthClient.getInstance()