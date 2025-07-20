// This file is executed when the server starts
// It initializes the reminder scheduler system

const initializeServices = async () => {
  try {
    console.log('🚀 Starting CleanTabs services...');
    
    // Wait a bit for the server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const adminSecret = process.env.ADMIN_SECRET || process.env.CRON_SECRET;
    
    if (!adminSecret) {
      console.warn('⚠️ No ADMIN_SECRET or CRON_SECRET found, skipping scheduler initialization');
      return;
    }
    
    console.log('🔄 Initializing reminder scheduler...');
    
    const response = await fetch(`${baseUrl}/api/scheduler/init`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminSecret}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Scheduler initialized successfully:', result.message);
      if (result.stats) {
        console.log('📊 Current reminder stats:', {
          due: result.stats.due,
          upcoming: result.stats.upcoming
        });
      }
    } else {
      const error = await response.text();
      console.error('❌ Failed to initialize scheduler:', response.status, error);
    }
    
  } catch (error) {
    console.error('❌ Error initializing services:', error);
  }
};

// Initialize services when this module is loaded
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_SCHEDULER === 'true') {
  initializeServices();
} else {
  console.log('⏸️ Scheduler initialization skipped (set ENABLE_SCHEDULER=true to enable)');
}

module.exports = { initializeServices };