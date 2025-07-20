import cron from 'node-cron';
import { prisma } from '@/lib/prisma';
import { sendSiteReminder } from '@/lib/email';

let isReminderJobRunning = false;

// Check for due reminders every minute
export const scheduleReminderCheck = () => {
  // Run every minute: * * * * *
  cron.schedule('* * * * *', async () => {
    if (isReminderJobRunning) {
      console.log('Reminder job already running, skipping...');
      return;
    }

    isReminderJobRunning = true;
    
    try {
      await checkAndSendDueReminders();
    } catch (error) {
      console.error('Error in scheduled reminder check:', error);
    } finally {
      isReminderJobRunning = false;
    }
  }, {
    scheduled: true,
    timezone: "Europe/Istanbul" // Turkish timezone
  });

  console.log('✅ Reminder checker scheduled to run every minute');
};

// Function to check and send due reminders
export const checkAndSendDueReminders = async () => {
  const now = new Date();
  console.log(`🔍 Checking for due reminders at: ${now.toISOString()}`);

  try {
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
          select: {
            id: true,
            name: true,
            url: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    console.log(`📋 Found ${dueReminders.length} due reminders`);

    if (dueReminders.length === 0) {
      return { processed: 0, errors: 0 };
    }

    const processedReminders = [];
    const errors = [];

    for (const reminder of dueReminders) {
      try {
        const user = reminder.user;
        const site = reminder.site;

        console.log(`📧 Processing reminder for site: ${site.name} (${user.email})`);

        // Send email notification if required
        if (reminder.reminderType === 'EMAIL' || reminder.reminderType === 'BOTH') {
          console.log(`📬 Sending email reminder for site: ${site.name} to user: ${user.email}`);
          
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
            console.log(`✅ Email sent successfully for reminder ${reminder.id}`);
          } else {
            console.error(`❌ Failed to send email for reminder ${reminder.id}:`, emailResult.error);
            errors.push({
              reminderId: reminder.id,
              error: 'Failed to send email',
              details: emailResult.error
            });
            continue; // Skip marking as completed if email failed
          }
        }

        // For browser notifications, we mark as ready for client-side handling
        if (reminder.reminderType === 'NOTIFICATION' || reminder.reminderType === 'BOTH') {
          console.log(`🔔 Browser notification scheduled for site: ${site.name}`);
        }

        // Handle recurring reminders
        if (reminder.isRecurring && reminder.recurringType && reminder.nextReminder) {
          // Calculate next occurrence
          let nextOccurrence = new Date(reminder.nextReminder);
          let newNextReminder = null;
          
          switch (reminder.recurringType) {
            case 'DAILY':
              newNextReminder = new Date(nextOccurrence.getTime() + 24 * 60 * 60 * 1000);
              break;
            case 'WEEKLY':
              newNextReminder = new Date(nextOccurrence.getTime() + 7 * 24 * 60 * 60 * 1000);
              break;
            case 'MONTHLY':
              newNextReminder = new Date(nextOccurrence);
              newNextReminder.setMonth(newNextReminder.getMonth() + 1);
              break;
          }

          // Create next reminder
          if (newNextReminder) {
            await prisma.reminder.create({
              data: {
                title: reminder.title,
                description: reminder.description,
                reminderDate: nextOccurrence,
                reminderType: reminder.reminderType,
                siteId: reminder.siteId,
                userId: reminder.user.id,
                isRecurring: true,
                recurringType: reminder.recurringType,
                nextReminder: newNextReminder
              }
            });
            
            console.log(`✅ Created next recurring reminder for ${site.name} at ${nextOccurrence.toISOString()}`);
          }
        }

        // Mark current reminder as completed
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
          reminderType: reminder.reminderType,
          processed: true
        });

        console.log(`✅ Reminder ${reminder.id} processed successfully`);

      } catch (error) {
        console.error(`❌ Error processing reminder ${reminder.id}:`, error);
        errors.push({
          reminderId: reminder.id,
          error: 'Processing failed',
          details: error
        });
      }
    }

    const summary = {
      processed: processedReminders.length,
      errors: errors.length,
      reminders: processedReminders,
      errorDetails: errors
    };

    console.log(`📊 Reminder check summary:`, {
      processed: summary.processed,
      errors: summary.errors,
      timestamp: now.toISOString()
    });

    return summary;

  } catch (error) {
    console.error('❌ Error in checkAndSendDueReminders:', error);
    throw error;
  }
};

// Initialize all scheduled jobs
export const initializeScheduler = () => {
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_SCHEDULER === 'true') {
    console.log('🚀 Initializing reminder scheduler...');
    scheduleReminderCheck();
    
    // Weekly cleanup job - runs every Sunday at 2 AM
    cron.schedule('0 2 * * 0', async () => {
      try {
        console.log('🧹 Running weekly cleanup...');
        
        // Clean up completed reminders older than 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const deletedReminders = await prisma.reminder.deleteMany({
          where: {
            completed: true,
            updatedAt: {
              lt: thirtyDaysAgo
            }
          }
        });

        console.log(`🗑️ Cleaned up ${deletedReminders.count} old completed reminders`);
        
      } catch (error) {
        console.error('❌ Error in weekly cleanup:', error);
      }
    }, {
      scheduled: true,
      timezone: "Europe/Istanbul"
    });

    console.log('✅ All schedulers initialized successfully');
  } else {
    console.log('⏸️ Schedulers disabled (set ENABLE_SCHEDULER=true to enable in development)');
  }
};

// Manual trigger for testing reminders
export const triggerManualReminderCheck = async () => {
  console.log('🔧 Manual reminder check triggered');
  return await checkAndSendDueReminders();
};

// Get active reminder stats
export const getReminderStats = async () => {
  try {
    const now = new Date();
    
    const stats = await prisma.reminder.groupBy({
      by: ['reminderType', 'completed', 'emailSent'],
      _count: {
        id: true
      }
    });

    const dueCount = await prisma.reminder.count({
      where: {
        reminderDate: {
          lte: now
        },
        completed: false
      }
    });

    const upcomingCount = await prisma.reminder.count({
      where: {
        reminderDate: {
          gt: now
        },
        completed: false
      }
    });

    return {
      stats,
      due: dueCount,
      upcoming: upcomingCount,
      timestamp: now.toISOString()
    };
  } catch (error) {
    console.error('Error getting reminder stats:', error);
    throw error;
  }
};