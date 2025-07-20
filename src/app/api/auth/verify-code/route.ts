import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { code, email } = await request.json();

    if (!code || !email) {
      return NextResponse.json({
        success: false,
        error: 'Kod ve email adresi gerekli'
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
        error: 'Geçersiz veya süresi dolmuş doğrulama kodu'
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
      message: 'Email adresin başarıyla doğrulandı!'
    });

  } catch (error) {
    console.error('Code verification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Sunucu hatası'
    }, { status: 500 });
  }
}