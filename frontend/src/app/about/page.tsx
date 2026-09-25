import React from 'react';
import { Activity, Brain, Database, ShieldCheck, HeartPulse, CheckCircle2, Lock } from 'lucide-react';
import DisclaimerCard from '@/components/ui/DisclaimerCard';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-300 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5" />
          <span>Platform Mission & Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About MediAssist
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          An AI-powered healthcare intelligence and decision-support platform designed to centralize disease understanding and verified pharmaceutical data.
        </p>
      </div>

      {/* Core Mission */}
      <div className="glass-card rounded-3xl p-8 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Vision</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          People often search across disparate portals to understand what symptoms mean, what drugs are used for, and what precautions to take. MediAssist harmonizes these fragmented health resources into a transparent, explainable decision-support system.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Our core ethos is **Patient Safety First**: we do not invent or extrapolate drug dosages via generative AI, and we proactively intercept emergency symptoms to redirect patients to emergency services.
        </p>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">XGBoost ML Pipeline</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Multi-class classification trained on 132 standardized symptoms with realistic synthetic noise injection for robustness.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Dual-Dataset NoSQL Hub</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Relational NoSQL schema mapping canonical diseases (`D001`–`D041`) directly to verified pharmaceutical entries (`M0001`+).
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Safety Interceptors</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Immediate detection of life-threatening indicators (acute chest pain, dyspnea, stroke signs) with emergency hotlines.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <DisclaimerCard />
    </div>
  );
}
