'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface PercentileRankingProps {
  percentile: number;
  segment: string;
  distribution: number[];
}

export function PercentileRanking({ percentile, segment }: PercentileRankingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="mb-6 text-center">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
          Where You Stand
        </h2>
      </div>

      <Card className="p-8">
        <div className="text-center">
          <div className="text-5xl font-bold text-emerald-400">
            Top {100 - percentile}%
          </div>
          <p className="mt-4 text-lg text-zinc-400">
            among {segment}
          </p>
        </div>

        {/* Percentile Bar */}
        <div className="mt-8">
          <div className="relative h-12 overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentile}%` }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
            />
            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${percentile}%` }}
            >
              <div className="relative -ml-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-zinc-900 bg-emerald-600">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-xs text-zinc-500">
            <span>Least Efficient</span>
            <span>Most Efficient</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
