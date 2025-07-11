import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('Admin users API called');
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    const session = await getServerSession(authOptions);
    console.log('Session in admin API:', JSON.stringify(session, null, 2));
    
    if (!session?.user?.email) {
      console.log('No session or email found');
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }
    
    if (session.user.email !== 'umitakdenizjob@gmail.com') {
      console.log('User not admin:', session.user.email);
      return NextResponse.json({ error: 'Not admin user' }, { status: 403 });
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