import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHistoryList, deleteAnalysisItem } from '../services/resumeService';
import { SkeletonTable } from '../components/Skeleton';
import toast from 'react-hot-toast';
import { Search, Trash2, Eye, Calendar, Sparkles, FileText, ArrowLeft } from 'lucide-react';

export const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHistory = async () => {
    try {
      const response = await getHistoryList();
      setAnalyses(response.analyses || []);
    } catch (error) {
      toast.error('Failed to load history list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis? This action cannot be undone.')) {
      return;
    }

    const toastId = toast.loading('Deleting analysis...');
    try {
      await deleteAnalysisItem(id);
      toast.success('Analysis deleted successfully.', { id: toastId });
      // filter deleted item in state
      setAnalyses((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error('Failed to delete analysis.', { id: toastId });
    }
  };

  // Filter based on search term
  const filteredAnalyses = analyses.filter((item) =>
    item.resumeId?.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-40 rounded bg-slate-200 dark:bg-dark-900 animate-pulse"></div>
        <SkeletonTable />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header and Back Link */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-outfit text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Analysis History
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Search, view, or manage your historical resume uploads and scores.
          </p>
        </div>
        
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 dark:bg-emerald-500"
        >
          <Sparkles className="h-4.5 w-4.5" />
          <span>New Analysis</span>
        </Link>
      </div>

      {/* Search Filter Box */}
      {analyses.length > 0 && (
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            className="w-full rounded-2xl border border-slate-200 bg-white/60 py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-dark-800 dark:bg-dark-900/50 dark:text-slate-200 dark:focus:border-emerald-500"
            placeholder="Search by file name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* History Layout */}
      {filteredAnalyses.length > 0 ? (
        <div className="rounded-3xl glass p-6 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
              <thead className="bg-slate-50/50 text-xs font-semibold text-slate-700 uppercase tracking-wider dark:bg-dark-900/50 dark:text-slate-300">
                <tr>
                  <th className="px-6 py-4">File Name</th>
                  <th className="px-6 py-4">Uploaded Date</th>
                  <th className="px-6 py-4">Resume Quality</th>
                  <th className="px-6 py-4">ATS Match</th>
                  <th className="px-6 py-4">Grammar Score</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                {filteredAnalyses.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/20 dark:hover:bg-dark-900/10 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200 max-w-[200px] truncate">
                      {item.resumeId?.fileName || 'Deleted File'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {new Date(item.resumeId?.uploadDate || item.createdAt).toLocaleDateString()}
                      </span>
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
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
                        {item.grammarScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/analysis/${item._id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 dark:border-dark-850 dark:hover:bg-dark-900 dark:text-slate-350 transition-colors"
                          title="View Analysis"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50/20 hover:bg-red-50 text-red-600 dark:border-red-900/30 dark:bg-red-950/10 dark:text-red-405 dark:hover:bg-red-950/20 transition-colors"
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
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl glass p-12 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="mt-6 font-outfit text-xl font-bold text-slate-800 dark:text-slate-100">
            {searchTerm ? 'No Matching Resumes' : 'No Analysis History'}
          </h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            {searchTerm 
              ? `We couldn't find any results matching "${searchTerm}". Try another search term.`
              : 'You haven\'t uploaded or parsed any resumes yet. Start scanning now!'}
          </p>
          <div className="mt-8">
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-emerald-500 dark:bg-emerald-500"
            >
              <Sparkles className="h-5 w-5" />
              <span>Upload Resume</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
