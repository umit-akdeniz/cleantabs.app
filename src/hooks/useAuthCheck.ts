'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthCheck() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    // Session yoksa veya geçersizse çıkış yap
    if (status === 'unauthenticated' || !session) {
      return;
    }

    // Session var ama user bilgileri eksikse çıkış yap
    if (session && (!session.user || !session.user.email)) {
      console.log('Invalid session detected, signing out');
      signOut({
        callbackUrl: '/auth/signin',
        redirect: true
      });
      return;
    }

  }, [session, status, router]);

  return { session, status };
}