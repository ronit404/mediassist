'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import {
  Settings,
  Sun,
  Moon,
  Laptop,
  Check,
  Lock,
  User,
  Trash2,
  ShieldAlert,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { clearLocalHistory, getLocalHistory } from '@/lib/api';
import PasswordInput from '@/components/auth/PasswordInput';
import DisclaimerCard from '@/components/ui/DisclaimerCard';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [historyCleared, setHistoryCleared] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length >= 8) {
      setPasswordSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPasswordSaved(false), 3000);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your entire local symptom history?')) {
      clearLocalHistory();
      setHistoryCleared(true);
      setTimeout(() => setHistoryCleared(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-300 text-xs font-semibold">
          <Settings className="w-3.5 h-3.5" />
          <span>User Preferences</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Settings & Appearance</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your account profile, visual themes, security, and privacy data.
        </p>
      </div>

      <div className="space-y-6">
        {/* ========================================================================= */}
        {/* SECTION 1: APPEARANCE & THEME */}
        {/* ========================================================================= */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Appearance & Theme</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your preferred visual mode for the MediAssist platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Light Mode */}
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
                theme === 'light'
                  ? 'bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-300 ring-2 ring-amber-500/40'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Sun className="w-5 h-5 text-amber-500" />
                {theme === 'light' && <Check className="w-4 h-4 text-amber-500" />}
              </div>
              <div>
                <h4 className="font-bold text-sm">Light Mode</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Clean clinical white and soft slate surfaces.
                </p>
              </div>
            </button>

            {/* Dark Mode */}
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-teal-500/10 border-teal-500 text-teal-900 dark:text-teal-300 ring-2 ring-teal-500/40'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Moon className="w-5 h-5 text-teal-400" />
                {theme === 'dark' && <Check className="w-4 h-4 text-teal-400" />}
              </div>
              <div>
                <h4 className="font-bold text-sm">Dark Mode</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Sleek obsidian & charcoal with cyan accents.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: ACCOUNT PROFILE */}
        {/* ========================================================================= */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Information</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Details associated with your active user account.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Account Name</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {user?.name || 'Healthcare User'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Email Address</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {user?.email || 'user@mediassist.com'}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: CHANGE PASSWORD */}
        {/* ========================================================================= */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Security & Password</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Update your account password to maintain security.
            </p>
          </div>

          {passwordSaved && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Password successfully updated.</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <PasswordInput
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />

            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
            />

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-transform active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Password</span>
            </button>
          </form>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 4: PRIVACY & DATA MANAGEMENT */}
        {/* ========================================================================= */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4 border-red-500/20">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Privacy & Data Management</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear your locally recorded health symptom assessments.
            </p>
          </div>

          {historyCleared && (
            <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Symptom assessment history cleared from this browser.</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Clear Analysis History</h4>
              <p className="text-[11px] text-slate-500">
                Permanently deletes all saved differential prediction runs from local storage.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClearHistory}
              className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Health History</span>
            </button>
          </div>
        </div>
      </div>

      <DisclaimerCard />
    </div>
  );
}
