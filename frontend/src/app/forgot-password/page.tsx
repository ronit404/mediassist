'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function ForgotPasswordHandler() {
  const router = useRouter();
  const { openAuthModal } = useAuth();

  useEffect(() => {
    openAuthModal('forgot-password');
    router.replace('/');
  }, [router, openAuthModal]);

  return null;
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordHandler />
    </Suspense>
  );
}
