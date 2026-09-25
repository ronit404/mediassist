'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function SignupHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    if (user) {
      const destination =
        redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
          ? redirectParam
          : '/dashboard';
      router.replace(destination);
    } else {
      openAuthModal('signup', redirectParam || undefined);
      router.replace('/');
    }
  }, [user, redirectParam, router, openAuthModal]);

  return null;
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupHandler />
    </Suspense>
  );
}
