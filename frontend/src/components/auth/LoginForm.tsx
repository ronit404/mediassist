'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, Loader2, AlertCircle, Lock } from 'lucide-react';
import PasswordInput from '@/components/auth/PasswordInput';
import { useAuth } from '@/context/AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
  onSwitchToForgotPassword?: () => void;
  redirectTarget?: string | null;
}

export default function LoginForm({
  onSuccess,
  onSwitchToSignup,
  onSwitchToForgotPassword,
  redirectTarget,
}: LoginFormProps) {
  const router = useRouter();
  const { login, setAuthModalMode, redirectPath } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const finalRedirect = redirectTarget || redirectPath;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password, rememberMe });
      if (onSuccess) {
        onSuccess();
      }
      if (finalRedirect && finalRedirect.startsWith('/') && !finalRedirect.startsWith('//')) {
        router.push(finalRedirect);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onSwitchToSignup) {
      onSwitchToSignup();
    }
    setAuthModalMode('signup');
  };

  const handleForgotClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onSwitchToForgotPassword) {
      onSwitchToForgotPassword();
    }
    setAuthModalMode('forgot-password');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Protected Route Redirect Notice Banner */}
      {finalRedirect && (
        <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-700 dark:text-sky-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <Lock className="w-4 h-4 shrink-0 text-sky-500" />
          <span>Please sign in to access this protected healthcare feature.</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Email Address
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

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Password</span>
          <button
            type="button"
            onClick={handleForgotClick}
            className="text-teal-600 dark:text-teal-400 hover:underline text-[11px] font-medium"
          >
            Forgot password?
          </button>
        </div>
        <PasswordInput
          label=""
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          required
        />
      </div>

      {/* Remember Me */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="modalRememberMe"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-teal-600 focus:ring-teal-500"
        />
        <label htmlFor="modalRememberMe" className="text-xs text-slate-600 dark:text-slate-400 select-none cursor-pointer">
          Remember me on this browser
        </label>
      </div>

      {/* Sign In CTA */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 font-bold text-white text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Authenticating Session...</span>
          </>
        ) : (
          <>
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Switch to Signup */}
      <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
        New to MediAssist?{' '}
        <button
          type="button"
          onClick={handleSignupClick}
          className="text-sky-600 dark:text-sky-400 font-bold hover:underline"
        >
          Create Account
        </button>
      </div>
    </form>
  );
}
