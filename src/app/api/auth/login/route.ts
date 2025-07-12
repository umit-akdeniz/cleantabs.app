import { NextRequest, NextResponse } from 'next/server'
import { AuthDatabase } from '@/lib/auth/database'
import { JWTManager } from '@/lib/auth/jwt'
import { z } from 'zod'

export const runtime = 'nodejs'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export async function POST(request: NextRequest) {
  try {
    console.log('Login attempt started')
    const body = await request.json()
    console.log('Request body received:', { email: body.email })
    
    const { email, password } = loginSchema.parse(body)
    console.log('Schema validation passed')

    const authDb = AuthDatabase.getInstance()
    console.log('AuthDatabase instance created')
    
    // Find user by email
    console.log('Searching for user with email:', email)
    const user = await authDb.findUserByEmail(email)
    console.log('User search result:', user ? 'Found' : 'Not found')
    
    if (!user) {
      console.log('User not found, returning 401')
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 })
    }

    // Verify password
    console.log('Verifying password')
    const isPasswordValid = await authDb.verifyPassword(password, user.password || '')
    console.log('Password verification result:', isPasswordValid)
    
    if (!isPasswordValid) {
      console.log('Invalid password, returning 401')
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 })
    }

    // Generate JWT tokens
    console.log('Generating JWT tokens')
    const tokens = JWTManager.generateTokens({
      id: user.id,
      email: user.email,
      plan: user.plan
    } as any)
    console.log('JWT tokens generated successfully')

    // Return success response
    console.log('Returning success response')
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          emailVerified: user.emailVerified
        },
        tokens
      }
    })

  } catch (error) {
    console.error('Login error details:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    
    if (error instanceof z.ZodError) {
      console.log('Zod validation error:', error.errors)
      return NextResponse.json({
        success: false,
        error: error.errors[0].message
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}