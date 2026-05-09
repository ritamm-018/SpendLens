'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, TrendingDown } from 'lucide-react';

export function ProblemSolution() {
  const problems = [
    'Paying for enterprise plans with a 10-person team',
    'Unused seats on team subscriptions',
    'Overlapping tools (Cursor + Copilot + Windsurf)',
    'Premium plans when Pro tier suffices',
    'Missing out on startup credit programs',
  ];

  const solutions = [
    'Identify wrong-tier plans costing you hundreds monthly',
    'Spot unused seats and optimize team allocations',
    'Detect tool overlap and consolidation opportunities',
    'Get defensible, finance-literate recommendations',
    'Discover startup credits worth $1k-$25k',
  ];

  return (
    <section className="border-b border-zinc-800 bg-zinc-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl"
          >
            AI tools are expensive.{' '}
            <span className="text-zinc-400">Most teams overpay.</span>
          </motion.h2>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Problems */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-950/50 border border-rose-900/50">
                <AlertCircle className="h-5 w-5 text-rose-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-50">
                Common Overspending Patterns
              </h3>
            </div>
            <ul className="space-y-3">
              {problems.map((problem, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-400">
                  <TrendingDown className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-400" />
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-950/50 border border-emerald-900/50">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-50">
                What SpendLens Finds
              </h3>
            </div>
            <ul className="space-y-3">
              {solutions.map((solution, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-400">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
                  <span>{solution}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
