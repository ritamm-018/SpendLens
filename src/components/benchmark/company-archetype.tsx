'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Zap, Rocket, Crown, TrendingUp, Users } from 'lucide-react';

interface CompanyArchetypeProps {
  archetype: {
    name: string;
    description: string;
    icon: string;
    color: string;
  };
}

export function CompanyArchetype({ archetype }: CompanyArchetypeProps) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Zap,
    Rocket,
    Crown,
    TrendingUp,
    Users,
  };

  const Icon = iconMap[archetype.icon] || Zap;

  const getGradient = () => {
    const gradients: Record<string, string> = {
      emerald: 'from-emerald-500 to-emerald-600',
      blue: 'from-blue-500 to-blue-600',
      violet: 'from-violet-500 to-violet-600',
      amber: 'from-amber-500 to-amber-600',
      cyan: 'from-cyan-500 to-cyan-600',
    };
    return gradients[archetype.color] || gradients.emerald;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
    >
      <div className="mb-6 text-center">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Your Company Archetype
        </h2>
      </div>

      <Card className="overflow-hidden p-8">
        <div className="flex flex-col items-center text-center">
          <div className={`rounded-2xl bg-gradient-to-br ${getGradient()} p-6`}>
            <Icon className="h-12 w-12 text-white" />
          </div>
          <h3 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {archetype.name}
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {archetype.description}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
