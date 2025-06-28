import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateId } from '@/lib/utils';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
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

    // Transform data to match the expected format
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      subcategories: category.subcategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        icon: sub.icon,
        items: sub.sites.map(site => ({
          id: site.id,
          name: site.name,
          url: site.url,
          description: site.description,
          color: site.color,
          favicon: site.favicon,
          personalNotes: site.personalNotes,
          tags: site.tags.map(tag => tag.name),
          reminderEnabled: site.reminderEnabled,
          categoryId: category.id,
          subcategoryId: sub.id,
          subLinks: site.subLinks.map(link => ({
            name: link.name,
            url: link.url
          }))
        }))
      }))
    }));

    return NextResponse.json(transformedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, icon = 'Folder' } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        id: generateId('cat'),
        name,
        icon
      },
      include: {
        subcategories: true
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');
    
    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: categoryId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}