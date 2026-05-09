'use client';

import { motion } from 'framer-motion';
import { AuditResult, ToolAuditResult } from '@/lib/audit/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, getSeverityBadge } from '@/lib/utils';
import { CheckCircle2, AlertCircle, TrendingDown, Lightbulb } from 'lucide-react';

interface ToolBreakdownProps {
  result: AuditResult;
}

export function ToolBreakdown({ result }: ToolBreakdownProps) {
  const currency = result.currency || 'USD';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-12"
    >
      <h2 className="mb-6 text-3xl font-bold text-zinc-50">
        Tool-by-Tool Breakdown
      </h2>

      <div className="space-y-6">
        {result.toolResults.map((toolResult, index) => (
          <ToolCard key={index} toolResult={toolResult} currency={currency} />
        ))}
      </div>
    </motion.div>
  );
}

function ToolCard({ toolResult, currency }: { toolResult: ToolAuditResult; currency: string }) {
  const hasRecommendations = toolResult.recommendations.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{toolResult.toolName}</CardTitle>
            <p className="mt-1 text-sm text-zinc-400">
              {toolResult.currentPlan} • {toolResult.currentSeats} seat
              {toolResult.currentSeats > 1 ? 's' : ''} • {formatCurrency(toolResult.currentMonthlyCost, currency)}
              /mo
            </p>
          </div>
          <Badge className={getSeverityBadge(toolResult.severity)}>
            {toolResult.severity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Savings Summary */}
        {toolResult.potentialMonthlySavings > 0 && (
          <div className="mb-6 rounded-lg border border-green-900 bg-green-950/30 p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-green-400" />
              <span className="font-semibold text-green-100">
                Potential Savings: {formatCurrency(toolResult.potentialMonthlySavings, currency)}/month
              </span>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {hasRecommendations ? (
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 font-semibold text-zinc-50">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Recommendations
            </h4>
            {toolResult.recommendations.map((rec, i) => (
              <div
                key={i}
                className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-zinc-50">
                      {rec.title}
                    </h5>
                    <p className="mt-2 text-sm text-zinc-400 whitespace-pre-line">
                      {rec.reasoning}
                    </p>
                    {rec.monthlySavings > 0 && (
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <span className="text-zinc-400">
                          Current: {formatCurrency(rec.currentCost, currency)}/mo
                        </span>
                        <span className="text-zinc-600">→</span>
                        <span className="font-semibold text-green-400">
                          Suggested: {formatCurrency(rec.suggestedCost, currency)}/mo
                        </span>
                      </div>
                    )}
                  </div>
                  {rec.monthlySavings > 0 && (
                    <div className="flex-shrink-0 text-right">
                      <div className="text-2xl font-bold text-green-400">
                        {formatCurrency(rec.monthlySavings, currency)}
                      </div>
                      <div className="text-xs text-zinc-500">saved/mo</div>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {rec.confidence} confidence
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {rec.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">No optimization opportunities found</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
