import React from 'react';
import { PhoneCall } from 'lucide-react';

interface EmergencyContactButtonProps {
  number?: string;
  label?: string;
  className?: string;
}

export default function EmergencyContactButton({
  number = '108',
  label = 'Call 108 / 911',
  className = '',
}: EmergencyContactButtonProps) {
  return (
    <a
      href={`tel:${number}`}
      className={
        className ||
        "px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
      }
    >
      <PhoneCall className="w-4 h-4" />
      <span>{label}</span>
    </a>
  );
}
