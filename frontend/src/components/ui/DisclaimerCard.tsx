import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface DisclaimerCardProps {
  className?: string;
}

export default function DisclaimerCard({ className = '' }: DisclaimerCardProps) {
  return (
    <div
      className={`p-4 rounded-2xl bg-amber-500/5 dark:bg-slate-900/90 border border-amber-500/20 dark:border-slate-800/80 flex items-start gap-3 text-slate-700 dark:text-slate-300 text-xs leading-relaxed ${className}`}
    >
      <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
        <ShieldAlert className="w-4 h-4" />
      </div>
      <div>
        <h5 className="font-semibold text-slate-900 dark:text-white mb-0.5">Important Medical Disclaimer</h5>
        <p className="text-slate-600 dark:text-slate-400 text-[11px]">
          MediAssist provides healthcare insights for informational and educational purposes only. AI-generated results and medicine mappings do not constitute confirmed diagnoses or clinical prescriptions. Always seek the advice of a qualified healthcare professional.
        </p>
      </div>
    </div>
  );
}
