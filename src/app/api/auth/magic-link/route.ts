import { NextRequest, NextResponse } from 'next/server'
import { MagicLinkService } from '@/lib/auth/magic-link'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, redirectUrl } = body

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Get client IP address
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown'

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const result = await MagicLinkService.sendMagicLink({
      email,
      redirectUrl: redirectUrl || '/dashboard',
      ipAddress,
      userAgent,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Magic link API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}