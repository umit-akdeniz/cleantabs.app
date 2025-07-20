import { prisma } from '@/lib/prisma'
import type { AuthEventType } from '@prisma/client'

interface AuditEventData {
  userId?: string
  type: AuthEventType
  success: boolean
  email?: string
  ipAddress?: string
  userAgent?: string
  details?: Record<string, any>
}

interface AuditSearchOptions {
  userId?: string
  type?: AuthEventType
  success?: boolean
  ipAddress?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}

interface AuditStats {
  totalEvents: number
  successfulLogins: number
  failedLogins: number
  twoFactorEvents: number
  passwordResets: number
  accountLockouts: number
  uniqueIPs: number
  recentActivity: {
    date: string
    count: number
  }[]
}

export class AuditService {
  // Log authentication events
  static async logAuthEvent(data: AuditEventData): Promise<void> {
    try {
      await prisma.authEvent.create({
        data: {
          userId: data.userId,
          type: data.type,
          success: data.success,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          details: data.details ? JSON.parse(JSON.stringify(data.details)) : null,
        }
      })
    } catch (error) {
      console.error('Failed to log audit event:', error)
      // Don't throw - audit logging should not break the main flow
    }
  }

  // Search audit events
  static async searchEvents(options: AuditSearchOptions = {}): Promise<any[]> {
    const {
      userId,
      type,
      success,
      ipAddress,
      startDate,
      endDate,
      limit = 100,
      offset = 0
    } = options

    const where: any = {}

    if (userId) where.userId = userId
    if (type) where.type = type
    if (success !== undefined) where.success = success
    if (ipAddress) where.ipAddress = ipAddress
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    return await prisma.authEvent.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })
  }

  // Get audit statistics
  static async getAuditStats(userId?: string, days: number = 30): Promise<AuditStats> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const where: any = { createdAt: { gte: startDate } }
    if (userId) where.userId = userId

    const [
      totalEvents,
      successfulLogins,
      failedLogins,
      twoFactorEvents,
      passwordResets,
      accountLockouts,
      uniqueIPs,
      dailyActivity
    ] = await Promise.all([
      // Total events
      prisma.authEvent.count({ where }),
      
      // Successful logins
      prisma.authEvent.count({
        where: { ...where, type: 'LOGIN_SUCCESS' }
      }),
      
      // Failed logins
      prisma.authEvent.count({
        where: { ...where, type: 'LOGIN_FAILED' }
      }),
      
      // 2FA events
      prisma.authEvent.count({
        where: {
          ...where,
          type: { in: ['TWO_FA_SUCCESS', 'TWO_FA_FAILED', 'TWO_FA_ENABLED', 'TWO_FA_DISABLED'] }
        }
      }),
      
      // Password resets
      prisma.authEvent.count({
        where: { ...where, type: 'PASSWORD_RESET' }
      }),
      
      // Account lockouts
      prisma.authEvent.count({
        where: { ...where, type: 'ACCOUNT_LOCKED' }
      }),
      
      // Unique IPs
      prisma.authEvent.findMany({
        where,
        select: { ipAddress: true },
        distinct: ['ipAddress']
      }),
      
      // Daily activity for the last 7 days
      this.getDailyActivity(userId, 7)
    ])

    return {
      totalEvents,
      successfulLogins,
      failedLogins,
      twoFactorEvents,
      passwordResets,
      accountLockouts,
      uniqueIPs: uniqueIPs.filter(ip => ip.ipAddress).length,
      recentActivity: dailyActivity
    }
  }

  // Get daily activity breakdown
  private static async getDailyActivity(userId?: string, days: number = 7): Promise<{ date: string; count: number }[]> {
    const results: { date: string; count: number }[] = []
    
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
      
      const where: any = {
        createdAt: { gte: startOfDay, lt: endOfDay }
      }
      if (userId) where.userId = userId
      
      const count = await prisma.authEvent.count({ where })
      
      results.unshift({
        date: startOfDay.toISOString().split('T')[0],
        count
      })
    }
    
    return results
  }

  // Get user login history
  static async getUserLoginHistory(userId: string, limit: number = 50): Promise<any[]> {
    return await prisma.authEvent.findMany({
      where: {
        userId,
        type: { in: ['LOGIN_SUCCESS', 'LOGIN_FAILED'] }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        type: true,
        success: true,
        ipAddress: true,
        userAgent: true,
        details: true,
        createdAt: true
      }
    })
  }

  // Get suspicious activity
  static async getSuspiciousActivity(days: number = 7): Promise<any[]> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    
    // Find IPs with high failure rates
    const suspiciousIPs = await prisma.$queryRaw`
      SELECT 
        "ipAddress",
        COUNT(*) as total_attempts,
        COUNT(CASE WHEN success = false THEN 1 END) as failed_attempts,
        COUNT(CASE WHEN success = false THEN 1 END)::float / COUNT(*)::float as failure_rate,
        MAX("createdAt") as last_attempt
      FROM "AuthEvent"
      WHERE "createdAt" >= ${startDate}
        AND "ipAddress" IS NOT NULL
        AND type = 'LOGIN_FAILED'
      GROUP BY "ipAddress"
      HAVING COUNT(*) > 10 
        AND COUNT(CASE WHEN success = false THEN 1 END)::float / COUNT(*)::float > 0.5
      ORDER BY failure_rate DESC, total_attempts DESC
      LIMIT 20
    `

    return suspiciousIPs as any[]
  }

  // Get failed login attempts by user
  static async getFailedLoginsByUser(days: number = 7): Promise<any[]> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    
    return await prisma.authEvent.findMany({
      where: {
        type: 'LOGIN_FAILED',
        createdAt: { gte: startDate }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            isLocked: true,
            failedLoginAttempts: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    })
  }

  // Clean up old audit records
  static async cleanupOldRecords(retentionDays: number = 90): Promise<number> {
    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000)
    
    const result = await prisma.authEvent.deleteMany({
      where: {
        createdAt: { lt: cutoffDate }
      }
    })
    
    return result.count
  }

  // Export audit data
  static async exportAuditData(options: AuditSearchOptions & { format?: 'json' | 'csv' }): Promise<string> {
    const events = await this.searchEvents({ ...options, limit: 10000 })
    
    if (options.format === 'csv') {
      const headers = ['Date', 'User Email', 'Event Type', 'Success', 'IP Address', 'User Agent', 'Details']
      const rows = events.map(event => [
        event.createdAt.toISOString(),
        event.user?.email || 'Unknown',
        event.type,
        event.success ? 'Yes' : 'No',
        event.ipAddress || '',
        event.userAgent || '',
        JSON.stringify(event.details || {})
      ])
      
      return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    }
    
    return JSON.stringify(events, null, 2)
  }

  // Real-time security alerts
  static async checkSecurityAlerts(userId?: string): Promise<{
    type: string
    message: string
    severity: 'low' | 'medium' | 'high'
    count: number
  }[]> {
    const alerts: any[] = []
    const lastHour = new Date(Date.now() - 60 * 60 * 1000)
    const where: any = { createdAt: { gte: lastHour } }
    if (userId) where.userId = userId

    // High number of failed logins
    const recentFailures = await prisma.authEvent.count({
      where: { ...where, type: 'LOGIN_FAILED' }
    })

    if (recentFailures > 10) {
      alerts.push({
        type: 'HIGH_FAILURE_RATE',
        message: `${recentFailures} failed login attempts in the last hour`,
        severity: recentFailures > 20 ? 'high' : 'medium',
        count: recentFailures
      })
    }

    // Multiple IPs for same user
    if (userId) {
      const uniqueIPs = await prisma.authEvent.findMany({
        where: {
          userId,
          createdAt: { gte: lastHour },
          type: 'LOGIN_SUCCESS'
        },
        select: { ipAddress: true },
        distinct: ['ipAddress']
      })

      if (uniqueIPs.length > 3) {
        alerts.push({
          type: 'MULTIPLE_IPS',
          message: `Login from ${uniqueIPs.length} different IPs in the last hour`,
          severity: 'medium',
          count: uniqueIPs.length
        })
      }
    }

    return alerts
  }
}