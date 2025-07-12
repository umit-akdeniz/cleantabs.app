import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MiddlewareUtils } from '@/lib/auth/middleware-utils';

export async function PUT(request: NextRequest) {
  try {
    const user = await MiddlewareUtils.getAuthenticatedUser(request);
    
    if (!user) {
      return MiddlewareUtils.unauthorizedResponse();
    }

    const { subcategoryId, newCategoryId } = await request.json();

    if (!subcategoryId || !newCategoryId) {
      return NextResponse.json(
        { error: 'Subcategory ID and new category ID are required' },
        { status: 400 }
      );
    }

    // Verify the subcategory belongs to the user
    const subcategory = await prisma.subcategory.findFirst({
      where: {
        id: subcategoryId,
        category: {
          userId: user.userId
        }
      }
    });

    if (!subcategory) {
      return NextResponse.json(
        { error: 'Subcategory not found or unauthorized' },
        { status: 404 }
      );
    }

    // Verify the new category belongs to the user
    const newCategory = await prisma.category.findFirst({
      where: {
        id: newCategoryId,
        userId: user.userId
      }
    });

    if (!newCategory) {
      return NextResponse.json(
        { error: 'Target category not found or unauthorized' },
        { status: 404 }
      );
    }

    // Move the subcategory
    const updatedSubcategory = await prisma.subcategory.update({
      where: { id: subcategoryId },
      data: { categoryId: newCategoryId },
      include: {
        sites: true,
        category: true
      }
    });

    return NextResponse.json(updatedSubcategory);
  } catch (error) {
    console.error('Error moving subcategory:', error);
    return NextResponse.json(
      { error: 'Failed to move subcategory' },
      { status: 500 }
    );
  }
}