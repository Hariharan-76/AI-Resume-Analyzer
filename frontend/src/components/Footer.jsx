import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200/50 bg-white/70 py-8 dark:border-dark-900/50 dark:bg-dark-950/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-emerald-500 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-outfit text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
              ResuScan AI
            </span>
          </div>

          {/* Description */}
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 sm:text-left">
            <span>© {new Date().getFullYear()} ResuScan AI. Built with MERN & Google Gemini.</span>
          </div>

          {/* Credits */}
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <span>Developed with</span>
            <Heart className="h-3 w-3 fill-red-500 text-red-500" />
            <span>for job seekers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
