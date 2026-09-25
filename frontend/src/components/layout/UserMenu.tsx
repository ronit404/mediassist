'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User as UserIcon, History, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function UserMenu() {
  const { user, logout, openAuthModal } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => openAuthModal('login')}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => openAuthModal('signup')}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 shadow-md shadow-sky-600/20 hover:shadow-sky-600/30 transition-all"
        >
          Get Started
        </button>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    router.push('/');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:border-slate-800 transition-colors"
        aria-label="User account menu"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="hidden lg:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[110px]">
            {user.name}
          </span>
          <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider">
            Patient
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 text-xs">
          {/* User Info Header */}
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
            <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              Personal Health Account
            </span>
          </div>

          {/* Links */}
          <div className="space-y-0.5">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
            >
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span>Profile Information</span>
            </Link>

            <Link
              href="/history"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
            >
              <History className="w-4 h-4 text-slate-400" />
              <span>Analysis History</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings & Theme</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-semibold transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
