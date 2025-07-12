import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MiddlewareUtils } from '@/lib/auth/middleware-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await MiddlewareUtils.getAuthenticatedUser(request);
    
    if (!user || !MiddlewareUtils.isAdmin(user)) {
      return MiddlewareUtils.forbiddenResponse('Admin access required');
    }

    const { id: userId } = await params;

    // Kullanıcının detaylı bilgilerini getir
    const userDetails = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        categories: {
          include: {
            subcategories: {
              include: {
                sites: true
              }
            }
          },
          orderBy: { name: 'asc' }
        },
        accounts: {
          select: {
            provider: true,
            type: true
          }
        },
        sessions: {
          select: {
            expires: true
          },
          orderBy: { expires: 'desc' },
          take: 5
        }
      }
    });

    if (!userDetails) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // İstatistikleri hesapla
    const stats = {
      totalCategories: userDetails.categories.length,
      totalSubcategories: userDetails.categories.reduce((acc, cat) => acc + cat.subcategories.length, 0),
      totalSites: userDetails.categories.reduce((acc, cat) => 
        acc + cat.subcategories.reduce((subAcc, sub) => subAcc + sub.sites.length, 0), 0
      ),
      lastLogin: userDetails.sessions[0]?.expires || null,
      accountProviders: userDetails.accounts.map(acc => acc.provider)
    };

    return NextResponse.json({ 
      success: true, 
      user: userDetails,
      stats
    });
    
  } catch (error) {
    console.error('User details fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}