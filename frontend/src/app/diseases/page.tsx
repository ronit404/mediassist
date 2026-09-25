'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Stethoscope, Search, X, HeartPulse, Sparkles } from 'lucide-react';
import { getDiseases } from '@/lib/api';
import { Disease } from '@/types';
import DiseaseCard from '@/components/ui/DiseaseCard';
import { GridSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import DisclaimerCard from '@/components/ui/DisclaimerCard';
import { FEATURED_DISEASES } from '@/data/mockData';

export default function DiseasesPage() {
  const [diseases, setDiseases] = useState<Disease[]>(FEATURED_DISEASES);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getDiseases({ limit: 50 })
      .then((data) => {
        if (data.diseases && data.diseases.length > 0) {
          setDiseases(data.diseases);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredDiseases = useMemo(() => {
    if (!searchTerm.trim()) return diseases;
    const q = searchTerm.toLowerCase();
    return diseases.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q)) ||
        (d.symptoms && d.symptoms.some((s) => s.toLowerCase().includes(q)))
    );
  }, [diseases, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
          <HeartPulse className="w-3.5 h-3.5" />
          <span>Clinical Conditions Encyclopedia</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Disease Explorer</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Learn about 41 canonical health conditions, their physiological symptoms, multi-tier precautions, dietary regimens, and linked medications.
        </p>
      </div>

      {/* Search Input */}
      <div className="glass-card rounded-2xl p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conditions by name or associated symptom (e.g., Influenza, Fever, Migraine)..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <GridSkeleton count={6} />
      ) : filteredDiseases.length === 0 ? (
        <EmptyState
          title="No Conditions Found"
          description={`No health conditions matched "${searchTerm}". Try searching by disease name or common symptom.`}
          onRetry={() => setSearchTerm('')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiseases.map((disease) => (
            <DiseaseCard key={disease.id} disease={disease} />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <DisclaimerCard />
    </div>
  );
}
