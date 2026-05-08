'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuditForm } from '@/components/audit/audit-form';
import { AuditInputFormData } from '@/lib/validation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuditPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: AuditInputFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Audit failed');
      }

      const result = await response.json();
      
      // Store in sessionStorage for now
      sessionStorage.setItem(`audit-${result.id}`, JSON.stringify(result));
      
      router.push(`/results/${result.id}`);
    } catch (error) {
      console.error('Audit error:', error);
      alert('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            AI Spend Audit
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Tell us about your AI stack and we'll identify optimization opportunities.
            Takes about 90 seconds.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AuditForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </motion.div>
      </div>
    </div>
  );
}
