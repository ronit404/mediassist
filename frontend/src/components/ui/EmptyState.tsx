import React from 'react';
import Link from 'next/link';
import { SearchX, Sparkles, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onRetry?: () => void;
}

export default function EmptyState({
  title = 'No Results Found',
  description = 'We could not find anything matching your search criteria.',
  actionText,
  actionHref,
  onRetry,
}: EmptyStateProps) {
  return (
    <div className="saas-card rounded-3xl p-12 text-center max-w-md mx-auto my-8 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-500 dark:text-slate-400 mx-auto">
        <SearchX className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h4>
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>

      <div className="pt-2 flex items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset / Retry</span>
          </button>
        )}
        {actionHref && actionText && (
          <Link
            href={actionHref}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-sky-600/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{actionText}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
