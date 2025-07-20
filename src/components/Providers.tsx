'use client'

import { SessionProvider } from 'next-auth/react'
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/lib/auth/context';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SessionProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </SessionProvider>
    </QueryProvider>
  );
}