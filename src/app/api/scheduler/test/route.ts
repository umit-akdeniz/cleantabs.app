import { NextRequest, NextResponse } from 'next/server';
import { triggerManualReminderCheck, getReminderStats } from '@/lib/scheduler';

export async function POST(request: NextRequest) {
  try {
    // Check for admin API key or development environment
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET || process.env.CRON_SECRET;
    
    if (!authHeader || !adminSecret || authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    console.log('🔧 Manual reminder check triggered via API');
    
    const result = await triggerManualReminderCheck();
    const stats = await getReminderStats();

    return NextResponse.json({
      success: true,
      message: 'Manual reminder check completed',
      result,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Manual reminder check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const stats = await getReminderStats();
    
    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Scheduler stats error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}