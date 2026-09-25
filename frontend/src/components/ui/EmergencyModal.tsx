import React from 'react';
import { AlertTriangle, PhoneCall } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  detectedEmergencySymptoms: string[];
  onAcknowledge: () => void;
}

export default function EmergencyModal({
  isOpen,
  detectedEmergencySymptoms,
  onAcknowledge,
}: EmergencyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-950 border-2 border-red-500/80 p-6 sm:p-8 shadow-2xl shadow-red-950/60 text-white space-y-6">
        {/* Header Icon */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400 animate-pulse shrink-0">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-red-400">
              Critical Safety Override
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Urgent Medical Attention Advised
            </h2>
          </div>
        </div>

        {/* Core Warning */}
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-900/60 text-sm text-red-200 leading-relaxed space-y-2">
          <p className="font-semibold text-red-300">
            The symptoms you selected indicate a potential high-risk or acute clinical emergency:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-red-100 font-medium">
            {detectedEmergencySymptoms.map((sym) => (
              <li key={sym} className="capitalize">
                {sym.replace(/_/g, ' ')}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          MediAssist algorithms are designed for educational triage and must not delay emergency medical care. Please contact emergency services immediately or proceed to the nearest emergency department.
        </p>

        {/* Emergency Hotlines Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <a
            href="tel:108"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-white text-sm shadow-lg shadow-red-600/30 transition-transform active:scale-95 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 108 / 112 (India)</span>
          </a>
          <a
            href="tel:911"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-700 hover:bg-red-600 font-bold text-white text-sm shadow-lg shadow-red-700/30 transition-transform active:scale-95 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 911 (US/Intl)</span>
          </a>
        </div>

        {/* Dismiss to educational analysis */}
        <div className="pt-2 text-center">
          <button
            onClick={onAcknowledge}
            className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4 transition-colors"
          >
            I understand the risk and wish to view non-diagnostic educational information
          </button>
        </div>
      </div>
    </div>
  );
}
