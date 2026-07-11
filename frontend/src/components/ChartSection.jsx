import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS modules
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const ChartSection = ({ resumeScore = 0, atsScore = 0, grammarScore = 0 }) => {
  // 1. Doughnut Chart Configuration (Overall Match vs Remainder)
  const doughnutData = {
    labels: ['Resume Score', 'Remaining'],
    datasets: [
      {
        data: [resumeScore, 100 - resumeScore],
        backgroundColor: ['#10b981', 'rgba(16, 185, 129, 0.1)'],
        borderColor: ['#10b981', 'transparent'],
        borderWidth: 1,
        cutout: '80%',
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // 2. Bar Chart Configuration (Compare Resume vs ATS vs Grammar)
  const barData = {
    labels: ['Resume Quality', 'ATS Scan', 'Grammar'],
    datasets: [
      {
        label: 'Score',
        data: [resumeScore, atsScore, grammarScore],
        backgroundColor: [
          'rgba(16, 185, 129, 0.75)', // Emerald
          'rgba(99, 102, 241, 0.75)', // Indigo
          'rgba(245, 158, 11, 0.75)', // Amber
        ],
        borderColor: ['#10b981', '#6366f1', '#f59e0b'],
        borderWidth: 1.5,
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.parsed.y} / 100`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          font: { family: 'Inter' },
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { family: 'Inter', weight: 'bold' },
        },
      },
    },
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Doughnut Overall Card */}
      <div className="flex flex-col items-center justify-center rounded-2xl glass p-6 shadow-sm">
        <h4 className="mb-4 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
          Overall Quality Match
        </h4>
        <div className="relative flex h-40 w-40 items-center justify-center">
          <Doughnut data={doughnutData} options={doughnutOptions} />
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-outfit text-4xl font-extrabold text-slate-800 dark:text-slate-100">
              {resumeScore}%
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500">
              Optimal
            </span>
          </div>
        </div>
      </div>

      {/* Bar Comparison Card */}
      <div className="col-span-1 flex flex-col rounded-2xl glass p-6 shadow-sm md:col-span-2">
        <h4 className="mb-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
          Score Breakdown Comparison
        </h4>
        <div className="h-44 w-full">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
