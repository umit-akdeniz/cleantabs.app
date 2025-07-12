import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MiddlewareUtils } from '@/lib/auth/middleware-utils';

export async function GET(request: NextRequest) {
  try {
    console.log('Admin users API called');
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    const user = await MiddlewareUtils.getAuthenticatedUser(request);
    
    if (!user) {
      return MiddlewareUtils.unauthorizedResponse();
    }
    
    if (!MiddlewareUtils.isAdmin(user)) {
      return MiddlewareUtils.forbiddenResponse('Admin access required');
    }
    
    console.log('Admin user verified, fetching users...');

    // Test database connection first
    await prisma.$connect();
    console.log('Database connected successfully');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: {
            categories: true,
            sessions: true
          }
        },
        categories: {
          select: {
            subcategories: {
              select: {
                sites: {
                  select: {
                    id: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Users fetched:', users.length);
    
    // Transform the data to match the expected format
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      _count: {
        categories: user._count.categories,
        sites: user.categories.reduce((total, category) => {
          return total + category.subcategories.reduce((subTotal, subcategory) => {
            return subTotal + subcategory.sites.length;
          }, 0);
        }, 0)
      }
    }));
    
    return NextResponse.json({ users: transformedUsers });
  } catch (error) {
    console.error('Admin users fetch error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}