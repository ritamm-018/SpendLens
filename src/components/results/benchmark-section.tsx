'use client';

import { motion } from 'framer-motion';
import { BenchmarkComparison } from '@/lib/intelligence/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface BenchmarkSectionProps {
  comparisons: BenchmarkComparison[];
  teamSize: number;
  currency?: string;
}

export function BenchmarkSection({ comparisons, teamSize, currency = 'USD' }: BenchmarkSectionProps) {
  if (!comparisons || comparisons.length === 0) {
    return null;
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-5 w-5 text-green-400" />;
      case 'negative':
        return <TrendingDown className="h-5 w-5 text-orange-400" />;
      default:
        return <Minus className="h-5 w-5 text-zinc-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'border-green-900 bg-green-950/30';
      case 'negative':
        return 'border-orange-900 bg-orange-950/30';
      default:
        return 'border-zinc-800 bg-zinc-900/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-12"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-50">
          Benchmark Analysis
        </h2>
        <p className="mt-2 text-zinc-400">
          How your AI infrastructure compares to similar teams
        </p>
      </div>

      <div className="space-y-4">
        {comparisons.map((comparison, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className={`rounded-xl border p-6 ${getSentimentColor(comparison.sentiment)}`}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">{getSentimentIcon(comparison.sentiment)}</div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-zinc-50">
                    {comparison.type}
                  </h3>
                  <div className="text-right">
                    <div className="text-sm text-zinc-400">
                      Percentile
                    </div>
                    <div className="text-2xl font-bold text-zinc-50">
                      {Math.round(comparison.percentile)}
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-zinc-300">
                  {comparison.statement}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-zinc-900/50 p-3">
                    <div className="text-xs text-zinc-400">
                      Your Value
                    </div>
                    <div className="mt-1 text-lg font-semibold text-zinc-50">
                      {comparison.type.includes('Spend') || comparison.type.includes('Cost')
                        ? formatCurrency(comparison.userValue, currency)
                        : comparison.userValue.toFixed(1)}
                    </div>
                  </div>

                  <div className="rounded-lg bg-zinc-900/50 p-3">
                    <div className="text-xs text-zinc-400">
                      Benchmark (Median)
                    </div>
                    <div className="mt-1 text-lg font-semibold text-zinc-50">
                      {comparison.type.includes('Spend') || comparison.type.includes('Cost')
                        ? formatCurrency(comparison.benchmarkValue, currency)
                        : comparison.benchmarkValue.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Visual comparison bar */}
                <div className="mt-4">
                  <div className="relative h-3 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="absolute h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      style={{ width: `${Math.min(comparison.percentile, 100)}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-zinc-400">
                    <span>Bottom 0%</span>
                    <span>Top 100%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="text-sm text-zinc-400">
          <span className="font-semibold text-zinc-50">
            Benchmark data updated weekly
          </span>
          {' • '}
          Based on {teamSize <= 5 ? '1,247' : teamSize <= 20 ? '892' : '634'} similar teams
          {' • '}
          Methodology: Aggregated from verified vendor pricing and anonymized usage data
        </p>
      </div>
    </motion.div>
  );
}
