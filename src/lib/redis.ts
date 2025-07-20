import { Redis } from 'ioredis'

let redis: Redis | null = null

function createRedisInstance(): Redis {
  const redisUrl = process.env.REDIS_URL
  
  if (!redisUrl) {
    console.warn('REDIS_URL not configured, Redis features will be disabled')
    throw new Error('Redis URL not configured')
  }

  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    lazyConnect: true,
  })

  client.on('error', (error) => {
    console.error('Redis connection error:', error)
  })

  client.on('connect', () => {
    console.log('Connected to Redis')
  })

  return client
}

export function getRedisClient(): Redis {
  if (!redis) {
    redis = createRedisInstance()
  }
  return redis
}

// Session management with Redis
export class RedisSessionService {
  private static prefix = 'session:'
  private static defaultTTL = 30 * 24 * 60 * 60 // 30 days in seconds

  static async setSession(sessionId: string, data: any, ttl: number = this.defaultTTL): Promise<void> {
    try {
      const client = getRedisClient()
      const key = `${this.prefix}${sessionId}`
      await client.setex(key, ttl, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to set session in Redis:', error)
      throw error
    }
  }

  static async getSession(sessionId: string): Promise<any | null> {
    try {
      const client = getRedisClient()
      const key = `${this.prefix}${sessionId}`
      const data = await client.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to get session from Redis:', error)
      return null
    }
  }

  static async deleteSession(sessionId: string): Promise<void> {
    try {
      const client = getRedisClient()
      const key = `${this.prefix}${sessionId}`
      await client.del(key)
    } catch (error) {
      console.error('Failed to delete session from Redis:', error)
      throw error
    }
  }

  static async extendSession(sessionId: string, ttl: number = this.defaultTTL): Promise<void> {
    try {
      const client = getRedisClient()
      const key = `${this.prefix}${sessionId}`
      await client.expire(key, ttl)
    } catch (error) {
      console.error('Failed to extend session in Redis:', error)
      throw error
    }
  }

  static async getUserSessions(userId: string): Promise<string[]> {
    try {
      const client = getRedisClient()
      const pattern = `${this.prefix}*`
      const keys = await client.keys(pattern)
      
      const userSessions: string[] = []
      
      for (const key of keys) {
        const data = await client.get(key)
        if (data) {
          const session = JSON.parse(data)
          if (session.userId === userId) {
            userSessions.push(key.replace(this.prefix, ''))
          }
        }
      }
      
      return userSessions
    } catch (error) {
      console.error('Failed to get user sessions from Redis:', error)
      return []
    }
  }

  static async revokeUserSessions(userId: string, keepCurrentSession?: string): Promise<void> {
    try {
      const sessions = await this.getUserSessions(userId)
      const client = getRedisClient()
      
      for (const sessionId of sessions) {
        if (keepCurrentSession && sessionId === keepCurrentSession) {
          continue
        }
        await client.del(`${this.prefix}${sessionId}`)
      }
    } catch (error) {
      console.error('Failed to revoke user sessions:', error)
      throw error
    }
  }
}

// Rate limiting with Redis
export class RedisRateLimitService {
  private static prefix = 'rate_limit:'

  static async checkRateLimit(
    key: string,
    windowMs: number,
    maxRequests: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    try {
      const client = getRedisClient()
      const redisKey = `${this.prefix}${key}`
      const window = Math.floor(Date.now() / windowMs)
      const redisWindowKey = `${redisKey}:${window}`

      const current = await client.incr(redisWindowKey)
      
      if (current === 1) {
        await client.expire(redisWindowKey, Math.ceil(windowMs / 1000))
      }

      const allowed = current <= maxRequests
      const remaining = Math.max(0, maxRequests - current)
      const resetTime = (window + 1) * windowMs

      return { allowed, remaining, resetTime }
    } catch (error) {
      console.error('Redis rate limiting error:', error)
      // Fail open - allow the request if Redis is down
      return { allowed: true, remaining: maxRequests, resetTime: Date.now() + windowMs }
    }
  }

  static async resetRateLimit(key: string): Promise<void> {
    try {
      const client = getRedisClient()
      const pattern = `${this.prefix}${key}:*`
      const keys = await client.keys(pattern)
      
      if (keys.length > 0) {
        await client.del(...keys)
      }
    } catch (error) {
      console.error('Failed to reset rate limit:', error)
      throw error
    }
  }
}

// Cache service with Redis
export class RedisCacheService {
  private static prefix = 'cache:'

  static async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      const client = getRedisClient()
      const redisKey = `${this.prefix}${key}`
      await client.setex(redisKey, ttl, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to set cache in Redis:', error)
      throw error
    }
  }

  static async get<T = any>(key: string): Promise<T | null> {
    try {
      const client = getRedisClient()
      const redisKey = `${this.prefix}${key}`
      const data = await client.get(redisKey)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to get cache from Redis:', error)
      return null
    }
  }

  static async del(key: string): Promise<void> {
    try {
      const client = getRedisClient()
      const redisKey = `${this.prefix}${key}`
      await client.del(redisKey)
    } catch (error) {
      console.error('Failed to delete cache from Redis:', error)
      throw error
    }
  }

  static async flush(): Promise<void> {
    try {
      const client = getRedisClient()
      const pattern = `${this.prefix}*`
      const keys = await client.keys(pattern)
      
      if (keys.length > 0) {
        await client.del(...keys)
      }
    } catch (error) {
      console.error('Failed to flush cache:', error)
      throw error
    }
  }
}

// Pub/Sub for real-time features
export class RedisPubSubService {
  private static publisher: Redis | null = null
  private static subscriber: Redis | null = null

  static getPublisher(): Redis {
    if (!this.publisher) {
      this.publisher = createRedisInstance()
    }
    return this.publisher
  }

  static getSubscriber(): Redis {
    if (!this.subscriber) {
      this.subscriber = createRedisInstance()
    }
    return this.subscriber
  }

  static async publish(channel: string, message: any): Promise<void> {
    try {
      const publisher = this.getPublisher()
      await publisher.publish(channel, JSON.stringify(message))
    } catch (error) {
      console.error('Failed to publish message:', error)
      throw error
    }
  }

  static async subscribe(channel: string, callback: (message: any) => void): Promise<void> {
    try {
      const subscriber = this.getSubscriber()
      
      subscriber.on('message', (receivedChannel, message) => {
        if (receivedChannel === channel) {
          try {
            const parsedMessage = JSON.parse(message)
            callback(parsedMessage)
          } catch (error) {
            console.error('Failed to parse pub/sub message:', error)
          }
        }
      })

      await subscriber.subscribe(channel)
    } catch (error) {
      console.error('Failed to subscribe to channel:', error)
      throw error
    }
  }

  static async unsubscribe(channel: string): Promise<void> {
    try {
      const subscriber = this.getSubscriber()
      await subscriber.unsubscribe(channel)
    } catch (error) {
      console.error('Failed to unsubscribe from channel:', error)
      throw error
    }
  }
}

// Graceful shutdown
export async function closeRedisConnections(): Promise<void> {
  try {
    if (redis) {
      await redis.quit()
      redis = null
    }
    
    if (RedisPubSubService['publisher']) {
      await RedisPubSubService['publisher'].quit()
      RedisPubSubService['publisher'] = null
    }
    
    if (RedisPubSubService['subscriber']) {
      await RedisPubSubService['subscriber'].quit()
      RedisPubSubService['subscriber'] = null
    }
  } catch (error) {
    console.error('Error closing Redis connections:', error)
  }
}