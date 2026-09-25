import React from 'react';

export function CardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
      <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="h-10 w-full bg-slate-200 dark:bg-slate-800/60 rounded-xl" />
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function LoadingSkeleton({ count = 4 }: { count?: number }) {
  return <GridSkeleton count={count} />;
}
