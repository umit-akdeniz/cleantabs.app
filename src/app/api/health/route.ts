import { NextResponse } from 'next/server'
import { DatabaseConnection } from '@/lib/database/connection'

export async function GET() {
  try {
    // Check database connection with health check
    const dbHealth = await DatabaseConnection.healthCheck()
    
    if (dbHealth.status === 'unhealthy') {
      return NextResponse.json(
        { 
          status: 'unhealthy', 
          message: 'Database connection failed',
          database: {
            status: 'unhealthy',
            error: dbHealth.error
          }
        },
        { status: 503 }
      )
    }
    
    // Check environment variables
    const requiredEnvVars = [
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
      'GITHUB_ID',
      'GITHUB_SECRET',
      'DATABASE_URL'
    ]
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Missing environment variables',
          missing: missingVars
        },
        { status: 500 }
      )
    }
    
    // Check auth providers
    const authProviders = {
      google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      github: !!(process.env.GITHUB_ID && process.env.GITHUB_SECRET)
    }
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: 'healthy',
        latency: dbHealth.latency + 'ms'
      },
      auth: {
        nextauth: !!process.env.NEXTAUTH_SECRET,
        providers: authProviders
      },
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
      }
    })
    
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}