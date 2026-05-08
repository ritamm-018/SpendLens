'use client';

import { motion } from 'framer-motion';
import { FileText, Sparkles, TrendingUp, Share2 } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: 'Share Your AI Stack',
      description: 'Tell us which AI tools you use, your team size, and primary use case. Takes 90 seconds.',
    },
    {
      icon: Sparkles,
      title: 'Get Intelligence Analysis',
      description: 'Our engine calculates your efficiency score, operating profile, and benchmarks against similar teams.',
    },
    {
      icon: TrendingUp,
      title: 'Discover Insights',
      description: 'See your 0-100 efficiency score, category breakdown, and strategic recommendations.',
    },
    {
      icon: Share2,
      title: 'Share Your Score',
      description: 'Export your results or share your efficiency score with your team.',
    },
  ];

  return (
    <section className="border-b border-zinc-200 bg-zinc-50 py-24 dark:border-zinc-800 dark:bg-zinc-900 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Get your AI Infrastructure Intelligence Report in four simple steps
          </p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-zinc-800">
                  <step.icon className="h-8 w-8 text-zinc-900 dark:text-zinc-50" />
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {step.description}
                  </p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-8 hidden h-0.5 w-full bg-gradient-to-r from-zinc-200 to-transparent dark:from-zinc-800 lg:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
