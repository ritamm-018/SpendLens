'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BenchmarkHeroProps {
  score: number;
  statement: string;
}

export function BenchmarkHero({ score, statement }: BenchmarkHeroProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // Animate score count-up
    const duration = 2000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return 'from-emerald-500 to-green-600';
    if (score >= 60) return 'from-amber-500 to-orange-600';
    return 'from-rose-500 to-red-600';
  };

  const getScoreTextColor = () => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 inline-flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-zinc-300 shadow-sm"
      >
        Benchmark Analysis Complete
      </motion.div>

      {/* Circular Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative mx-auto mb-12 h-64 w-64"
      >
        {/* Background circle */}
        <svg className="h-full w-full -rotate-90 transform">
          <circle
            cx="128"
            cy="128"
            r="112"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-zinc-800"
          />
          {/* Progress circle */}
          <motion.circle
            cx="128"
            cy="128"
            r="112"
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: '0 704' }}
            animate={{ strokeDasharray: `${(displayScore / 100) * 704} 704` }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className={`${getScoreColor().split(' ')[0].replace('from-', 'stop-')}`} />
              <stop offset="100%" className={`${getScoreColor().split(' ')[1].replace('to-', 'stop-')}`} />
            </linearGradient>
          </defs>
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="text-center"
          >
            <div className={`text-6xl font-bold tabular-nums ${getScoreTextColor()}`}>
              {displayScore}
            </div>
            <div className="mt-1 text-sm font-medium uppercase tracking-wider text-zinc-400">
              / 100
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl"
      >
        AI Efficiency Score
      </motion.h1>

      {/* Statement */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-zinc-400"
      >
        {statement}
      </motion.p>
    </motion.div>
  );
}
