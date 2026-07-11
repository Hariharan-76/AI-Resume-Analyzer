import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, FileText, CheckCircle2, ShieldCheck, ArrowRight, BarChart3, HelpCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Landing = () => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const features = [
    {
      icon: BarChart3,
      title: 'ATS Alignment Analyzer',
      description: 'Find out how well your resume matches candidate filtering software systems.',
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Recommendations',
      description: 'Leverages Google Gemini to parse, scan, and highlight actionable feedback.',
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20'
    },
    {
      icon: ShieldCheck,
      title: 'Keyword Density Auditor',
      description: 'Get a list of missing keywords needed to capture recruiters\' attention.',
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background radial highlights */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-400/5 blur-[120px] dark:bg-emerald-500/3"></div>
      <div className="absolute right-10 top-1/3 h-[600px] w-[600px] rounded-full bg-indigo-400/5 blur-[140px] dark:bg-indigo-500/3"></div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.div
            variants={itemVariants}
            className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-200/50 bg-emerald-50/50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Introducing Gemini 1.5 Powered ATS Grading</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mt-6 font-outfit text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 sm:text-6xl"
          >
            Optimize Your Resume for <br />
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
              Applicant Tracking Systems
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-base text-slate-500 dark:text-slate-400 sm:text-lg"
          >
            Upload your resume, find gaps in keywords, view your grammar score, and optimize your qualifications to pass ATS screeners with detailed AI summaries.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link
              to={user ? "/upload" : "/register"}
              className="group flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-medium text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 hover:shadow-emerald-500/35 dark:bg-emerald-500 dark:hover:bg-emerald-400 transition-all duration-300"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-slate-200 bg-white/50 px-6 py-3.5 font-medium text-slate-700 hover:bg-slate-50 dark:border-dark-800 dark:bg-dark-900/50 dark:text-slate-300 dark:hover:bg-dark-800 transition-all duration-300"
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-dark-900">
        <div className="text-center">
          <h2 className="font-outfit text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-4xl">
            Streamline Your Applications
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 dark:text-slate-400">
            ResuScan analyzes critical points in under 15 seconds, returning actionable scores and key areas to enhance.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="relative overflow-hidden rounded-2xl glass p-6 shadow-sm"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-outfit text-lg font-bold text-slate-800 dark:text-slate-200">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About / CTA Section */}
      <section id="about" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-center text-white shadow-xl dark:from-emerald-700 dark:to-emerald-950 sm:p-12">
          <Sparkles className="mx-auto h-10 w-10 text-emerald-300 animate-pulse" />
          <h2 className="mt-6 font-outfit text-3xl font-bold tracking-tight sm:text-4xl">
            Increase Interview Callbacks By up to 40%
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-emerald-100 leading-relaxed">
            Leading recruiters filter resumes using software. If your document lacks matching keywords or lists them incorrectly, you could be skipped. Optimize your CV today!
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to={user ? "/upload" : "/register"}
              className="rounded-xl bg-white px-6 py-3.5 font-bold text-emerald-700 shadow-md hover:bg-slate-50 hover:shadow-lg transition-all duration-300"
            >
              Analyze Your Resume Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
