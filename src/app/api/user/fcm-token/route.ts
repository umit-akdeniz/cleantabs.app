import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/simple-auth';
import { z } from 'zod';

const fcmTokenSchema = z.object({
  token: z.string().min(1),
  userId: z.string().min(1)
});

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const body = await request.json();
    const { token, userId } = fcmTokenSchema.parse(body);

    // Verify the userId matches the authenticated user
    if (userId !== (await user)?.userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID mismatch'
      }, { status: 403 });
    }

    // Update or create FCM token for user
    await prisma.user.update({
      where: { id: userId },
      data: {
        fcmToken: token,
        fcmTokenUpdated: new Date()
      }
    });

    console.log(`FCM token updated for user ${(await user)?.email}: ${token.substring(0, 20)}...`);

    return NextResponse.json({
      success: true,
      message: 'FCM token saved successfully'
    });

  } catch (error) {
    console.error('FCM token save error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Get user's FCM token
    const userWithToken = await prisma.user.findUnique({
      where: { id: (await user)?.userId },
      select: {
        fcmToken: true,
        fcmTokenUpdated: true
      }
    });

    return NextResponse.json({
      success: true,
      hasToken: !!userWithToken?.fcmToken,
      tokenUpdated: userWithToken?.fcmTokenUpdated
    });

  } catch (error) {
    console.error('FCM token get error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}