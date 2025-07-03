'use client';

import { useEffect } from 'react';

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadResources = [
      { href: '/favicon.svg', as: 'image' },
      { href: '/icon-192x192.png', as: 'image' },
    ];

    preloadResources.forEach(({ href, as }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      document.head.appendChild(link);
    });

    // Optimize images with intersection observer
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img);
    });

    // Prefetch critical pages on hover
    const prefetchPages = ['/dashboard', '/auth/signin', '/auth/signup'];
    const linkElements = document.querySelectorAll('a[href]');
    
    linkElements.forEach((link) => {
      const href = (link as HTMLAnchorElement).href;
      const pathname = new URL(href, window.location.origin).pathname;
      
      if (prefetchPages.includes(pathname)) {
        link.addEventListener('mouseenter', () => {
          const prefetchLink = document.createElement('link');
          prefetchLink.rel = 'prefetch';
          prefetchLink.href = href;
          document.head.appendChild(prefetchLink);
        }, { once: true });
      }
    });

    // Cleanup
    return () => {
      imageObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    // Service Worker registration for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return null;
}