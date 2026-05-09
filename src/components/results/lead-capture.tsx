'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { leadCaptureSchema, LeadCaptureFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';

interface LeadCaptureProps {
  reportId: string;
  totalSavings: number;
}

export function LeadCapture({ reportId, totalSavings }: LeadCaptureProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadCaptureFormData>({
    resolver: zodResolver(leadCaptureSchema),
    defaultValues: {
      reportId,
    },
  });

  const onSubmit = async (data: LeadCaptureFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, totalSavings }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Lead capture error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="border-green-900 bg-green-950/30">
          <CardContent className="flex items-center gap-4 p-8">
            <CheckCircle2 className="h-12 w-12 text-green-400" />
            <div>
              <h3 className="text-xl font-semibold text-green-100">
                Report Sent!
              </h3>
              <p className="mt-1 text-green-300">
                Check your email for your full audit report and next steps.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Get Your Full Report
          </CardTitle>
          <CardDescription>
            Receive a detailed PDF report and personalized recommendations via email.
            {totalSavings > 500 && (
              <span className="mt-2 block font-medium text-zinc-50">
                With ${totalSavings}/mo in potential savings, you may qualify for Credex infrastructure credits.
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company (optional)</Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Acme Inc"
                  {...register('company')}
                />
              </div>
              <div>
                <Label htmlFor="role">Role (optional)</Label>
                <Input
                  id="role"
                  type="text"
                  placeholder="Founder, CTO, etc."
                  {...register('role')}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Email My Report
                </>
              )}
            </Button>

            <p className="text-xs text-zinc-500">
              We'll never spam you or share your email. Unsubscribe anytime.
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
