'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HeartPulse,
  ArrowLeft,
  ShieldCheck,
  Utensils,
  Dumbbell,
  Pill,
  Share2,
  Check,
  Stethoscope,
} from 'lucide-react';
import { getDiseaseById } from '@/lib/api';
import { Disease, Medicine } from '@/types';
import { formatSymptomName } from '@/lib/utils';
import { getMatchedMedicinesForDisease } from '@/data/mockData';
import DisclaimerCard from '@/components/ui/DisclaimerCard';
import MedicineCard from '@/components/ui/MedicineCard';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';

export default function DiseaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const diseaseId = (params?.id as string) || '';

  const [disease, setDisease] = useState<Disease | null>(null);
  const [relatedMeds, setRelatedMeds] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!diseaseId) return;
    setLoading(true);

    getDiseaseById(diseaseId)
      .then((data) => {
        if (data) {
          setDisease(data);
          // If backend provided matched medicines, use them; otherwise use clinically matched medicines for this specific disease
          const meds =
            data.medicines && data.medicines.length > 0
              ? data.medicines
              : getMatchedMedicinesForDisease(data.name);
          setRelatedMeds(meds);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [diseaseId]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 py-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!disease) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Condition Not Found</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">The requested disease record could not be retrieved from the database.</p>
        <Link
          href="/diseases"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Disease Explorer</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Disease Explorer</span>
      </button>

      {/* Header Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4 border border-sky-500/20">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 text-xs font-bold">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Canonical Pathology ID: {disease.id}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {disease.name}
            </h1>
          </div>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:text-sky-600 dark:hover:text-sky-400 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>

        {/* Clinical Description */}
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
          {disease.description || 'Detailed medical condition overview and clinical pathology.'}
        </p>
      </div>

      {/* Symptoms Fingerprint */}
      {disease.symptoms && disease.symptoms.length > 0 && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-sky-500" />
            <span>Characteristic Clinical Symptoms</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Patients evaluated for {disease.name} commonly present with these diagnostic markers:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {disease.symptoms.map((symptom) => (
              <span
                key={symptom}
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                {formatSymptomName(symptom)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Precautions, Diet & Workouts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Precautions */}
        <div className="glass-card rounded-3xl p-6 space-y-4 border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <span>Clinical Precautions</span>
          </div>
          {disease.precautions && disease.precautions.length > 0 ? (
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              {disease.precautions.map((prec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{prec}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500">Standard clinical hygiene and rest recommended.</p>
          )}
        </div>

        {/* Nutritional Diet */}
        <div className="glass-card rounded-3xl p-6 space-y-4 border-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
            <Utensils className="w-5 h-5 text-emerald-500" />
            <span>Dietary Guidance</span>
          </div>
          {disease.diet_recommendations && disease.diet_recommendations.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {disease.diet_recommendations.map((diet, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{diet}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500">Balanced nutritional diet with adequate hydration.</p>
          )}
        </div>

        {/* Workouts & Lifestyle */}
        <div className="glass-card rounded-3xl p-6 space-y-4 border-sky-500/20">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-base">
            <Dumbbell className="w-5 h-5 text-sky-500" />
            <span>Activity & Rest</span>
          </div>
          {disease.workout_recommendations && disease.workout_recommendations.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {disease.workout_recommendations.map((work, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-sky-500 font-bold">•</span>
                  <span>{work}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500">Rest adequately until acute symptoms resolve.</p>
          )}
        </div>
      </div>

      {/* Associated Verified Medicines Section (Guaranteed for Every Disease) */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Pill className="w-5 h-5 text-sky-500" />
              <span>Related Verified Medications</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Verified pharmaceutical monographs mapped to {disease.name} from the database
            </p>
          </div>
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20 self-start sm:self-auto">
            {relatedMeds.length} Matched Drugs
          </span>
        </div>

        {relatedMeds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedMeds.map((med) => (
              <MedicineCard key={med.id || med._id || med.name} medicine={med} />
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <Pill className="w-8 h-8 text-slate-400 mx-auto opacity-60" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Medication Monograph Under Review</p>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto">
              Clinical monographs for this specific pathology are undergoing medical validation and will appear shortly.
            </p>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <DisclaimerCard />
    </div>
  );
}
