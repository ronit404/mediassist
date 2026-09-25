'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import PasswordInput from '@/components/auth/PasswordInput';
import PasswordStrength from '@/components/auth/PasswordStrength';
import { useAuth } from '@/context/AuthContext';

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  redirectTarget?: string | null;
}

export default function SignupForm({
  onSuccess,
  onSwitchToLogin,
  redirectTarget,
}: SignupFormProps) {
  const router = useRouter();
  const { signup, setAuthModalMode, redirectPath } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const finalRedirect = redirectTarget || redirectPath;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError('Please enter your full name (minimum 2 characters).');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!agreeToTerms) {
      setError('You must agree to the Terms of Use and Privacy Policy to create an account.');
      return;
    }

    setIsLoading(true);

    try {
      await signup({ name, email, password });
      if (onSuccess) {
        onSuccess();
      }
      if (finalRedirect && finalRedirect.startsWith('/') && !finalRedirect.startsWith('//')) {
        router.push(finalRedirect);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onSwitchToLogin) {
      onSwitchToLogin();
    }
    setAuthModalMode('login');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Full Name
        </label>
        <div className="relative">
          <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dr. / Jane Doe"
            className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
          />
        </div>
      </div>

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
            placeholder="jane@example.com"
            className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a strong password"
          required
        />
        <PasswordStrength password={password} />
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
          required
        />
      </div>

      {/* Terms Agreement */}
      <div className="flex items-start gap-2 pt-1">
        <input
          type="checkbox"
          id="modalTerms"
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-teal-600 focus:ring-teal-500 mt-0.5"
        />
        <label htmlFor="modalTerms" className="text-xs text-slate-600 dark:text-slate-400 leading-normal select-none cursor-pointer">
          I agree to the{' '}
          <span className="text-sky-600 dark:text-sky-400 font-medium">
            Terms of Use
          </span>{' '}
          and acknowledge that MediAssist is an educational clinical-decision support platform.
        </label>
      </div>

      {/* Create Account CTA */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 font-bold text-white text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Switch to Sign In */}
      <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <button
          type="button"
          onClick={handleLoginClick}
          className="text-sky-600 dark:text-sky-400 font-bold hover:underline"
        >
          Sign In
        </button>
      </div>
    </form>
  );
}
