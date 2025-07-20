import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function getAuthUser(request: NextRequest) {
  // First try custom headers (for middleware)
  const userId = request.headers.get('x-user-id');
  const email = request.headers.get('x-user-email');
  const plan = request.headers.get('x-user-plan');

  if (userId && email) {
    return {
      userId,
      email,
      plan: plan || 'FREE'
    };
  }

  // Then try Authorization header with simple tokens
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
    
    // Handle simple tokens (format: simple_token_{userId}_{timestamp})
    if (token.startsWith('simple_token_')) {
      const tokenParts = token.split('_');
      if (tokenParts.length >= 3) {
        const tokenUserId = tokenParts[2];
        
        try {
          // Verify user exists in database
          const user = await prisma.user.findUnique({
            where: { id: tokenUserId },
            select: {
              id: true,
              email: true,
              plan: true
            }
          });
          
          if (user) {
            return {
              userId: user.id,
              email: user.email,
              plan: user.plan || 'FREE'
            };
          }
        } catch (error) {
          console.error('Error verifying simple token:', error);
        }
      }
    }
  }

  return null;
}