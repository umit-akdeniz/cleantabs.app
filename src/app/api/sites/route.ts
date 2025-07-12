import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateId } from '@/lib/utils';
import { MiddlewareUtils } from '@/lib/auth/middleware-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await MiddlewareUtils.getAuthenticatedUser(request);
    
    if (!user) {
      return MiddlewareUtils.unauthorizedResponse();
    }

    const sites = await prisma.site.findMany({
      where: {
        subcategory: {
          category: {
            userId: user.userId
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
    const transformedSites = Array.isArray(sites) ? sites.map(site => ({
      id: site.id,
      name: site.name,
      url: site.url,
      description: site.description,
      color: site.color,
      favicon: site.favicon,
      personalNotes: site.personalNotes,
      customInitials: site.customInitials,
      lastChecked: site.lastChecked?.toISOString(),
      tags: Array.isArray(site.tags) ? site.tags.map(tag => tag.name) : [],
      reminderEnabled: site.reminderEnabled,
      categoryId: site.subcategory.category.id,
      subcategoryId: site.subcategoryId,
      subLinks: Array.isArray(site.subLinks) ? site.subLinks.map(link => ({
        name: link.name,
        url: link.url
      })) : []
    })) : [];

    return NextResponse.json(transformedSites);
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await MiddlewareUtils.getAuthenticatedUser(request);
    
    if (!user) {
      return MiddlewareUtils.unauthorizedResponse();
    }

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