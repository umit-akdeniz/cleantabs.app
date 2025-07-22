import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

// Email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'cleantabsapp@gmail.com',
    pass: process.env.SMTP_PASSWORD || '',
  },
});

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code
}

async function sendNewVerificationEmail(email: string, token: string, code: string, name: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/verify?token=${token}`;
  const codeVerificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify-code?email=${encodeURIComponent(email)}`;
  
  const mailOptions = {
    from: '"CleanTabs" <cleantabsapp@gmail.com>',
    to: email,
    subject: '🔄 CleanTabs - New Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CleanTabs New Verification Code</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
        <div style="background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 30px; text-align: center;">
            <div style="background: rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
              🔄
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">CleanTabs</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">New Verification Code</p>
          </div>
          
          <div style="padding: 40px 30px;">
            <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">Hello ${name}! 👋</h2>
            <p style="color: #64748b; margin: 0 0 24px 0; font-size: 16px;">You requested a new verification code. Here is your new code:</p>
            
            <!-- Verification Code -->
            <div style="background: #f1f5f9; padding: 24px; border-radius: 12px; margin: 24px 0; text-align: center; border: 2px solid #059669;">
              <h3 style="color: #1e293b; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">🔢 Yeni Doğrulama Kodu</h3>
              <div style="background: white; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <span style="font-size: 32px; font-weight: 700; color: #059669; letter-spacing: 4px; font-family: monospace;">${code}</span>
              </div>
              <p style="color: #64748b; margin: 0; font-size: 14px;">Bu kodu <strong>15 dakika</strong> içinde gir</p>
              <a href="${codeVerificationUrl}" style="background: #059669; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block; margin-top: 12px;">
                Kodu Gir
              </a>
            </div>
            
            <!-- OR Divider -->
            <div style="text-align: center; margin: 24px 0;">
              <div style="border-bottom: 1px solid #e2e8f0; position: relative;">
                <span style="background: white; padding: 0 16px; color: #64748b; font-weight: 500; position: relative; top: 8px;">VEYA</span>
              </div>
            </div>
            
            <!-- One Click Verification -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 24px 0; text-align: center; border: 1px solid #e2e8f0;">
              <h3 style="color: #1e293b; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">🔗 Tek Tıkla Doğrula</h3>
              <a href="${verificationUrl}" style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                Email Adresini Hemen Doğrula
              </a>
            </div>
            
            <div style="background: #fef3c7; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #f59e0b;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                <strong>⚠️ Önemli:</strong> Bu yeni kod önceki kodu geçersiz kılar. Sadece en son gönderilen kod geçerlidir.
              </p>
            </div>
            
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 24px 0;">
              <p style="color: #64748b; margin: 0; font-size: 14px; text-align: center;">
                <strong>Gönderim Tarihi:</strong> ${new Date().toLocaleString('tr-TR')}
              </p>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 12px;">
          <p>© 2024 CleanTabs. This email was sent for your new verification code.</p>
          <p>If you didn't request this, you can ignore this email.</p>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email adresi gerekli'
      }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'No user found with this email address'
      }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: false,
        error: 'Email adresi zaten doğrulanmış'
      }, { status: 400 });
    }

    // Generate new codes
    const verificationToken = randomBytes(32).toString('hex');
    const verificationCode = generateVerificationCode();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const codeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update user with new codes
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpiry: verificationExpiry,
        verificationCode,
        verificationCodeExpiry: codeExpiry
      }
    });

    // Send new verification email
    try {
      await sendNewVerificationEmail(email, verificationToken, verificationCode, user.name || 'Kullanıcı');
      console.log('New verification email sent successfully');
    } catch (emailError) {
      console.error('Failed to send new verification email:', emailError);
      return NextResponse.json({
        success: false,
        error: 'Email gönderilemedi'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'New verification code sent to your email'
    });

  } catch (error) {
    console.error('Resend code error:', error);
    return NextResponse.json({
      success: false,
      error: 'Sunucu hatası'
    }, { status: 500 });
    }
}