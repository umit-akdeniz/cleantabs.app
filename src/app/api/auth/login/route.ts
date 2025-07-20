import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

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

    // Find user by email using Prisma
    console.log('Searching for user with email:', email)
    const user = await prisma.user.findUnique({
      where: { email }
    })
    console.log('User search result:', user ? 'Found' : 'Not found')
    
    if (!user || !user.password) {
      console.log('User not found or no password, returning 401')
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 })
    }

    // Verify password
    console.log('Verifying password')
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log('Password verification result:', isPasswordValid)
    
    if (!isPasswordValid) {
      console.log('Invalid password, returning 401')
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 })
    }

    // Check if email is verified
    if (!user.emailVerified) {
      console.log('Email not verified, returning 401')
      return NextResponse.json({
        success: false,
        error: 'Please verify your email address before signing in. Check your inbox for the verification link.'
      }, { status: 401 })
    }

    // Simple token generation (bypass JWTManager for now)
    console.log('Generating simple tokens')
    const tokens = {
      accessToken: `simple_token_${user.id}_${Date.now()}`,
      refreshToken: `refresh_token_${user.id}_${Date.now()}`
    }
    console.log('Simple tokens generated successfully')

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