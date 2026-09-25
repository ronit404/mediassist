'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Bell } from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import UserMenu from '@/components/layout/UserMenu';

interface HeaderProps {
  onOpenMobile: () => void;
}

export default function Header({ onOpenMobile }: HeaderProps) {
  const pathname = usePathname();

  // Determine Title based on active route
  const getPageTitle = () => {
    if (pathname === '/') return 'Overview Hub';
    if (pathname === '/dashboard') return 'User Health Dashboard';
    if (pathname === '/symptom-checker') return 'AI Symptom Checker';
    if (pathname === '/analysis-results') return 'Triage Assessment Results';
    if (pathname === '/medicines') return 'Medicine Explorer';
    if (pathname.startsWith('/medicines/')) return 'Pharmaceutical Monograph';
    if (pathname === '/diseases') return 'Disease Explorer';
    if (pathname.startsWith('/diseases/')) return 'Clinical Condition Profile';
    if (pathname === '/history') return 'Analysis History';
    if (pathname === '/settings') return 'Settings & Theme';
    if (pathname === '/profile') return 'Account Profile';
    if (pathname === '/about') return 'Platform Architecture';
    if (pathname === '/contact') return 'Contact & Support';
    return 'MediAssist';
  };

  return (
    <header className="sticky top-0 z-30 glass-header px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Title */}
        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Action Icons: Notification, Theme, User Menu */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-teal-500 absolute top-1.5 right-1.5" />
        </button>

        <ThemeToggle />

        <div className="pl-1 border-l border-slate-200 dark:border-slate-800">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
