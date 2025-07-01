import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
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

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify the user owns this subcategory (through category)
    const existingSubcategory = await prisma.subcategory.findUnique({
      where: { id: subcategoryId },
      include: {
        category: true
      }
    });

    if (!existingSubcategory || existingSubcategory.category.userId !== user.id) {
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