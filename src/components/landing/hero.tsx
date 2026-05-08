'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Activity, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          {/* Professional Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8 inline-flex items-center gap-2 rounded border border-zinc-200 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            AI Infrastructure Intelligence Platform
          </motion.div>

          {/* Headline - Professional Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl lg:text-7xl"
          >
            Discover Your{' '}
            <span className="text-zinc-600 dark:text-zinc-400">
              AI Efficiency Score
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-xl leading-relaxed text-zinc-600 dark:text-zinc-400"
          >
            See how your AI infrastructure compares to similar teams. Get your efficiency score,
            operating profile, and strategic insights in{' '}
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">90 seconds</span>.
          </motion.p>

          {/* CTAs - Professional Styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/audit">
              <Button
                size="lg"
                className="group bg-zinc-900 px-8 py-6 text-base font-medium shadow-sm transition-all hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Analyze My AI Efficiency
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/audit">
              <Button
                size="lg"
                variant="outline"
                className="group border border-zinc-300 px-8 py-6 text-base font-medium transition-all hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
              >
                Benchmark My AI Stack
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-sm text-zinc-500 dark:text-zinc-500"
          >
            Trusted by AI-first startups and engineering teams
          </motion.p>
        </motion.div>

        {/* Stats - Professional Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mx-auto mt-24 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {[
            { label: 'Efficiency Score', value: '0-100', subtitle: 'Scale', icon: Target },
            { label: 'Analysis Time', value: '90', subtitle: 'Seconds', icon: Activity },
            { label: 'Benchmark Data', value: '1,200+', subtitle: 'Teams', icon: TrendingUp },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between">
                <stat.icon className="h-5 w-5 text-zinc-400 dark:text-zinc-600" />
              </div>
              <div className="mt-6">
                <div className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {stat.label}
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <div className="text-4xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                    {stat.value}
                  </div>
                  <div className="text-lg font-normal text-zinc-400 dark:text-zinc-600">
                    {stat.subtitle}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
