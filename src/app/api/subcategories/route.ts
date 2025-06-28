import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateId } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const { name, categoryId, icon = 'Folder' } = await request.json();
    
    if (!name || !categoryId) {
      return NextResponse.json(
        { error: 'Name and category ID are required' },
        { status: 400 }
      );
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        id: generateId('sub'),
        name,
        icon,
        categoryId
      }
    });

    return NextResponse.json(subcategory);
  } catch (error) {
    console.error('Error creating subcategory:', error);
    return NextResponse.json(
      { error: 'Failed to create subcategory' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subcategoryId = searchParams.get('id');
    
    if (!subcategoryId) {
      return NextResponse.json(
        { error: 'Subcategory ID is required' },
        { status: 400 }
      );
    }

    await prisma.subcategory.delete({
      where: { id: subcategoryId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    return NextResponse.json(
      { error: 'Failed to delete subcategory' },
      { status: 500 }
    );
  }
}