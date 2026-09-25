import React from 'react';
import Link from 'next/link';
import { ArrowRight, HeartPulse } from 'lucide-react';
import { Disease } from '@/types';
import { formatSymptomName } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface DiseaseCardProps {
  disease: Disease;
}

export default function DiseaseCard({ disease }: DiseaseCardProps) {
  const { user, openAuthModal } = useAuth();
  const displaySymptoms = (disease.symptoms || []).slice(0, 4);

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      openAuthModal('login', `/diseases/${disease.id}`);
    }
  };

  return (
    <div className="glass-card-hover rounded-2xl p-5 flex flex-col justify-between group">
      <div>
        {/* Header with Icon */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 dark:text-indigo-400 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/50">
            {disease.id}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors mb-2 line-clamp-1">
          {disease.name}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-4">
          {disease.description || 'Clinical overview and symptom pathology documented in the MediAssist medical database.'}
        </p>

        {/* Symptoms tags */}
        {displaySymptoms.length > 0 && (
          <div className="space-y-1.5 mb-4">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Characteristic Symptoms:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {displaySymptoms.map((sym) => (
                <span
                  key={sym}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                >
                  {formatSymptomName(sym)}
                </span>
              ))}
              {(disease.symptoms?.length || 0) > 4 && (
                <span className="text-[10px] text-slate-400 px-1.5 py-0.5">
                  +{(disease.symptoms?.length || 0) - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action CTA */}
      <Link
        href={`/diseases/${disease.id}`}
        onClick={handleClick}
        className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-600/30 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-200 dark:border-slate-700/50 group-hover:border-indigo-500/30"
      >
        <span>Explore Condition</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
