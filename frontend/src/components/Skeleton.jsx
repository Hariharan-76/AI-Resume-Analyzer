import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="w-full rounded-2xl glass p-6 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-3 w-1/2">
          <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-8 w-28 rounded bg-slate-200 dark:bg-slate-800"></div>
        </div>
        <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
      </div>
      <div className="mt-4 h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800"></div>
    </div>
  );
};

export const SkeletonList = () => {
  return (
    <div className="space-y-4 rounded-2xl glass p-6 shadow-sm animate-pulse">
      <div className="h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-800"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-800"></div>
            <div className="h-3 flex-grow rounded bg-slate-200 dark:bg-slate-800"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonTable = () => {
  return (
    <div className="w-full rounded-2xl glass p-6 shadow-sm animate-pulse">
      <div className="mb-6 flex justify-between">
        <div className="h-10 w-1/3 rounded bg-slate-200 dark:bg-slate-800"></div>
        <div className="h-10 w-24 rounded bg-slate-200 dark:bg-slate-800"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex justify-between border-b border-slate-100 py-3 dark:border-dark-900">
            <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800"></div>
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800"></div>
            <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default { SkeletonCard, SkeletonList, SkeletonTable };
