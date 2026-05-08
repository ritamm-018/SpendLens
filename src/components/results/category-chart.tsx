'use client';

import { motion } from 'framer-motion';
import { CategoryBreakdown } from '@/lib/intelligence/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface CategoryChartProps {
  categoryBreakdown: CategoryBreakdown;
  teamSize: number;
}

const CATEGORY_COLORS = {
  'coding-ai': '#3b82f6', // blue
  'research-ai': '#8b5cf6', // purple
  'api-infrastructure': '#06b6d4', // cyan
  'design-prototyping': '#ec4899', // pink
  'collaboration': '#f59e0b', // amber
  'other': '#6b7280', // gray
};

export function CategoryChart({ categoryBreakdown, teamSize }: CategoryChartProps) {
  if (!categoryBreakdown || categoryBreakdown.categories.length === 0) {
    return null;
  }

  // Prepare data for pie chart
  const chartData = categoryBreakdown.categories.map((cat) => ({
    name: cat.displayName,
    value: cat.totalSpend,
    percentage: cat.percentage,
    color: CATEGORY_COLORS[cat.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.other,
  }));

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'over-indexed':
        return <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
      case 'under-indexed':
        return <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'over-indexed':
        return 'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30';
      case 'under-indexed':
        return 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30';
      default:
        return 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-12"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Category Analysis
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          How your AI spend is distributed across categories
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Pie Chart */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-50">
            Spend Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${((entry.percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(Number(value) || 0)}
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown Table */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-50">
            Category Details
          </h3>
          <div className="space-y-4">
            {categoryBreakdown.categories.map((category, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{
                        backgroundColor:
                          CATEGORY_COLORS[category.category as keyof typeof CATEGORY_COLORS] ||
                          CATEGORY_COLORS.other,
                      }}
                    />
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-50">
                        {category.displayName}
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        {category.tools.length} tool{category.tools.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {formatCurrency(category.totalSpend)}
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      {formatPercentage(category.percentage / 100)}
                    </div>
                  </div>
                </div>

                {/* Spend per team member */}
                <div className="mt-3 flex items-center justify-between rounded-md bg-white/50 px-3 py-2 dark:bg-zinc-950/50">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Per team member
                  </span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {formatCurrency(category.spendPerTeamMember)}/mo
                  </span>
                </div>

                {/* Benchmark comparison if available */}
                {category.benchmarkComparison && (
                  <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                    {category.benchmarkComparison.deviation > 0 ? (
                      <span className="text-orange-600 dark:text-orange-400">
                        {Math.abs(category.benchmarkComparison.deviation).toFixed(0)}% above benchmark
                      </span>
                    ) : category.benchmarkComparison.deviation < 0 ? (
                      <span className="text-green-600 dark:text-green-400">
                        {Math.abs(category.benchmarkComparison.deviation).toFixed(0)}% below benchmark
                      </span>
                    ) : (
                      <span>At benchmark</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Insights */}
      {categoryBreakdown.insights && categoryBreakdown.insights.length > 0 && (
        <div className="mt-8 space-y-3">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Category Insights
          </h3>
          {categoryBreakdown.insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`flex items-start gap-3 rounded-lg border p-4 ${getInsightColor(insight.type)}`}
            >
              {getInsightIcon(insight.type)}
              <div className="flex-1">
                <div className="font-medium text-zinc-900 dark:text-zinc-50">
                  {insight.category}
                </div>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                  {insight.message}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
