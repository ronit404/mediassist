import React from 'react';
import Link from 'next/link';
import { Pill, Building2, Tag, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Medicine } from '@/types';
import { getDrugClinicalSummary, cleanGenericName, isPrescriptionRequired, formatMedicinePrice } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface MedicineCardProps {
  medicine: Medicine;
}

export default function MedicineCard({ medicine }: MedicineCardProps) {
  const { user, openAuthModal } = useAuth();
  const isRx = isPrescriptionRequired(medicine.prescription_required);
  const summary = getDrugClinicalSummary(medicine);
  const cleanGeneric = cleanGenericName(medicine.generic_name);
  const formattedPrice = formatMedicinePrice(medicine.price);
  
  const medicineTargetId = medicine.id || medicine._id || encodeURIComponent(medicine.name);

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      openAuthModal('login', `/medicines/${medicineTargetId}`);
    }
  };

  return (
    <div className="glass-card-hover rounded-2xl p-5 flex flex-col justify-between group border border-slate-200 dark:border-slate-700/80">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              isRx
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {isRx ? <AlertCircle className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
            {isRx ? 'Rx Required' : 'OTC / General'}
          </span>

          <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-cyan-800/40">
            {formattedPrice}
          </span>
        </div>

        {/* Medicine Name */}
        <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1 mb-1.5">
          <Link
            href={`/medicines/${medicineTargetId}`}
            onClick={handleClick}
            className="hover:underline"
          >
            {medicine.name}
          </Link>
        </h3>

        {/* Clean Generic Salt Composition */}
        {cleanGeneric && (
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-1 mb-3 flex items-center gap-1.5">
            <Pill className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
            <span className="truncate">{cleanGeneric}</span>
          </p>
        )}

        {/* High-Yield Key Takeaway (Clean bullet) */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 mb-3 space-y-1">
          <div className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 font-medium line-clamp-2 leading-relaxed">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <span>{summary.keyHighlights[0]}</span>
          </div>
        </div>

        {/* Manufacturer & Category */}
        <div className="space-y-1.5 mb-4">
          {medicine.category_or_disease && (
            <div>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800">
                <Tag className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
                <span className="truncate max-w-[220px]">{medicine.category_or_disease}</span>
              </span>
            </div>
          )}

          {medicine.manufacturer && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{medicine.manufacturer}</span>
            </p>
          )}
        </div>
      </div>

      {/* Action CTA */}
      <Link
        href={`/medicines/${medicineTargetId}`}
        onClick={handleClick}
        className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-blue-50 dark:hover:bg-cyan-950/30 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-slate-200 dark:border-slate-800 group-hover:border-blue-500/30 dark:group-hover:border-cyan-500/30"
      >
        <span>View Quick Monograph</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
