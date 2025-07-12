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

    const { name } = await request.json();
    const params = await context.params;
    const subcategoryId = params.id;

    if (!name || !subcategoryId) {
      return NextResponse.json(
        { error: 'Name and subcategory ID are required' },
        { status: 400 }
      );
    }

    // Verify the user owns this subcategory (through category)
    const existingSubcategory = await prisma.subcategory.findUnique({
      where: { id: subcategoryId },
      include: {
        category: true
      }
    });

    if (!existingSubcategory || existingSubcategory.category.userId !== user.userId) {
      return NextResponse.json(
        { error: 'Subcategory not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update the subcategory
    const updatedSubcategory = await prisma.subcategory.update({
      where: { id: subcategoryId },
      data: { name: name.trim() }
    });

    return NextResponse.json(updatedSubcategory);

  } catch (error) {
    console.error('Error updating subcategory:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}