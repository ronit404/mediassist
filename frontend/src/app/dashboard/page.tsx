'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Pill,
  Stethoscope,
  History,
  ArrowRight,
  Activity,
  ShieldCheck,
  Calendar,
  Clock,
  ChevronRight,
  TrendingUp,
  Brain,
  CheckCircle2,
  AlertCircle,
  Search
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchPatientHistory } from '@/lib/api';
import { FEATURED_MEDICINES, FEATURED_DISEASES } from '@/data/mockData';
import { AnalysisHistoryItem } from '@/types';
import { formatSymptomName } from '@/lib/utils';
import MedicineCard from '@/components/ui/MedicineCard';
import DiseaseCard from '@/components/ui/DiseaseCard';
import DisclaimerCard from '@/components/ui/DisclaimerCard';

export default function UserDashboardPage() {
  const { user, token, patientProfile } = useAuth();
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      if (token) {
        try {
          const items = await fetchPatientHistory(token);
          setHistory(items);
        } catch (e) {
          console.error('Failed to load user history:', e);
        } finally {
          setLoadingHistory(false);
        }
      } else {
        setHistory([]);
        setLoadingHistory(false);
      }
    }
    loadData();
  }, [token, user]);

  const userName = patientProfile?.name || user?.name || 'Healthcare User';

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="saas-card rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-sky-500/10 via-teal-500/5 to-transparent border border-sky-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Personal Health Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome Back, {userName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              How can MediAssist assist your clinical understanding today?
            </p>
          </div>

          <Link
            href="/symptom-checker"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 font-bold text-white text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 shrink-0 active:scale-95 transition-all"
          >
            <Brain className="w-4 h-4" />
            <span>Start Symptom Triage</span>
          </Link>
        </div>
      </div>

      {/* 4 Core Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Action 1 */}
        <Link
          href="/symptom-checker"
          className="saas-card-hover rounded-2xl p-5 flex flex-col justify-between space-y-4 group border-sky-500/30"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300">
              AI Symptom Checker
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Select symptoms and receive ML differential insights.
            </p>
          </div>
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
            <span>Analyze</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        {/* Action 2 */}
        <Link
          href="/medicines"
          className="saas-card-hover rounded-2xl p-5 flex flex-col justify-between space-y-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300">
              Explore Medicines
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Search 3,978+ verified chemical formulations.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <span>Browse Catalog</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        {/* Action 3 */}
        <Link
          href="/diseases"
          className="saas-card-hover rounded-2xl p-5 flex flex-col justify-between space-y-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300">
              Disease Directory
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Review pathology, diets, and clinical precautions.
            </p>
          </div>
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">
            <span>Explore 41 Conditions</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        {/* Action 4 */}
        <Link
          href="/history"
          className="saas-card-hover rounded-2xl p-5 flex flex-col justify-between space-y-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
              Analysis History
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Review your saved triage sessions and predictions.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            <span>{history.length} Saved Records</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>

      {/* Recent Triage Analyses Feed */}
      <div className="saas-card rounded-3xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Symptom Analyses</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Past differential triage assessments</p>
          </div>
          <Link
            href="/history"
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {history.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-xs text-slate-500">No triage runs logged on this browser yet.</p>
            <Link
              href="/symptom-checker"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-600"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Perform Your First Analysis</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 3).map((item) => {
              const topMatch = item.predictions?.[0];
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {topMatch?.disease || 'Condition Triage'}
                      </span>
                      {topMatch?.confidence && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-500/20">
                          {topMatch.confidence}% Match
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 text-[11px] text-slate-500">
                      <span>Symptoms:</span>
                      {item.symptoms.map((s) => (
                        <span key={s} className="text-slate-700 dark:text-slate-300 font-medium">
                          {formatSymptomName(s)},
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-xs text-slate-400">
                    <span className="text-[11px]">{item.date}</span>
                    <button
                      onClick={() => {
                        sessionStorage.setItem('mediassist_active_results', JSON.stringify(item));
                        window.location.href = '/analysis-results';
                      }}
                      className="px-3 py-1.5 rounded-lg bg-sky-600 text-white font-semibold text-xs hover:bg-sky-500 transition-colors"
                    >
                      Review
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommended Medicines Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Popular Verified Medicines</h2>
          <Link
            href="/medicines"
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Browse Full Catalog</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURED_MEDICINES.slice(0, 3).map((med) => (
            <MedicineCard key={med.id} medicine={med} />
          ))}
        </div>
      </div>

      <DisclaimerCard />
    </div>
  );
}
