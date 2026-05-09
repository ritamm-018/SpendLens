'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SpendComparisonProps {
  comparison: {
    yourTeam: number;
    industryAverage: number;
    mostEfficient: number;
    trend: 'above' | 'below' | 'aligned';
  };
}

export function SpendComparison({ comparison }: SpendComparisonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="mb-6 text-center">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
          Spend Comparison
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <ComparisonCard
          label="Your Team"
          amount={comparison.yourTeam}
          trend={comparison.trend}
          delay={0.5}
        />
        <ComparisonCard
          label="Industry Average"
          amount={comparison.industryAverage}
          delay={0.6}
        />
        <ComparisonCard
          label="Most Efficient Teams"
          amount={comparison.mostEfficient}
          delay={0.7}
        />
      </div>
    </motion.div>
  );
}

function ComparisonCard({
  label,
  amount,
  trend,
  delay,
}: {
  label: string;
  amount: number;
  trend?: 'above' | 'below' | 'aligned';
  delay: number;
}) {
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = amount / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= amount) {
        setDisplayAmount(amount);
        clearInterval(timer);
      } else {
        setDisplayAmount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [amount]);

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend === 'above') return <TrendingUp className="h-4 w-4 text-rose-500" />;
    if (trend === 'below') return <TrendingDown className="h-4 w-4 text-emerald-500" />;
    return <Minus className="h-4 w-4 text-zinc-400" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="p-6 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <div className="text-sm font-medium uppercase tracking-wide text-zinc-400">
            {label}
          </div>
          {getTrendIcon()}
        </div>
        <div className="text-3xl font-bold tabular-nums text-zinc-50">
          ${displayAmount.toLocaleString()}
          <span className="text-lg font-normal text-zinc-400">/mo</span>
        </div>
      </Card>
    </motion.div>
  );
}
