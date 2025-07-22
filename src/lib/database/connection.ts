import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

export class DatabaseConnection {
  private static instance: PrismaClient
  private static isInitialized = false

  static getInstance(): PrismaClient {
    // Use singleton in development for better performance
    if (process.env.NODE_ENV !== 'production') {
      if (!DatabaseConnection.instance) {
        DatabaseConnection.instance = DatabaseConnection.createInstance()
      }
      return DatabaseConnection.instance
    }
    
    // In production (serverless), use global connection with cleanup
    if (global.__prisma) {
      return global.__prisma
    }
    
    const client = DatabaseConnection.createInstance()
    global.__prisma = client
    
    // Warm up the connection in serverless
    DatabaseConnection.warmConnection()
    
    return client
  }

  static warmConnection(): void {
    if (process.env.NODE_ENV === 'production') {
      // Non-blocking connection warmup
      setImmediate(async () => {
        try {
          const client = global.__prisma || DatabaseConnection.getInstance()
          await client.$queryRaw`SELECT 1`
          console.log('🔥 Connection warmed up')
        } catch (error) {
          console.warn('⚠️ Connection warmup failed:', error)
        }
      })
    }
  }

  private static createInstance(): PrismaClient {
    console.log('🔌 Creating new Prisma client instance')

    const client = new PrismaClient({
      log: process.env.NODE_ENV === 'development' 
        ? ['error', 'warn'] 
        : ['error'],
      errorFormat: 'minimal',
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      },
      transactionOptions: {
        timeout: 30000, // 30 seconds
        maxWait: 15000,  // 15 seconds
      },
    })

    // Connection event handlers removed for TypeScript compatibility

    // Always set global in production to prevent multiple instances
    if (process.env.NODE_ENV === 'production') {
      global.__prisma = client
    }

    // Graceful shutdown - only in development
    if (process.env.NODE_ENV !== 'production') {
      process.on('beforeExit', async () => {
        console.log('🔌 Disconnecting from database...')
        await client.$disconnect()
      })

      process.on('SIGINT', async () => {
        console.log('🔌 Disconnecting from database...')
        await client.$disconnect()
        process.exit(0)
      })

      process.on('SIGTERM', async () => {
        console.log('🔌 Disconnecting from database...')
        await client.$disconnect()
        process.exit(0)
      })
    }

    return client
  }

  static async testConnection(): Promise<boolean> {
    let retries = 3
    while (retries > 0) {
      try {
        const client = DatabaseConnection.getInstance()
        await client.$queryRaw`SELECT 1`
        console.log('✅ Database connection successful')
        return true
      } catch (error) {
        retries--
        console.error(`❌ Database connection failed (${3-retries}/3):`, error)
        
        if (retries > 0) {
          console.log('🔄 Retrying in 2 seconds...')
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
    }
    return false
  }

  static async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy'
    latency?: number
    error?: string
  }> {
    try {
      const client = DatabaseConnection.getInstance()
      const start = Date.now()
      await client.$queryRaw`SELECT 1`
      const latency = Date.now() - start
      
      return {
        status: 'healthy',
        latency
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Always use singleton instance
export const prisma = DatabaseConnection.getInstance()