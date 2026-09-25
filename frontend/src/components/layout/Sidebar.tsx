'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  Home,
  LayoutDashboard,
  Pill,
  Stethoscope,
  Sparkles,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, openAuthModal } = useAuth();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'User Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Symptom Checker', href: '/symptom-checker', icon: Sparkles, badge: 'AI' },
    { name: 'Medicines', href: '/medicines', icon: Pill },
    { name: 'Diseases', href: '/diseases', icon: Stethoscope },
    { name: 'Analysis History', href: '/history', icon: History },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-[76px]' : 'w-[260px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Branding Section */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  Medi<span className="text-teal-500">Assist</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  Healthcare AI
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Button */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Navigation Links */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Main Menu
            </div>
          )}

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold border border-teal-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                {!collapsed && (
                  <span className="truncate flex-1 flex items-center justify-between">
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-300 border border-teal-500/30">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Profile & Theme Controls */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          {/* User Snippet */}
          {user ? (
            <div
              className={`flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>

              {!collapsed && (
                <div className="flex-1 truncate">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                </div>
              )}

              {!collapsed && (
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                onCloseMobile();
                openAuthModal('login');
              }}
              className={`w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm ${
                collapsed ? 'p-2' : ''
              }`}
            >
              <LogOut className="w-3.5 h-3.5 rotate-180" />
              {!collapsed && <span>Sign In</span>}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
