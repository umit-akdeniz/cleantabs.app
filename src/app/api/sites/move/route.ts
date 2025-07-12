import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MiddlewareUtils } from '@/lib/auth/middleware-utils';

export async function PUT(request: NextRequest) {
  try {
    const user = await MiddlewareUtils.getAuthenticatedUser(request);
    
    if (!user) {
      return MiddlewareUtils.unauthorizedResponse();
    }

    const { siteId, newSubcategoryId } = await request.json();

    if (!siteId || !newSubcategoryId) {
      return NextResponse.json(
        { error: 'Site ID and new subcategory ID are required' },
        { status: 400 }
      );
    }

    // Verify the site belongs to the user
    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        subcategory: {
          category: {
            userId: user.userId
          }
        }
      }
    });

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found or unauthorized' },
        { status: 404 }
      );
    }

    // Verify the new subcategory belongs to the user
    const newSubcategory = await prisma.subcategory.findFirst({
      where: {
        id: newSubcategoryId,
        category: {
          userId: user.userId
        }
      }
    });

    if (!newSubcategory) {
      return NextResponse.json(
        { error: 'Target subcategory not found or unauthorized' },
        { status: 404 }
      );
    }

    // Move the site
    const updatedSite = await prisma.site.update({
      where: { id: siteId },
      data: { subcategoryId: newSubcategoryId },
      include: {
        tags: true,
        subLinks: true,
        subcategory: {
          include: {
            category: true
          }
        }
      }
    });

    return NextResponse.json(updatedSite);
  } catch (error) {
    console.error('Error moving site:', error);
    return NextResponse.json(
      { error: 'Failed to move site' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Move site API is working' });
}