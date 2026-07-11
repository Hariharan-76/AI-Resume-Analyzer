import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnalysisDetails } from '../services/resumeService';
import { exportAnalysisToPDF } from '../utils/pdfExporter';
import ChartSection from '../components/ChartSection';
import { SkeletonList, SkeletonTable } from '../components/Skeleton';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Briefcase, 
  Tags,
  BookOpen,
  Award,
  Sparkles
} from 'lucide-react';

export const Analysis = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const response = await getAnalysisDetails(id);
        setAnalysis(response);
      } catch (error) {
        toast.error('Failed to retrieve analysis details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [id]);

  const handleDownload = () => {
    if (!analysis) return;
    try {
      exportAnalysisToPDF(analysis, analysis.resumeId?.fileName);
      toast.success('PDF report downloaded successfully!');
    } catch (err) {
      toast.error('Failed to generate PDF report.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-10 w-64 rounded bg-slate-200 dark:bg-dark-900 animate-pulse"></div>
        <SkeletonList />
        <SkeletonTable />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Analysis Not Found</h2>
        <p className="mt-2 text-slate-500">The requested resume review is not available or has been deleted.</p>
        <Link to="/dashboard" className="mt-6 inline-flex items-center gap-2 text-emerald-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const {
    resumeScore = 0,
    atsScore = 0,
    grammarScore = 0,
    summary = '',
    strengths = [],
    weaknesses = [],
    skillsFound = [],
    missingSkills = [],
    recommendedJobs = [],
    improvements = [],
    keywords = [],
    resumeId = {}
  } = analysis;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header and Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/50 pb-6 dark:border-dark-900/50">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 dark:border-dark-850 dark:hover:bg-dark-900 dark:text-slate-400"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-outfit text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FileText className="h-6 w-6 text-emerald-500" />
              <span>Resume Analysis Report</span>
            </h1>
            <p className="text-xs text-slate-500">
              File: <span className="font-semibold text-slate-700 dark:text-slate-300">{resumeId.fileName}</span> • Analyzed on: {new Date(resumeId.uploadDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-500 hover:shadow-emerald-500/20 dark:bg-emerald-500 dark:hover:bg-emerald-400 transition-all duration-200"
          >
            <Download className="h-4.5 w-4.5" />
            <span>Download PDF Report</span>
          </button>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/50 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-dark-800 dark:bg-dark-900/50 dark:text-slate-300 dark:hover:bg-dark-800 transition-all duration-200"
          >
            <Sparkles className="h-4.5 w-4.5" />
            <span>Analyze Another</span>
          </Link>
        </div>
      </div>

      {/* Main Charts Breakdown */}
      <motion.div variants={itemVariants} className="rounded-3xl glass p-6 shadow-sm">
        <ChartSection resumeScore={resumeScore} atsScore={atsScore} grammarScore={grammarScore} />
      </motion.div>

      {/* Executive Summary */}
      <motion.div variants={itemVariants} className="rounded-3xl glass p-6 shadow-sm space-y-4">
        <h3 className="font-outfit text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-500" />
          <span>Executive Summary</span>
        </h3>
        <blockquote className="border-l-4 border-emerald-500 pl-4 py-1 text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed bg-emerald-50/20 dark:bg-emerald-950/5 rounded-r-xl">
          {summary}
        </blockquote>
      </motion.div>

      {/* Strengths & Weaknesses Grids */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Strengths Card */}
        <motion.div variants={itemVariants} className="rounded-3xl glass p-6 shadow-sm space-y-4 border-t-4 border-emerald-500">
          <h3 className="font-outfit text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span>Key Strengths</span>
          </h3>
          <ul className="space-y-3">
            {strengths.map((item, index) => (
              <li key={index} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-350">
                <span className="h-5 w-5 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 flex-shrink-0 mt-0.5 font-bold">✓</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Weaknesses Card */}
        <motion.div variants={itemVariants} className="rounded-3xl glass p-6 shadow-sm space-y-4 border-t-4 border-rose-500">
          <h3 className="font-outfit text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-500" />
            <span>Areas of Concern</span>
          </h3>
          <ul className="space-y-3">
            {weaknesses.map((item, index) => (
              <li key={index} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-350">
                <span className="h-5 w-5 flex items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-450 flex-shrink-0 mt-0.5 font-bold">!</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Suggested Improvements & Missing Skills */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recommended Improvements */}
        <motion.div variants={itemVariants} className="rounded-3xl glass p-6 shadow-sm space-y-4 border-t-4 border-indigo-500">
          <h3 className="font-outfit text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-500" />
            <span>Actionable Improvements</span>
          </h3>
          <ul className="space-y-3">
            {improvements.map((item, index) => (
              <li key={index} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-350">
                <span className="text-indigo-500 font-bold flex-shrink-0 mt-0.5">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Missing Skills */}
        <motion.div variants={itemVariants} className="rounded-3xl glass p-6 shadow-sm space-y-4 border-t-4 border-amber-500">
          <h3 className="font-outfit text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-amber-500" />
            <span>Missing Recommended Skills</span>
          </h3>
          <ul className="space-y-3">
            {missingSkills.map((item, index) => (
              <li key={index} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-350">
                <span className="text-amber-500 font-bold flex-shrink-0 mt-0.5">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Skills, Keywords, Jobs Badges Row */}
      <motion.div variants={itemVariants} className="rounded-3xl glass p-6 shadow-sm space-y-6">
        {/* Skills Found */}
        <div className="space-y-3">
          <h4 className="font-outfit text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Tags className="h-4.5 w-4.5 text-emerald-500" />
            <span>Detected Skills ({skillsFound.length})</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {skillsFound.map((item, index) => (
              <span key={index} className="inline-flex rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div className="space-y-3">
          <h4 className="font-outfit text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Tags className="h-4.5 w-4.5 text-indigo-500" />
            <span>Target Industry Keywords ({keywords.length})</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {keywords.map((item, index) => (
              <span key={index} className="inline-flex rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="space-y-3">
          <h4 className="font-outfit text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Briefcase className="h-4.5 w-4.5 text-amber-500" />
            <span>Suggested Careers & Job Roles</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {recommendedJobs.map((item, index) => (
              <span key={index} className="inline-flex rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/30">
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analysis;
