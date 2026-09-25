'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/about',
  '/contact',
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthModalOpen, openAuthModal } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Strict route protection guard: prompt modal on protected routes without re-triggering loops
  useEffect(() => {
    if (!mounted || isLoading) return;

    // Unauthenticated user trying to access a protected/restricted route
    if (!user && !isPublicRoute) {
      const currentFullUrl =
        typeof window !== 'undefined'
          ? window.location.pathname + window.location.search
          : pathname;
      
      if (!isAuthModalOpen) {
        openAuthModal('login', currentFullUrl);
      }
    }
  }, [mounted, isLoading, user, pathname, isPublicRoute, isAuthModalOpen, openAuthModal]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-sky-500/20 relative">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Page Workspace Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-22 pb-8">
        {children}
      </main>

      {/* Standard Minimal Professional Footer */}
      <Footer />

      {/* Global Authentication Modal Overlay */}
      <AuthModal />
    </div>
  );
}

