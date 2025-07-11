'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SessionValidatorProps {
  children: React.ReactNode;
}

export default function SessionValidator({ children }: SessionValidatorProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    // Session yoksa veya geçersizse
    if (status === 'unauthenticated' || !session) {
      return;
    }

    // Session var ama user bilgileri eksikse
    if (session && (!session.user || !session.user.email)) {
      console.log('Invalid session detected, signing out and clearing storage');
      
      // localStorage'ı temizle
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      signOut({
        callbackUrl: '/auth/signin',
        redirect: true
      });
      return;
    }

  }, [session, status, router]);

  return <>{children}</>;
}