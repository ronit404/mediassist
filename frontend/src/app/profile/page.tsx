'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  LogOut,
  History,
  Sparkles,
  HeartPulse,
  Save,
  CheckCircle,
  AlertCircle,
  Shield,
  Phone,
  Calendar,
  Droplet,
  UserCheck
} from 'lucide-react';
import { fetchPatientHistory } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, patientProfile, token, logout, updateProfile, openAuthModal } = useAuth();
  const [historyCount, setHistoryCount] = useState<number>(0);
  
  // Editable profile state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergiesText, setAllergiesText] = useState('');
  const [conditionsText, setConditionsText] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync profile fields when patientProfile loads
  useEffect(() => {
    if (patientProfile) {
      setName(patientProfile.name || user?.name || '');
      setPhone(patientProfile.phone || '');
      setDob(patientProfile.date_of_birth || '');
      setGender(patientProfile.gender || '');
      setBloodGroup(patientProfile.blood_group || '');
      setAllergiesText((patientProfile.allergies || []).join(', '));
      setConditionsText((patientProfile.chronic_conditions || []).join(', '));
      setNotes(patientProfile.notes || '');
    } else if (user) {
      setName(user.name || '');
    }
  }, [patientProfile, user]);

  useEffect(() => {
    if (token) {
      fetchPatientHistory(token).then((items) => setHistoryCount(items.length)).catch(() => {});
    }
  }, [token]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    setSaveSuccess(false);

    try {
      const allergiesList = allergiesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
        
      const conditionsList = conditionsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const ok = await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        date_of_birth: dob,
        gender,
        blood_group: bloodGroup,
        allergies: allergiesList,
        chronic_conditions: conditionsList,
        notes: notes.trim(),
      });

      if (ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setErrorMsg('Failed to update patient profile. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-sky-500/10 text-sky-600 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Authentication Required</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Please sign in to access and manage your dynamic patient profile.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold shadow-lg shadow-sky-500/20"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 text-xs font-semibold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Verified Patient Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Personal Health Profile
          </h1>
        </div>

        <button
          onClick={handleLogout}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Profile Overview Card */}
      <div className="saas-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-sky-500/20">
            {user.name ? user.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              Authenticated Patient (ID: {user.id})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Auth User ID</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{user.id}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Joined Platform</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{user.createdAt || 'Recent'}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Logged Triage Records</span>
            <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">{historyCount} Records</span>
          </div>
        </div>
      </div>

      {/* Patient Health Form */}
      <div className="saas-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-sky-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Clinical & Demographic Details</h3>
          </div>
          <span className="text-xs text-slate-400">Encrypted & Private</span>
        </div>

        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Profile information synchronized successfully.</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                placeholder="Patient name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Other">Other / Prefer not to say</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Known Allergies</label>
              <input
                type="text"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                placeholder="Penicillin, Peanuts, Pollen (comma-separated)"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Chronic Conditions</label>
            <input
              type="text"
              value={conditionsText}
              onChange={(e) => setConditionsText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              placeholder="Asthma, Hypertension, Type 2 Diabetes (comma-separated)"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Clinical Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              placeholder="Add any medical notes or observations..."
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-sky-500/20 inline-flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving to Database...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/history"
          className="saas-card-hover rounded-2xl p-5 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Symptom History</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">View previous AI differential results</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform">
            View →
          </span>
        </Link>

        <Link
          href="/symptom-checker"
          className="saas-card-hover rounded-2xl p-5 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Run New Triage</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Assess active symptoms with ML</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform">
            Start →
          </span>
        </Link>
      </div>
    </div>
  );
}

