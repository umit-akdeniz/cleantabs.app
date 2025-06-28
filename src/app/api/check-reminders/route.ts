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
        site: true
      }
    });

    const results = [];

    for (const reminder of dueReminders) {
      try {
        // Send email notification
        const emailResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: process.env.REMINDER_EMAIL || 'admin@sitehub.com', // User email - production'da user'dan alınmalı
            subject: `Reminder: ${reminder.title}`,
            text: `
              Reminder: ${reminder.title}
              
              Site: ${reminder.site.name}
              URL: ${reminder.site.url}
              
              ${reminder.description ? `Description: ${reminder.description}` : ''}
              
              Scheduled for: ${reminder.reminderDate.toLocaleString()}
              
              ---
              SiteHub Pro Reminder Service
            `,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 20px; border-radius: 10px 10px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">SiteHub Pro Reminder</h1>
                </div>
                
                <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
                  <h2 style="color: #1e293b; margin: 0 0 20px 0;">${reminder.title}</h2>
                  
                  <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
                    <h3 style="color: #475569; margin: 0 0 10px 0; font-size: 16px;">Site Details</h3>
                    <p style="margin: 5px 0; color: #64748b;"><strong>Name:</strong> ${reminder.site.name}</p>
                    <p style="margin: 5px 0; color: #64748b;"><strong>URL:</strong> <a href="${reminder.site.url}" style="color: #3b82f6; text-decoration: none;">${reminder.site.url}</a></p>
                    <p style="margin: 5px 0; color: #64748b;"><strong>Scheduled:</strong> ${reminder.reminderDate.toLocaleString()}</p>
                  </div>
                  
                  ${reminder.description ? `
                    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                      <h3 style="color: #475569; margin: 0 0 10px 0; font-size: 16px;">Description</h3>
                      <p style="color: #64748b; line-height: 1.6; margin: 0;">${reminder.description}</p>
                    </div>
                  ` : ''}
                  
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="${reminder.site.url}" 
                       style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
                      Visit Site
                    </a>
                  </div>
                  
                  <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                      This reminder was sent by SiteHub Pro
                    </p>
                  </div>
                </div>
              </div>
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