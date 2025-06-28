import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const { subcategoryId, targetCategoryId } = await request.json();

    if (!subcategoryId || !targetCategoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if subcategory and target category exist
    const subcategory = await prisma.subcategory.findUnique({
      where: { id: subcategoryId }
    });

    const targetCategory = await prisma.category.findUnique({
      where: { id: targetCategoryId }
    });

    if (!subcategory || !targetCategory) {
      return NextResponse.json({ error: 'Subcategory or target category not found' }, { status: 404 });
    }

    // Update the subcategory's category
    const updatedSubcategory = await prisma.subcategory.update({
      where: { id: subcategoryId },
      data: { categoryId: targetCategoryId },
      include: {
        category: true
      }
    });

    return NextResponse.json(updatedSubcategory);
  } catch (error) {
    console.error('Error moving subcategory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}