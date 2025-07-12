import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MiddlewareUtils } from '@/lib/auth/middleware-utils';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await MiddlewareUtils.getAuthenticatedUser(request);
    if (!user) {
      return MiddlewareUtils.unauthorizedResponse();
    }

    const body = await request.json();
    const { title, description, reminderDate, reminderType, isCompleted } = body;
    const { id } = await context.params;

    const reminder = await prisma.reminder.update({
      where: { id },
      data: {
        title,
        description,
        reminderDate: reminderDate ? new Date(reminderDate) : undefined,
        reminderType,
        completed: isCompleted,
      },
      include: {
        site: {
          select: {
            name: true
          }
        }
      }
    });

    // Transform response to match frontend interface
    const reminderResponse = {
      id: reminder.id,
      title: reminder.title,
      description: reminder.description,
      reminderDate: reminder.reminderDate.toISOString(),
      reminderType: reminder.reminderType,
      siteId: reminder.siteId,
      siteName: reminder.site.name,
      isCompleted: reminder.completed,
      createdAt: reminder.createdAt.toISOString(),
    };

    return NextResponse.json(reminderResponse);
  } catch (error) {
    console.error('Error updating reminder:', error);
    return NextResponse.json(
      { error: 'Failed to update reminder' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await MiddlewareUtils.getAuthenticatedUser(request);
    if (!user) {
      return MiddlewareUtils.unauthorizedResponse();
    }

    const { id } = await context.params;

    await prisma.reminder.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json(
      { error: 'Failed to delete reminder' },
      { status: 500 }
    );
  }
}