import Bull from 'bull'
import { sendEmail } from '@/lib/email'
import { S3Service } from '@/lib/aws-s3'
import { prisma } from '@/lib/prisma'
import { AuditService } from '@/lib/auth/audit'

// Redis connection for Bull
const redisConfig = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
}

// Job queues
export const emailQueue = new Bull('email processing', redisConfig)
export const reminderQueue = new Bull('reminder processing', redisConfig)
export const exportQueue = new Bull('export processing', redisConfig)
export const cleanupQueue = new Bull('cleanup processing', redisConfig)
export const auditQueue = new Bull('audit processing', redisConfig)

// Email job types
interface EmailJob {
  type: 'reminder' | 'verification' | 'password_reset' | 'export_ready' | 'weekly_digest'
  to: string
  data: any
}

interface ReminderJob {
  reminderId: string
  userId: string
  siteId: string
}

interface ExportJob {
  userId: string
  format: 'html' | 'json' | 'csv'
  includeCategories: boolean
  includeSubcategories: boolean
  includeSites: boolean
}

interface CleanupJob {
  type: 'audit_logs' | 'temp_files' | 'expired_tokens' | 'old_exports'
  olderThan: Date
}

interface AuditJob {
  userId?: string
  type: string
  data: any
}

// Email queue processors
emailQueue.process('send-email', async (job) => {
  const { type, to, data }: EmailJob = job.data

  try {
    switch (type) {
      case 'reminder':
        await sendEmail({
          to,
          subject: `⏰ Reminder: Check ${data.siteName}`,
          html: generateReminderEmail(data),
          text: `Reminder to check ${data.siteName}: ${data.siteUrl}`,
        })
        break

      case 'verification':
        await sendEmail({
          to,
          subject: 'Verify Your Email - CleanTabs',
          html: generateVerificationEmail(data),
          text: `Please verify your email: ${data.verificationUrl}`,
        })
        break

      case 'password_reset':
        await sendEmail({
          to,
          subject: 'Reset Your Password - CleanTabs',
          html: generatePasswordResetEmail(data),
          text: `Reset your password: ${data.resetUrl}`,
        })
        break

      case 'export_ready':
        await sendEmail({
          to,
          subject: 'Your CleanTabs Export is Ready',
          html: generateExportReadyEmail(data),
          text: `Your bookmark export is ready for download: ${data.downloadUrl}`,
        })
        break

      case 'weekly_digest':
        await sendEmail({
          to,
          subject: '📊 Your CleanTabs Weekly Digest',
          html: generateWeeklyDigestEmail(data),
          text: `Your weekly activity: ${data.bookmarksAdded} bookmarks added, ${data.sitesVisited} sites visited`,
        })
        break

      default:
        throw new Error(`Unknown email type: ${type}`)
    }

    console.log(`Email sent successfully: ${type} to ${to}`)
  } catch (error) {
    console.error(`Failed to send ${type} email to ${to}:`, error)
    throw error
  }
})

// Reminder queue processors
reminderQueue.process('send-reminder', async (job) => {
  const { reminderId, userId, siteId }: ReminderJob = job.data

  try {
    const reminder = await prisma.reminder.findUnique({
      where: { id: reminderId },
      include: {
        site: true,
      },
    })

    if (!reminder) {
      throw new Error(`Reminder ${reminderId} not found`)
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    })

    if (!user) {
      throw new Error(`User ${userId} not found`)
    }

    // Send email reminder
    if (reminder.reminderType === 'EMAIL' || reminder.reminderType === 'BOTH') {
      await emailQueue.add('send-email', {
        type: 'reminder',
        to: user.email,
        data: {
          siteName: reminder.site.name,
          siteUrl: reminder.site.url,
          reminderNote: reminder.description,
          userName: user.name,
        },
      })
    }

    // Mark reminder as sent
    await prisma.reminder.update({
      where: { id: reminderId },
      data: {
        emailSent: true,
        completed: true,
      },
    })

    console.log(`Reminder sent successfully: ${reminderId}`)
  } catch (error) {
    console.error(`Failed to process reminder ${reminderId}:`, error)
    throw error
  }
})

// Export queue processors
exportQueue.process('create-export', async (job) => {
  const { userId, format, includeCategories, includeSubcategories, includeSites }: ExportJob = job.data

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    })

    if (!user) {
      throw new Error(`User ${userId} not found`)
    }

    // Fetch user data
    const categories = await prisma.category.findMany({
      where: { userId },
      include: {
        subcategories: {
          include: {
            sites: includeSites,
          },
        },
      },
      orderBy: { order: 'asc' },
    })

    let exportContent: string
    let contentType: string
    let filename: string

    switch (format) {
      case 'html':
        exportContent = generateHtmlExport(categories)
        contentType = 'text/html'
        filename = 'bookmarks.html'
        break

      case 'json':
        exportContent = JSON.stringify(categories, null, 2)
        contentType = 'application/json'
        filename = 'bookmarks.json'
        break

      case 'csv':
        exportContent = generateCsvExport(categories)
        contentType = 'text/csv'
        filename = 'bookmarks.csv'
        break

      default:
        throw new Error(`Unsupported export format: ${format}`)
    }

    // Upload to S3
    const exportUrl = await S3Service.uploadExport(
      userId,
      Buffer.from(exportContent, 'utf-8'),
      filename
    )

    // Send email notification
    await emailQueue.add('send-email', {
      type: 'export_ready',
      to: user.email,
      data: {
        downloadUrl: exportUrl,
        format: format.toUpperCase(),
        itemCount: categories.reduce((total, cat) => 
          total + cat.subcategories.reduce((subTotal, sub) => 
            subTotal + (sub.sites?.length || 0), 0), 0),
        userName: user.name,
      },
    })

    console.log(`Export created successfully for user ${userId}: ${exportUrl}`)
  } catch (error) {
    console.error(`Failed to create export for user ${userId}:`, error)
    throw error
  }
})

// Cleanup queue processors
cleanupQueue.process('cleanup', async (job) => {
  const { type, olderThan }: CleanupJob = job.data

  try {
    switch (type) {
      case 'audit_logs':
        const deletedLogs = await AuditService.cleanupOldRecords(90) // 90 days
        console.log(`Cleaned up ${deletedLogs} old audit logs`)
        break

      case 'temp_files':
        // Clean up temporary files from S3
        await S3Service.cleanupOldFiles('temp/', 24 * 60 * 60 * 1000) // 1 day
        console.log('Cleaned up temporary files')
        break

      case 'expired_tokens':
        await prisma.user.updateMany({
          where: {
            OR: [
              { emailVerificationExpiry: { lt: new Date() } },
              { passwordResetExpiry: { lt: new Date() } },
              { magicLinkExpiry: { lt: new Date() } },
            ],
          },
          data: {
            emailVerificationToken: null,
            emailVerificationExpiry: null,
            passwordResetToken: null,
            passwordResetExpiry: null,
            magicLinkToken: null,
            magicLinkExpiry: null,
          },
        })
        console.log('Cleaned up expired tokens')
        break

      case 'old_exports':
        // Clean up old export files from S3
        await S3Service.cleanupOldFiles('exports/', 7 * 24 * 60 * 60 * 1000) // 7 days
        console.log('Cleaned up old export files')
        break

      default:
        throw new Error(`Unknown cleanup type: ${type}`)
    }

    console.log(`Cleanup completed: ${type}`)
  } catch (error) {
    console.error(`Cleanup failed for ${type}:`, error)
    throw error
  }
})

// Schedule recurring jobs
export const scheduleJobs = () => {
  // Daily cleanup at 2 AM
  cleanupQueue.add('cleanup', 
    { type: 'audit_logs', olderThan: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
    { repeat: { cron: '0 2 * * *' } }
  )

  cleanupQueue.add('cleanup',
    { type: 'expired_tokens', olderThan: new Date() },
    { repeat: { cron: '0 2 * * *' } }
  )

  cleanupQueue.add('cleanup',
    { type: 'temp_files', olderThan: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { repeat: { cron: '0 2 * * *' } }
  )

  // Weekly export cleanup on Sundays at 3 AM
  cleanupQueue.add('cleanup',
    { type: 'old_exports', olderThan: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    { repeat: { cron: '0 3 * * 0' } }
  )

  console.log('Recurring jobs scheduled')
}

// Helper functions for email generation
function generateReminderEmail(data: any): string {
  return `
    <h2>Reminder: Check ${data.siteName}</h2>
    <p>Hi ${data.userName},</p>
    <p>This is your scheduled reminder to check <a href="${data.siteUrl}">${data.siteName}</a>.</p>
    ${data.reminderNote ? `<p><strong>Note:</strong> ${data.reminderNote}</p>` : ''}
    <p><a href="${data.siteUrl}" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Site</a></p>
  `
}

function generateVerificationEmail(data: any): string {
  return `
    <h2>Verify Your Email</h2>
    <p>Please click the link below to verify your email address:</p>
    <p><a href="${data.verificationUrl}">Verify Email</a></p>
  `
}

function generatePasswordResetEmail(data: any): string {
  return `
    <h2>Reset Your Password</h2>
    <p>Click the link below to reset your password:</p>
    <p><a href="${data.resetUrl}">Reset Password</a></p>
  `
}

function generateExportReadyEmail(data: any): string {
  return `
    <h2>Your Export is Ready</h2>
    <p>Hi ${data.userName},</p>
    <p>Your CleanTabs export (${data.format}) containing ${data.itemCount} bookmarks is ready for download.</p>
    <p><a href="${data.downloadUrl}">Download Export</a></p>
  `
}

function generateWeeklyDigestEmail(data: any): string {
  return `
    <h2>Your Weekly CleanTabs Digest</h2>
    <p>This week you:</p>
    <ul>
      <li>Added ${data.bookmarksAdded} new bookmarks</li>
      <li>Visited ${data.sitesVisited} sites</li>
      <li>Created ${data.categoriesCreated} categories</li>
      <li>Set ${data.remindersSet} reminders</li>
    </ul>
  `
}

function generateHtmlExport(categories: any[]): string {
  // Generate Netscape Bookmark File format
  let html = '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n'
  html += '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n'
  html += '<TITLE>CleanTabs Bookmarks</TITLE>\n'
  html += '<H1>CleanTabs Bookmarks</H1>\n'
  html += '<DL><p>\n'

  categories.forEach(category => {
    html += `    <DT><H3>${category.name}</H3>\n`
    html += '    <DL><p>\n'
    
    category.subcategories.forEach((subcategory: any) => {
      html += `        <DT><H3>${subcategory.name}</H3>\n`
      html += '        <DL><p>\n'
      
      subcategory.sites?.forEach((site: any) => {
        html += `            <DT><A HREF="${site.url}">${site.name}</A>\n`
      })
      
      html += '        </DL><p>\n'
    })
    
    html += '    </DL><p>\n'
  })

  html += '</DL><p>\n'
  return html
}

function generateCsvExport(categories: any[]): string {
  let csv = 'Category,Subcategory,Name,URL,Description\n'
  
  categories.forEach(category => {
    category.subcategories.forEach((subcategory: any) => {
      subcategory.sites?.forEach((site: any) => {
        csv += `"${category.name}","${subcategory.name}","${site.name}","${site.url}","${site.description || ''}"\n`
      })
    })
  })
  
  return csv
}

// Job queue monitoring
export const getQueueStats = async () => {
  const [emailStats, reminderStats, exportStats, cleanupStats] = await Promise.all([
    emailQueue.getJobCounts(),
    reminderQueue.getJobCounts(),
    exportQueue.getJobCounts(),
    cleanupQueue.getJobCounts(),
  ])

  return {
    email: emailStats,
    reminder: reminderStats,
    export: exportStats,
    cleanup: cleanupStats,
  }
}