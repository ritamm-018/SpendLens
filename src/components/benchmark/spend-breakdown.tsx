'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface SpendBreakdownProps {
  breakdown: {
    category: string;
    percentage: number;
    color: string;
  }[];
}

export function SpendBreakdown({ breakdown }: SpendBreakdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="mb-6 text-center">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
          Estimated Spend Breakdown
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Inferred from your usage patterns
        </p>
      </div>

      <Card className="p-8">
        <div className="space-y-6">
          {breakdown.map((item, i) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-50">
                  {item.category}
                </span>
                <span className="text-sm font-semibold tabular-nums text-zinc-400">
                  {item.percentage}%
                </span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-zinc-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 1 + i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
