import { NextRequest, NextResponse } from 'next/server'
import { AuthDatabase } from '@/lib/auth/database'
import { sendPasswordResetEmail } from '@/lib/email'
import { z } from 'zod'
import crypto from 'crypto'

export const runtime = 'nodejs'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    const authDb = AuthDatabase.getInstance()
    
    // Check if user exists
    const user = await authDb.findUserByEmail(email)
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ 
        success: true, 
        message: 'If an account with this email exists, you will receive a password reset link.' 
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to database
    await authDb.createPasswordResetToken(user.id, resetToken, resetTokenExpiry)

    // Send reset email
    const emailResult = await sendPasswordResetEmail(email, resetToken)
    
    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to send password reset email' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Password reset email sent successfully' 
    })

  } catch (error) {
    console.error('Password reset error:', error)
    
    if (error instanceof z.ZodError) {
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