import { NextRequest, NextResponse } from 'next/server'
import { AuthDatabase } from '@/lib/auth/database'
import { z } from 'zod'

export const runtime = 'nodejs'

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = resetPasswordSchema.parse(body)

    const authDb = AuthDatabase.getInstance()
    
    // Find user by reset token
    const user = await authDb.findUserByResetToken(token)
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid or expired reset token' 
      }, { status: 400 })
    }

    // Check if token is expired
    if (user.resetPasswordExpiry && user.resetPasswordExpiry < new Date()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Reset token has expired' 
      }, { status: 400 })
    }

    // Update password and clear reset token
    await authDb.updatePasswordAndClearResetToken(user.id, password)

    return NextResponse.json({ 
      success: true, 
      message: 'Password updated successfully' 
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