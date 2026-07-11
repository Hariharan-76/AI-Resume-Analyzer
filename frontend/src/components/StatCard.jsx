import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({ title, value, icon: Icon, description, trend, color = 'emerald' }) => {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-900/30',
      accent: 'bg-emerald-500',
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/20',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-100 dark:border-indigo-900/30',
      accent: 'bg-indigo-500',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/30',
      accent: 'bg-amber-500',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/20',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-100 dark:border-rose-900/30',
      accent: 'bg-rose-500',
    },
  };

  const activeColor = colorMap[color] || colorMap.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl glass p-6 shadow-sm hover:shadow-md dark:shadow-slate-900/20"
    >
      <div className={`absolute top-0 left-0 h-1.5 w-full ${activeColor.accent}`} />
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="mt-1 font-outfit text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            {value}
          </h3>
        </div>
        
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${activeColor.bg} ${activeColor.text}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {(description || trend) && (
        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {trend}
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
