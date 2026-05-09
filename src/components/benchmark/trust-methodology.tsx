'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Shield, RefreshCw, Users } from 'lucide-react';

export function TrustMethodology() {
  const badges = [
    {
      icon: Shield,
      text: 'Pricing verified from official vendor sources',
    },
    {
      icon: RefreshCw,
      text: 'Benchmarks updated weekly',
    },
    {
      icon: Users,
      text: 'Analysis from 1,200+ anonymized startups',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4 }}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 + i * 0.1 }}
          >
            <Card className="p-4 text-center">
              <badge.icon className="mx-auto h-5 w-5 text-zinc-400" />
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                {badge.text}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
