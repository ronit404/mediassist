'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Search,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  User,
  Layers,
  CheckCircle2,
  Brain,
} from 'lucide-react';
import { CATEGORIZED_SYMPTOMS, EMERGENCY_SYMPTOMS } from '@/data/mockData';
import { predictDisease, savePatientHistory } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { formatSymptomName } from '@/lib/utils';
import EmergencyModal from '@/components/ui/EmergencyModal';
import DisclaimerCard from '@/components/ui/DisclaimerCard';
import { PatientInfo } from '@/types';

export default function SymptomCheckerPage() {
  const router = useRouter();
  const { token, patientProfile } = useAuth();

  // Wizard step: 1 (Info), 2 (Symptoms), 3 (Review), 4 (Loading)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Patient context state
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    age: '25',
    gender: 'Not specified',
    weight: '70',
    duration: '1-3 days',
    severity: 'Moderate',
  });

  // Selected symptoms set
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Emergency Interception Modal
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [detectedEmergencies, setDetectedEmergencies] = useState<string[]>([]);
  const [emergencyAcknowledged, setEmergencyAcknowledged] = useState<boolean>(false);

  // Analysis Animation Steps
  const [loadingStep, setLoadingStep] = useState<number>(1);

  // Toggle symptom selection
  const handleToggleSymptom = (key: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleClearAllSymptoms = () => {
    setSelectedSymptoms([]);
  };

  // Check for emergency symptoms whenever selection changes
  useEffect(() => {
    const critical = selectedSymptoms.filter((s) => EMERGENCY_SYMPTOMS.includes(s));
    setDetectedEmergencies(critical);
    if (critical.length > 0 && !emergencyAcknowledged) {
      setShowEmergencyModal(true);
    }
  }, [selectedSymptoms, emergencyAcknowledged]);

  // Filtered symptoms list for Step 2
  const filteredSymptoms = useMemo(() => {
    let list = CATEGORIZED_SYMPTOMS;
    if (activeCategory !== 'All') {
      list = list.filter((c) => c.category === activeCategory);
    }

    const flattened = list.flatMap((c) => c.symptoms);
    
    // Deduplicate by key to guarantee unique React keys across categories
    const uniqueMap = new Map<string, { key: string; label: string }>();
    for (const item of flattened) {
      if (!uniqueMap.has(item.key)) {
        uniqueMap.set(item.key, item);
      }
    }
    const uniqueList = Array.from(uniqueMap.values());

    if (!searchQuery.trim()) return uniqueList;

    const q = searchQuery.toLowerCase().replace(/[\s-]/g, '_');
    return uniqueList.filter(
      (s) => s.key.toLowerCase().includes(q) || s.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeCategory, searchQuery]);

  // Submit and run ML analysis
  const handleStartAnalysis = async () => {
    if (selectedSymptoms.length === 0) return;

    // Transition to loading step
    setCurrentStep(4);
    setLoadingStep(1);

    setTimeout(() => setLoadingStep(2), 700);
    setTimeout(() => setLoadingStep(3), 1400);

    try {
      const response = await predictDisease(selectedSymptoms);

      // Save to patient analysis history (syncs with MongoDB)
      await savePatientHistory({
        patientInfo,
        symptoms: selectedSymptoms,
        predictions: response.predictions,
      }, token || undefined);

      // Save active analysis to sessionStorage for results page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'mediassist_active_results',
          JSON.stringify({
            patientInfo,
            symptoms: selectedSymptoms,
            predictions: response.predictions,
          })
        );
      }

      setTimeout(() => {
        router.push('/analysis-results');
      }, 2000);
    } catch (err) {
      console.error('Analysis error:', err);
      setTimeout(() => {
        router.push('/analysis-results');
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Emergency Modal Interceptor */}
      <EmergencyModal
        isOpen={showEmergencyModal}
        detectedEmergencySymptoms={detectedEmergencies}
        onAcknowledge={() => {
          setEmergencyAcknowledged(true);
          setShowEmergencyModal(false);
        }}
      />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 text-xs font-semibold">
          <Brain className="w-3.5 h-3.5" />
          <span>Machine Learning Differential Triage</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Symptom Checker
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Identify possible health conditions, clinical precautions, and verified medications by selecting your active symptoms.
        </p>
      </div>

      {/* Multi-step Progress Bar (when not loading) */}
      {currentStep < 4 && (
        <div className="saas-card rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-2 max-w-xl mx-auto text-xs font-semibold">
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors ${
              currentStep === 1
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
            <span>Patient Info</span>
          </button>

          <span className="text-slate-400 dark:text-slate-600">→</span>

          <button
            onClick={() => setCurrentStep(2)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors ${
              currentStep === 2
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
            <span>Select Symptoms ({selectedSymptoms.length})</span>
          </button>

          <span className="text-slate-400 dark:text-slate-600">→</span>

          <button
            onClick={() => {
              if (selectedSymptoms.length > 0) setCurrentStep(3);
            }}
            disabled={selectedSymptoms.length === 0}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              currentStep === 3
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
            <span>Review &amp; Run</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: PATIENT CONTEXT INFO */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="saas-card rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span>Step 1: Patient Context (Optional)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Providing basic context helps refine medical relevance. No personally identifiable data is stored.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Age */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Patient Age (Years)</label>
              <input
                type="number"
                value={patientInfo.age}
                onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                placeholder="e.g. 28"
                min={1}
                max={120}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Biological Gender</label>
              <select
                value={patientInfo.gender}
                onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
              >
                <option value="Not specified">Prefer not to say</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Symptom Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Symptom Duration</label>
              <select
                value={patientInfo.duration}
                onChange={(e) => setPatientInfo({ ...patientInfo, duration: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
              >
                <option value="Less than 24 hours">Less than 24 hours (Sudden onset)</option>
                <option value="1-3 days">1 to 3 days</option>
                <option value="4-7 days">4 to 7 days</option>
                <option value="More than 1 week">More than 1 week (Persistent)</option>
              </select>
            </div>

            {/* Severity */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Symptom Severity</label>
              <select
                value={patientInfo.severity}
                onChange={(e) => setPatientInfo({ ...patientInfo, severity: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
              >
                <option value="Mild">Mild (Noticeable but does not restrict daily tasks)</option>
                <option value="Moderate">Moderate (Interferes with routine tasks)</option>
                <option value="Severe">Severe (Significant discomfort or impairment)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 font-bold text-white text-sm flex items-center gap-2 shadow-lg shadow-sky-600/20 active:scale-95 transition-all"
            >
              <span>Next: Select Symptoms</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: SELECT SYMPTOMS */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="saas-card rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Step 2: Choose Your Symptoms</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Select at least 1 symptom. For optimal AI accuracy, select 3–6 matching indicators.
              </p>
            </div>

            {selectedSymptoms.length > 0 && (
              <button
                onClick={handleClearAllSymptoms}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium self-start sm:self-auto"
              >
                Clear all ({selectedSymptoms.length})
              </button>
            )}
          </div>

          {/* Search bar for symptoms */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Instant symptom search (e.g., Fever, Cough, Headache, Stomach pain)..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Selected Chips Bar */}
          {selectedSymptoms.length > 0 && (
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 space-y-2">
              <span className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider block">
                Selected Symptoms ({selectedSymptoms.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map((key) => (
                  <button
                    key={key}
                    onClick={() => handleToggleSymptom(key)}
                    className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-600 hover:bg-rose-600 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <span>{formatSymptomName(key)}</span>
                    <X className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === 'All'
                  ? 'bg-sky-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              All (132)
            </button>
            {CATEGORIZED_SYMPTOMS.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === cat.category
                    ? 'bg-teal-600 text-white font-bold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* Symptoms Grid Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto pr-1">
            {filteredSymptoms.map((sym) => {
              const isSelected = selectedSymptoms.includes(sym.key);
              return (
                <button
                  key={sym.key}
                  onClick={() => handleToggleSymptom(sym.key)}
                  className={`p-3 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between gap-2 border ${
                    isSelected
                      ? 'bg-teal-500/15 border-teal-500 text-teal-800 dark:text-teal-200 font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="truncate">{sym.label}</span>
                  {isSelected ? (
                    <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              disabled={selectedSymptoms.length === 0}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 font-bold text-white text-sm flex items-center gap-2 shadow-lg shadow-sky-600/20 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Next: Review &amp; Run</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: REVIEW & RUN */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="saas-card rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Step 3: Review Analysis Parameters</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Confirm your reported symptoms before invoking the multi-class ML neural inference engine.
            </p>
          </div>

          {/* Context Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Patient Age</span>
              <span className="font-bold text-slate-900 dark:text-white">{patientInfo.age || '25'} Years</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Gender</span>
              <span className="font-bold text-slate-900 dark:text-white">{patientInfo.gender || 'Not specified'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Onset Duration</span>
              <span className="font-bold text-slate-900 dark:text-white">{patientInfo.duration}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Severity</span>
              <span className="font-bold text-slate-900 dark:text-white">{patientInfo.severity}</span>
            </div>
          </div>

          {/* Symptoms List Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Active Symptoms Vector ({selectedSymptoms.length}):
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((key) => (
                <span
                  key={key}
                  className="px-3 py-1 rounded-lg bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-slate-700"
                >
                  {formatSymptomName(key)}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Modify Symptoms</span>
            </button>

            <button
              onClick={handleStartAnalysis}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 font-bold text-white text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-sky-600/20 active:scale-95 transition-all"
            >
              <Brain className="w-5 h-5 text-sky-200" />
              <span>Run AI Symptom Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: PROFESSIONAL NEURAL LOADING SCREEN */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="saas-card rounded-3xl p-10 sm:p-16 text-center space-y-8 animate-in fade-in max-w-lg mx-auto">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-600 to-teal-500 animate-spin opacity-40 blur-md" />
            <div className="relative w-20 h-20 rounded-full bg-white dark:bg-slate-900 border-2 border-teal-500 flex items-center justify-center text-teal-600 dark:text-teal-300 shadow-xl shadow-teal-500/20">
              <Brain className="w-10 h-10 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Analyzing Symptom Patterns...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Executing XGBoost multi-class classifier on 132 binary indicators.
            </p>
          </div>

          {/* Steps Timeline */}
          <div className="space-y-3 text-left text-xs max-w-xs mx-auto">
            <div
              className={`flex items-center gap-3 transition-opacity ${
                loadingStep >= 1 ? 'text-teal-700 dark:text-teal-300 opacity-100 font-semibold' : 'text-slate-400 opacity-40'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${loadingStep >= 1 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
              <span>Encoding symptom features</span>
            </div>

            <div
              className={`flex items-center gap-3 transition-opacity ${
                loadingStep >= 2 ? 'text-teal-700 dark:text-teal-300 opacity-100 font-semibold' : 'text-slate-400 opacity-40'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${loadingStep >= 2 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
              <span>Ranking Top 3 differential conditions</span>
            </div>

            <div
              className={`flex items-center gap-3 transition-opacity ${
                loadingStep >= 3 ? 'text-teal-700 dark:text-teal-300 opacity-100 font-semibold' : 'text-slate-400 opacity-40'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${loadingStep >= 3 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
              <span>Querying precautions &amp; medications</span>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <DisclaimerCard />
    </div>
  );
}
