'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface OptimizationOpportunityProps {
  opportunity: {
    level: 'high' | 'medium' | 'low';
    savingsMin: number;
    savingsMax: number;
    confidence: number;
  };
}

export function OptimizationOpportunity({ opportunity }: OptimizationOpportunityProps) {
  const getColors = () => {
    if (opportunity.level === 'high') {
      return {
        border: 'border-emerald-200 dark:border-emerald-900',
        bg: 'bg-emerald-50 dark:bg-emerald-950/20',
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
        icon: 'text-emerald-600 dark:text-emerald-400',
        badge: 'border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
        text: 'text-emerald-600 dark:text-emerald-400',
        progress: 'bg-emerald-500',
      };
    }
    if (opportunity.level === 'medium') {
      return {
        border: 'border-amber-200 dark:border-amber-900',
        bg: 'bg-amber-50 dark:bg-amber-950/20',
        iconBg: 'bg-amber-100 dark:bg-amber-900/30',
        icon: 'text-amber-600 dark:text-amber-400',
        badge: 'border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900 dark:text-amber-300',
        text: 'text-amber-600 dark:text-amber-400',
        progress: 'bg-amber-500',
      };
    }
    return {
      border: 'border-zinc-200 dark:border-zinc-800',
      bg: 'bg-zinc-50 dark:bg-zinc-900/20',
      iconBg: 'bg-zinc-100 dark:bg-zinc-800',
      icon: 'text-zinc-600 dark:text-zinc-400',
      badge: 'border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
      text: 'text-zinc-600 dark:text-zinc-400',
      progress: 'bg-zinc-500',
    };
  };

  const colors = getColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <Card className={`border-2 ${colors.border} ${colors.bg} p-8`}>
        <div className="flex items-start gap-6">
          <div className={`rounded-xl ${colors.iconBg} p-4`}>
            <Target className={`h-8 w-8 ${colors.icon}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Optimization Opportunity
              </h3>
              <span className={`rounded border ${colors.badge} px-2 py-0.5 text-xs font-medium uppercase tracking-wide`}>
                {opportunity.level}
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Estimated Savings Potential:
              </span>
              <span className={`text-2xl font-bold ${colors.text}`}>
                ${opportunity.savingsMin.toLocaleString()}–${opportunity.savingsMax.toLocaleString()}
                <span className="text-base font-normal">/month</span>
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${opportunity.confidence}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 1.2 }}
                  className={`h-full ${colors.progress}`}
                />
              </div>
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {opportunity.confidence}% confidence
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
