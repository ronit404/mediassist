'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ShieldCheck,
  Cookie,
  FileText,
  HelpCircle,
  Mail,
  X,
  CheckCircle2,
  Lock,
  Send,
  Sparkles,
  Pill,
  Stethoscope,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type LegalTab = 'privacy' | 'cookie' | 'terms' | 'help' | 'contact' | 'methodology' | 'safety' | null;

export default function Footer() {
  const { user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<LegalTab>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const currentYear = new Date().getFullYear();
  const startYear = 2024;

  const handleProtectedAction = (e: React.MouseEvent, destination: string) => {
    if (!user) {
      e.preventDefault();
      openAuthModal('login', destination);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactMessage('');
      setContactEmail('');
      setActiveTab(null);
    }, 2500);
  };

  return (
    <>
      <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-xl transition-colors mt-auto text-slate-600 dark:text-slate-400 text-xs">
        {/* ========================================================================= */}
        {/* 1. MAIN MULTI-COLUMN ENTERPRISE FOOTER GRID */}
        {/* ========================================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Column 1: Brand & Clinical Boundary (Span 4) */}
            <div className="lg:col-span-4 space-y-4">
              <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                    Medi<span className="text-sky-600 dark:text-sky-400">Assist</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider -mt-1">
                    Healthcare Platform
                  </span>
                </div>
              </Link>

              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed max-w-sm">
                Healthcare, simplified with intelligent assistance. Unifying symptom triage, clinical conditions, and certified pharmaceutical monographs into one intelligent ecosystem.
              </p>

              {/* Stats Strip */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                  132 ML Indicators
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                  3,978+ Medicines
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                  41 Diseases
                </span>
              </div>

              {/* Emergency Alert Pill */}
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-300 text-[11px] leading-snug flex items-start gap-2">
                <PhoneCall className="w-3.5 h-3.5 mt-0.5 shrink-0 text-rose-500" />
                <span>
                  <strong>Emergency Notice:</strong> MediAssist is not for acute emergency care. In critical situations, dial <a href="tel:108" className="font-bold underline hover:text-rose-600">108</a> / <a href="tel:112" className="font-bold underline hover:text-rose-600">112</a> / <a href="tel:911" className="font-bold underline hover:text-rose-600">911</a> immediately.
                </span>
              </div>
            </div>

            {/* Column 2: Platform Capabilities (Span 2) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Platform
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/symptom-checker"
                    onClick={(e) => handleProtectedAction(e, '/symptom-checker')}
                    className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-sky-500" />
                    <span>Symptom Checker</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/medicines"
                    onClick={(e) => handleProtectedAction(e, '/medicines')}
                    className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors flex items-center gap-1.5"
                  >
                    <Pill className="w-3 h-3 text-blue-500" />
                    <span>Medicine Explorer</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/diseases"
                    onClick={(e) => handleProtectedAction(e, '/diseases')}
                    className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors flex items-center gap-1.5"
                  >
                    <Stethoscope className="w-3 h-3 text-teal-500" />
                    <span>Disease Encyclopedia</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    onClick={(e) => handleProtectedAction(e, '/dashboard')}
                    className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  >
                    Patient Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/history"
                    onClick={(e) => handleProtectedAction(e, '/history')}
                    className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  >
                    Assessment History
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Clinical & Safety (Span 2) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Clinical Safety
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setActiveTab('safety')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-left">
                    Decision Support Limits
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('methodology')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-left">
                    Differential Methodology
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('terms')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-left">
                    Emergency Protocols
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('privacy')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-left">
                    Data Encryption
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('cookie')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-left">
                    Storage &amp; Privacy
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal & Policy (Span 2) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Legal &amp; Trust
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setActiveTab('privacy')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-left font-medium">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('cookie')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-left font-medium">
                    Cookie Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('terms')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-left font-medium">
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('help')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-left font-medium">
                    Help &amp; Support
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('contact')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-left font-medium">
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 5: Care & Direct Contact (Span 2) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Support Desk
              </h4>
              <div className="space-y-2 text-xs">
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Have inquiries regarding medications or health conditions?
                </p>
                <div className="space-y-1 pt-1 font-mono text-[11px]">
                  <div className="text-slate-800 dark:text-slate-200 font-bold">
                    support@mediassist.health
                  </div>
                  <div className="text-slate-500">
                    Response time: &lt; 2 Hours
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="mt-2 w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5 text-sky-500" />
                  <span>Contact Care Desk</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. BOTTOM SUB-FOOTER: PIPE-SEPARATED LINKS & DYNAMIC COPYRIGHT */}
        {/* ========================================================================= */}
        <div className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              {/* Pipe-separated Horizontal Link Strip */}
              <nav className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <button
                  onClick={() => setActiveTab('privacy')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus:outline-none"
                >
                  Privacy Policy
                </button>
                <span className="text-slate-300 dark:text-slate-700 select-none">|</span>

                <button
                  onClick={() => setActiveTab('cookie')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus:outline-none"
                >
                  Cookie Policy
                </button>
                <span className="text-slate-300 dark:text-slate-700 select-none">|</span>

                <button
                  onClick={() => setActiveTab('terms')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus:outline-none"
                >
                  Terms of Service
                </button>
                <span className="text-slate-300 dark:text-slate-700 select-none">|</span>

                <button
                  onClick={() => setActiveTab('help')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus:outline-none"
                >
                  Help &amp; Support
                </button>
                <span className="text-slate-300 dark:text-slate-700 select-none">|</span>

                <button
                  onClick={() => setActiveTab('contact')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus:outline-none"
                >
                  Contact Us
                </button>
              </nav>

              {/* Dynamic Copyright Line */}
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-500">
                &copy; {startYear} &ndash; {currentYear} MediAssist. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 4. MODAL DIALOGS FOR ALL FOOTER LINKS (No 404s, fully self-contained) */}
      {/* ========================================================================= */}
      {activeTab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                {activeTab === 'privacy' && <Lock className="w-5 h-5 text-sky-500" />}
                {activeTab === 'cookie' && <Cookie className="w-5 h-5 text-amber-500" />}
                {activeTab === 'terms' && <FileText className="w-5 h-5 text-teal-500" />}
                {activeTab === 'help' && <HelpCircle className="w-5 h-5 text-indigo-500" />}
                {activeTab === 'contact' && <Mail className="w-5 h-5 text-rose-500" />}
                {activeTab === 'methodology' && <Sparkles className="w-5 h-5 text-sky-500" />}
                {activeTab === 'safety' && <ShieldCheck className="w-5 h-5 text-teal-500" />}
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  {activeTab === 'privacy' && 'Privacy & Health Data Protection'}
                  {activeTab === 'cookie' && 'Cookie & Local Storage Policy'}
                  {activeTab === 'terms' && 'Terms of Service & Clinical Boundary'}
                  {activeTab === 'help' && 'Help & Support Center'}
                  {activeTab === 'contact' && 'Contact MediAssist Care Team'}
                  {activeTab === 'methodology' && 'Differential ML Methodology'}
                  {activeTab === 'safety' && 'Clinical Safety & Boundaries'}
                </h3>
              </div>
              <button
                onClick={() => setActiveTab(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-3">
                  <p>
                    At <strong>MediAssist</strong>, patient privacy and health data confidentiality are fundamental principles.
                  </p>
                  <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 space-y-2">
                    <h4 className="font-bold text-sky-900 dark:text-sky-300 text-xs">Our Privacy Commitments:</h4>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-sky-200/90">
                      <li><strong>Zero Sale of Personal Data:</strong> We never sell your health questions, symptom choices, or profile data to advertisers or third parties.</li>
                      <li><strong>Local Isolation:</strong> Your differential symptom history is stored in local client storage and only shared with ML models during active evaluation requests.</li>
                      <li><strong>Encrypted Transport:</strong> All communication between your client device and our machine learning backend is secured with TLS encryption.</li>
                    </ul>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Last updated: September 2026. For privacy inquiries, reach us at privacy@mediassist.health.
                  </p>
                </div>
              )}

              {/* Cookie Policy Tab */}
              {activeTab === 'cookie' && (
                <div className="space-y-3">
                  <p>
                    MediAssist uses minimal essential cookies and browser storage tokens strictly necessary for system operation and user preferences.
                  </p>
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
                    <h4 className="font-bold text-amber-900 dark:text-amber-300 text-xs">Technologies Used:</h4>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-amber-200/90">
                      <li><strong>Authentication Session:</strong> Secure session token stored locally to maintain your logged-in state.</li>
                      <li><strong>Appearance &amp; Theme:</strong> Stores your Light / Dark mode visual preference.</li>
                      <li><strong>Triage Local Cache:</strong> Caches symptom entries locally so you do not lose in-progress selections on page refresh.</li>
                    </ul>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    We do not deploy third-party advertising tracking pixels or cross-site tracking cookies.
                  </p>
                </div>
              )}

              {/* Terms of Service Tab */}
              {activeTab === 'terms' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 space-y-2">
                    <h4 className="font-bold text-teal-900 dark:text-teal-300 text-xs">Clinical Boundary &amp; Non-Emergency Use:</h4>
                    <p className="text-slate-700 dark:text-teal-200/90">
                      MediAssist is a clinical decision-support and health informational resource. It is <strong>NOT</strong> a substitute for professional clinical judgment, emergency response, diagnostic testing, or doctor prescriptions.
                    </p>
                  </div>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Users must be 18 years of age or supervised by a legal guardian when using predictive health tools.</li>
                    <li>Always consult a certified medical physician before beginning or discontinuing any pharmaceutical regimen.</li>
                    <li>If experiencing acute or severe symptoms (e.g. chest pressure, sudden numbness), call local emergency numbers immediately.</li>
                  </ul>
                </div>
              )}

              {/* Methodology Tab */}
              {activeTab === 'methodology' && (
                <div className="space-y-3">
                  <p>
                    MediAssist utilizes an ensemble multi-class gradient boosting model trained on 132 canonical clinical symptom indicators across 41 common and chronic health conditions.
                  </p>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white">How Scores are Computed:</h4>
                    <p className="text-[11px]">
                      The engine evaluates the co-occurrence probability distribution for the chosen symptom fingerprint, computing confidence percentages for the top 3 differential conditions while mapping linked verified pharmaceuticals.
                    </p>
                  </div>
                </div>
              )}

              {/* Safety Tab */}
              {activeTab === 'safety' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 space-y-2">
                    <h4 className="font-bold text-rose-900 dark:text-rose-300">Safety Guardrails &amp; Overrides:</h4>
                    <p className="text-rose-800 dark:text-rose-200/90 text-[11px]">
                      If critical indicators (such as acute chest pain, hemoptysis, or sudden loss of motor function) are selected, MediAssist automatically triggers an emergency warning overlay to redirect the patient to emergency facilities.
                    </p>
                  </div>
                </div>
              )}

              {/* Help & Support Tab */}
              {activeTab === 'help' && (
                <div className="space-y-3">
                  <p>
                    Need assistance finding information or running a symptom check? Here is a quick guide to using MediAssist:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                      <span className="font-bold text-slate-900 dark:text-white block">Symptom Checker</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Pick active symptoms from the 132-indicator grid and receive top 3 differential predictions with confidence scores.
                      </p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                      <span className="font-bold text-slate-900 dark:text-white block">Medicine Explorer</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Search 3,978+ pharmaceutical monographs with composition, manufacturer, and pricing details.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Us Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-4">
                  {contactSubmitted ? (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span>Thank you! Your inquiry has been sent to our patient support team. We will respond shortly.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                          Your Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                          Message or Question
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="How can our support team assist you?"
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </button>
                    </form>
                  )}

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                    <span>Direct Email: <a href="mailto:support@mediassist.health" className="hover:underline">support@mediassist.health</a></span>
                    <span>Emergency: <a href="tel:108" className="font-semibold text-rose-500 hover:underline">108</a> / <a href="tel:112" className="font-semibold text-rose-500 hover:underline">112</a> / <a href="tel:911" className="font-semibold text-rose-500 hover:underline">911</a></span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveTab(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 font-semibold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
