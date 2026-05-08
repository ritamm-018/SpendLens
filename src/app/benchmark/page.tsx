'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { ArrowRight, TrendingUp, Users, Zap } from 'lucide-react';

export default function BenchmarkPage() {
  const router = useRouter();
  const [teamSize, setTeamSize] = useState('');
  const [useCase, setUseCase] = useState('');
  const [monthlySpend, setMonthlySpend] = useState('');

  const handleQuickBenchmark = () => {
    // For now, redirect to audit with pre-filled context
    // In a real implementation, this would show instant benchmark results
    router.push('/audit');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            Quick Benchmark
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            See How You Compare
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Get instant benchmark insights without a full audit. Takes 30 seconds.
          </p>
        </motion.div>

        {/* Quick Benchmark Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-12"
        >
          <Card className="p-8">
            <div className="space-y-6">
              {/* Team Size */}
              <div>
                <Label htmlFor="teamSize" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-zinc-500" />
                  Team Size
                </Label>
                <Select
                  id="teamSize"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="mt-2"
                >
                  <option value="">Select team size...</option>
                  <option value="1-5">1-5 people</option>
                  <option value="6-10">6-10 people</option>
                  <option value="11-20">11-20 people</option>
                  <option value="21-50">21-50 people</option>
                  <option value="51+">51+ people</option>
                </Select>
              </div>

              {/* Use Case */}
              <div>
                <Label htmlFor="useCase" className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-zinc-500" />
                  Primary Use Case
                </Label>
                <Select
                  id="useCase"
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  className="mt-2"
                >
                  <option value="">Select use case...</option>
                  <option value="code-completion">Code Completion</option>
                  <option value="api-integration">API Integration</option>
                  <option value="content-generation">Content Generation</option>
                  <option value="research">Research & Analysis</option>
                  <option value="mixed">Mixed Usage</option>
                </Select>
              </div>

              {/* Monthly Spend */}
              <div>
                <Label htmlFor="monthlySpend" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-zinc-500" />
                  Approximate Monthly AI Spend
                </Label>
                <Select
                  id="monthlySpend"
                  value={monthlySpend}
                  onChange={(e) => setMonthlySpend(e.target.value)}
                  className="mt-2"
                >
                  <option value="">Select range...</option>
                  <option value="0-100">$0 - $100</option>
                  <option value="100-500">$100 - $500</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000-2500">$1,000 - $2,500</option>
                  <option value="2500+">$2,500+</option>
                </Select>
              </div>

              {/* CTA */}
              <Button
                onClick={handleQuickBenchmark}
                disabled={!teamSize || !useCase || !monthlySpend}
                className="w-full"
                size="lg"
              >
                See My Benchmark
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* What You'll Get */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="text-center text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            What You'll Get
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: 'Percentile Ranking',
                description: 'See where you stand vs. similar teams',
              },
              {
                title: 'Spend Comparison',
                description: 'Compare your spend to industry averages',
              },
              {
                title: 'Quick Insights',
                description: 'Instant recommendations to optimize',
              },
            ].map((item, i) => (
              <Card key={i} className="p-6 text-center">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Want Full Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Want a detailed analysis with tool-by-tool recommendations?
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/audit')}
            className="mt-4"
          >
            Run Full Audit Instead
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
