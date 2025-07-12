import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MiddlewareUtils } from '@/lib/auth/middleware-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await MiddlewareUtils.getAuthenticatedUser(request);
    
    if (!user || !MiddlewareUtils.isAdmin(user)) {
      return MiddlewareUtils.forbiddenResponse('Admin access required');
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