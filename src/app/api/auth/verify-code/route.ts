import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { code, email } = await request.json();

    if (!code || !email) {
      return NextResponse.json({
        success: false,
        error: 'Code and email address required'
      }, { status: 400 });
    }

    // Find user with this email and verification code
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        verificationCode: code,
        verificationCodeExpiry: {
          gt: new Date() // Code should not be expired
        }
      }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired verification code'
      }, { status: 400 });
    }

    // Update user as verified and remove verification code
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationCode: null,
        verificationCodeExpiry: null,
        verificationToken: null,
        verificationTokenExpiry: null
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Your email has been successfully verified!'
    });

  } catch (error) {
    console.error('Code verification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 });
  }
}