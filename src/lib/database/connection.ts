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
    return client
  }

  private static createInstance(): PrismaClient {
    console.log('🔌 Creating new Prisma client instance')

    const client = new PrismaClient({
      log: process.env.NODE_ENV === 'development' 
        ? ['error', 'warn'] 
        : ['error'],
      errorFormat: 'minimal',
      transactionOptions: {
        timeout: 15000, // 15 seconds
        maxWait: 8000,  // 8 seconds
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
    try {
      const client = DatabaseConnection.getInstance()
      await client.$queryRaw`SELECT 1`
      console.log('✅ Database connection successful')
      return true
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      return false
    }
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