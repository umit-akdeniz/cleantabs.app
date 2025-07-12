import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MiddlewareUtils } from '@/lib/auth/middleware-utils';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await MiddlewareUtils.getAuthenticatedUser(request);
    
    if (!user) {
      return MiddlewareUtils.unauthorizedResponse();
    }

    const { id } = await context.params;
    const body = await request.json();
    const { name, url, description, color, favicon, personalNotes, tags, reminderEnabled, subcategoryId, subLinks, lastChecked, customInitials } = body;

    // Delete existing tags and sublinks
    await prisma.tag.deleteMany({ where: { siteId: id } });
    await prisma.subLink.deleteMany({ where: { siteId: id } });

    // Update site with new data
    const site = await prisma.site.update({
      where: { id },
      data: {
        name,
        url,
        description,
        color,
        favicon,
        personalNotes,
        reminderEnabled,
        subcategoryId,
        lastChecked: lastChecked ? new Date(lastChecked) : undefined,
        customInitials,
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
      tags: site.tags.map(tag => tag.name),
      reminderEnabled: site.reminderEnabled,
      categoryId: site.subcategory.category.id,
      subcategoryId: site.subcategoryId,
      lastChecked: site.lastChecked?.toISOString(),
      customInitials: site.customInitials,
      subLinks: site.subLinks.map(link => ({
        name: link.name,
        url: link.url
      }))
    };

    return NextResponse.json(transformedSite);
  } catch (error) {
    console.error('Error updating site:', error);
    return NextResponse.json(
      { error: 'Failed to update site' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await MiddlewareUtils.getAuthenticatedUser(request);
    
    if (!user) {
      return MiddlewareUtils.unauthorizedResponse();
    }

    const { id } = await context.params;

    await prisma.site.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting site:', error);
    return NextResponse.json(
      { error: 'Failed to delete site' },
      { status: 500 }
    );
  }
}