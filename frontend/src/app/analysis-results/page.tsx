'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Brain,
  ShieldCheck,
  Utensils,
  Dumbbell,
  Pill,
  Share2,
  Check,
  RotateCcw,
} from 'lucide-react';
import { PredictionItem, PatientInfo } from '@/types';
import { formatSymptomName } from '@/lib/utils';
import MedicineCard from '@/components/ui/MedicineCard';
import DisclaimerCard from '@/components/ui/DisclaimerCard';
import { FEATURED_DISEASES, FEATURED_MEDICINES, getMatchedMedicinesForDisease } from '@/data/mockData';

export default function AnalysisResultsPage() {
  const router = useRouter();
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [selectedRank, setSelectedRank] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('mediassist_active_results');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setPredictions(parsed.predictions || []);
          setSymptoms(parsed.symptoms || []);
          setPatientInfo(parsed.patientInfo || null);
          return;
        } catch {
          // fallback
        }
      }
    }

    // Default Fallback for standalone viewing
    setSymptoms(['fever', 'cough', 'chills', 'headache']);
    setPredictions([
      {
        disease: 'Influenza',
        confidence: 84.5,
        disease_details: FEATURED_DISEASES[0],
        medicines: FEATURED_MEDICINES.slice(0, 3),
      },
      {
        disease: 'Common Cold',
        confidence: 62.1,
        disease_details: FEATURED_DISEASES[1],
        medicines: FEATURED_MEDICINES.slice(3, 5),
      },
      {
        disease: 'Migraine',
        confidence: 45.3,
        disease_details: FEATURED_DISEASES[2],
        medicines: [FEATURED_MEDICINES[0]],
      },
    ]);
  }, []);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentCondition = predictions[selectedRank] || predictions[0];
  const diseaseDetails = currentCondition?.disease_details;
  const medicines =
    currentCondition?.medicines && currentCondition.medicines.length > 0
      ? currentCondition.medicines
      : getMatchedMedicinesForDisease(currentCondition?.disease || 'General Medicine');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/symptom-checker"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Symptom Analysis</span>
        </Link>

        <button
          onClick={handleShare}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-sm"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Results Link Copied' : 'Share Results'}</span>
        </button>
      </div>

      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 text-xs font-semibold">
          <Brain className="w-3.5 h-3.5" />
          <span>Multi-Class Prediction Complete</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Your Symptom Analysis Results
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
          Based on the {symptoms.length} symptoms evaluated, our machine learning model identified the following Top 3 matching health conditions.
        </p>
      </div>

      {/* Symptoms Vector Summary Banner */}
      <div className="p-4 rounded-2xl saas-card flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Reported Symptoms:</span>
        {symptoms.map((s) => (
          <span
            key={s}
            className="px-2.5 py-1 rounded-md bg-sky-50 dark:bg-slate-800 text-sky-800 dark:text-sky-300 text-xs font-medium border border-sky-200 dark:border-slate-700"
          >
            {formatSymptomName(s)}
          </span>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TOP 3 DIFFERENTIAL CONDITIONS SELECTOR */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Top 3 Conditions Matching Your Symptoms
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {predictions.map((item, idx) => {
            const isSelected = selectedRank === idx;
            return (
              <button
                key={item.disease + idx}
                onClick={() => setSelectedRank(idx)}
                className={`p-5 rounded-2xl text-left transition-all relative border flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-slate-900 border-sky-500 dark:border-teal-400 shadow-md ring-2 ring-sky-500/20 dark:ring-teal-400/30'
                    : 'saas-card-hover text-slate-800 dark:text-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Rank #{idx + 1}
                  </span>
                  <span className="text-sm font-extrabold text-teal-600 dark:text-teal-400">{item.confidence}% Match</span>
                </div>

                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">{item.disease}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {item.disease_details?.description || 'View condition care plan'}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      idx === 0
                        ? 'bg-gradient-to-r from-sky-500 to-teal-400'
                        : idx === 1
                        ? 'bg-blue-500'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(10, item.confidence))}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DETAILED CARE PLAN FOR SELECTED CONDITION */}
      {/* ========================================================================= */}
      <div className="saas-card rounded-3xl p-6 sm:p-8 space-y-8 border-teal-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
              Selected Differential Profile
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {currentCondition?.disease}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {diseaseDetails?.description ||
                'Clinical presentation and management protocol associated with this predicted profile.'}
            </p>
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <span className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">
              {currentCondition?.confidence}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Model Confidence</span>
          </div>
        </div>

        {/* Precautions, Diets & Workouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Precautions */}
          <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-slate-900/80 border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Recommended Precautions</span>
            </div>
            {diseaseDetails?.precautions && diseaseDetails.precautions.length > 0 ? (
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {diseaseDetails.precautions.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">Standard clinical hygiene and rest.</p>
            )}
          </div>

          {/* Diets */}
          <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-slate-900/80 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
              <Utensils className="w-4 h-4 text-emerald-500" />
              <span>Dietary Regimen</span>
            </div>
            {diseaseDetails?.diet_recommendations && diseaseDetails.diet_recommendations.length > 0 ? (
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {diseaseDetails.diet_recommendations.map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">Nutritional meal plan and high hydration.</p>
            )}
          </div>

          {/* Workouts */}
          <div className="p-5 rounded-2xl bg-sky-500/5 dark:bg-slate-900/80 border border-sky-500/30 space-y-3">
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 font-bold text-sm">
              <Dumbbell className="w-4 h-4 text-sky-500" />
              <span>Activity &amp; Recovery</span>
            </div>
            {diseaseDetails?.workout_recommendations && diseaseDetails.workout_recommendations.length > 0 ? (
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {diseaseDetails.workout_recommendations.map((w, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-sky-500 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">Bed rest during febrile or acute phases.</p>
            )}
          </div>
        </div>

        {/* Associated Verified Medicines */}
        {medicines.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Verified Associated Medicines</span>
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">From verified pharmaceutical records</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {medicines.map((med) => (
                <MedicineCard key={med.id} medicine={med} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href="/symptom-checker"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20 hover:from-sky-500 hover:to-teal-400 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Perform Another Assessment</span>
        </Link>

        <Link
          href="/history"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <span>View Saved History</span>
        </Link>
      </div>

      {/* Disclaimer */}
      <DisclaimerCard />
    </div>
  );
}
