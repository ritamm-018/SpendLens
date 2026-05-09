'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, Copy, CheckCircle, ArrowRight, Smartphone, Zap, Shield } from 'lucide-react';
import { useState } from 'react';

export default function EmailForwardPage() {
  const [copied, setCopied] = useState(false);
  const emailAddress = 'audit@spendlens.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-400">
            <Mail className="h-3 w-3" />
            Email Forwarding
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Forward Your Invoice Email
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            The easiest way to audit your AI spend. Just forward your billing emails.
          </p>
        </motion.div>

        {/* Email Address Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-8 text-center dark:border-violet-900 dark:from-violet-950/20 dark:to-purple-950/20">
            <Mail className="mx-auto h-12 w-12 text-violet-600 dark:text-violet-400" />
            <h2 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Forward invoices to:
            </h2>
            <div className="mt-6 flex items-center justify-center gap-3">
              <code className="rounded-lg bg-white px-6 py-3 text-xl font-mono text-violet-600 dark:bg-zinc-900 dark:text-violet-400">
                {emailAddress}
              </code>
              <Button onClick={copyEmail} variant="outline" size="sm">
                {copied ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              We'll analyze your invoice and email you a unique audit link within minutes
            </p>
          </Card>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <h3 className="mb-6 text-center text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            How It Works
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Forward Email',
                description: 'Forward your billing emails from Cursor, OpenAI, Anthropic, etc.',
              },
              {
                step: '2',
                title: 'AI Extracts Data',
                description: 'Our AI parses tool names, plans, costs, and billing dates.',
              },
              {
                step: '3',
                title: 'Get Audit Link',
                description: 'Receive a unique link to your personalized audit report.',
              },
            ].map((item, i) => (
              <Card key={i} className="p-6 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-lg font-bold text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                  {item.step}
                </div>
                <h4 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-50">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Example Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h3 className="mb-4 text-center text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Example Response
          </h3>
          <Card className="p-6">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-2 text-xs text-zinc-500">From: SpendLens &lt;audit@spendlens.com&gt;</div>
              <div className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Subject: Your SpendLens Audit is Ready
              </div>
              <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                <p>Hi there,</p>
                <p>We've analyzed your invoice from <strong>Cursor</strong> and found:</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Current Plan: Pro ($20/mo)</li>
                  <li>Potential Savings: $80/month</li>
                  <li>Recommendation: Right-size to 8 seats</li>
                </ul>
                <p className="mt-4">
                  <Button size="sm" className="mt-2">
                    View Full Audit <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid gap-4 sm:grid-cols-3"
        >
          {[
            {
              icon: Smartphone,
              title: 'Works from Mobile',
              description: 'Forward emails from your phone. No desktop needed.',
            },
            {
              icon: Zap,
              title: 'Zero Friction',
              description: 'No forms to fill. Just forward and wait.',
            },
            {
              icon: Shield,
              title: 'Secure Processing',
              description: 'Emails are processed securely and deleted after.',
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
