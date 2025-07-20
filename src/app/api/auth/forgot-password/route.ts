import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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
    
    console.log('🔄 Forgot password request for:', email);
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })
    
    if (!user) {
      // Don't reveal if user exists or not for security
      console.log('⚠️ Password reset requested for non-existent email:', email);
      return NextResponse.json({ 
        success: true, 
        message: 'If an account with this email exists, you will receive a password reset link.' 
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpiry: resetTokenExpiry
      }
    })

    console.log('🔑 Reset token generated for user:', user.email);

    // Send reset email
    const emailResult = await sendPasswordResetEmail(email, resetToken)
    
    if (!emailResult.success) {
      console.error('❌ Failed to send password reset email:', emailResult.error)
      
      // In development, log the reset URL for manual testing
      if (process.env.NODE_ENV === 'development') {
        console.log('\n🔧 =================================');
        console.log('🔧 DEVELOPMENT MODE - RESET URL:');
        console.log('🔧 Email:', email);
        console.log('🔧 Token:', resetToken);
        console.log('🔧 Reset URL:', `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`);
        console.log('🔧 =================================\n');
      } else {
        // In production, clean up token if email failed
        await prisma.user.update({
          where: { id: user.id },
          data: {
            resetPasswordToken: null,
            resetPasswordExpiry: null
          }
        })
        
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to send password reset email' 
        }, { status: 500 })
      }
    }

    console.log('✅ Password reset email sent successfully to:', user.email);

    return NextResponse.json({ 
      success: true, 
      message: 'If an account with this email exists, you will receive a password reset link.' 
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