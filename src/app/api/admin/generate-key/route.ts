import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateAdminKey } from '@/lib/admin-keygen';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Admin email kontrolü
    if (!session || session.user?.email !== 'umitakdenizjob@gmail.com') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
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