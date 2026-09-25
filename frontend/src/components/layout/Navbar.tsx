'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Pill,
  Stethoscope,
  Menu,
  X,
  Brain,
  History,
  LayoutDashboard
} from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import UserMenu from '@/components/layout/UserMenu';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smart Hide / Show Navbar State
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  // Close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsVisible(true);
  }, [pathname]);

  // Smart scroll & top-edge mouse detection listeners
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Track if page is scrolled
      setIsScrolled(currentScrollY > 20);

      // Always show navbar at top of page or if mobile menu is open
      if (currentScrollY <= 20 || mobileMenuOpen) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Scrolling Down -> Hide Navbar smoothly
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsVisible(false);
      }
      // Scrolling Up -> Reveal Navbar
      else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    // Show navbar when mouse hovers at the top edge of the screen (within 35px)
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 35) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mobileMenuOpen]);

  // Standard patient/user navigation items
  const authNavLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Symptom Checker', href: '/symptom-checker', icon: Brain, badge: 'AI' },
    { name: 'Medicines', href: '/medicines', icon: Pill },
    { name: 'Diseases', href: '/diseases', icon: Stethoscope },
    { name: 'History', href: '/history', icon: History },
  ];

  return (
    <>
      {/* Invisible Top Edge Hover Trigger Zone (Active when navbar is hidden) */}
      <div
        onMouseEnter={() => setIsVisible(true)}
        className="fixed top-0 left-0 right-0 h-4 z-40 pointer-events-auto"
        aria-hidden="true"
      />

      <header
        onMouseEnter={() => setIsVisible(true)}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b ${
          isVisible
            ? 'translate-y-0 opacity-100 pointer-events-auto shadow-sm'
            : '-translate-y-full opacity-0 pointer-events-none'
        } ${
          isScrolled
            ? 'border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-sm'
            : 'border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo & Brand (Acts as Dynamic Home Route) */}
            <Link
              href={user ? '/dashboard' : '/'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 group cursor-pointer select-none"
              aria-label="MediAssist Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  Medi<span className="text-sky-600 dark:text-sky-400">Assist</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider -mt-1 hidden sm:block">
                  Healthcare Platform
                </span>
              </div>
            </Link>

            {/* ========================================================================= */}
            {/* 1. AUTHENTICATED STATE: TOP NAVIGATION LINKS */}
            {/* ========================================================================= */}
            {user && (
              <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                {authNavLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`relative px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'text-sky-600 dark:text-sky-400 bg-sky-500/10 font-bold border border-sky-500/20 shadow-sm'
                          : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                      <span>{link.name}</span>
                      {link.badge && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* ========================================================================= */}
            {/* RIGHT CONTROLS: MINIMAL (UNAUTH) VS COMPLETE (AUTH) */}
            {/* ========================================================================= */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* If NOT Authenticated: Minimal Logo + Sign In + Get Started */}
              {!user ? (
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
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 shadow-md shadow-sky-600/20 hover:shadow-sky-600/30 transition-all cursor-pointer"
                  >
                    Get Started
                  </button>
                </div>
              ) : (
                /* If Authenticated: User Menu Dropdown */
                <UserMenu />
              )}

              {/* Mobile Hamburger Toggle (Authenticated only) */}
              {user && (
                <div className="flex md:hidden items-center">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Toggle Navigation"
                  >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE DRAWER (AUTHENTICATED LINKS) */}
        {/* ========================================================================= */}
        {user && mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-3">
            <div className="space-y-1">
              {authNavLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold ${
                      isActive
                        ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-sky-500" />
                      <span>{link.name}</span>
                    </div>
                    {link.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-300">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
