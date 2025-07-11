// Google Analytics 4 implementation
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics
export const initializeGA = () => {
  if (!GA_MEASUREMENT_ID) return;
  
  // Load Google Analytics script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize gtag
  window.gtag = window.gtag || function(...args) {
    (window.gtag as any).q = (window.gtag as any).q || [];
    (window.gtag as any).q.push(args);
  };
  
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Track page views
export const trackPageView = (url: string, title: string) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: title,
    page_location: url,
  });
};

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;
  
  window.gtag('event', eventName, parameters);
};

// Track conversion events
export const trackConversion = (conversionId: string, value?: number, currency?: string) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;
  
  window.gtag('event', 'conversion', {
    send_to: conversionId,
    value: value,
    currency: currency || 'USD',
  });
};

// Track search events
export const trackSiteSearch = (searchTerm: string, category?: string, resultsCount?: number) => {
  trackEvent('search', {
    search_term: searchTerm,
    content_category: category,
    custom_results_count: resultsCount,
  });
};

// Track user engagement
export const trackUserEngagement = (action: string, category: string, label?: string) => {
  trackEvent('user_engagement', {
    engagement_time_msec: Date.now(),
    custom_parameter_1: action,
    custom_parameter_2: category,
    custom_parameter_3: label,
  });
};

// Track feature usage
export const trackFeatureUsage = (featureName: string, action: string, value?: number) => {
  trackEvent('feature_usage', {
    feature_name: featureName,
    action: action,
    value: value,
  });
};

// Track bookmark actions
export const trackBookmarkAction = (action: 'add' | 'delete' | 'edit' | 'import' | 'export' | 'search', count?: number) => {
  trackEvent('bookmark_action', {
    action: action,
    bookmark_count: count,
  });
};

// Track subscription events
export const trackSubscription = (planType: 'free' | 'premium', action: 'upgrade' | 'downgrade' | 'cancel') => {
  trackEvent('subscription', {
    plan_type: planType,
    action: action,
  });
};

// Enhanced E-commerce tracking
export const trackPurchase = (transactionId: string, value: number, currency: string, items: any[]) => {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: items,
  });
};

// Track user journey
export const trackUserJourney = (step: string, category: string, details?: Record<string, any>) => {
  trackEvent('user_journey', {
    step: step,
    category: category,
    ...details,
  });
};

// Track performance metrics
export const trackPerformance = (metric: string, value: number, unit: string) => {
  trackEvent('performance_metric', {
    metric_name: metric,
    metric_value: value,
    metric_unit: unit,
  });
};

// Track error events
export const trackError = (errorType: string, errorMessage: string, location?: string) => {
  trackEvent('error', {
    error_type: errorType,
    error_message: errorMessage,
    error_location: location,
  });
};

// Track social sharing
export const trackSocialShare = (platform: string, contentType: string, contentId?: string) => {
  trackEvent('share', {
    method: platform,
    content_type: contentType,
    content_id: contentId,
  });
};

// Track help and support usage
export const trackHelpUsage = (section: string, action: string, query?: string) => {
  trackEvent('help_usage', {
    help_section: section,
    help_action: action,
    search_query: query,
  });
};

// Track mobile app promotion
export const trackAppPromotion = (action: string, platform: string) => {
  trackEvent('app_promotion', {
    action: action,
    platform: platform,
  });
};

// Initialize on page load
if (typeof window !== 'undefined') {
  initializeGA();
}