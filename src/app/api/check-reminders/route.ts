import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();
    
    // Find all reminders that are due (reminderDate <= now) and not completed and email not sent
    const dueReminders = await prisma.reminder.findMany({
      where: {
        reminderDate: {
          lte: now
        },
        completed: false,
        emailSent: false,
        reminderType: {
          in: ['EMAIL', 'BOTH']
        }
      },
      include: {
        site: {
          include: {
            subcategory: {
              include: {
                category: {
                  include: {
                    user: {
                      select: {
                        email: true,
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const results = [];

    for (const reminder of dueReminders) {
      try {
        // Send email notification to the user who owns the site
        const userEmail = reminder.site.subcategory.category.user.email;
        const userName = reminder.site.subcategory.category.user.name;
        
        const emailResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: userEmail,
            subject: `⏰ Reminder: ${reminder.title}`,
            text: `
              Hi ${userName},
              
              This is your scheduled reminder: ${reminder.title}
              
              Site: ${reminder.site.name}
              URL: ${reminder.site.url}
              
              ${reminder.description ? `Description: ${reminder.description}` : ''}
              
              Scheduled for: ${reminder.reminderDate.toLocaleString()}
              
              ---
              CleanTabs Reminder Service
            `,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>CleanTabs Reminder</title>
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
                    <p style="color: #64748b; margin: 0 0 24px 0; font-size: 16px;">Hi ${userName},</p>
                    <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">${reminder.title}</h2>
                    <p style="color: #64748b; margin: 0 0 24px 0; font-size: 16px;">Your scheduled reminder is here!</p>
                    
                    ${reminder.description ? `
                      <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #3b82f6;">
                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" style="margin-right: 8px;">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                          </svg>
                          <strong style="color: #1e293b; font-size: 14px;">Your Note:</strong>
                        </div>
                        <p style="color: #475569; margin: 0; font-size: 15px; line-height: 1.5;">${reminder.description}</p>
                      </div>
                    ` : ''}
                    
                    <div style="text-align: center; margin: 32px 0;">
                      <a href="${reminder.site.url}" 
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
                        Visit ${reminder.site.name}
                      </a>
                    </div>
                    
                    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 24px 0;">
                      <p style="color: #64748b; margin: 0; font-size: 14px; text-align: center;">
                        <strong>Site URL:</strong> <a href="${reminder.site.url}" style="color: #3b82f6; text-decoration: none;">${reminder.site.url}</a>
                      </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                      <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                        Scheduled for: ${reminder.reminderDate.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 12px;">
                  <p>© 2024 CleanTabs. All rights reserved.</p>
                  <p>Manage your reminders in your <a href="${process.env.NEXTAUTH_URL}/reminders" style="color: #3b82f6;">dashboard</a></p>
                </div>
              </body>
              </html>
            `
          })
        });

        if (emailResponse.ok) {
          // Mark email as sent
          await prisma.reminder.update({
            where: { id: reminder.id },
            data: { emailSent: true }
          });

          results.push({
            reminderId: reminder.id,
            status: 'sent',
            siteName: reminder.site.name
          });
        } else {
          results.push({
            reminderId: reminder.id,
            status: 'failed',
            siteName: reminder.site.name,
            error: 'Email sending failed'
          });
        }

      } catch (error) {
        console.error(`Error processing reminder ${reminder.id}:`, error);
        results.push({
          reminderId: reminder.id,
          status: 'error',
          siteName: reminder.site.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      processedCount: results.length,
      results
    });

  } catch (error) {
    console.error('Error checking reminders:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check reminders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}