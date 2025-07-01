import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { siteId, reminderDate, title, description } = await request.json();

    if (!siteId || !reminderDate || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user has premium plan
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.plan !== 'PREMIUM') {
      return NextResponse.json(
        { error: 'Premium subscription required' },
        { status: 403 }
      );
    }

    // Get site details
    const site = await prisma.site.findUnique({
      where: { id: siteId },
      include: {
        subcategory: {
          include: {
            category: true
          }
        }
      }
    });

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    // Verify user owns this site
    if (site.subcategory.category.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Generate calendar event
    const calendarEvent = generateCalendarEvent({
      title,
      description: description || `Reminder to check: ${site.name}`,
      url: site.url,
      siteName: site.name,
      reminderDate: new Date(reminderDate),
      category: site.subcategory.category.name,
      subcategory: site.subcategory.name
    });

    // Create reminder in database
    const reminder = await prisma.reminder.create({
      data: {
        title,
        description: description || `Reminder to check: ${site.name}`,
        reminderDate: new Date(reminderDate),
        reminderType: 'BOTH', // Email and notification
        siteId,
        userId: user.id
      }
    });

    return NextResponse.json({
      message: 'Calendar reminder created successfully',
      calendarEvent,
      downloadUrl: `/api/calendar/download/${reminder.id}`,
      reminder
    });

  } catch (error) {
    console.error('Calendar reminder error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reminderId = searchParams.get('id');

    if (!reminderId) {
      return NextResponse.json(
        { error: 'Reminder ID required' },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const reminder = await prisma.reminder.findUnique({
      where: { id: reminderId },
      include: {
        site: {
          include: {
            subcategory: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    if (!reminder) {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }

    // Verify user owns this reminder
    if (reminder.userId !== reminder.site.subcategory.category.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Generate ICS file content
    const icsContent = generateICSFile({
      title: reminder.title,
      description: reminder.description || '',
      url: reminder.site.url,
      siteName: reminder.site.name,
      reminderDate: reminder.reminderDate,
      category: reminder.site.subcategory.category.name,
      subcategory: reminder.site.subcategory.name
    });

    return new NextResponse(icsContent, {
      headers: {
        'Content-Type': 'text/calendar',
        'Content-Disposition': `attachment; filename="cleantabs-reminder-${reminder.site.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics"`
      }
    });

  } catch (error) {
    console.error('Calendar download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

interface CalendarEventData {
  title: string;
  description: string;
  url: string;
  siteName: string;
  reminderDate: Date;
  category: string;
  subcategory: string;
}

function generateCalendarEvent(data: CalendarEventData) {
  const startDate = data.reminderDate;
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 minutes later

  return {
    title: data.title,
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    description: `${data.description}\n\nSite: ${data.siteName}\nURL: ${data.url}\nCategory: ${data.category} > ${data.subcategory}\n\nGenerated by CleanTabs`,
    url: data.url,
    location: data.url
  };
}

function generateICSFile(data: CalendarEventData): string {
  const startDate = data.reminderDate;
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 minutes later
  
  // Format dates for ICS (YYYYMMDDTHHMMSSZ)
  const formatICSDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  const now = new Date();
  const uid = `cleantabs-${now.getTime()}@cleantabs.app`;

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CleanTabs//Site Reminder//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatICSDate(now)}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${escapeICSText(data.title)}
DESCRIPTION:${escapeICSText(data.description + '\\n\\nSite: ' + data.siteName + '\\nURL: ' + data.url + '\\nCategory: ' + data.category + ' > ' + data.subcategory + '\\n\\nGenerated by CleanTabs')}
URL:${data.url}
LOCATION:${escapeICSText(data.url)}
CATEGORIES:${escapeICSText('CleanTabs,Website,Reminder')}
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:${escapeICSText('Reminder: ' + data.title)}
END:VALARM
END:VEVENT
END:VCALENDAR`;

  return icsContent;
}

function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}