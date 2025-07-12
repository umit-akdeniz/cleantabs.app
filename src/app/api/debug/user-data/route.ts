import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        createdAt: true,
        categories: {
          include: {
            subcategories: {
              include: {
                sites: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        categoriesCount: user.categories.length,
        categories: user.categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          subcategoriesCount: cat.subcategories.length,
          subcategories: cat.subcategories.map(sub => ({
            id: sub.id,
            name: sub.name,
            sitesCount: sub.sites.length
          }))
        }))
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}