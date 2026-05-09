'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BenchmarkHero } from '@/components/benchmark/benchmark-hero';
import { PercentileRanking } from '@/components/benchmark/percentile-ranking';
import { SpendComparison } from '@/components/benchmark/spend-comparison';
import { SpendBreakdown } from '@/components/benchmark/spend-breakdown';
import { StrategicInsights } from '@/components/benchmark/strategic-insights';
import { OptimizationOpportunity } from '@/components/benchmark/optimization-opportunity';
import { CompanyArchetype } from '@/components/benchmark/company-archetype';
import { TrustMethodology } from '@/components/benchmark/trust-methodology';
import { FullAuditCTA } from '@/components/benchmark/full-audit-cta';
import { ShareableCard } from '@/components/benchmark/shareable-card';
import { LoadingSequence } from '@/components/benchmark/loading-sequence';
import { generateBenchmarkResults } from '@/lib/benchmark/generator';
import type { BenchmarkResults } from '@/lib/benchmark/types';

function BenchmarkResultsContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<BenchmarkResults | null>(null);

  useEffect(() => {
    // Simulate intelligent analysis with cinematic loading
    const teamSize = searchParams.get('teamSize') || '6-10';
    const useCase = searchParams.get('useCase') || 'code-completion';
    const monthlySpend = searchParams.get('monthlySpend') || '500-1000';

    // Generate results
    const benchmarkResults = generateBenchmarkResults({
      teamSize,
      useCase,
      monthlySpend,
    });

    // Show loading sequence for 3 seconds
    setTimeout(() => {
      setResults(benchmarkResults);
      setLoading(false);
    }, 3000);
  }, [searchParams]);

  if (loading) {
    return <LoadingSequence />;
  }

  if (!results) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-16"
          >
            {/* Section 1: Hero Result */}
            <BenchmarkHero score={results.efficiencyScore} statement={results.statement} />

            {/* Section 2: Percentile Ranking */}
            <PercentileRanking
              percentile={results.percentile}
              segment={results.segment}
              distribution={results.distribution}
            />

            {/* Section 3: Spend Comparison */}
            <SpendComparison comparison={results.spendComparison} />

            {/* Section 4: Estimated Spend Breakdown */}
            <SpendBreakdown breakdown={results.spendBreakdown} />

            {/* Section 5: Strategic Insights */}
            <StrategicInsights insights={results.strategicInsights} />

            {/* Section 6: Optimization Opportunity */}
            <OptimizationOpportunity opportunity={results.optimizationOpportunity} />

            {/* Section 7: Company Archetype */}
            <CompanyArchetype archetype={results.archetype} />

            {/* Section 8: Trust + Methodology */}
            <TrustMethodology />

            {/* Section 9: Strong CTA to Full Audit */}
            <FullAuditCTA />

            {/* Section 10: Shareable Benchmark Card */}
            <ShareableCard results={results} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function BenchmarkResultsPage() {
  return (
    <Suspense fallback={<LoadingSequence />}>
      <BenchmarkResultsContent />
    </Suspense>
  );
}
