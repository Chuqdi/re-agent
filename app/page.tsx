'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import LoginPage from '@/components/LoginPage';

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Only redirect if user exists AND NOT going to a mylocation route
      const isMyLocationRoute = pathname.startsWith('/dashboard/mylocation');

      if (user && !isMyLocationRoute) {
        router.replace('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  return <LoginPage />;
}
