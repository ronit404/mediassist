'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { X, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

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

export default function AuthModal() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthModalOpen, authModalMode, setAuthModalMode, closeAuthModal } = useAuth();
  const modalContentRef = useRef<HTMLDivElement>(null);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  const handleClose = () => {
    closeAuthModal();
    // If the modal was dismissed on a protected route, safely return to home page
    if (!isPublicRoute) {
      router.push('/');
    }
  };

  // Close on Escape key press & prevent background scrolling when open
  useEffect(() => {
    if (!isAuthModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthModalOpen, isPublicRoute]);

  if (!isAuthModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* 1. Translucent Backdrop: Click outside to close */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 dark:bg-slate-950/75 backdrop-blur-md cursor-pointer z-0 transition-opacity"
        aria-hidden="true"
      />

      {/* 2. Centered Opaque Authentication Card */}
      <div
        ref={modalContentRef}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-lg bg-white dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 my-auto animate-in zoom-in-95 duration-200 text-slate-900 dark:text-white pointer-events-auto"
      >
        {/* Ambient Top Glow Highlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-sky-500/10 via-teal-500/5 to-transparent blur-2xl pointer-events-none" />

        {/* Close Button 'X' */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-30 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand & Title Header */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center shadow-md shadow-sky-500/20">
              <Activity className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                Medi<span className="text-teal-500">Assist</span>
              </span>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                Secure Access
              </span>
            </div>
          </div>

          <div>
            <h2 id="auth-modal-title" className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {authModalMode === 'login' && 'Welcome Back'}
              {authModalMode === 'signup' && 'Create Your Account'}
              {authModalMode === 'forgot-password' && 'Password Recovery'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {authModalMode === 'login' && 'Sign in to access your personal health tools, AI checks, and records.'}
              {authModalMode === 'signup' && 'Join MediAssist to access clinical decision-support and medication insights.'}
              {authModalMode === 'forgot-password' && 'Enter your registered email to receive reset instructions.'}
            </p>
          </div>

          {/* Mode Switcher Tabs (Login vs Signup) */}
          {authModalMode !== 'forgot-password' && (
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 mt-2 relative z-20">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAuthModalMode('login');
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authModalMode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAuthModalMode('signup');
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authModalMode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Modal Body Forms */}
        <div className="relative z-10">
          {authModalMode === 'login' && (
            <LoginForm
              onSuccess={handleClose}
              onSwitchToSignup={() => setAuthModalMode('signup')}
              onSwitchToForgotPassword={() => setAuthModalMode('forgot-password')}
            />
          )}

          {authModalMode === 'signup' && (
            <SignupForm
              onSuccess={handleClose}
              onSwitchToLogin={() => setAuthModalMode('login')}
            />
          )}

          {authModalMode === 'forgot-password' && (
            <ForgotPasswordForm
              onSwitchToLogin={() => setAuthModalMode('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
