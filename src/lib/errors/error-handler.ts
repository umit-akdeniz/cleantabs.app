import { NextResponse } from 'next/server'
import { AuthError, DatabaseError, ValidationError } from './auth-errors'

export interface ErrorResponse {
  error: {
    message: string
    code: string
    statusCode: number
    timestamp: string
    requestId?: string
  }
  details?: any
}

export class ErrorHandler {
  static handle(error: unknown, context: string = 'UNKNOWN'): NextResponse {
    console.error(`💥 Error in ${context}:`, error)
    
    const timestamp = new Date().toISOString()
    const requestId = generateRequestId()
    
    // Handle known error types
    if (error instanceof AuthError) {
      return NextResponse.json({
        error: {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
          timestamp,
          requestId
        }
      }, { status: error.statusCode })
    }
    
    if (error instanceof DatabaseError) {
      return NextResponse.json({
        error: {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
          timestamp,
          requestId
        }
      }, { status: error.statusCode })
    }
    
    if (error instanceof ValidationError) {
      return NextResponse.json({
        error: {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
          timestamp,
          requestId
        },
        details: {
          fields: error.fields
        }
      }, { status: error.statusCode })
    }
    
    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      return handlePrismaError(error as any, timestamp, requestId)
    }
    
    // Handle generic errors
    if (error instanceof Error) {
      return NextResponse.json({
        error: {
          message: process.env.NODE_ENV === 'development' 
            ? error.message 
            : 'An unexpected error occurred',
          code: 'INTERNAL_ERROR',
          statusCode: 500,
          timestamp,
          requestId
        }
      }, { status: 500 })
    }
    
    // Fallback for unknown errors
    return NextResponse.json({
      error: {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        statusCode: 500,
        timestamp,
        requestId
      }
    }, { status: 500 })
  }
  
  static async handleWithRetry<T>(
    operation: () => Promise<T>,
    context: string,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        console.error(`${context} failed (attempt ${attempt}/${maxRetries}):`, error)
        
        if (attempt < maxRetries) {
          // Progressive delay
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        }
      }
    }
    
    throw lastError!
  }
}

function handlePrismaError(error: any, timestamp: string, requestId: string): NextResponse {
  const prismaErrorMap: Record<string, { message: string; status: number }> = {
    'P2002': { message: 'A record with this information already exists', status: 409 },
    'P2003': { message: 'Foreign key constraint failed', status: 400 },
    'P2004': { message: 'Constraint failed', status: 400 },
    'P2025': { message: 'Record not found', status: 404 },
    'P1001': { message: 'Cannot reach database server', status: 503 },
    'P1008': { message: 'Operations timed out', status: 504 },
    'P1017': { message: 'Server has closed the connection', status: 503 },
  }
  
  const errorInfo = prismaErrorMap[error.code] || { 
    message: 'Database error occurred', 
    status: 500 
  }
  
  return NextResponse.json({
    error: {
      message: errorInfo.message,
      code: error.code,
      statusCode: errorInfo.status,
      timestamp,
      requestId
    }
  }, { status: errorInfo.status })
}

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Utility functions for common error scenarios
export const handleDatabaseError = (error: unknown, operation: string) => {
  return ErrorHandler.handle(error, `DATABASE_${operation.toUpperCase()}`)
}

export const handleAuthError = (error: unknown, operation: string) => {
  return ErrorHandler.handle(error, `AUTH_${operation.toUpperCase()}`)
}

export const handleValidationError = (error: unknown, operation: string) => {
  return ErrorHandler.handle(error, `VALIDATION_${operation.toUpperCase()}`)
}