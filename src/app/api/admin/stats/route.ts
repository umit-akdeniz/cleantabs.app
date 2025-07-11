import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || session.user.email !== 'umitakdenizjob@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [siteCount, categoryCount, subcategoryCount, reminderCount] = await Promise.all([
      prisma.site.count(),
      prisma.category.count(),
      prisma.subcategory.count(),
      prisma.reminder.count({
        where: {
          completed: false
        }
      })
    ]);

    const stats = {
      totalSites: siteCount,
      totalCategories: categoryCount,
      totalSubcategories: subcategoryCount,
      activeReminders: reminderCount
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Admin stats fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}