import nodemailer from 'nodemailer';

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Send email function
export const sendEmail = async ({ to, subject, html, text }: EmailTemplate) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email send error:', error);
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
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">CleanTabs</h1>
        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Reset Your Password</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
        <p>You requested to reset your password for your CleanTabs account. Click the button below to create a new password.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 25px; 
                    font-weight: bold;
                    display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
        </p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          This password reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
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
    subject: 'Reset Your Password - CleanTabs',
    html,
  });
};

// Modern site reminder notification
export const sendSiteReminder = async (email: string, siteName: string, siteUrl: string, reminderNote?: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Site Reminder - CleanTabs</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
      <div style="background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); padding: 40px 30px; text-align: center;">
          <div style="background: rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6"/>
              <path d="m21 12-6 0m-6 0-6 0"/>
            </svg>
          </div>
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Site Reminder</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Time to check your saved site</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">${siteName}</h2>
          <p style="color: #64748b; margin: 0 0 24px 0; font-size: 16px;">Your scheduled reminder to check this site is here!</p>
          
          ${reminderNote ? `
            <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #3b82f6;">
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" style="margin-right: 8px;">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <strong style="color: #1e293b; font-size: 14px;">Your Note:</strong>
              </div>
              <p style="color: #475569; margin: 0; font-size: 15px; line-height: 1.5;">${reminderNote}</p>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${siteUrl}" 
               style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); 
                      color: white; 
                      padding: 16px 32px; 
                      text-decoration: none; 
                      border-radius: 12px; 
                      font-weight: 600;
                      font-size: 16px;
                      display: inline-block;
                      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                      transition: all 0.2s;">
              Visit ${siteName}
            </a>
          </div>
          
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <p style="color: #64748b; margin: 0; font-size: 14px; text-align: center;">
              <strong>Site URL:</strong> <a href="${siteUrl}" style="color: #3b82f6; text-decoration: none;">${siteUrl}</a>
            </p>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 12px;">
        <p>© 2024 CleanTabs. All rights reserved.</p>
        <p>Manage your reminders in your <a href="${process.env.NEXTAUTH_URL}/dashboard" style="color: #3b82f6;">dashboard</a></p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `⏰ Reminder: Check ${siteName}`,
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