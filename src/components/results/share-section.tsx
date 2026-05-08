'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Target, User, TrendingDown } from 'lucide-react';
import { ShareModal } from './share-modal';
import { EnhancedAuditResult } from '@/lib/intelligence/types';

interface ShareSectionProps {
  result: EnhancedAuditResult;
}

export function ShareSection({ result }: ShareSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-12"
      >
        <Card className="border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Share Your Efficiency Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-zinc-700 dark:text-zinc-300">
              Share your AI Infrastructure Intelligence Report with your team or on social media.
              Show off your efficiency score and operating profile.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="group bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share My Results
              </Button>
              <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1.5 rounded-full bg-white/50 px-3 py-1 dark:bg-zinc-900/50">
                  <Target className="h-3 w-3" />
                  Efficiency Score
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-white/50 px-3 py-1 dark:bg-zinc-900/50">
                  <User className="h-3 w-3" />
                  Profile
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-white/50 px-3 py-1 dark:bg-zinc-900/50">
                  <TrendingDown className="h-3 w-3" />
                  Savings
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={result}
      />
    </>
  );
}

