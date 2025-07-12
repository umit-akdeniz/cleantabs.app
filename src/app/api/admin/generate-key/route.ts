import { NextRequest, NextResponse } from 'next/server';
import { generateAdminKey } from '@/lib/admin-keygen';
import { MiddlewareUtils } from '@/lib/auth/middleware-utils';

export async function POST(request: NextRequest) {
  try {
    const user = await MiddlewareUtils.getAuthenticatedUser(request);
    
    if (!user || !MiddlewareUtils.isAdmin(user)) {
      return MiddlewareUtils.forbiddenResponse('Admin access required');
    }

    // Yeni admin key oluştur
    const adminKey = generateAdminKey();
    
    return NextResponse.json({ 
      success: true, 
      adminKey,
      message: 'Admin access key generated successfully'
    });
    
  } catch (error) {
    console.error('Admin key generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}