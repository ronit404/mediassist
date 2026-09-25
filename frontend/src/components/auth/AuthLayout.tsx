import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, Brain, Lock, CheckCircle2 } from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden glass-card border border-slate-200 dark:border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12">
        {/* Left Branding Panel (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-blue-900/40 via-slate-900 to-teal-950/40 p-10 flex-col justify-between border-r border-slate-200/60 dark:border-slate-800/80 relative overflow-hidden">
          {/* Subtle Ambient Mesh Glow */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Medi<span className="text-teal-400">Assist</span>
              </span>
            </Link>
            <p className="text-xs text-teal-300 font-semibold tracking-wide uppercase">
              AI-Powered Health Information Platform
            </p>
          </div>

          {/* Mid Content */}
          <div className="relative z-10 space-y-6">
            <h2 className="text-2xl font-extrabold text-white leading-tight">
              Intelligent Clinical Decision Support & Drug Insights
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore health conditions, understand medicine information, and gain intelligent insights from symptom patterns.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-2 text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                  <Brain className="w-3.5 h-3.5" />
                </div>
                <span>132 Standardized Symptoms ML Model</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>3,978+ Verified Pharmaceutical Catalog</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span>Zero Generative Dosage Hallucinations</span>
              </div>
            </div>
          </div>

          {/* Bottom Safety Statement */}
          <div className="relative z-10 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 leading-normal flex items-start gap-2">
            <Lock className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
            <span>Your health information is handled with privacy and security in mind.</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="lg:hidden inline-flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-white">
                  Medi<span className="text-teal-500">Assist</span>
                </span>
              </Link>
              <div className="ml-auto">
                <ThemeToggle />
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            </div>

            {/* Form Content */}
            <div className="pt-2">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
