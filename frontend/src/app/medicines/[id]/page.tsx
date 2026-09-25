'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Pill,
  Building2,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
  Share2,
  Bookmark,
  Check,
  Tag,
  Stethoscope,
  Info,
  Layers,
  CheckCircle2,
  Zap,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { getMedicineById } from '@/lib/api';
import { Medicine } from '@/types';
import { getDrugClinicalSummary, cleanGenericName, isPrescriptionRequired, formatMedicinePrice } from '@/lib/utils';
import DisclaimerCard from '@/components/ui/DisclaimerCard';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';

type TabType = 'overview' | 'uses' | 'composition' | 'mechanism' | 'safety';

export default function MedicineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const medicineId = (params?.id as string) || '';

  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    if (!medicineId) return;
    setLoading(true);
    getMedicineById(medicineId)
      .then((data) => setMedicine(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [medicineId]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 py-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Medicine Record Not Found</h2>
        <p className="text-xs text-slate-500">The requested drug monograph is not cataloged in the local database.</p>
        <Link
          href="/medicines"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Medicine Explorer</span>
        </Link>
      </div>
    );
  }

  const isRx = isPrescriptionRequired(medicine.prescription_required);
  const cleanGeneric = cleanGenericName(medicine.generic_name);
  const summary = getDrugClinicalSummary(medicine);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Navigation Breadcrumb */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Medicine Explorer</span>
      </button>

      {/* Hero Header Card */}
      <div className="saas-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full ${
                  isRx
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {isRx ? <AlertCircle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                {isRx ? 'Prescription Mandated (Rx)' : 'Over-the-Counter (OTC)'}
              </span>
              <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
                {summary.classification}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {medicine.name}
            </h1>

            {cleanGeneric && (
              <p className="text-xs sm:text-sm text-sky-700 dark:text-sky-400 font-bold flex items-center gap-2">
                <Pill className="w-4 h-4 shrink-0" />
                <span>Active Salt / Composition: {cleanGeneric}</span>
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSave}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                saved
                  ? 'bg-sky-600 text-white border-sky-500 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-sky-600'
              }`}
              title="Save to bookmarks"
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
              <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-sky-600 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Copy URL link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Quick Attributes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-0.5">Indicative Price</span>
            <span className="font-extrabold text-sky-600 dark:text-sky-400 text-sm">
              {formatMedicinePrice(medicine.price)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-0.5">Manufacturer</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
              {medicine.manufacturer || 'Authorized Pharma'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-0.5">Category</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
              {medicine.category_or_disease || 'General Medicine'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-0.5">Regulation</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{isRx ? 'Schedule H' : 'General OTC'}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>Core Overview &amp; Points</span>
        </button>

        <button
          onClick={() => setActiveTab('uses')}
          className={`py-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'uses'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Primary Uses &amp; Indications</span>
        </button>

        <button
          onClick={() => setActiveTab('composition')}
          className={`py-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'composition'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Composition &amp; Salt</span>
        </button>

        <button
          onClick={() => setActiveTab('mechanism')}
          className={`py-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'mechanism'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Mechanism of Action</span>
        </button>

        <button
          onClick={() => setActiveTab('safety')}
          className={`py-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'safety'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Safety &amp; Warnings</span>
        </button>
      </div>

      {/* Structured High-Yield Panels */}
      <div className="saas-card rounded-3xl p-6 sm:p-8 space-y-6">
        {/* TAB 1: OVERVIEW & KEY POINTS */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Core Clinical Highlights
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                What You Need to Know About {medicine.name}
              </h3>
            </div>

            {/* Main Bullet Points */}
            <div className="space-y-3">
              {summary.keyHighlights.map((point, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    0{index + 1}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Summary Box */}
            <div className="p-4 rounded-2xl bg-sky-500/5 dark:bg-slate-900/80 border border-sky-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
              <span>
                <strong>Prescription Status:</strong> {isRx ? 'Requires valid medical practitioner prescription.' : 'Available for general over-the-counter dispensing.'}
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: PRIMARY USES & INDICATIONS */}
        {activeTab === 'uses' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Therapeutic Indications
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Conditions Treated by {medicine.name}
              </h3>
            </div>

            <div className="space-y-3">
              {summary.indications.map((ind, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5 group hover:border-sky-500/40 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {ind}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: COMPOSITION & ACTIVE SALT */}
        {activeTab === 'composition' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Essential Chemical &amp; Salt Monograph
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Active Formulation &amp; Pharmacological Breakdown
              </h3>
            </div>

            <div className="space-y-3">
              {summary.compositionPoints.map((point, index) => {
                const parts = point.split(':');
                const title = parts[0];
                const detail = parts.slice(1).join(':');

                return (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5 hover:border-sky-500/40 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">
                      0{index + 1}
                    </div>
                    <div className="space-y-0.5 text-xs leading-relaxed">
                      <strong className="text-slate-900 dark:text-white font-bold block">
                        {title}
                      </strong>
                      {detail && (
                        <p className="text-slate-600 dark:text-slate-300 font-medium">
                          {detail.trim()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: MECHANISM OF ACTION */}
        {activeTab === 'mechanism' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Pharmacodynamics
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                How It Works in the Body
              </h3>
            </div>

            <div className="space-y-3">
              {summary.mechanismSteps.map((step, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 relative"
                >
                  <div className="w-7 h-7 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SAFETY ADVISORY */}
        {activeTab === 'safety' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Clinical Precautions
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Patient Safety &amp; Warnings
              </h3>
            </div>

            <div className="space-y-3">
              {summary.safetyAdvisories.map((advisory, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-amber-500/5 dark:bg-slate-900/80 border border-amber-500/20 flex items-start gap-3"
                >
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {advisory}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <DisclaimerCard />
    </div>
  );
}
