import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { generateId } from '@/lib/utils';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const sites = await prisma.site.findMany({
      where: {
        subcategory: {
          category: {
            userId: user.id
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
        createdAt: 'asc'
      }
    });

    // Transform data to match the expected format
    const transformedSites = sites.map(site => ({
      id: site.id,
      name: site.name,
      url: site.url,
      description: site.description,
      color: site.color,
      favicon: site.favicon,
      personalNotes: site.personalNotes,
      customInitials: site.customInitials,
      lastChecked: site.lastChecked?.toISOString(),
      tags: site.tags.map(tag => tag.name),
      reminderEnabled: site.reminderEnabled,
      categoryId: site.subcategory.category.id,
      subcategoryId: site.subcategoryId,
      subLinks: site.subLinks.map(link => ({
        name: link.name,
        url: link.url
      }))
    }));

    return NextResponse.json(transformedSites);
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, url, description, color, favicon, personalNotes, customInitials, tags, reminderEnabled, subcategoryId, subLinks } = body;

    const site = await prisma.site.create({
      data: {
        name,
        url,
        description,
        color,
        favicon,
        personalNotes,
        customInitials,
        reminderEnabled,
        subcategoryId,
        tags: {
          create: tags?.map((tag: string) => ({ name: tag })) || []
        },
        subLinks: {
          create: subLinks?.map((link: { name: string; url: string }) => ({
            name: link.name,
            url: link.url
          })) || []
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
      }
    });

    // Transform response
    const transformedSite = {
      id: site.id,
      name: site.name,
      url: site.url,
      description: site.description,
      color: site.color,
      favicon: site.favicon,
      personalNotes: site.personalNotes,
      customInitials: site.customInitials,
      lastChecked: site.lastChecked?.toISOString(),
      tags: site.tags.map(tag => tag.name),
      reminderEnabled: site.reminderEnabled,
      categoryId: site.subcategory.category.id,
      subcategoryId: site.subcategoryId,
      subLinks: site.subLinks.map(link => ({
        name: link.name,
        url: link.url
      }))
    };

    return NextResponse.json(transformedSite);
  } catch (error) {
    console.error('Error creating site:', error);
    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    );
  }
}