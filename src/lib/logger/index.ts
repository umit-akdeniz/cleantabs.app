export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: string
  userId?: string
  requestId?: string
  metadata?: Record<string, any>
}

export class Logger {
  private static instance: Logger
  private level: LogLevel

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(
        process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO
      )
    }
    return Logger.instance
  }

  private log(level: LogLevel, message: string, context?: string, metadata?: Record<string, any>) {
    if (level > this.level) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      metadata
    }

    const levelName = LogLevel[level]
    const emoji = this.getLevelEmoji(level)
    
    console.log(`${emoji} [${levelName}] ${context ? `[${context}]` : ''} ${message}`, 
      metadata ? metadata : '')
  }

  private getLevelEmoji(level: LogLevel): string {
    switch (level) {
      case LogLevel.ERROR: return '❌'
      case LogLevel.WARN: return '⚠️'
      case LogLevel.INFO: return 'ℹ️'
      case LogLevel.DEBUG: return '🔍'
      default: return '📝'
    }
  }

  error(message: string, context?: string, metadata?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, context, metadata)
  }

  warn(message: string, context?: string, metadata?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context, metadata)
  }

  info(message: string, context?: string, metadata?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context, metadata)
  }

  debug(message: string, context?: string, metadata?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context, metadata)
  }

  // Auth-specific logging methods
  authSuccess(message: string, userId?: string, metadata?: Record<string, any>) {
    this.info(`✅ ${message}`, 'AUTH', { userId, ...metadata })
  }

  authFailure(message: string, email?: string, metadata?: Record<string, any>) {
    this.warn(`❌ ${message}`, 'AUTH', { email, ...metadata })
  }

  authError(message: string, error: Error, metadata?: Record<string, any>) {
    this.error(`💥 ${message}`, 'AUTH', { error: error.message, stack: error.stack, ...metadata })
  }

  // Database-specific logging methods
  dbQuery(query: string, duration: number, metadata?: Record<string, any>) {
    this.debug(`📊 Query executed in ${duration}ms`, 'DATABASE', { query, ...metadata })
  }

  dbError(message: string, error: Error, metadata?: Record<string, any>) {
    this.error(`💥 ${message}`, 'DATABASE', { error: error.message, stack: error.stack, ...metadata })
  }

  dbConnection(message: string, metadata?: Record<string, any>) {
    this.info(`🔌 ${message}`, 'DATABASE', metadata)
  }
}

// Global logger instance
export const logger = Logger.getInstance()

// Convenience functions
export const logAuthSuccess = (message: string, userId?: string, metadata?: Record<string, any>) => {
  logger.authSuccess(message, userId, metadata)
}

export const logAuthFailure = (message: string, email?: string, metadata?: Record<string, any>) => {
  logger.authFailure(message, email, metadata)
}

export const logAuthError = (message: string, error: Error, metadata?: Record<string, any>) => {
  logger.authError(message, error, metadata)
}

export const logDbQuery = (query: string, duration: number, metadata?: Record<string, any>) => {
  logger.dbQuery(query, duration, metadata)
}

export const logDbError = (message: string, error: Error, metadata?: Record<string, any>) => {
  logger.dbError(message, error, metadata)
}

export const logDbConnection = (message: string, metadata?: Record<string, any>) => {
  logger.dbConnection(message, metadata)
}