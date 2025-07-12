import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

export interface APIError {
  success: false
  error: string
  code?: string
  details?: any
  timestamp: string
  requestId?: string
}

export interface APISuccess<T = any> {
  success: true
  data: T
  timestamp: string
  requestId?: string
}

export type APIResponse<T = any> = APIError | APISuccess<T>

export enum ErrorCodes {
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Database errors
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  DUPLICATE_RESOURCE = 'DUPLICATE_RESOURCE',
  DATABASE_ERROR = 'DATABASE_ERROR',
  FOREIGN_KEY_CONSTRAINT = 'FOREIGN_KEY_CONSTRAINT',
  
  // Business logic errors
  PLAN_LIMIT_EXCEEDED = 'PLAN_LIMIT_EXCEEDED',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
  RESOURCE_LIMIT_EXCEEDED = 'RESOURCE_LIMIT_EXCEEDED',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // System errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR'
}

export class APIErrorHandler {
  private static generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15)
  }

  /**
   * Create standardized success response
   */
  static success<T>(data: T, status: number = 200, requestId?: string): NextResponse {
    const response: APISuccess<T> = {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      requestId: requestId || this.generateRequestId()
    }

    return NextResponse.json(response, { status })
  }

  /**
   * Create standardized error response
   */
  static error(
    error: string,
    status: number = 500,
    code?: ErrorCodes,
    details?: any,
    requestId?: string
  ): NextResponse {
    const response: APIError = {
      success: false,
      error,
      code,
      details,
      timestamp: new Date().toISOString(),
      requestId: requestId || this.generateRequestId()
    }

    // Log error for monitoring
    this.logError(response, status)

    return NextResponse.json(response, { status })
  }

  /**
   * Handle different types of errors automatically
   */
  static handleError(error: unknown, requestId?: string): NextResponse {
    const reqId = requestId || this.generateRequestId()

    // Zod validation errors
    if (error instanceof ZodError) {
      const details = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }))

      return this.error(
        'Validation failed',
        400,
        ErrorCodes.VALIDATION_ERROR,
        details,
        reqId
      )
    }

    // Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaError(error, reqId)
    }

    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return this.error(
        'Database request failed',
        500,
        ErrorCodes.DATABASE_ERROR,
        undefined,
        reqId
      )
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return this.error(
        'Database validation error',
        400,
        ErrorCodes.VALIDATION_ERROR,
        undefined,
        reqId
      )
    }

    // Custom application errors
    if (error instanceof AppError) {
      return this.error(
        error.message,
        error.statusCode,
        error.code,
        error.details,
        reqId
      )
    }

    // Generic JavaScript errors
    if (error instanceof Error) {
      console.error('Unhandled error:', error)
      return this.error(
        process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'Internal server error',
        500,
        ErrorCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === 'development' ? error.stack : undefined,
        reqId
      )
    }

    // Unknown error type
    console.error('Unknown error type:', error)
    return this.error(
      'Unknown error occurred',
      500,
      ErrorCodes.INTERNAL_SERVER_ERROR,
      undefined,
      reqId
    )
  }

  /**
   * Handle Prisma-specific errors
   */
  private static handlePrismaError(
    error: Prisma.PrismaClientKnownRequestError,
    requestId: string
  ): NextResponse {
    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        const target = error.meta?.target as string[] | undefined
        return this.error(
          `Resource already exists${target ? `: ${target.join(', ')}` : ''}`,
          409,
          ErrorCodes.DUPLICATE_RESOURCE,
          { constraint: target },
          requestId
        )

      case 'P2025':
        // Record not found
        return this.error(
          'Resource not found',
          404,
          ErrorCodes.RESOURCE_NOT_FOUND,
          undefined,
          requestId
        )

      case 'P2003':
        // Foreign key constraint violation
        return this.error(
          'Cannot delete resource: it is referenced by other data',
          400,
          ErrorCodes.FOREIGN_KEY_CONSTRAINT,
          undefined,
          requestId
        )

      case 'P2004':
        // Constraint violation
        return this.error(
          'Operation violates data constraints',
          400,
          ErrorCodes.VALIDATION_ERROR,
          undefined,
          requestId
        )

      default:
        return this.error(
          'Database operation failed',
          500,
          ErrorCodes.DATABASE_ERROR,
          { prismaCode: error.code },
          requestId
        )
    }
  }

  /**
   * Log errors for monitoring
   */
  private static logError(error: APIError, status: number): void {
    const logLevel = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
    
    const logData = {
      ...error,
      status,
      environment: process.env.NODE_ENV,
      timestamp: error.timestamp
    }

    console[logLevel](`[API Error ${status}]`, logData)

    // In production, you might want to send this to an external monitoring service
    if (process.env.NODE_ENV === 'production' && status >= 500) {
      // Send to monitoring service (Sentry, DataDog, etc.)
      // Example: Sentry.captureException(error)
    }
  }

  /**
   * Commonly used error responses
   */
  static unauthorized(message = 'Unauthorized access', requestId?: string): NextResponse {
    return this.error(message, 401, ErrorCodes.UNAUTHORIZED, undefined, requestId)
  }

  static forbidden(message = 'Access forbidden', requestId?: string): NextResponse {
    return this.error(message, 403, ErrorCodes.FORBIDDEN, undefined, requestId)
  }

  static notFound(resource = 'Resource', requestId?: string): NextResponse {
    return this.error(
      `${resource} not found`,
      404,
      ErrorCodes.RESOURCE_NOT_FOUND,
      undefined,
      requestId
    )
  }

  static badRequest(message = 'Bad request', requestId?: string): NextResponse {
    return this.error(message, 400, ErrorCodes.INVALID_INPUT, undefined, requestId)
  }

  static planLimitExceeded(message = 'Plan limit exceeded', requestId?: string): NextResponse {
    return this.error(message, 402, ErrorCodes.PLAN_LIMIT_EXCEEDED, undefined, requestId)
  }

  static rateLimitExceeded(retryAfter?: number, requestId?: string): NextResponse {
    const response = this.error(
      'Rate limit exceeded',
      429,
      ErrorCodes.RATE_LIMIT_EXCEEDED,
      { retryAfter },
      requestId
    )

    if (retryAfter) {
      response.headers.set('Retry-After', retryAfter.toString())
    }

    return response
  }

  static internalError(message = 'Internal server error', requestId?: string): NextResponse {
    return this.error(message, 500, ErrorCodes.INTERNAL_SERVER_ERROR, undefined, requestId)
  }
}

/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: ErrorCodes,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }

  static unauthorized(message = 'Unauthorized access'): AppError {
    return new AppError(message, 401, ErrorCodes.UNAUTHORIZED)
  }

  static forbidden(message = 'Access forbidden'): AppError {
    return new AppError(message, 403, ErrorCodes.FORBIDDEN)
  }

  static notFound(resource = 'Resource'): AppError {
    return new AppError(`${resource} not found`, 404, ErrorCodes.RESOURCE_NOT_FOUND)
  }

  static badRequest(message = 'Bad request'): AppError {
    return new AppError(message, 400, ErrorCodes.INVALID_INPUT)
  }

  static planLimitExceeded(message = 'Plan limit exceeded'): AppError {
    return new AppError(message, 402, ErrorCodes.PLAN_LIMIT_EXCEEDED)
  }

  static internal(message = 'Internal server error'): AppError {
    return new AppError(message, 500, ErrorCodes.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Async error wrapper for API routes
 */
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      return APIErrorHandler.handleError(error)
    }
  }
}