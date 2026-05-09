'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreditCard, ArrowRight, Shield, RefreshCw, Zap } from 'lucide-react';

export default function ConnectBillingPage() {
  const platforms = [
    {
      name: 'Stripe',
      logo: '💳',
      description: 'Connect your Stripe account for automatic subscription sync',
      features: ['Real-time sync', 'Auto monthly audits', 'Subscription tracking'],
      comingSoon: false,
    },
    {
      name: 'Brex',
      logo: '🏦',
      description: 'Sync your Brex card transactions automatically',
      features: ['Transaction history', 'Merchant detection', 'Category filtering'],
      comingSoon: true,
    },
    {
      name: 'Expensify',
      logo: '📊',
      description: 'Import expense reports from Expensify',
      features: ['Expense reports', 'Category mapping', 'Team expenses'],
      comingSoon: true,
    },
    {
      name: 'Ramp',
      logo: '⚡',
      description: 'Connect Ramp for corporate card tracking',
      features: ['Card transactions', 'Vendor tracking', 'Spend analytics'],
      comingSoon: true,
    },
  ];

  const handleConnect = (platform: string) => {
    if (platform === 'Stripe') {
      // TODO: Implement Stripe OAuth
      alert('Stripe OAuth integration coming soon! For now, try screenshot upload or manual entry.');
    } else {
      alert(`${platform} integration coming soon!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400">
            <CreditCard className="h-3 w-3" />
            Connect Billing Platform
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Connect Your Billing Platform
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            One-click sync for automatic data extraction and monthly re-audits
          </p>
        </motion.div>

        {/* Platforms Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {platforms.map((platform, i) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Card className={`p-6 ${platform.comingSoon ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{platform.logo}</div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                        {platform.name}
                      </h3>
                      {platform.comingSoon && (
                        <span className="text-xs text-amber-600 dark:text-amber-400">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {platform.description}
                </p>

                <ul className="mt-4 space-y-2">
                  {platform.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <ArrowRight className="h-3 w-3 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleConnect(platform.name)}
                  disabled={platform.comingSoon}
                  className="mt-6 w-full"
                  variant={platform.comingSoon ? 'outline' : 'default'}
                >
                  {platform.comingSoon ? 'Coming Soon' : `Connect ${platform.name}`}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid gap-4 sm:grid-cols-3"
        >
          {[
            {
              icon: Shield,
              title: 'Secure & Private',
              description: 'Bank-level encryption. Read-only access.',
            },
            {
              icon: RefreshCw,
              title: 'Auto Updates',
              description: 'Monthly re-audits with latest data.',
            },
            {
              icon: Zap,
              title: 'Instant Setup',
              description: 'Connect in 5 seconds. Zero manual work.',
            },
          ].map((item, i) => (
            <Card key={i} className="p-6 text-center">
              <item.icon className="mx-auto h-8 w-8 text-zinc-400" />
              <h4 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-50">
                {item.title}
              </h4>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                {item.description}
              </p>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
