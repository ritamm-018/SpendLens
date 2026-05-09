'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { EnhancedAuditResult } from '@/lib/intelligence/types';
import { ResultsHero } from '@/components/results/results-hero';
import { AISummary } from '@/components/results/ai-summary';
import { BenchmarkSection } from '@/components/results/benchmark-section';
import { ProfileBadge } from '@/components/results/profile-badge';
import { CategoryChart } from '@/components/results/category-chart';
import { StrategicInsights } from '@/components/results/strategic-insights';
import { ToolBreakdown } from '@/components/results/tool-breakdown';
import { TrustBadges } from '@/components/results/trust-badges';
import { LeadCapture } from '@/components/results/lead-capture';
import { ShareSection } from '@/components/results/share-section';
import { Loader2 } from 'lucide-react';
import Head from 'next/head';
import { formatCurrency } from '@/lib/utils';

export default function ResultsPage() {
  const params = useParams();
  const [result, setResult] = useState<EnhancedAuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would fetch from the database
    // For now, we'll check sessionStorage
    const storedResult = sessionStorage.getItem(`audit-${params.id}`);
    
    if (storedResult) {
      setResult(JSON.parse(storedResult));
      setLoading(false);
    } else {
      setError('Audit not found');
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Audit Not Found
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            This audit may have expired or doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Open Graph metadata
  const currency = result.currency || 'USD';
  const ogTitle = `My AI Efficiency Score: ${result.efficiencyScore.overall}/100`;
  const ogDescription = `${result.operatingProfile.profile.name} • ${formatCurrency(result.totalMonthlySavings, currency)}/month in savings found • Analyzed ${result.toolResults.length} AI tools`;
  const ogUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <Head>
        <title>{ogTitle} | SpendLens</title>
        <meta name="description" content={ogDescription} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:site_name" content="SpendLens" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <ResultsHero result={result} />
          
          {/* AI Summary */}
          {result.aiSummary && (
            <div className="mt-8">
              <AISummary summary={result.aiSummary} />
            </div>
          )}
          
          <BenchmarkSection 
            comparisons={result.benchmarkComparisons} 
            teamSize={result.teamSize}
            currency={currency}
          />
          <ProfileBadge 
            classification={result.operatingProfile}
            currency={currency}
          />
          <CategoryChart 
            categoryBreakdown={result.categoryBreakdown} 
            teamSize={result.teamSize}
            currency={currency}
          />
          <StrategicInsights insights={result.strategicInsights} />
          <ToolBreakdown result={result} />
          <TrustBadges result={result} />
          <ShareSection result={result} />
          <LeadCapture reportId={result.id} totalSavings={result.totalMonthlySavings} />
        </div>
      </div>
    </>
  );
}
