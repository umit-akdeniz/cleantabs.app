import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, reminderDate, reminderType, siteId, userId } = body;

    const reminder = await prisma.reminder.create({
      data: {
        title,
        description,
        reminderDate: new Date(reminderDate),
        reminderType,
        siteId,
        userId,
      },
      include: {
        site: true
      }
    });

    return NextResponse.json(reminder);
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const siteId = searchParams.get('siteId');

    let whereClause: any = {};
    
    if (userId) {
      whereClause.userId = userId;
    }
    
    if (siteId) {
      whereClause.siteId = siteId;
    }

    const reminders = await prisma.reminder.findMany({
      where: whereClause,
      include: {
        site: true
      },
      orderBy: {
        reminderDate: 'asc'
      }
    });

    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reminders' },
      { status: 500 }
    );
  }
}