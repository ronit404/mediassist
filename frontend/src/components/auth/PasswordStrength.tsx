import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const rules = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
    { label: 'One special character (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const metCount = rules.filter((r) => r.met).length;

  // Strength score
  let strengthLabel = 'Weak';
  let strengthColor = 'bg-red-500';
  let strengthTextColor = 'text-red-500';

  if (metCount >= 4) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-emerald-500';
    strengthTextColor = 'text-emerald-500';
  } else if (metCount >= 2) {
    strengthLabel = 'Medium';
    strengthColor = 'bg-amber-500';
    strengthTextColor = 'text-amber-500';
  }

  if (!password) return null;

  return (
    <div className="space-y-2 pt-1">
      {/* Strength Bar */}
      <div className="flex items-center justify-between text-[11px] font-semibold">
        <span className="text-slate-500 dark:text-slate-400">Password Strength:</span>
        <span className={strengthTextColor}>{strengthLabel}</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        <div className={`rounded-full ${metCount >= 1 ? strengthColor : 'bg-slate-200 dark:bg-slate-800'}`} />
        <div className={`rounded-full ${metCount >= 2 ? strengthColor : 'bg-slate-200 dark:bg-slate-800'}`} />
        <div className={`rounded-full ${metCount >= 4 ? strengthColor : 'bg-slate-200 dark:bg-slate-800'}`} />
        <div className={`rounded-full ${metCount === 5 ? strengthColor : 'bg-slate-200 dark:bg-slate-800'}`} />
      </div>

      {/* Rules Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1.5 text-[11px]">
        {rules.map((r) => (
          <div
            key={r.label}
            className={`flex items-center gap-1.5 ${
              r.met ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {r.met ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-slate-400" />}
            <span>{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
