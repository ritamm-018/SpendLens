'use client';

import { motion } from 'framer-motion';
import { EnhancedAuditResult } from '@/lib/intelligence/types';
import { formatCurrency } from '@/lib/utils';
import { TrendingDown, Activity, Target, Shield } from 'lucide-react';

interface ResultsHeroProps {
  result: EnhancedAuditResult;
}

export function ResultsHero({ result }: ResultsHeroProps) {
  const efficiencyScore = result.efficiencyScore;
  const profile = result.operatingProfile;

  // Get score color based on value - professional palette
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getScoreBorder = (score: number) => {
    if (score >= 80) return 'border-emerald-200 dark:border-emerald-900/50';
    if (score >= 60) return 'border-amber-200 dark:border-amber-900/50';
    return 'border-rose-200 dark:border-rose-900/50';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      {/* Efficiency Score Hero - Professional Card */}
      <div className={`rounded-lg border ${getScoreBorder(efficiencyScore.overall)} bg-white p-10 shadow-sm dark:bg-zinc-900`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              AI Infrastructure Efficiency
            </div>
            <div className="flex items-baseline gap-3">
              <div className={`text-7xl font-semibold tabular-nums ${getScoreColor(efficiencyScore.overall)}`}>
                {efficiencyScore.overall}
              </div>
              <div className="text-3xl font-normal text-zinc-400 dark:text-zinc-600">/100</div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="rounded bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {profile.profile.name}
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                {efficiencyScore.confidence === 'high' && 'High Confidence'}
                {efficiencyScore.confidence === 'medium' && 'Medium Confidence'}
                {efficiencyScore.confidence === 'low' && 'Low Confidence'}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Analysis Date
            </div>
            <div className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
              {new Date(result.generatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>
        
        <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {profile.profile.description}
          </p>
        </div>
      </div>

      {/* Key Metrics Grid - Professional Layout */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: TrendingDown,
            label: 'Potential Savings',
            value: formatCurrency(result.totalMonthlySavings),
            subtitle: `${formatCurrency(result.totalAnnualSavings)} annually`,
            change: result.savingsPercentage > 0 ? `${result.savingsPercentage.toFixed(1)}%` : null,
          },
          {
            icon: Target,
            label: 'Spend Efficiency',
            value: result.benchmarkComparisons[0]?.percentile
              ? `Top ${Math.round(100 - result.benchmarkComparisons[0].percentile)}%`
              : 'N/A',
            subtitle: 'vs similar teams',
            change: null,
          },
          {
            icon: Shield,
            label: 'Infrastructure Risk',
            value:
              efficiencyScore.components.riskFactors >= 80
                ? 'Low'
                : efficiencyScore.components.riskFactors >= 60
                ? 'Moderate'
                : 'Elevated',
            subtitle: 'Risk assessment',
            change: null,
          },
          {
            icon: Activity,
            label: 'Tools Analyzed',
            value: result.toolResults.length.toString(),
            subtitle: `${result.toolResults.reduce((sum, t) => sum + t.recommendations.length, 0)} recommendations`,
            change: null,
          },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-start justify-between">
              <metric.icon className="h-5 w-5 text-zinc-400 dark:text-zinc-600" />
              {metric.change && (
                <div className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                  {metric.change}
                </div>
              )}
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {metric.label}
              </div>
              <div className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                {metric.value}
              </div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                {metric.subtitle}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Efficiency Score Breakdown - Professional Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-50">
            Score Components
          </h3>
        </div>
        
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {efficiencyScore.breakdown.map((component, i) => (
            <motion.div
              key={component.component}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="px-6 py-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {component.description}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Weight: {Math.round(component.weight * 100)}% • Contribution: {Math.round(component.contribution)} points
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                    {component.score}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">/100</div>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${component.score}%` }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.6, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    component.score >= 80
                      ? 'bg-emerald-500'
                      : component.score >= 60
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
