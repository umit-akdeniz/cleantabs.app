import { NextRequest, NextResponse } from 'next/server'
import { sendSiteReminder, sendActivityReminder, sendWeeklyDigest } from '@/lib/email'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getAuthUser } from '@/lib/simple-auth'

const siteReminderSchema = z.object({
  email: z.string().email(),
  siteName: z.string().min(1),
  siteUrl: z.string().url(),
  reminderNote: z.string().optional(),
})

const activityReminderSchema = z.object({
  email: z.string().email(),
  activityType: z.enum(['bookmark', 'review', 'follow-up']),
  title: z.string().min(1),
  description: z.string().optional(),
  actionUrl: z.string().url().optional(),
})

const weeklyDigestSchema = z.object({
  email: z.string().email(),
  userName: z.string().min(1),
  stats: z.object({
    bookmarksAdded: z.number(),
    sitesVisited: z.number(),
    remindersSet: z.number(),
    categoriesCreated: z.number(),
  }),
})

const createReminderSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  reminderDate: z.string(),
  reminderType: z.enum(['NOTIFICATION', 'EMAIL', 'BOTH']),
  siteId: z.string().min(1),
  isRecurring: z.boolean().optional(),
  recurringType: z.enum(['daily', 'weekly', 'monthly']).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    console.log('User found:', user.email) // Debug log

    // Get user's reminders from database - ONLY their reminders
    const reminders = await prisma.reminder.findMany({
      where: {
        userId: user.userId
      },
      include: {
        site: {
          select: {
            id: true,
            name: true,
            url: true
          }
        }
      },
      orderBy: {
        reminderDate: 'asc'
      }
    })

    console.log('Reminders found:', reminders.length) // Debug log

    // Also get all reminders for debugging
    const allReminders = await prisma.reminder.findMany({
      include: {
        site: {
          select: {
            id: true,
            name: true,
            url: true
          }
        }
      }
    })

    console.log('All reminders in database:', allReminders.length) // Debug log

    return NextResponse.json({ 
      success: true, 
      reminders 
    })

  } catch (error) {
    console.error('Get reminders error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Headers:', Object.fromEntries(request.headers.entries()))
    
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const body = await request.json()
    console.log('📨 Reminder POST body:', body)
    
    // Check if this is a direct reminder creation (no type field)
    if (!body.type && body.siteId) {
      console.log('🔄 Parsing reminder data with schema')
      const reminderData = createReminderSchema.parse(body)
      
      console.log('User found:', user.email)

      // Verify user owns the site before creating reminder
      const site = await prisma.site.findFirst({
        where: {
          id: reminderData.siteId,
          subcategory: {
            category: {
              userId: user.userId
            }
          }
        }
      });

      if (!site) {
        return NextResponse.json({
          success: false,
          error: 'Site not found or access denied'
        }, { status: 404 });
      }

      // Calculate next reminder date for recurring reminders
      let nextReminderDate = null;
      if (reminderData.isRecurring && reminderData.recurringType) {
        const baseDate = new Date(reminderData.reminderDate);
        switch (reminderData.recurringType) {
          case 'daily':
            nextReminderDate = new Date(baseDate.getTime() + 24 * 60 * 60 * 1000);
            break;
          case 'weekly':
            nextReminderDate = new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
          case 'monthly':
            nextReminderDate = new Date(baseDate);
            nextReminderDate.setMonth(nextReminderDate.getMonth() + 1);
            break;
        }
      }

      // Create reminder in database with userId
      const reminder = await prisma.reminder.create({
        data: {
          title: reminderData.title,
          description: reminderData.description || '',
          reminderDate: new Date(reminderData.reminderDate),
          reminderType: reminderData.reminderType,
          siteId: reminderData.siteId,
          userId: user.userId,
          isRecurring: reminderData.isRecurring || false,
          recurringType: reminderData.recurringType?.toUpperCase() as any,
          nextReminder: nextReminderDate
        }
      })

      return NextResponse.json({ 
        success: true, 
        reminder,
        message: 'Reminder created successfully' 
      })
    }

    const { type, ...data } = body

    switch (type) {
      case 'site':
        const siteData = siteReminderSchema.parse(data)
        const siteResult = await sendSiteReminder(
          siteData.email,
          siteData.siteName,
          siteData.siteUrl,
          siteData.reminderNote
        )
        return NextResponse.json({ 
          success: siteResult.success,
          message: 'Site reminder sent successfully' 
        })

      case 'activity':
        const activityData = activityReminderSchema.parse(data)
        const activityResult = await sendActivityReminder(
          activityData.email,
          activityData.activityType,
          activityData.title,
          activityData.description,
          activityData.actionUrl
        )
        return NextResponse.json({ 
          success: activityResult.success,
          message: 'Activity reminder sent successfully' 
        })

      case 'weekly-digest':
        const digestData = weeklyDigestSchema.parse(data)
        const digestResult = await sendWeeklyDigest(
          digestData.email,
          digestData.userName,
          digestData.stats
        )
        return NextResponse.json({ 
          success: digestResult.success,
          message: 'Weekly digest sent successfully' 
        })

      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid reminder type' 
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Reminder API error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    })
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: error.errors[0].message,
        details: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}