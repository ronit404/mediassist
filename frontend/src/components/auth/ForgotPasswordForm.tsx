'use client';

import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ForgotPasswordFormProps {
  onSwitchToLogin?: () => void;
}

export default function ForgotPasswordForm({ onSwitchToLogin }: ForgotPasswordFormProps) {
  const { forgotPassword, setAuthModalMode } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      setAuthModalMode('login');
    }
  };

  if (submitted) {
    return (
      <div className="space-y-6 py-2 text-center animate-in fade-in">
        <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Check Your Email</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            If an account exists for <strong className="text-slate-900 dark:text-white">{email}</strong>, we have sent instructions to reset your password.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleBackToLogin}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:from-sky-500 hover:to-teal-400 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Registered Email Address
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 font-bold text-white text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-95 transition-all disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending Reset Link...</span>
          </>
        ) : (
          <>
            <span>Send Reset Instructions</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={handleBackToLogin}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </button>
      </div>
    </form>
  );
}
