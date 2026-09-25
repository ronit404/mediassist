'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function RegisterHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const { openAuthModal } = useAuth();

  useEffect(() => {
    openAuthModal('signup', redirectParam || undefined);
    router.replace('/');
  }, [redirectParam, router, openAuthModal]);

  return null;
}

export default function RegisterRedirect() {
  return (
    <Suspense fallback={null}>
      <RegisterHandler />
    </Suspense>
  );
}
