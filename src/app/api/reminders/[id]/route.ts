import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/simple-auth';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = getAuthUser(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const { id } = await context.params;

    // Get reminder - ONLY if it belongs to the user
    const reminder = await prisma.reminder.findFirst({
      where: {
        id,
        userId: (await user)?.userId
      },
      include: {
        site: {
          select: {
            id: true,
            name: true,
            url: true
          }
        }
      }
    });

    if (!reminder) {
      return NextResponse.json({
        success: false,
        error: 'Reminder not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      reminder
    });

  } catch (error) {
    console.error('Get reminder error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, reminderDate, reminderType, isCompleted } = body;
    const { id } = await context.params;

    // Update reminder - ONLY if it belongs to the user
    const reminder = await prisma.reminder.updateMany({
      where: {
        id,
        userId: (await user)?.userId
      },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(reminderDate && { reminderDate: new Date(reminderDate) }),
        ...(reminderType && { reminderType }),
        ...(isCompleted !== undefined && { completed: isCompleted }),
        updatedAt: new Date()
      }
    });

    if (reminder.count === 0) {
      return NextResponse.json({
        success: false,
        error: 'Reminder not found or access denied'
      }, { status: 404 });
    }

    // Fetch updated reminder
    const updatedReminder = await prisma.reminder.findFirst({
      where: {
        id,
        userId: (await user)?.userId
      },
      include: {
        site: {
          select: {
            id: true,
            name: true,
            url: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      reminder: updatedReminder,
      message: 'Reminder updated successfully'
    });

  } catch (error) {
    console.error('Update reminder error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const { id } = await context.params;

    // Delete reminder - ONLY if it belongs to the user
    const deletedReminder = await prisma.reminder.deleteMany({
      where: {
        id,
        userId: (await user)?.userId
      }
    });

    if (deletedReminder.count === 0) {
      return NextResponse.json({
        success: false,
        error: 'Reminder not found or access denied'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Reminder deleted successfully'
    });

  } catch (error) {
    console.error('Delete reminder error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}