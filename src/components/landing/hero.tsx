'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Activity, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { InputMethodModal } from '@/components/audit/input-method-modal';

export function Hero() {
  const [showInputModal, setShowInputModal] = useState(false);

  return (
    <>
      <InputMethodModal isOpen={showInputModal} onClose={() => setShowInputModal(false)} />
      <section className="relative overflow-hidden border-b border-zinc-800 bg-zinc-950">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a08_1px,transparent_1px),linear-gradient(to_bottom,#27272a08_1px,transparent_1px)] bg-[size:32px_32px]" />
      
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
            className="mb-8 inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-300 backdrop-blur-sm"
          >
            AI Infrastructure Intelligence Platform
          </motion.div>

          {/* Headline - Professional Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-semibold tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl"
          >
            Discover Your{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              AI Efficiency Score
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-xl leading-relaxed text-zinc-400"
          >
            See how your AI infrastructure compares to similar teams. Get your efficiency score,
            operating profile, and strategic insights in{' '}
            <span className="font-semibold text-zinc-100">90 seconds</span>.
          </motion.p>

          {/* CTAs - Professional Styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              variant="premium"
              onClick={() => setShowInputModal(true)}
              className="group px-8 py-6 text-base font-semibold"
            >
              Analyze My AI Efficiency
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Link href="/benchmark">
              <Button
                size="lg"
                variant="outline"
                className="group px-8 py-6 text-base font-semibold"
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
            className="mt-8 text-sm text-zinc-500"
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
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-lg shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/30"
            >
              <div className="flex items-start justify-between">
                <stat.icon className="h-5 w-5 text-zinc-600" />
              </div>
              <div className="mt-6">
                <div className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                  {stat.label}
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <div className="text-4xl font-semibold tabular-nums text-zinc-50">
                    {stat.value}
                  </div>
                  <div className="text-lg font-normal text-zinc-600">
                    {stat.subtitle}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
    </>
  );
}
