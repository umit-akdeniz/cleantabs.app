'use client';

import { useCallback } from 'react';
import { showToast } from '@/components/Toast';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  customMessage?: string;
  onError?: (error: Error) => void;
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: unknown, 
    context: string = 'Operation',
    options: ErrorHandlerOptions = {}
  ) => {
    const { 
      showToast: shouldShowToast = true, 
      customMessage, 
      onError 
    } = options;

    // Normalize error to Error object
    let errorObj: Error;
    if (error instanceof Error) {
      errorObj = error;
    } else if (typeof error === 'string') {
      errorObj = new Error(error);
    } else {
      errorObj = new Error('An unknown error occurred');
    }

    // Log error for debugging
    console.error(`${context} Error:`, errorObj);

    // Call custom error handler if provided
    if (onError) {
      onError(errorObj);
    }

    // Show toast notification
    if (shouldShowToast) {
      const message = customMessage || getErrorMessage(errorObj, context);
      showToast({
        type: 'error',
        title: 'Error',
        message
      });
    }

    // In production, you might want to send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(errorObj, { tags: { context } });
    }

    return errorObj;
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context: string = 'Async Operation',
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, context, options);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
};

// Helper function to get user-friendly error messages
function getErrorMessage(error: Error, context: string): string {
  const message = error.message.toLowerCase();

  // Network errors
  if (message.includes('fetch') || message.includes('network')) {
    return 'Network error. Please check your internet connection and try again.';
  }

  // Authentication errors
  if (message.includes('unauthorized') || message.includes('401')) {
    return 'Please log in again to continue.';
  }

  // Permission errors
  if (message.includes('forbidden') || message.includes('403')) {
    return 'You do not have permission to perform this action.';
  }

  // Not found errors
  if (message.includes('not found') || message.includes('404')) {
    return 'The requested resource was not found.';
  }

  // Server errors
  if (message.includes('500') || message.includes('server error')) {
    return 'Server error. Please try again later.';
  }

  // Validation errors
  if (message.includes('validation') || message.includes('invalid')) {
    return error.message; // Show the actual validation message
  }

  // Rate limiting
  if (message.includes('rate limit') || message.includes('429')) {
    return 'Too many requests. Please wait a moment and try again.';
  }

  // Default fallback
  return `${context} failed. Please try again.`;
}

// Error types for better error handling
export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(message: string = 'Validation error occurred') {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication error occurred') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Authorization error occurred') {
    super(message);
    this.name = 'AuthorizationError';
  }
}