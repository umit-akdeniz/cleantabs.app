import { NextResponse } from 'next/server';
import { prisma } from './prisma';

export async function handleDatabaseError(error: any, operation: string) {
  console.error(`Database error in ${operation}:`, error);
  
  // Connection timeout hatası
  if (error.message?.includes('timeout') || error.message?.includes('connection')) {
    return NextResponse.json(
      { error: 'Database connection timeout. Please try again.' },
      { status: 503 }
    );
  }
  
  // Prisma hatası
  if (error.code?.startsWith('P')) {
    return NextResponse.json(
      { error: 'Database error occurred. Please try again.' },
      { status: 500 }
    );
  }
  
  // Genel hata
  return NextResponse.json(
    { error: 'An error occurred. Please try again.' },
    { status: 500 }
  );
}

export async function withDatabaseRetry<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = 3
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`${operationName} failed (attempt ${i + 1}/${maxRetries}):`, error);
      
      if (i < maxRetries - 1) {
        // Progressive delay
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  
  throw lastError;
}

export async function ensureJson(response: Response): Promise<any> {
  const text = await response.text();
  
  if (!text) {
    throw new Error('Empty response');
  }
  
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('JSON parse error:', error);
    console.error('Response text:', text);
    throw new Error('Invalid JSON response');
  }
}