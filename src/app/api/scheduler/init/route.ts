import { NextRequest, NextResponse } from 'next/server';
import { initializeScheduler, getReminderStats } from '@/lib/scheduler';

let isInitialized = false;

export async function POST(request: NextRequest) {
  try {
    // Check for admin API key
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET || process.env.CRON_SECRET;
    
    if (!authHeader || !adminSecret || authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    if (isInitialized) {
      const stats = await getReminderStats();
      return NextResponse.json({
        success: true,
        message: 'Scheduler already initialized',
        stats
      });
    }

    // Initialize the scheduler
    initializeScheduler();
    isInitialized = true;

    const stats = await getReminderStats();

    return NextResponse.json({
      success: true,
      message: 'Scheduler initialized successfully',
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Scheduler initialization error:', error);
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
      initialized: isInitialized,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Scheduler status error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}