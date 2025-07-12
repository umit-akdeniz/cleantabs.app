interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  tags?: string[]
}

interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  tags?: string[] // Cache tags for invalidation
  skipIfExists?: boolean // Skip setting if key already exists
}

export class CacheManager {
  private static store = new Map<string, CacheEntry<any>>()
  private static readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  // Cache configuration for different data types
  private static readonly CACHE_CONFIGS = {
    // User data - short cache
    user: { ttl: 2 * 60 * 1000, tags: ['user'] }, // 2 minutes
    
    // Categories - medium cache (changes less frequently)
    categories: { ttl: 10 * 60 * 1000, tags: ['categories', 'user-data'] }, // 10 minutes
    
    // Sites - short cache (frequently updated)
    sites: { ttl: 5 * 60 * 1000, tags: ['sites', 'user-data'] }, // 5 minutes
    
    // Statistics - longer cache
    stats: { ttl: 30 * 60 * 1000, tags: ['stats'] }, // 30 minutes
    
    // System data - very long cache
    system: { ttl: 60 * 60 * 1000, tags: ['system'] }, // 1 hour
  }

  /**
   * Get data from cache
   */
  static get<T>(key: string): T | null {
    const entry = this.store.get(key)
    
    if (!entry) {
      return null
    }

    // Check if expired
    if (this.isExpired(entry)) {
      this.store.delete(key)
      return null
    }

    return entry.data
  }

  /**
   * Set data in cache
   */
  static set<T>(
    key: string, 
    data: T, 
    options: CacheOptions = {}
  ): void {
    const ttl = options.ttl || this.DEFAULT_TTL
    
    // Skip if exists and skipIfExists is true
    if (options.skipIfExists && this.store.has(key)) {
      return
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      tags: options.tags
    }

    this.store.set(key, entry)
    
    // Clean up expired entries periodically
    this.cleanup()
  }

  /**
   * Delete specific key from cache
   */
  static delete(key: string): boolean {
    return this.store.delete(key)
  }

  /**
   * Clear cache by tags
   */
  static clearByTags(tags: string[]): number {
    let cleared = 0
    
    for (const [key, entry] of this.store.entries()) {
      if (entry.tags && tags.some(tag => entry.tags!.includes(tag))) {
        this.store.delete(key)
        cleared++
      }
    }
    
    return cleared
  }

  /**
   * Clear all cache
   */
  static clear(): void {
    this.store.clear()
  }

  /**
   * Get cache statistics
   */
  static getStats(): {
    totalKeys: number
    totalSize: string
    hitRate: number
    expiredKeys: number
  } {
    const totalKeys = this.store.size
    const expiredKeys = Array.from(this.store.values())
      .filter(entry => this.isExpired(entry)).length
    
    // Estimate size (rough calculation)
    const estimatedSize = Array.from(this.store.entries())
      .reduce((size, [key, entry]) => {
        return size + key.length + JSON.stringify(entry.data).length
      }, 0)

    return {
      totalKeys,
      totalSize: this.formatBytes(estimatedSize),
      hitRate: 0, // Would need to track hits/misses for this
      expiredKeys
    }
  }

  /**
   * Cache wrapper for functions
   */
  static async cached<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    // Try to get from cache first
    const cached = this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    // Fetch data
    const data = await fetcher()
    
    // Cache the result
    this.set(key, data, options)
    
    return data
  }

  /**
   * User-specific cache methods
   */
  static getUserCacheKey(userId: string, type: string, ...args: string[]): string {
    return `user:${userId}:${type}:${args.join(':')}`
  }

  static async getUserData<T>(
    userId: string,
    type: keyof typeof CacheManager.CACHE_CONFIGS,
    fetcher: () => Promise<T>,
    ...keyParts: string[]
  ): Promise<T> {
    const key = this.getUserCacheKey(userId, type, ...keyParts)
    const config = this.CACHE_CONFIGS[type]
    
    return this.cached(key, fetcher, {
      ttl: config.ttl,
      tags: [...config.tags, `user:${userId}`]
    })
  }

  /**
   * Invalidate user-specific cache
   */
  static invalidateUser(userId: string): number {
    return this.clearByTags([`user:${userId}`])
  }

  /**
   * Invalidate cache by type
   */
  static invalidateType(type: keyof typeof CacheManager.CACHE_CONFIGS): number {
    const config = this.CACHE_CONFIGS[type]
    return this.clearByTags(config.tags)
  }

  /**
   * Preload commonly accessed data
   */
  static async preload(userId: string, preloadFunctions: {
    categories?: () => Promise<any>
    sites?: () => Promise<any>
    stats?: () => Promise<any>
  }): Promise<void> {
    const promises = []

    if (preloadFunctions.categories) {
      promises.push(
        this.getUserData(userId, 'categories', preloadFunctions.categories)
      )
    }

    if (preloadFunctions.sites) {
      promises.push(
        this.getUserData(userId, 'sites', preloadFunctions.sites)
      )
    }

    if (preloadFunctions.stats) {
      promises.push(
        this.getUserData(userId, 'stats', preloadFunctions.stats)
      )
    }

    await Promise.all(promises)
  }

  /**
   * Check if cache entry is expired
   */
  private static isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl
  }

  /**
   * Clean up expired entries
   */
  private static cleanup(): void {
    // Only run cleanup every 5 minutes to avoid performance impact
    const lastCleanup = (global as any).__cacheLastCleanup || 0
    const now = Date.now()
    
    if (now - lastCleanup < 5 * 60 * 1000) {
      return
    }

    let cleaned = 0
    for (const [key, entry] of this.store.entries()) {
      if (this.isExpired(entry)) {
        this.store.delete(key)
        cleaned++
      }
    }

    ;(global as any).__cacheLastCleanup = now
    
    if (cleaned > 0) {
      console.log(`Cache cleanup: removed ${cleaned} expired entries`)
    }
  }

  /**
   * Format bytes for display
   */
  private static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * Cache middleware for API routes
   */
  static middleware<T>(
    cacheKey: string,
    options: CacheOptions = {}
  ) {
    return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
      const method = descriptor.value

      descriptor.value = async function (...args: any[]) {
        // Try cache first
        const cached = CacheManager.get<T>(cacheKey)
        if (cached !== null) {
          return cached
        }

        // Execute original method
        const result = await method.apply(this, args)
        
        // Cache the result
        CacheManager.set(cacheKey, result, options)
        
        return result
      }

      return descriptor
    }
  }
}

/**
 * Cache decorator for methods
 */
export function Cached(
  keyGenerator: (...args: any[]) => string,
  options: CacheOptions = {}
) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const key = keyGenerator(...args)
      
      return CacheManager.cached(
        key,
        () => method.apply(this, args),
        options
      )
    }

    return descriptor
  }
}

/**
 * Cache invalidation decorator
 */
export function InvalidateCache(tags: string[]) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const result = await method.apply(this, args)
      
      // Invalidate cache after successful operation
      CacheManager.clearByTags(tags)
      
      return result
    }

    return descriptor
  }
}

// Export cache manager instance
export const cache = CacheManager