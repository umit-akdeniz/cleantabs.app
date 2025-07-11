import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Admin email kontrolü
    if (!session || session.user?.email !== 'umitakdenizjob@gmail.com') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
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