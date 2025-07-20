import nodemailer from 'nodemailer';

// Email transporter configuration
const createTransporter = () => {
  // Force real email sending if FORCE_EMAIL is set
  const forceRealEmail = process.env.FORCE_EMAIL === 'true';

  // Use real SMTP if configured and not in development mode (or forced)
  if ((forceRealEmail || process.env.NODE_ENV !== 'development') && 
      process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // Fallback: Use stream transport for any missing config
  console.warn('⚠️ Email not configured, using development mode');
  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true
  });
};

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Send email function with development fallback
export const sendEmail = async ({ to, subject, html, text }: EmailTemplate) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_FROM || 'CleanTabs <noreply@cleantabs.app>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    };

    const result = await transporter.sendMail(mailOptions);
    
    // In development mode (unless forced), log email content instead of sending
    if (process.env.NODE_ENV === 'development' && process.env.FORCE_EMAIL !== 'true') {
      console.log('\n📧 =================================');
      console.log('📧 EMAIL WOULD BE SENT:');
      console.log('📧 To:', to);
      console.log('📧 Subject:', subject);
      console.log('📧 =================================\n');
      return { success: true, messageId: 'dev-mode' };
    }

    console.log('✅ Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error);
    
    // In development, still return success to avoid blocking functionality
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Development mode: Treating email as sent successfully');
      return { success: true, messageId: 'dev-mode-fallback' };
    }
    
    return { success: false, error };
  }
};

// Email verification template
export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">CleanTabs</h1>
        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Verify Your Email Address</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-top: 0;">Welcome to CleanTabs!</h2>
        <p>Thanks for signing up! Please verify your email address to complete your registration.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 25px; 
                    font-weight: bold;
                    display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
        </p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          This verification link will expire in 24 hours. If you didn't create an account with CleanTabs, please ignore this email.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>© 2024 CleanTabs. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Verify Your Email Address - CleanTabs',
    html,
  });
};

// Bookmark export email template
export const sendBookmarkExport = async (email: string, bookmarksHtml: string, count: number) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your CleanTabs Export</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">CleanTabs Export</h1>
        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your Bookmarks Export is Ready</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-top: 0;">Export Complete!</h2>
        <p>Your CleanTabs export containing <strong>${count} bookmarks</strong> is attached to this email.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Export Details:</h3>
          <ul style="color: #666;">
            <li>Total bookmarks: ${count}</li>
            <li>Export format: HTML (compatible with all browsers)</li>
            <li>Generated: ${new Date().toLocaleDateString()}</li>
          </ul>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          You can import this file into any browser or bookmark manager. The HTML file maintains your category structure and all bookmark details.
        </p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Thank you for using CleanTabs! If you have any questions, feel free to contact our support team.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>© 2024 CleanTabs. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Your CleanTabs Export (${count} bookmarks) - CleanTabs`,
    html,
  });
};

// Password reset email template
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - CleanTabs</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .email-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #334155;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }
        
        .main-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
          padding: 48px 40px;
          text-align: center;
          position: relative;
        }
        
        .header-icon {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          padding: 16px;
          border-radius: 20px;
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .header-title {
          color: white;
          margin: 0;
          font-size: 32px;
          font-weight: 700;
        }
        
        .header-subtitle {
          color: rgba(255, 255, 255, 0.9);
          margin: 12px 0 0 0;
          font-size: 18px;
          font-weight: 500;
        }
        
        .content {
          padding: 48px 40px;
        }
        
        .greeting {
          color: #1e293b;
          margin: 0 0 24px 0;
          font-size: 20px;
          font-weight: 600;
        }
        
        .description {
          color: #64748b;
          margin: 0 0 32px 0;
          font-size: 16px;
          line-height: 1.7;
        }
        
        .user-email {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          padding: 24px;
          border-radius: 16px;
          margin: 32px 0;
          border-left: 5px solid #dc2626;
          text-align: center;
        }
        
        .user-email-label {
          color: #475569;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
        }
        
        .user-email-value {
          color: #1e293b;
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }
        
        .cta-container {
          text-align: center;
          margin: 40px 0;
        }
        
        .cta-button {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
          color: white;
          padding: 18px 40px;
          text-decoration: none;
          border-radius: 16px;
          font-weight: 600;
          font-size: 18px;
          display: inline-block;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .url-container {
          background: #f8fafc;
          padding: 20px;
          border-radius: 12px;
          margin: 32px 0;
          border: 1px solid #e2e8f0;
        }
        
        .url-text {
          color: #64748b;
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .url-link {
          color: #dc2626;
          text-decoration: none;
          font-weight: 500;
          word-break: break-all;
        }
        
        .security-note {
          background: #fef2f2;
          padding: 20px;
          border-radius: 12px;
          margin: 32px 0;
          border-left: 4px solid #dc2626;
        }
        
        .security-note-title {
          color: #991b1b;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
        }
        
        .security-note-text {
          color: #dc2626;
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .expiry-info {
          background: #fef3c7;
          padding: 16px;
          border-radius: 8px;
          margin: 24px 0;
          text-align: center;
        }
        
        .expiry-text {
          color: #92400e;
          margin: 0;
          font-size: 14px;
          font-weight: 500;
        }
        
        .footer {
          text-align: center;
          margin-top: 32px;
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="main-card">
          <div class="header">
            <div class="header-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h1 class="header-title">🔐 Password Reset</h1>
            <p class="header-subtitle">Reset your CleanTabs password securely</p>
          </div>
          
          <div class="content">
            <h2 class="greeting">Hello!</h2>
            <p class="description">
              We received a request to reset the password for your CleanTabs account. 
              If you made this request, click the button below to create a new password.
            </p>
            
            <div class="user-email">
              <div class="user-email-label">Password reset requested for:</div>
              <p class="user-email-value">${email}</p>
            </div>
            
            <div class="cta-container">
              <a href="${resetUrl}" class="cta-button">
                🔑 Reset My Password
              </a>
            </div>
            
            <div class="expiry-info">
              <p class="expiry-text">⏰ This link expires in 1 hour for security</p>
            </div>
            
            <div class="url-container">
              <p class="url-text">
                <strong>🔗 Alternatively, copy and paste this link:</strong><br>
                <a href="${resetUrl}" class="url-link">${resetUrl}</a>
              </p>
            </div>
            
            <div class="security-note">
              <div class="security-note-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#991b1b" stroke-width="2" style="margin-right: 8px;">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                🛡️ Security Notice
              </div>
              <p class="security-note-text">
                If you didn't request this password reset, please ignore this email. 
                Your account remains secure and no changes will be made.
              </p>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>📱 <strong>CleanTabs</strong> - Your Smart Bookmark Manager</p>
          <p style="margin-top: 16px; font-size: 12px;">
            © 2024 CleanTabs. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '🔐 Reset Your CleanTabs Password',
    html,
  });
};

// Modern site reminder notification with beautiful design
export const sendSiteReminder = async (email: string, siteName: string, siteUrl: string, reminderNote?: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Site Reminder - CleanTabs</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .email-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #334155;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }
        
        .main-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          position: relative;
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 48px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="4"/></g></svg>') repeat;
          animation: float 20s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .header-icon {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          padding: 16px;
          border-radius: 20px;
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }
        
        .header-title {
          color: white;
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }
        
        .header-subtitle {
          color: rgba(255, 255, 255, 0.9);
          margin: 12px 0 0 0;
          font-size: 18px;
          font-weight: 500;
          position: relative;
          z-index: 1;
        }
        
        .content {
          padding: 48px 40px;
        }
        
        .site-name {
          color: #1e293b;
          margin: 0 0 20px 0;
          font-size: 28px;
          font-weight: 700;
          text-align: center;
        }
        
        .site-description {
          color: #64748b;
          margin: 0 0 32px 0;
          font-size: 18px;
          text-align: center;
          line-height: 1.7;
        }
        
        .note-container {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          padding: 24px;
          border-radius: 16px;
          margin: 32px 0;
          border-left: 5px solid #667eea;
          position: relative;
          overflow: hidden;
        }
        
        .note-container::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border-radius: 50%;
          transform: translate(30px, -30px);
        }
        
        .note-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
        }
        
        .note-title {
          color: #1e293b;
          font-size: 16px;
          font-weight: 600;
          margin-left: 8px;
        }
        
        .note-text {
          color: #475569;
          margin: 0;
          font-size: 16px;
          line-height: 1.6;
          position: relative;
          z-index: 1;
        }
        
        .cta-container {
          text-align: center;
          margin: 40px 0;
        }
        
        .cta-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 18px 40px;
          text-decoration: none;
          border-radius: 16px;
          font-weight: 600;
          font-size: 18px;
          display: inline-block;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        
        .cta-button:hover::before {
          left: 100%;
        }
        
        .url-container {
          background: #f8fafc;
          padding: 20px;
          border-radius: 12px;
          margin: 32px 0;
          text-align: center;
          border: 1px solid #e2e8f0;
        }
        
        .url-text {
          color: #64748b;
          margin: 0;
          font-size: 14px;
        }
        
        .url-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
        }
        
        .footer {
          text-align: center;
          margin-top: 32px;
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .footer-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
        }
        
        .sparkle {
          display: inline-block;
          margin: 0 4px;
          animation: sparkle 2s ease-in-out infinite;
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="main-card">
          <div class="header">
            <div class="header-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6"/>
                <path d="m21 12-6 0m-6 0-6 0"/>
              </svg>
            </div>
            <h1 class="header-title">🔔 Reminder Alert!</h1>
            <p class="header-subtitle">Time to visit your saved site</p>
          </div>
          
          <div class="content">
            <h2 class="site-name">📌 ${siteName}</h2>
            <p class="site-description">
              Your scheduled reminder is here! <span class="sparkle">✨</span> 
              Ready to dive back into this amazing site?
            </p>
            
            ${reminderNote ? `
              <div class="note-container">
                <div class="note-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span class="note-title">📝 Your Personal Note</span>
                </div>
                <p class="note-text">"${reminderNote}"</p>
              </div>
            ` : ''}
            
            <div class="cta-container">
              <a href="${siteUrl}" class="cta-button">
                🚀 Visit ${siteName} Now
              </a>
            </div>
            
            <div class="url-container">
              <p class="url-text">
                <strong>🔗 Direct Link:</strong> 
                <a href="${siteUrl}" class="url-link">${siteUrl}</a>
              </p>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>📱 <strong>CleanTabs</strong> - Your Smart Bookmark Manager</p>
          <p>
            Manage your reminders in your 
            <a href="${process.env.NEXTAUTH_URL}/dashboard" class="footer-link">dashboard</a>
          </p>
          <p style="margin-top: 16px; font-size: 12px;">
            © 2024 CleanTabs. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `🔔 Reminder: Time to check ${siteName}! ⏰`,
    html,
  });
};

// Modern activity reminder notification
export const sendActivityReminder = async (email: string, activityType: string, title: string, description?: string, actionUrl?: string) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'bookmark':
        return '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
      case 'review':
        return '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h4l3 3V8l-3 3z"/><path d="M22 11v3a2 2 0 0 1-2 2"/></svg>';
      case 'follow-up':
        return '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
      default:
        return '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6"/><path d="m21 12-6 0m-6 0-6 0"/></svg>';
    }
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Activity Reminder - CleanTabs</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
      <div style="background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); padding: 40px 30px; text-align: center;">
          <div style="background: rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
            ${getActivityIcon(activityType)}
          </div>
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Activity Reminder</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Don't forget about this activity</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">${title}</h2>
          
          ${description ? `
            <p style="color: #64748b; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">${description}</p>
          ` : ''}
          
          <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #8b5cf6;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" style="margin-right: 8px;">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              <strong style="color: #1e293b; font-size: 14px;">Activity Type:</strong>
            </div>
            <p style="color: #475569; margin: 0; font-size: 15px; text-transform: capitalize;">${activityType}</p>
          </div>
          
          ${actionUrl ? `
            <div style="text-align: center; margin: 32px 0;">
              <a href="${actionUrl}" 
                 style="background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); 
                        color: white; 
                        padding: 16px 32px; 
                        text-decoration: none; 
                        border-radius: 12px; 
                        font-weight: 600;
                        font-size: 16px;
                        display: inline-block;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                        transition: all 0.2s;">
                Take Action
              </a>
            </div>
          ` : ''}
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 12px;">
        <p>© 2024 CleanTabs. All rights reserved.</p>
        <p>Manage your reminders in your <a href="${process.env.NEXTAUTH_URL}/dashboard" style="color: #8b5cf6;">dashboard</a></p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `🔔 Activity Reminder: ${title}`,
    html,
  });
};

// Weekly activity digest
export const sendWeeklyDigest = async (email: string, userName: string, stats: {
  bookmarksAdded: number;
  sitesVisited: number;
  remindersSet: number;
  categoriesCreated: number;
}) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Weekly Activity Digest - CleanTabs</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
      <div style="background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 30px; text-align: center;">
          <div style="background: rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h4l3 3V8l-3 3z"/>
              <path d="M22 11v3a2 2 0 0 1-2 2"/>
            </svg>
          </div>
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Weekly Digest</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Here's your CleanTabs activity this week</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #1e293b; margin: 0 0 24px 0; font-size: 24px; font-weight: 600;">Hi ${userName}!</h2>
          <p style="color: #64748b; margin: 0 0 32px 0; font-size: 16px;">Here's a summary of your CleanTabs activity this week:</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 32px 0;">
            <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; text-align: center; border-left: 4px solid #0ea5e9;">
              <div style="font-size: 32px; font-weight: 700; color: #0ea5e9; margin-bottom: 8px;">${stats.bookmarksAdded}</div>
              <div style="font-size: 14px; color: #475569; font-weight: 500;">Bookmarks Added</div>
            </div>
            <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; text-align: center; border-left: 4px solid #10b981;">
              <div style="font-size: 32px; font-weight: 700; color: #10b981; margin-bottom: 8px;">${stats.sitesVisited}</div>
              <div style="font-size: 14px; color: #475569; font-weight: 500;">Sites Visited</div>
            </div>
            <div style="background: #fef3f2; padding: 20px; border-radius: 12px; text-align: center; border-left: 4px solid #f97316;">
              <div style="font-size: 32px; font-weight: 700; color: #f97316; margin-bottom: 8px;">${stats.remindersSet}</div>
              <div style="font-size: 14px; color: #475569; font-weight: 500;">Reminders Set</div>
            </div>
            <div style="background: #faf5ff; padding: 20px; border-radius: 12px; text-align: center; border-left: 4px solid #8b5cf6;">
              <div style="font-size: 32px; font-weight: 700; color: #8b5cf6; margin-bottom: 8px;">${stats.categoriesCreated}</div>
              <div style="font-size: 14px; color: #475569; font-weight: 500;">Categories Created</div>
            </div>
          </div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" 
               style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); 
                      color: white; 
                      padding: 16px 32px; 
                      text-decoration: none; 
                      border-radius: 12px; 
                      font-weight: 600;
                      font-size: 16px;
                      display: inline-block;
                      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                      transition: all 0.2s;">
              View Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 12px;">
        <p>© 2024 CleanTabs. All rights reserved.</p>
        <p>Manage your email preferences in your <a href="${process.env.NEXTAUTH_URL}/dashboard" style="color: #059669;">dashboard</a></p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `📊 Your CleanTabs Weekly Digest`,
    html,
  });
};