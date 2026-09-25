'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  Sparkles,
  ShieldCheck,
  Brain,
  Pill,
  Stethoscope,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  History,
  PhoneCall,
  Clock,
  Layers,
  Check,
  BookOpen,
  Filter,
  FileText
} from 'lucide-react';
import { FEATURED_MEDICINES, FEATURED_DISEASES } from '@/data/mockData';
import MedicineCard from '@/components/ui/MedicineCard';
import DiseaseCard from '@/components/ui/DiseaseCard';
import EmergencyContactButton from '@/components/ui/EmergencyContactButton';
import DisclaimerCard from '@/components/ui/DisclaimerCard';
import { getMedicines, getDiseases } from '@/lib/api';
import { Medicine, Disease } from '@/types';
import { useAuth } from '@/context/AuthContext';

const TRIAGE_PREVIEWS = [
  {
    category: 'Respiratory & Viral',
    symptoms: ['High Fever', 'Chills', 'Fatigue', 'Dry Cough'],
    confidence: '88.4%',
    progressWidth: '88%',
    progressGradient: 'from-sky-500 to-teal-400',
    disease: 'Influenza / Viral Infection',
    description: 'Structured care guidance, rest protocols, and hydration monitoring.',
    accentColor: 'text-sky-600 dark:text-sky-400',
    accentBg: 'bg-sky-500/10',
    accentBorder: 'border-sky-500/20',
  },
  {
    category: 'Neurological & Headache',
    symptoms: ['Throbbing Headache', 'Light Sensitivity', 'Nausea', 'Visual Aura'],
    confidence: '94.2%',
    progressWidth: '94%',
    progressGradient: 'from-violet-500 to-indigo-400',
    disease: 'Migraine with Aura',
    description: 'Dark-room resting protocols, hydration, and physician-reviewed abortive therapy.',
    accentColor: 'text-violet-600 dark:text-violet-400',
    accentBg: 'bg-violet-500/10',
    accentBorder: 'border-violet-500/20',
  },
  {
    category: 'Gastrointestinal',
    symptoms: ['Abdominal Pain', 'Acidity', 'Loss of Appetite', 'Bloating'],
    confidence: '91.8%',
    progressWidth: '92%',
    progressGradient: 'from-emerald-500 to-teal-400',
    disease: 'Acute Gastritis / Reflux',
    description: 'Non-irritant dietary guidance, small meal schedules, and verified antacids.',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/20',
  },
  {
    category: 'Allergy & Immunology',
    symptoms: ['Continuous Sneezing', 'Runny Nose', 'Watery Eyes', 'Throat Itch'],
    confidence: '96.5%',
    progressWidth: '96%',
    progressGradient: 'from-amber-500 to-orange-400',
    disease: 'Allergic Rhinitis / Hay Fever',
    description: 'Aeroallergen avoidance, saline rinses, and verified non-sedating antihistamines.',
    accentColor: 'text-amber-600 dark:text-amber-400',
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500/20',
  },
  {
    category: 'Dermatology & Skin',
    symptoms: ['Skin Rash', 'Itching', 'Erythema', 'Flaking'],
    confidence: '89.6%',
    progressWidth: '90%',
    progressGradient: 'from-rose-500 to-pink-400',
    disease: 'Contact Dermatitis',
    description: 'Topical soothing regimens, allergen avoidance, and barrier repair lotions.',
    accentColor: 'text-rose-600 dark:text-rose-400',
    accentBg: 'bg-rose-500/10',
    accentBorder: 'border-rose-500/20',
  },
];

function getDiverseFeaturedMedicines(medList: Medicine[]): Medicine[] {
  if (!medList || medList.length === 0) return FEATURED_MEDICINES.slice(0, 3);

  const selected: Medicine[] = [];
  const seenBaseNames = new Set<string>();
  const seenGenerics = new Set<string>();

  for (const med of medList) {
    // Extract normalized core brand name (e.g., "A Ret Gel 0.025%" -> "a ret")
    const baseName = med.name
      .toLowerCase()
      .replace(/(\d+(\.\d+)?(mg|%|mcg|ml|g|iu|tablets?|capsules?|gel|syrup|drop|suspension)|tablet|capsule|gel|cream|syrup|ointment|solution)/gi, '')
      .trim();

    // Extract core generic ingredient (e.g. "Paracetamol (Acetaminophen)" -> "paracetamol")
    const generic = (med.generic_name || '')
      .toLowerCase()
      .split(/[\(\+\,\/]/)[0]
      .trim();

    const isDuplicateName = baseName && Array.from(seenBaseNames).some(
      (b) => b.includes(baseName) || baseName.includes(b)
    );
    const isDuplicateGeneric = generic && generic.length > 3 && Array.from(seenGenerics).some(
      (g) => g.includes(generic) || generic.includes(g)
    );

    if (!isDuplicateName && !isDuplicateGeneric) {
      selected.push(med);
      if (baseName) seenBaseNames.add(baseName);
      if (generic) seenGenerics.add(generic);
    }

    if (selected.length >= 3) break;
  }

  // If fewer than 3 items found from strict filter, supplement with distinct mock medicines
  if (selected.length < 3) {
    for (const med of FEATURED_MEDICINES) {
      if (!selected.some((s) => s.name.toLowerCase().includes(med.name.toLowerCase().substring(0, 4)))) {
        selected.push(med);
        if (selected.length >= 3) break;
      }
    }
  }

  return selected.slice(0, 3);
}

export default function HomePage() {
  const { user, openAuthModal } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>(FEATURED_MEDICINES.slice(0, 3));
  const [diseases, setDiseases] = useState<Disease[]>(FEATURED_DISEASES);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [isFading, setIsFading] = useState<boolean>(false);

  const handleProtectedAction = (e: React.MouseEvent, destination: string) => {
    if (!user) {
      e.preventDefault();
      openAuthModal('login', destination);
    }
  };

  useEffect(() => {
    getMedicines({ limit: 30 }).then((data) => {
      if (data.medicines && data.medicines.length > 0) {
        const diverse = getDiverseFeaturedMedicines(data.medicines);
        setMedicines(diverse);
      }
    });
    getDiseases({ limit: 6 }).then((data) => {
      if (data.diseases && data.diseases.length > 0) {
        setDiseases(data.diseases);
      }
    });
  }, []);

  // Cycle Triage Preview every 4 seconds automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setPreviewIndex((prev) => (prev + 1) % TRIAGE_PREVIEWS.length);
        setIsFading(false);
      }, 200);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const activePreview = TRIAGE_PREVIEWS[previewIndex];

  const faqs = [
    {
      q: 'What is MediAssist?',
      a: 'MediAssist is an intelligent digital healthcare assistance platform that combines an AI symptom triage engine, a verified 3,978+ medicine directory, and a 41-condition clinical disease encyclopedia to help you understand health information.'
    },
    {
      q: 'Is MediAssist a replacement for a doctor?',
      a: 'No. MediAssist is designed to support and inform you before you see a doctor. It does not replace clinical assessment, diagnostic tests, or professional medical advice.'
    },
    {
      q: 'How does the AI Symptom Checker work?',
      a: 'You select your active symptoms from our canonical 132-symptom registry. Our multi-class machine learning engine analyzes the patterns to provide the top 3 ranked differential conditions, accompanied by precautions, dietary recommendations, and linked medicines.'
    },
    {
      q: 'Can MediAssist prescribe medications?',
      a: 'No. MediAssist provides educational monographs and price indications for verified medications. It never prescribes drugs or alters your physician’s prescriptions.'
    },
    {
      q: 'What happens if I select critical emergency symptoms?',
      a: 'MediAssist immediately pauses the evaluation and displays an urgent Safety Override Modal with emergency contact numbers (such as 108, 112, or 911) to ensure acute care is not delayed.'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* ========================================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-8 sm:pt-14 pb-12 hero-gradient overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-700 dark:text-sky-300 text-xs font-bold uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>INTELLIGENT HEALTHCARE ASSISTANCE</span>
              </div>

              {/* Main Heading with Continuous Left-to-Right Animated Shimmer */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.14]">
                <span className="inline-block animate-continuous-text-ltr mr-2 select-none">
                  Better understanding.
                </span>
                <span className="inline-block animate-continuous-gradient-ltr select-none">
                  Better healthcare decisions.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                MediAssist brings health information, medical organization, and intelligent assistance together in one simple, secure platform.
              </p>

              {/* Primary Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link
                  href="/symptom-checker"
                  onClick={(e) => handleProtectedAction(e, '/symptom-checker')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-sky-600/20 hover:shadow-sky-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Brain className="w-4 h-4 text-sky-200" />
                  <span>Check Your Symptoms</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/medicines"
                  onClick={(e) => handleProtectedAction(e, '/medicines')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-800 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Pill className="w-4 h-4 text-blue-500" />
                  <span>Explore Medicines</span>
                </Link>
              </div>

              {/* Safety Disclaimers */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Designed to support — not replace — healthcare professionals.</span>
              </div>
            </div>

            {/* Right Hero: Live Interactive Triage Preview (Auto-Cycles every 4s) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl saas-card p-5 sm:p-6 shadow-2xl border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white ml-1">
                      AI Triage Preview
                    </span>
                  </div>
                  
                  {/* Category Pill with cycling index */}
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${activePreview.accentBg} ${activePreview.accentColor} border ${activePreview.accentBorder} transition-colors duration-300`}>
                    {activePreview.category}
                  </span>
                </div>

                {/* Animated Dynamic Body */}
                <div className={`space-y-4 transition-all duration-300 ${isFading ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}>
                  {/* Selected Symptoms Pills */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Active Reported Indicators:
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {activePreview.symptoms.length} Symptoms
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                      {activePreview.symptoms.map((symptom, idx) => (
                        <span
                          key={`${previewIndex}-${idx}`}
                          className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 text-xs font-semibold border border-sky-200 dark:border-slate-700 shadow-sm"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Differential Result Card */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 dark:text-white">Differential Outcome</span>
                      <span className={`font-extrabold ${activePreview.accentColor}`}>
                        {activePreview.confidence} Confidence
                      </span>
                    </div>
                    
                    {/* Animated Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${activePreview.progressGradient} h-full transition-all duration-700 ease-out`}
                        style={{ width: activePreview.progressWidth }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">
                      Primary Match: <strong className="text-slate-900 dark:text-white">{activePreview.disease}</strong> with {activePreview.description}
                    </p>
                  </div>
                </div>

                {/* Footer Controls & Dots */}
                <div className="space-y-3 pt-1">
                  <Link
                    href="/symptom-checker"
                    onClick={(e) => handleProtectedAction(e, '/symptom-checker')}
                    className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs text-center block shadow-md hover:shadow-sky-600/20 transition-all active:scale-[0.98]"
                  >
                    Run Full Differential Analysis →
                  </Link>

                  {/* 4s Indicator Pagination Dots */}
                  <div className="flex items-center justify-center gap-1.5 pt-0.5">
                    {TRIAGE_PREVIEWS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setIsFading(true);
                          setTimeout(() => {
                            setPreviewIndex(i);
                            setIsFading(false);
                          }, 150);
                        }}
                        aria-label={`Jump to triage preview ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          previewIndex === i
                            ? 'w-6 bg-sky-500'
                            : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CAPABILITY TRUST STRIP (Continuous Left-to-Right Animated Marquee) */}
      {/* ========================================================================= */}
      <section className="py-4 border-y border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/60 overflow-hidden marquee-mask select-none">
        <div className="animate-marquee-ltr flex items-center gap-8 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
          {/* First Set */}
          <div className="flex items-center gap-8 shrink-0">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-sky-500" />
              <span>Understand Symptoms</span>
            </div>
            <span className="text-slate-400 dark:text-slate-600">•</span>

            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-blue-500" />
              <span>Explore 3,978+ Medicines</span>
            </div>
            <span className="text-slate-400 dark:text-slate-600">•</span>

            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-500" />
              <span>Review 41 Diseases</span>
            </div>
            <span className="text-slate-400 dark:text-slate-600">•</span>

            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-500" />
              <span>Track Health History</span>
            </div>
            <span className="text-slate-400 dark:text-slate-600">•</span>
          </div>

          {/* Duplicate Set for Seamless Continuous Loop */}
          <div className="flex items-center gap-8 shrink-0" aria-hidden="true">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-sky-500" />
              <span>Understand Symptoms</span>
            </div>
            <span className="text-slate-400 dark:text-slate-600">•</span>

            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-blue-500" />
              <span>Explore 3,978+ Medicines</span>
            </div>
            <span className="text-slate-400 dark:text-slate-600">•</span>

            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-500" />
              <span>Review 41 Diseases</span>
            </div>
            <span className="text-slate-400 dark:text-slate-600">•</span>

            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-500" />
              <span>Track Health History</span>
            </div>
            <span className="text-slate-400 dark:text-slate-600">•</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3 CORE PILLARS OF MEDIASSIST */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs">
            <span>UNIFIED HEALTHCARE ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything you need to understand your health.
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            MediAssist seamlessly connects intelligent symptom analysis, certified medical conditions, and verified pharmaceuticals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Symptom Checker */}
          <div className="saas-card-hover rounded-3xl p-7 flex flex-col justify-between group space-y-4 border-l-4 border-l-sky-500">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Symptom Checker</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Select your symptoms from 132 indicators. The XGBoost model calculates probability distributions to rank the top 3 differential conditions.
              </p>
            </div>
            <Link
              href="/symptom-checker"
              onClick={(e) => handleProtectedAction(e, '/symptom-checker')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform"
            >
              <span>Launch Symptom Checker</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pillar 2: Medicine Explorer */}
          <div className="saas-card-hover rounded-3xl p-7 flex flex-col justify-between group space-y-4 border-l-4 border-l-blue-500">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Medicine Explorer</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Search over 3,978+ verified medicines. Inspect active generic formulations, manufacturers, indicative pricing, and prescription requirements.
              </p>
            </div>
            <Link
              href="/medicines"
              onClick={(e) => handleProtectedAction(e, '/medicines')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform"
            >
              <span>Explore Medicine Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pillar 3: Disease Encyclopedia */}
          <div className="saas-card-hover rounded-3xl p-7 flex flex-col justify-between group space-y-4 border-l-4 border-l-teal-500">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Disease Encyclopedia</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Browse 41 canonical health conditions. Review clinical precautions, dietary recommendations, exercise regimens, and linked medications.
              </p>
            </div>
            <Link
              href="/diseases"
              onClick={(e) => handleProtectedAction(e, '/diseases')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform"
            >
              <span>Browse Conditions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURED MEDICINES SHOWCASE */}
      {/* ========================================================================= */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
                <Pill className="w-3.5 h-3.5" />
                <span>PHARMACEUTICAL DIRECTORY</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Featured Verified Medicines
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Pharmaceutical monographs with clinical salt compositions and indications.
              </p>
            </div>

            <Link
              href="/medicines"
              onClick={(e) => handleProtectedAction(e, '/medicines')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>View All 3,978+ Drugs</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines.slice(0, 3).map((med) => (
              <MedicineCard key={med.id} medicine={med} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 41 CANONICAL DISEASES SHOWCASE */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>CLINICAL KNOWLEDGE BASE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Canonical Disease Profiles
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Diagnostic symptom fingerprints, precautions, and nutrition guidelines.
            </p>
          </div>

          <Link
            href="/diseases"
            onClick={(e) => handleProtectedAction(e, '/diseases')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
          >
            <span>View All 41 Conditions</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diseases.slice(0, 3).map((disease) => (
            <DiseaseCard key={disease.id} disease={disease} />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* EMERGENCY SAFETY GUARDRAIL */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 text-slate-800 dark:text-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-rose-950 dark:text-rose-200">
                Immediate Emergency Medical Guidance
              </h3>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-rose-300 max-w-xl">
                MediAssist is for educational and informational support only. If you experience acute chest pain, severe breathlessness, or trauma, contact emergency response services immediately.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <EmergencyContactButton number="108" label="Call 108 / 911" />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================================= */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Common questions regarding our AI triage engine and medical boundaries.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div
                  key={idx}
                  className="saas-card rounded-2xl overflow-hidden border-slate-200 dark:border-slate-800"
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-sky-500' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>



      <DisclaimerCard />
    </div>
  );
}
