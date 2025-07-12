import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // For JWT-based auth, logout is handled client-side by removing tokens
    // But we can add additional server-side logic here if needed
    
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (token) {
      // Here you could add the token to a blacklist if needed
      // For now, we'll just log the logout event
      console.log('User logged out with token:', token.substring(0, 20) + '...')
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

  } catch (error) {
    console.error('Logout error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}