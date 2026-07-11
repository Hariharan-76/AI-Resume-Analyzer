import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-500 dark:bg-dark-900 dark:text-slate-400 mb-6">
        <HelpCircle className="h-10 w-10 animate-bounce" />
      </div>
      
      <h1 className="font-outfit text-6xl font-extrabold text-slate-800 dark:text-slate-100">
        404
      </h1>
      
      <h2 className="mt-4 font-outfit text-2xl font-bold text-slate-700 dark:text-slate-200">
        Page Not Found
      </h2>
      
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        The link you followed may be broken or the page might have been removed.
      </p>
      
      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-emerald-500 dark:bg-emerald-500"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
