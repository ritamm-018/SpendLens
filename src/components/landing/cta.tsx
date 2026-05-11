'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CTA() {
  return (
    <section className="bg-gradient-to-b from-zinc-900/50 to-zinc-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            See how efficient your AI stack really is
          </h2>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Get your AI Efficiency Score, operating profile, and strategic insights.
            Discover where you stand compared to similar teams.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/audit">
              <Button size="lg" className="group bg-emerald-600 hover:bg-emerald-700">
                Discover My AI Operating Score
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            Takes 90 seconds • Instant results • Strategic insights
          </p>
        </motion.div>
      </div>
    </section>
  );
}
