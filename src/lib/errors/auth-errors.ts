export class AuthError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(
    message: string,
    code: string = 'AUTH_ERROR',
    statusCode: number = 400,
    isOperational: boolean = true
  ) {
    super(message)
    this.name = 'AuthError'
    this.code = code
    this.statusCode = statusCode
    this.isOperational = isOperational

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthError)
    }
  }
}

export class DatabaseError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(
    message: string,
    code: string = 'DATABASE_ERROR',
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message)
    this.name = 'DatabaseError'
    this.code = code
    this.statusCode = statusCode
    this.isOperational = isOperational

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError)
    }
  }
}

export class ValidationError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly fields: string[]

  constructor(
    message: string,
    fields: string[] = [],
    code: string = 'VALIDATION_ERROR',
    statusCode: number = 400,
    isOperational: boolean = true
  ) {
    super(message)
    this.name = 'ValidationError'
    this.code = code
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.fields = fields

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError)
    }
  }
}

// Error factory functions
export const AuthErrors = {
  invalidCredentials: () => new AuthError('Invalid email or password', 'INVALID_CREDENTIALS', 401),
  userNotFound: () => new AuthError('User not found', 'USER_NOT_FOUND', 404),
  userAlreadyExists: () => new AuthError('User already exists with this email', 'USER_EXISTS', 409),
  tokenExpired: () => new AuthError('Token has expired', 'TOKEN_EXPIRED', 401),
  tokenInvalid: () => new AuthError('Invalid token', 'TOKEN_INVALID', 401),
  accessDenied: () => new AuthError('Access denied', 'ACCESS_DENIED', 403),
  sessionExpired: () => new AuthError('Session has expired', 'SESSION_EXPIRED', 401),
  premiumRequired: () => new AuthError('Premium subscription required', 'PREMIUM_REQUIRED', 402),
}

export const DatabaseErrors = {
  connectionFailed: () => new DatabaseError('Database connection failed', 'CONNECTION_FAILED', 503),
  queryFailed: (query: string) => new DatabaseError(`Query failed: ${query}`, 'QUERY_FAILED', 500),
  transactionFailed: () => new DatabaseError('Transaction failed', 'TRANSACTION_FAILED', 500),
  uniqueConstraintViolation: (field: string) => new DatabaseError(`Duplicate value for ${field}`, 'UNIQUE_CONSTRAINT', 409),
}

export const ValidationErrors = {
  invalidEmail: () => new ValidationError('Invalid email format', ['email'], 'INVALID_EMAIL'),
  invalidPassword: () => new ValidationError('Password does not meet requirements', ['password'], 'INVALID_PASSWORD'),
  invalidName: () => new ValidationError('Name must be at least 2 characters', ['name'], 'INVALID_NAME'),
  missingFields: (fields: string[]) => new ValidationError('Missing required fields', fields, 'MISSING_FIELDS'),
}