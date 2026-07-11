import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getHistoryList } from '../services/resumeService';
import { Calendar, User, Mail, Sparkles, Award, TrendingUp, History } from 'lucide-react';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getHistoryList();
        setStats(response.stats);
      } catch (error) {
        toast.error('Failed to retrieve profile analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="font-outfit text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your personal details and track your assessment activities.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* User Card Info */}
        <div className="rounded-3xl glass p-6 shadow-sm flex flex-col items-center text-center space-y-4 md:col-span-1 h-fit">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white font-outfit text-3xl font-bold shadow-md shadow-emerald-500/20">
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 className="font-outfit text-xl font-bold text-slate-800 dark:text-slate-100">
              {user?.name || 'User'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">Professional Candidate</p>
          </div>
          
          <div className="w-full border-t border-slate-100 my-4 dark:border-dark-850"></div>
          
          <div className="w-full space-y-3.5 text-left text-sm text-slate-600 dark:text-slate-350">
            <div className="flex items-center gap-2">
              <Mail className="h-4.5 w-4.5 text-slate-400" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-slate-400" />
              <span>Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* User Analytics Profile Summary */}
        <div className="rounded-3xl glass p-6 shadow-sm md:col-span-2 space-y-6">
          <h3 className="font-outfit text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            <span>Account Analytics</span>
          </h3>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-12 rounded bg-slate-200 dark:bg-dark-900"></div>
              <div className="h-12 rounded bg-slate-200 dark:bg-dark-900"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Total Analysed */}
                <div className="rounded-2xl bg-emerald-50/45 p-4 border border-emerald-100/50 dark:bg-emerald-950/15 dark:border-emerald-900/30 text-center">
                  <div className="flex justify-center mb-1 text-emerald-600 dark:text-emerald-400">
                    <History className="h-5 w-5" />
                  </div>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{stats?.totalAnalyses || 0}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">Uploaded Resumes</p>
                </div>

                {/* Avg Resume Quality */}
                <div className="rounded-2xl bg-indigo-50/45 p-4 border border-indigo-100/50 dark:bg-indigo-950/15 dark:border-indigo-900/30 text-center">
                  <div className="flex justify-center mb-1 text-indigo-600 dark:text-indigo-400">
                    <Award className="h-5 w-5" />
                  </div>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{stats?.averageResumeScore || 0}%</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">Avg Resume Score</p>
                </div>

                {/* Avg ATS Readability */}
                <div className="rounded-2xl bg-amber-50/45 p-4 border border-amber-100/50 dark:bg-amber-950/15 dark:border-amber-900/30 text-center">
                  <div className="flex justify-center mb-1 text-amber-600 dark:text-amber-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{stats?.averageAtsScore || 0}%</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">Avg ATS Match</p>
                </div>
              </div>

              {/* Assessment Message */}
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-dark-900/60 text-sm text-slate-600 dark:text-slate-350 leading-relaxed border border-slate-200/20">
                <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">💡 Optimization Tip</p>
                Your average resume compatibility score is{' '}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {stats?.averageResumeScore || 0}%
                </span>
                . Resumes scoring over 80% have a significantly higher rate of getting past automated screenings.
                Ensure you incorporate suggested key industry-related keywords in your active draft.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
