import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Try Authorization header first
    const authHeader = request.headers.get('authorization');
    let token = authHeader?.replace('Bearer ', '');
    
    // Fallback to cookie
    if (!token) {
      token = request.cookies.get('auth-token')?.value;
    }

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'No token found'
      }, { status: 401 });
    }

    let userId: string;

    // Handle simple tokens (format: simple_token_{userId}_{timestamp})
    if (token.startsWith('simple_token_')) {
      const tokenParts = token.split('_');
      if (tokenParts.length < 3) {
        return NextResponse.json({
          success: false,
          error: 'Invalid token format'
        }, { status: 401 });
      }
      userId = tokenParts[2];
    } else {
      // Handle JWT tokens (legacy support)
      try {
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
        userId = decoded.userId;
      } catch (jwtError) {
        return NextResponse.json({
          success: false,
          error: 'Invalid JWT token'
        }, { status: 401 });
      }
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          emailVerified: user.emailVerified
        }
      }
    });

  } catch (error) {
    console.error('❌ Simple auth check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Invalid token'
    }, { status: 401 });
  }
}