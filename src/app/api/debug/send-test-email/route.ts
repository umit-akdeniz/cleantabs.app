import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST() {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const timestamp = new Date().toISOString();

    // Send test email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"CleanTabs Debug" <${process.env.SMTP_USER}>`,
      to: 'umitakdenizjob@gmail.com',
      subject: 'CleanTabs Test Email - System Check',
      text: `This is a test email from CleanTabs system.\n\nTimestamp: ${timestamp}\n\nEmail system is working correctly.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">CleanTabs System Test</h2>
          <p>This is a test email to verify the email system is working correctly.</p>
          <p><strong>Timestamp:</strong> ${timestamp}</p>
          <p style="color: #666; font-size: 14px;">If you received this email, the CleanTabs email system is functioning properly.</p>
        </div>
      `
    });

    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId,
      timestamp 
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json({
      success: false, 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}