'use client';

import { EnhancedAuditResult } from '@/lib/intelligence/types';
import { formatCurrency } from '@/lib/utils';
import { TrendingDown, Shield, Wrench } from 'lucide-react';

interface ResultsHeroProps {
  result: EnhancedAuditResult;
}

export function ResultsHero({ result }: ResultsHeroProps) {
  const efficiencyScore = result.efficiencyScore;
  const profile = result.operatingProfile;
  const currency = result.currency || 'USD';

  // Score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-900/20 border-emerald-900/50';
    if (score >= 60) return 'bg-amber-900/20 border-amber-900/50';
    return 'bg-rose-900/20 border-rose-900/50';
  };

  return (
    <div className="mb-12 space-y-6">
      {/* Main Score Card */}
      <div className={`rounded-lg border ${getScoreBg(efficiencyScore.overall)} p-8`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-medium text-zinc-400">
              AI Infrastructure Efficiency Score
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <div className={`text-6xl font-semibold ${getScoreColor(efficiencyScore.overall)}`}>
                {efficiencyScore.overall}
              </div>
              <div className="text-2xl text-zinc-600">/100</div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="rounded bg-zinc-800 px-2.5 py-1 text-sm font-medium text-zinc-300">
                {profile.profile.name}
              </span>
              <span className="text-sm text-zinc-500">
                {efficiencyScore.confidence === 'high' && 'High confidence'}
                {efficiencyScore.confidence === 'medium' && 'Medium confidence'}
                {efficiencyScore.confidence === 'low' && 'Low confidence'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-zinc-500">Analysis Date</div>
            <div className="mt-1 text-sm text-zinc-400">
              {new Date(result.generatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>
        
        <div className="mt-6 border-t border-zinc-800 pt-6">
          <p className="text-sm text-zinc-400">
            {profile.profile.description}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center gap-2 text-zinc-500">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm font-medium">Potential Savings</span>
          </div>
          <div className="mt-3 text-2xl font-semibold text-white">
            {formatCurrency(result.totalMonthlySavings, currency)}
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            {formatCurrency(result.totalAnnualSavings, currency)} annually
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center gap-2 text-zinc-500">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Risk Level</span>
          </div>
          <div className="mt-3 text-2xl font-semibold text-white">
            {efficiencyScore.components.riskFactors >= 80
              ? 'Low'
              : efficiencyScore.components.riskFactors >= 60
              ? 'Moderate'
              : 'Elevated'}
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            Infrastructure risk assessment
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center gap-2 text-zinc-500">
            <Wrench className="h-4 w-4" />
            <span className="text-sm font-medium">Recommendations</span>
          </div>
          <div className="mt-3 text-2xl font-semibold text-white">
            {result.toolResults.reduce((sum, t) => sum + t.recommendations.length, 0)}
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            Across {result.toolResults.length} tools
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-6 py-4">
          <h3 className="text-sm font-semibold text-white">Score Breakdown</h3>
        </div>
        
        <div className="divide-y divide-zinc-800">
          {efficiencyScore.breakdown.map((component) => (
            <div key={component.component} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">
                    {component.description}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    Weight: {Math.round(component.weight * 100)}% • Contribution: {Math.round(component.contribution)} pts
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-lg font-semibold text-white">
                    {component.score}
                  </div>
                  <div className="text-xs text-zinc-500">/100</div>
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  style={{ width: `${component.score}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    component.score >= 80
                      ? 'bg-emerald-500'
                      : component.score >= 60
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
