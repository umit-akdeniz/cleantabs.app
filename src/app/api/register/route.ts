import { NextRequest } from 'next/server'
import { AuthDatabase } from '@/lib/auth/database'
import { AuthErrors, ValidationErrors } from '@/lib/errors/auth-errors'
import { ErrorHandler } from '@/lib/errors/error-handler'
import { validateEmail, validatePassword, validateName } from '@/lib/auth/utils'
import { logAuthSuccess, logAuthFailure, logAuthError } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    logAuthSuccess('Register API called', undefined, { email })

    // Validate input
    if (!name || !email || !password) {
      logAuthFailure('Missing required fields', email)
      throw ValidationErrors.missingFields(['name', 'email', 'password'])
    }

    if (!validateName(name)) {
      logAuthFailure('Invalid name format', email)
      throw ValidationErrors.invalidName()
    }

    if (!validateEmail(email)) {
      logAuthFailure('Invalid email format', email)
      throw ValidationErrors.invalidEmail()
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      logAuthFailure('Invalid password', email, { errors: passwordValidation.errors })
      throw ValidationErrors.invalidPassword()
    }

    // Check if user already exists
    const authDb = AuthDatabase.getInstance()
    const existingUser = await authDb.findUserByEmail(email)
    
    if (existingUser) {
      logAuthFailure('User already exists', email)
      throw AuthErrors.userAlreadyExists()
    }

    // Create user
    const user = await authDb.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      plan: 'FREE'
    })

    logAuthSuccess('User created successfully', user.id, { email: user.email })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    
    return Response.json({
      user: userWithoutPassword,
      message: 'Account created successfully!'
    }, { status: 201 })

  } catch (error) {
    logAuthError('Registration failed', error as Error)
    return ErrorHandler.handle(error, 'REGISTER')
  }
}