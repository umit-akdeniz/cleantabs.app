import { NextRequest, NextResponse } from 'next/server'
import { sendSiteReminder, sendActivityReminder, sendWeeklyDigest } from '@/lib/email'
import { prisma } from '@/lib/auth/database'
import { z } from 'zod'
import { MiddlewareUtils } from '@/lib/auth/middleware-utils'

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
})

export async function GET(request: NextRequest) {
  try {
    const user = await MiddlewareUtils.getAuthenticatedUser(request)
    
    if (!user) {
      return MiddlewareUtils.unauthorizedResponse()
    }

    console.log('User found:', user.email) // Debug log

    // Get user's reminders from database
    const reminders = await prisma.reminder.findMany({
      where: {
        site: {
          subcategory: {
            category: {
              userId: user.userId
            }
          }
        }
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
    
    const user = await MiddlewareUtils.getAuthenticatedUser(request)
    
    if (!user) {
      return MiddlewareUtils.unauthorizedResponse()
    }

    const body = await request.json()
    
    // Check if this is a direct reminder creation (no type field)
    if (!body.type && body.siteId) {
      const reminderData = createReminderSchema.parse(body)
      
      console.log('User found:', user.email)

      // Create reminder in database
      const reminder = await prisma.reminder.create({
        data: {
          title: reminderData.title,
          description: reminderData.description || '',
          reminderDate: new Date(reminderData.reminderDate),
          reminderType: reminderData.reminderType,
          siteId: reminderData.siteId
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
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: error.errors[0].message 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}