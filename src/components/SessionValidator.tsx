'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { useRouter } from 'next/navigation';

interface SessionValidatorProps {
  children: React.ReactNode;
}

export default function SessionValidator({ children }: SessionValidatorProps) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // User yoksa veya geçersizse
    if (!user) {
      return;
    }

    // User var ama bilgileri eksikse
    if (user && !user.email) {
      console.log('Invalid user detected, logging out and clearing storage');
      
      // localStorage'ı temizle
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      logout();
      return;
    }

  }, [user, isLoading, logout, router]);

  return <>{children}</>;
}