'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { InputMethodModal } from '@/components/audit/input-method-modal';

export function Hero() {
  const [showInputModal, setShowInputModal] = useState(false);

  return (
    <>
      <InputMethodModal isOpen={showInputModal} onClose={() => setShowInputModal(false)} />
      <section className="border-b border-zinc-800 bg-zinc-950">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl">
            {/* Simple badge */}
            <div className="mb-6 inline-block rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-400">
              AI Spend Intelligence
            </div>

            {/* Clear headline */}
            <h1 className="text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
              Audit your AI tool spending in 90 seconds
            </h1>

            {/* Direct value prop */}
            <p className="mt-6 text-lg text-zinc-400 sm:text-xl">
              Get your efficiency score, see how you compare to similar teams, and find opportunities to optimize your AI infrastructure.
            </p>

            {/* Clear CTAs */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => setShowInputModal(true)}
                className="bg-emerald-600 px-6 py-3 text-base font-medium text-white hover:bg-emerald-700"
              >
                Start Free Audit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/benchmark">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-zinc-700 px-6 py-3 text-base font-medium text-zinc-300 hover:bg-zinc-900"
                >
                  View Benchmark Data
                </Button>
              </Link>
            </div>

            {/* Simple trust indicator */}
            <p className="mt-8 text-sm text-zinc-500">
              Used by engineering teams at AI-first startups
            </p>
          </div>

          {/* Stats - simple grid */}
          <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <div className="text-sm font-medium text-zinc-400">Average Savings</div>
              <div className="mt-2 text-3xl font-semibold text-white">$2,400</div>
              <div className="mt-1 text-sm text-zinc-500">per year</div>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <div className="text-sm font-medium text-zinc-400">Analysis Time</div>
              <div className="mt-2 text-3xl font-semibold text-white">90 sec</div>
              <div className="mt-1 text-sm text-zinc-500">to complete</div>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <div className="text-sm font-medium text-zinc-400">Benchmark Data</div>
              <div className="mt-2 text-3xl font-semibold text-white">1,200+</div>
              <div className="mt-1 text-sm text-zinc-500">teams analyzed</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
