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

    // User var ama bilgileri eksikse
    if (session?.user && !session.user.email) {
      console.log('Invalid user detected, logging out');
      signOut({ callbackUrl: '/auth/signin' });
      return;
    }

  }, [session, status, router]);

  return <>{children}</>;
}