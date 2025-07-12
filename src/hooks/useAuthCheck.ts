'use client';

import { useAuth } from '@/lib/auth/context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthCheck() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // User yoksa veya geçersizse
    if (!isAuthenticated || !user) {
      return;
    }

    // User var ama bilgileri eksikse çıkış yap
    if (user && !user.email) {
      console.log('Invalid user detected, logging out');
      logout();
      return;
    }

  }, [user, isAuthenticated, isLoading, logout, router]);

  return { user, isAuthenticated, isLoading };
}