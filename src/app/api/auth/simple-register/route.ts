import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

// Email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'cleantabsapp@gmail.com',
    pass: process.env.SMTP_PASSWORD || '',
  },
})

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code
}

async function sendVerificationEmail(email: string, token: string, code: string, name: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/verify?token=${token}`
  const codeVerificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify-code`
  
  const mailOptions = {
    from: '"CleanTabs" <cleantabsapp@gmail.com>',
    to: email,
    subject: '✅ CleanTabs - Email Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CleanTabs Email Verification</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
        <div style="background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); padding: 40px 30px; text-align: center;">
            <div style="background: rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
              ✅
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">CleanTabs</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Email Verification</p>
          </div>
          
          <div style="padding: 40px 30px;">
            <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">Hello ${name}! 👋</h2>
            <p style="color: #64748b; margin: 0 0 24px 0; font-size: 16px;">Welcome to CleanTabs! To activate your account, you can use one of the following methods:</p>
            
            <!-- Verification Code -->
            <div style="background: #f1f5f9; padding: 24px; border-radius: 12px; margin: 24px 0; text-align: center; border: 2px solid #3b82f6;">
              <h3 style="color: #1e293b; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">🔢 Doğrulama Kodu</h3>
              <div style="background: white; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <span style="font-size: 32px; font-weight: 700; color: #3b82f6; letter-spacing: 4px; font-family: monospace;">${code}</span>
              </div>
              <p style="color: #64748b; margin: 0; font-size: 14px;">Bu kodu <strong>15 dakika</strong> içinde gir</p>
              <a href="${codeVerificationUrl}" style="background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block; margin-top: 12px;">
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
              <a href="${verificationUrl}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                Email Adresini Hemen Doğrula
              </a>
            </div>
            
            <div style="background: #fef3c7; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #f59e0b;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                <strong>⚠️ Important:</strong> These verification links will expire after 24 hours. The verification code must be used within 15 minutes.
              </p>
            </div>
            
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 24px 0;">
              <p style="color: #64748b; margin: 0; font-size: 14px; text-align: center;">
                <strong>Kayıt Tarihi:</strong> ${new Date().toLocaleString('tr-TR')}
              </p>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 12px;">
          <p>© 2024 CleanTabs. This email was sent for verification.</p>
          <p>If you did not create this account, you can ignore this email.</p>
        </div>
      </body>
      </html>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function POST(request: NextRequest) {
  try {
    console.log('Registration attempt started')
    const body = await request.json()
    console.log('Request body received:', { email: body.email, name: body.name })
    
    const { email, name, password } = registerSchema.parse(body)
    console.log('Schema validation passed')

    // Check if user already exists
    console.log('Checking if user exists with email:', email)
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      console.log('User already exists, returning 409')
      return NextResponse.json({
        success: false,
        error: 'Bu email adresi ile zaten bir hesap mevcut'
      }, { status: 409 })
    }

    // Hash password
    console.log('Hashing password')
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Generate verification token and code
    const verificationToken = randomBytes(32).toString('hex')
    const verificationCode = generateVerificationCode()
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    const codeExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Create user
    console.log('Creating user in database')
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        plan: 'FREE',
        verificationToken,
        verificationTokenExpiry: verificationExpiry,
        verificationCode,
        verificationCodeExpiry: codeExpiry
      }
    })
    console.log('User created successfully with ID:', user.id)

    // Send verification email
    console.log('Sending verification email')
    try {
      await sendVerificationEmail(email, verificationToken, verificationCode, name)
      console.log('Verification email sent successfully')
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail registration if email fails, just log it
    }

    // Return success response (don't auto-login, user needs to verify email)
    console.log('Returning success response')
    return NextResponse.json({
      success: true,
      message: 'Account created successfully! Click the verification link sent to your email to activate your account.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: null // Not verified yet
        }
      }
    })

  } catch (error) {
    console.error('Registration error details:', error)
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
      error: 'An error occurred while creating account'
    }, { status: 500 })
  }
}