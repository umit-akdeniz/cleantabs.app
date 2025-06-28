// Utility functions for the application

export function generateId(prefix: string = ''): string {
  if (typeof window !== 'undefined') {
    // Client-side: use crypto.randomUUID if available, fallback to timestamp + random
    if (crypto?.randomUUID) {
      return prefix ? `${prefix}-${crypto.randomUUID()}` : crypto.randomUUID();
    }
    return prefix ? `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  } else {
    // Server-side: use Node.js crypto
    const crypto = require('crypto');
    return prefix ? `${prefix}-${crypto.randomUUID()}` : crypto.randomUUID();
  }
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}