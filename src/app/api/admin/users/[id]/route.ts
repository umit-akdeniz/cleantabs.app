import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MiddlewareUtils } from '@/lib/auth/middleware-utils';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await MiddlewareUtils.getAuthenticatedUser(request);
    
    if (!user || !MiddlewareUtils.isAdmin(user)) {
      return MiddlewareUtils.forbiddenResponse('Admin access required');
    }

    const body = await request.json();
    const { id: userId } = await params;

    // Plan güncelleme
    if (body.plan) {
      await prisma.user.update({
        where: { id: userId },
        data: { plan: body.plan }
      });
      return NextResponse.json({ success: true });
    }

    // Email doğrulama
    if (body.emailVerified !== undefined) {
      await prisma.user.update({
        where: { id: userId },
        data: { emailVerified: body.emailVerified ? new Date(body.emailVerified) : null }
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'No valid update fields provided' }, { status: 400 });
  } catch (error) {
    console.error('Admin user update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await MiddlewareUtils.getAuthenticatedUser(request);
    
    if (!user || !MiddlewareUtils.isAdmin(user)) {
      return MiddlewareUtils.unauthorizedResponse();
    }

    const { id: userId } = await params;

    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin user delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}