import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JWTManager } from '@/lib/auth/jwt';

export async function getAuthUser(request: NextRequest) {
  // First try custom headers (for middleware)
  const userId = request.headers.get('x-user-id');
  const email = request.headers.get('x-user-email');
  const plan = request.headers.get('x-user-plan');

  if (userId && email) {
    return {
      userId,
      email,
      plan: plan || 'FREE',
      isPremium: plan === 'PREMIUM'
    };
  }

  // Then try Authorization header with JWT tokens
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
    
    // First try JWT tokens
    const jwtPayload = JWTManager.verifyAccessToken(token);
    if (jwtPayload) {
      return {
        userId: jwtPayload.userId,
        email: jwtPayload.email,
        plan: jwtPayload.plan || 'FREE',
        isPremium: jwtPayload.plan === 'PREMIUM'
      };
    }
    
    // Fall back to simple tokens (format: simple_token_{userId}_{timestamp})
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
              plan: user.plan || 'FREE',
              isPremium: user.plan === 'PREMIUM'
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