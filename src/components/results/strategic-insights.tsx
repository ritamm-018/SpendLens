'use client';

import { motion } from 'framer-motion';
import { StrategicInsight } from '@/lib/intelligence/types';
import { Lightbulb, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StrategicInsightsProps {
  insights: StrategicInsight[];
}

const CATEGORY_CONFIG = {
  operational: {
    icon: Target,
    label: 'Operational',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-900',
  },
  workflow: {
    icon: TrendingUp,
    label: 'Workflow',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-200 dark:border-purple-900',
  },
  risk: {
    icon: AlertTriangle,
    label: 'Risk',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    borderColor: 'border-orange-200 dark:border-orange-900',
  },
  strategic: {
    icon: Lightbulb,
    label: 'Strategic',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-200 dark:border-green-900',
  },
};

const IMPACT_CONFIG = {
  high: {
    label: 'High Impact',
    color: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  },
  medium: {
    label: 'Medium Impact',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400',
  },
  low: {
    label: 'Low Impact',
    color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
  },
};

export function StrategicInsights({ insights }: StrategicInsightsProps) {
  if (!insights || insights.length === 0) {
    return null;
  }

  // Group insights by category
  const groupedInsights = insights.reduce((acc, insight) => {
    if (!acc[insight.category]) {
      acc[insight.category] = [];
    }
    acc[insight.category].push(insight);
    return acc;
  }, {} as Record<string, StrategicInsight[]>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-12"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Strategic Intelligence
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Actionable insights to optimize your AI infrastructure
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedInsights).map(([category, categoryInsights]) => {
          const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
          const Icon = config.icon;

          return (
            <div key={category}>
              <div className="mb-4 flex items-center gap-2">
                <Icon className={`h-5 w-5 ${config.color}`} />
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {config.label} Insights
                </h3>
                <Badge variant="secondary" className="ml-2">
                  {categoryInsights.length}
                </Badge>
              </div>

              <div className="space-y-4">
                {categoryInsights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`rounded-xl border p-6 ${config.bgColor} ${config.borderColor}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                            {insight.title}
                          </h4>
                          <Badge className={IMPACT_CONFIG[insight.impact].color}>
                            {IMPACT_CONFIG[insight.impact].label}
                          </Badge>
                          {insight.actionable && (
                            <Badge variant="outline" className="border-zinc-300 dark:border-zinc-700">
                              Actionable
                            </Badge>
                          )}
                        </div>

                        <p className="mt-3 text-zinc-700 dark:text-zinc-300">
                          {insight.description}
                        </p>

                        {insight.relatedTools && insight.relatedTools.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                              Related tools:
                            </span>
                            {insight.relatedTools.map((tool, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="bg-white/50 dark:bg-zinc-900/50"
                              >
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary footer */}
      <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">
            {insights.filter((i) => i.actionable).length} actionable insights
          </span>
          {' • '}
          {insights.filter((i) => i.impact === 'high').length} high-impact opportunities
          {' • '}
          Generated using proprietary intelligence algorithms and industry benchmarks
        </p>
      </div>
    </motion.div>
  );
}
