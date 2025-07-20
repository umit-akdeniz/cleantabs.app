import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/simple-auth';
import { CreateCategorySchema } from '@/schemas/category';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

  // Skip cache completely for debugging
  console.log('🔍 Getting categories for user:', user.userId);

  const categories = await prisma.category.findMany({
    where: { userId: user.userId },
    include: {
      subcategories: {
        include: {
          sites: {
            include: {
              tags: true,
              subLinks: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  // Transform data to match the expected format with safe property access
  const transformedCategories = Array.isArray(categories) ? categories.filter(category => category && category.name).map(category => ({
    id: category.id || '',
    name: category.name || 'Unnamed Category',
    icon: category.icon || 'Folder',
    subcategories: Array.isArray(category.subcategories) ? category.subcategories.filter(sub => sub && sub.name).map(sub => ({
      id: sub.id || '',
      name: sub.name || 'Unnamed Subcategory',
      icon: sub.icon || 'Folder',
      items: Array.isArray(sub.sites) ? sub.sites.filter(site => site && site.name).map(site => ({
        id: site.id || '',
        name: site.name || 'Unnamed Site',
        url: site.url || '',
        description: site.description,
        color: site.color,
        favicon: site.favicon,
        personalNotes: site.personalNotes,
        tags: Array.isArray(site.tags) ? site.tags.map(tag => tag.name) : [],
        reminderEnabled: site.reminderEnabled,
        categoryId: category.id,
        subcategoryId: sub.id,
        subLinks: Array.isArray(site.subLinks) ? site.subLinks.map(link => ({
          name: link.name,
          url: link.url
        })) : []
      })) : []
    })) : []
  })) : [];

  console.log('📊 Returning categories:', transformedCategories.length);

  return NextResponse.json(transformedCategories);
  
  } catch (error) {
    console.error('Categories GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 });
  }
}

// Schema is imported from /schemas/category.ts

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
    const { name, icon } = CreateCategorySchema.parse(body);

    const category = await prisma.category.create({
      data: {
        name,
        icon: icon || 'Folder',
        userId: user.userId
      },
      include: {
        subcategories: true
      }
    });

    console.log('✅ Category created successfully');

    return NextResponse.json(category, { status: 201 });
    
  } catch (error) {
    console.error('Categories POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 });
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
    const categoryId = searchParams.get('id');
    
    if (!categoryId) {
      return NextResponse.json({
        success: false,
        error: 'Category ID is required'
      }, { status: 400 });
    }

    // Verify ownership before deletion
    const category = await prisma.category.findFirst({
      where: { 
        id: categoryId,
        userId: user.userId 
      }
    });

    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }

    await prisma.category.delete({
      where: { id: categoryId }
    });

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Categories DELETE error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 });
  }
}