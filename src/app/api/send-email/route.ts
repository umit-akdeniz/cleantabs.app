import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { to, subject, html, text } = await request.json();

    // Create transporter - Bu production'da SMTP ayarları ile değiştirilmeli
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // Email address
        pass: process.env.SMTP_PASSWORD, // App password
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"CleanTabs" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}