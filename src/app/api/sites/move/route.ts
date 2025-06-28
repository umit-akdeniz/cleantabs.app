import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  let siteId: string | undefined;
  let targetSubcategoryId: string | undefined;
  
  try {
    const body = await request.json();
    siteId = body.siteId;
    targetSubcategoryId = body.targetSubcategoryId;
    console.log('Move site request:', { siteId, targetSubcategoryId });

    if (!siteId || !targetSubcategoryId) {
      console.log('Missing fields:', { siteId, targetSubcategoryId });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if site and target subcategory exist
    const site = await prisma.site.findUnique({
      where: { id: siteId }
    });

    const targetSubcategory = await prisma.subcategory.findUnique({
      where: { id: targetSubcategoryId },
      include: {
        category: true
      }
    });

    if (!site || !targetSubcategory) {
      console.log('Site or target subcategory not found:', { 
        siteFound: !!site, 
        targetSubcategoryFound: !!targetSubcategory,
        siteId,
        targetSubcategoryId 
      });
      return NextResponse.json({ error: 'Site or target subcategory not found' }, { status: 404 });
    }

    // Update the site's subcategory
    const updatedSite = await prisma.site.update({
      where: { id: siteId },
      data: { 
        subcategoryId: targetSubcategoryId
      },
      include: {
        subLinks: true
      }
    });

    console.log('Site moved successfully:', { siteId, targetSubcategoryId, updatedSite: updatedSite.id });
    return NextResponse.json(updatedSite);
  } catch (error) {
    console.log('Error moving site:', error);
    console.log('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      siteId,
      targetSubcategoryId
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Test endpoint
export async function GET() {
  return NextResponse.json({ message: 'Move API is working', timestamp: new Date().toISOString() });
}