import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/simple-auth';
import { CreateSubcategorySchema } from '@/schemas/subcategory';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const subcategories = await prisma.subcategory.findMany({
      where: {
        category: {
          userId: user.userId
        }
      },
      include: {
        category: true,
        sites: true
      }
    });

    return NextResponse.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subcategories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const body = await request.json();
    const { name, categoryId, icon } = CreateSubcategorySchema.parse(body);

    // Verify category ownership
    const category = await prisma.category.findFirst({
      where: { 
        id: categoryId,
        userId: user.userId 
      }
    });

    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category not found or unauthorized'
      }, { status: 404 });
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        name,
        icon: icon || 'Folder',
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

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

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