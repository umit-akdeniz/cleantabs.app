import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSiteReminder } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Check for admin API key or internal call
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!authHeader || !cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const now = new Date();
    console.log('Checking for due reminders at:', now.toISOString());

    // Find all reminders that are due and not yet completed or sent
    const dueReminders = await prisma.reminder.findMany({
      where: {
        reminderDate: {
          lte: now
        },
        completed: false,
        emailSent: false
      },
      include: {
        site: {
          include: {
            subcategory: {
              include: {
                category: {
                  include: {
                    user: true
                  }
                }
              }
            }
          }
        }
      }
    });

    console.log(`Found ${dueReminders.length} due reminders`);

    const processedReminders = [];
    const errors = [];

    for (const reminder of dueReminders) {
      try {
        const user = reminder.site.subcategory.category.user;
        const site = reminder.site;

        // Send notification based on reminder type
        if (reminder.reminderType === 'EMAIL' || reminder.reminderType === 'BOTH') {
          console.log(`Sending email reminder for site: ${site.name} to user: ${user.email}`);
          
          const emailResult = await sendSiteReminder(
            user.email,
            site.name,
            site.url,
            reminder.description || reminder.title
          );

          if (emailResult.success) {
            // Mark email as sent
            await prisma.reminder.update({
              where: { id: reminder.id },
              data: { emailSent: true }
            });
            console.log(`Email sent successfully for reminder ${reminder.id}`);
          } else {
            console.error(`Failed to send email for reminder ${reminder.id}:`, emailResult.error);
            errors.push({
              reminderId: reminder.id,
              error: 'Failed to send email',
              details: emailResult.error
            });
          }
        }

        // For browser notifications, we'll mark as completed since they're handled client-side
        if (reminder.reminderType === 'NOTIFICATION' || reminder.reminderType === 'BOTH') {
          console.log(`Browser notification reminder for site: ${site.name}`);
          // Browser notifications are handled client-side when user visits the app
        }

        // Mark reminder as completed if it's a one-time reminder
        await prisma.reminder.update({
          where: { id: reminder.id },
          data: { 
            completed: true,
            updatedAt: new Date()
          }
        });

        processedReminders.push({
          id: reminder.id,
          siteName: site.name,
          userEmail: user.email,
          reminderType: reminder.reminderType
        });

      } catch (error) {
        console.error(`Error processing reminder ${reminder.id}:`, error);
        errors.push({
          reminderId: reminder.id,
          error: 'Processing failed',
          details: error
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedReminders.length,
      errors: errors.length,
      reminders: processedReminders,
      errorDetails: errors
    });

  } catch (error) {
    console.error('Reminder check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error
    }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'reminder-checker',
    timestamp: new Date().toISOString()
  });
}