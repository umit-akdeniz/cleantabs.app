import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/simple-auth';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const sites = await prisma.site.findMany({
      where: {
        subcategory: {
          category: {
            userId: (await user)?.userId
          }
        }
      },
      include: {
        tags: true,
        subLinks: true,
        subcategory: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data to match expected format
    const transformedSites = sites.map(site => ({
      id: site.id,
      name: site.name || 'Unnamed Site',
      url: site.url || '',
      description: site.description,
      color: site.color,
      favicon: site.favicon,
      personalNotes: site.personalNotes,
      customInitials: site.customInitials,
      reminderEnabled: site.reminderEnabled,
      tags: site.tags.map(tag => tag.name),
      categoryId: site.subcategory.category.id,
      subcategoryId: site.subcategoryId,
      subLinks: site.subLinks.map(link => ({
        name: link.name,
        url: link.url
      }))
    }));

    return NextResponse.json(transformedSites);
    
  } catch (error) {
    console.error('Sites GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const body = await request.json();
    const { name, url, description, color, subcategoryId, tags = [], subLinks = [] } = body;

    // Verify subcategory ownership
    const subcategory = await prisma.subcategory.findFirst({
      where: {
        id: subcategoryId,
        category: {
          userId: (await user)?.userId
        }
      }
    });

    if (!subcategory) {
      return NextResponse.json({
        success: false,
        error: 'Subcategory not found'
      }, { status: 404 });
    }

    const site = await prisma.site.create({
      data: {
        name: name || 'Unnamed Site',
        url: url || '',
        description,
        color,
        subcategoryId,
        tags: {
          create: tags.map((tag: string) => ({ name: tag }))
        },
        subLinks: {
          create: subLinks.map((link: any) => ({
            name: link.name,
            url: link.url
          }))
        }
      },
      include: {
        tags: true,
        subLinks: true
      }
    });

    return NextResponse.json(site, { status: 201 });
    
  } catch (error) {
    console.error('Sites POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 });
  }
}