'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface StrategicInsightsProps {
  insights: {
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }[];
}

export function StrategicInsights({ insights }: StrategicInsightsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <div className="mb-6 text-center">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
          Strategic Insights
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Operational intelligence for your team
        </p>
      </div>

      <div className="space-y-4">
        {insights.map((insight, i) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + i * 0.15 }}
          >
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className={`rounded-lg p-2 ${
                  insight.impact === 'high'
                    ? 'bg-emerald-950'
                    : insight.impact === 'medium'
                    ? 'bg-amber-950'
                    : 'bg-zinc-800'
                }`}>
                  <Lightbulb className={`h-5 w-5 ${
                    insight.impact === 'high'
                      ? 'text-emerald-400'
                      : insight.impact === 'medium'
                      ? 'text-amber-400'
                      : 'text-zinc-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-zinc-50">
                      {insight.title}
                    </h3>
                    <span className={`text-xs font-medium uppercase tracking-wide ${
                      insight.impact === 'high'
                        ? 'text-emerald-400'
                        : insight.impact === 'medium'
                        ? 'text-amber-400'
                        : 'text-zinc-500'
                    }`}>
                      {insight.impact} impact
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {insight.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
