import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHistoryList, deleteAnalysisItem } from '../services/resumeService';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import ChartSection from '../components/ChartSection';
import { SkeletonCard, SkeletonTable } from '../components/Skeleton';
import toast from 'react-hot-toast';
import {
  Sparkles,
  Upload,
  History as HistoryIcon,
  Trash2,
  Eye,
  TrendingUp,
  FileSpreadsheet,
  Award,
  CheckSquare,
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await getHistoryList();
      setData(response);
    } catch (error) {
      toast.error('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis? This action cannot be undone.')) {
      return;
    }

    const toastId = toast.loading('Deleting analysis...');
    try {
      await deleteAnalysisItem(id);
      toast.success('Analysis deleted successfully.', { id: toastId });
      // Refresh dashboard data
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete analysis.', { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-10 w-48 rounded bg-slate-200 dark:bg-dark-900 animate-pulse"></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonTable />
      </div>
    );
  }

  const { analyses = [], stats = {} } = data || {};
  const latestAnalysis = analyses[0]; // Sorted by new in backend API

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-outfit text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Welcome, {user?.name || 'User'}!
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Here's a summary of your resume analyses and scores.
          </p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-500 hover:shadow-emerald-500/20 dark:bg-emerald-500 dark:hover:bg-emerald-400 transition-all duration-200"
        >
          <Upload className="h-5 w-5" />
          <span>Upload New Resume</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Average Resume Score"
          value={`${stats.averageResumeScore || 0}%`}
          icon={Award}
          color="emerald"
          description="Overall design and quality"
        />
        <StatCard
          title="Average ATS Match"
          value={`${stats.averageAtsScore || 0}%`}
          icon={TrendingUp}
          color="indigo"
          description="Readability and keywords"
        />
        <StatCard
          title="Average Grammar Score"
          value={`${stats.averageGrammarScore || 0}%`}
          icon={CheckSquare}
          color="amber"
          description="Writing and syntax errors"
        />
        <StatCard
          title="Total Resumes Parsed"
          value={stats.totalAnalyses || 0}
          icon={FileSpreadsheet}
          color="rose"
          description="Total submissions"
        />
      </div>

      {/* Main Charts & Analytics */}
      {analyses.length > 0 ? (
        <div className="space-y-8">
          {/* Charts Card */}
          <div className="rounded-2xl glass p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-outfit text-lg font-bold text-slate-800 dark:text-slate-200">
                Latest Analysis Quality Metrics
              </h3>
              <span className="text-xs text-slate-500">
                File: {latestAnalysis?.resumeId?.fileName}
              </span>
            </div>
            <ChartSection
              resumeScore={latestAnalysis?.resumeScore}
              atsScore={latestAnalysis?.atsScore}
              grammarScore={latestAnalysis?.grammarScore}
            />
          </div>

          {/* Recent Uploads Table */}
          <div className="rounded-2xl glass p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-outfit text-lg font-bold text-slate-800 dark:text-slate-200">
                Recent Submissions
              </h3>
              <Link
                to="/history"
                className="text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
              >
                View All History
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                <thead className="bg-slate-50/50 text-xs font-semibold text-slate-700 uppercase tracking-wider dark:bg-dark-900/50 dark:text-slate-300">
                  <tr>
                    <th className="px-6 py-4">File Name</th>
                    <th className="px-6 py-4">Date Uploaded</th>
                    <th className="px-6 py-4">Overall Score</th>
                    <th className="px-6 py-4">ATS Compatibility</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                  {analyses.slice(0, 5).map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/20 dark:hover:bg-dark-900/10 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                        {item.resumeId?.fileName || 'Deleted File'}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(item.resumeId?.uploadDate || item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                          {item.resumeScore}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400">
                          {item.atsScore}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/analysis/${item._id}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 dark:border-dark-850 dark:hover:bg-dark-900 dark:text-slate-300 transition-colors"
                            title="View Analysis"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50/20 hover:bg-red-50 text-red-600 dark:border-red-900/30 dark:bg-red-950/10 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl glass p-12 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
            <Upload className="h-8 w-8" />
          </div>
          <h3 className="mt-6 font-outfit text-xl font-bold text-slate-800 dark:text-slate-100">
            No Resumes Uploaded Yet
          </h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Scan and optimize your first resume to see metrics, scores, and deep-dive charts here.
          </p>
          <div className="mt-8">
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-500 dark:bg-emerald-500"
            >
              <Upload className="h-5 w-5" />
              <span>Upload Your First Resume</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
