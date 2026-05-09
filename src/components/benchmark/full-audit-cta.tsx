'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Check, Upload } from 'lucide-react';
import Link from 'next/link';

export function FullAuditCTA() {
  const benefits = [
    'Tool-by-tool optimization recommendations',
    'Redundancy and overlap detection',
    'Personalized savings roadmap',
    'AI infrastructure efficiency scoring',
    'Shareable executive report',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6 }}
    >
      <Card className="overflow-hidden border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-cyan-50 p-8 dark:border-emerald-900 dark:from-emerald-950/20 dark:to-cyan-950/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Unlock Your Full AI Infrastructure Audit
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Get detailed, tool-by-tool recommendations and uncover every optimization opportunity
          </p>

          <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {benefit}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/audit">
              <Button size="lg" className="group">
                Run Full Audit
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="group">
              <Upload className="mr-2 h-4 w-4" />
              Upload Billing Screenshot
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
