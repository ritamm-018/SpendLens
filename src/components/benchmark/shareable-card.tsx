'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Link as LinkIcon, Share2 } from 'lucide-react';
import type { BenchmarkResults } from '@/lib/benchmark/types';

interface ShareableCardProps {
  results: BenchmarkResults;
}

export function ShareableCard({ results }: ShareableCardProps) {
  const handleDownload = () => {
    // TODO: Implement image generation
    console.log('Download image');
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleTwitterShare = () => {
    const text = `I just analyzed my AI infrastructure with @SpendLens and scored ${results.efficiencyScore}/100! 🚀`;
    if (typeof window !== 'undefined') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8 }}
    >
      <div className="mb-6 text-center">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Share Your Results
        </h2>
      </div>

      <Card className="p-8">
        <div className="text-center">
          <div className="mx-auto max-w-md rounded-lg border-2 border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-8 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
            <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
              {results.efficiencyScore}/100
            </div>
            <div className="mt-2 text-sm font-medium uppercase tracking-wide text-zinc-500">
              AI Efficiency Score
            </div>
            <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Top {100 - results.percentile}% of AI-native startups
            </div>
            <div className="mt-4 text-xs text-zinc-400">
              SpendLens.com
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" size="sm" onClick={handleTwitterShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
