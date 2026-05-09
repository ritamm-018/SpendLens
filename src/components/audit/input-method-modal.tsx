'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  X,
  Upload,
  CreditCard,
  Mail,
  Puzzle,
  Edit3,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InputMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type InputMethod = 'manual' | 'screenshot' | 'billing' | 'email' | 'extension';

export function InputMethodModal({ isOpen, onClose }: InputMethodModalProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<InputMethod | null>(null);

  const methods = [
    {
      id: 'screenshot' as InputMethod,
      icon: Upload,
      title: 'Upload Screenshot',
      description: 'Drag & drop your billing dashboard screenshot',
      badge: 'Fastest',
      badgeColor: 'bg-emerald-950 text-emerald-400',
      time: '10 seconds',
      features: ['Auto-extract data', 'Works with any billing system', 'AI-powered parsing'],
      gradient: 'from-emerald-500 to-green-600',
    },
    {
      id: 'billing' as InputMethod,
      icon: CreditCard,
      title: 'Connect Billing Platform',
      description: 'One-click sync with Stripe, Brex, or Expensify',
      badge: 'Most Accurate',
      badgeColor: 'bg-blue-950 text-blue-400',
      time: '5 seconds',
      features: ['Real-time sync', 'Auto monthly audits', 'Zero manual work'],
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      id: 'email' as InputMethod,
      icon: Mail,
      title: 'Forward Invoice Email',
      description: 'Send your billing emails to audit@spendlens.com',
      badge: 'Zero Friction',
      badgeColor: 'bg-violet-950 text-violet-400',
      time: '5 seconds',
      features: ['Works from mobile', 'No account needed', 'Instant audit link'],
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      id: 'extension' as InputMethod,
      icon: Puzzle,
      title: 'Browser Extension',
      description: 'Auto-detect AI tools you\'re already using',
      badge: 'Coming Soon',
      badgeColor: 'bg-amber-950 text-amber-400',
      time: '3 seconds',
      features: ['Passive detection', 'Always accurate', 'Privacy-friendly'],
      gradient: 'from-amber-500 to-orange-600',
      comingSoon: true,
    },
    {
      id: 'manual' as InputMethod,
      icon: Edit3,
      title: 'Enter Manually',
      description: 'Fill out the form with your AI tool details',
      badge: 'Full Control',
      badgeColor: 'bg-zinc-800 text-zinc-400',
      time: '90 seconds',
      features: ['Detailed input', 'Custom tools', 'Complete flexibility'],
      gradient: 'from-zinc-500 to-zinc-600',
    },
  ];

  const handleMethodSelect = (methodId: InputMethod) => {
    setSelectedMethod(methodId);

    // Slight delay for visual feedback
    setTimeout(() => {
      if (methodId === 'manual') {
        router.push('/audit');
      } else if (methodId === 'screenshot') {
        router.push('/audit/screenshot');
      } else if (methodId === 'billing') {
        router.push('/audit/connect');
      } else if (methodId === 'email') {
        router.push('/audit/email');
      } else if (methodId === 'extension') {
        // Coming soon - show notification
        alert('Browser extension coming soon! For now, try screenshot upload or manual entry.');
        setSelectedMethod(null);
      }
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto mx-4"
        >
          <Card className="p-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500"
              >
                <Sparkles className="h-8 w-8 text-white" />
              </motion.div>

              <h2 className="text-3xl font-bold text-zinc-50">
                Choose Your Input Method
              </h2>
              <p className="mt-2 text-lg text-zinc-400">
                Select how you'd like to provide your AI spend data
              </p>
            </div>

            {/* Methods Grid */}
            <div className="space-y-6">
              {/* Enter Manually - Featured Option */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <button
                  onClick={() => handleMethodSelect('manual')}
                  className="group relative w-full text-left transition-all cursor-pointer"
                >
                  <Card
                    className={`p-6 transition-all ${
                      selectedMethod === 'manual'
                        ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-zinc-950'
                        : 'hover:shadow-lg hover:scale-[1.01]'
                    } hover:border-emerald-700 bg-gradient-to-r from-zinc-900 to-zinc-900/50`}
                  >
                    <div className="flex items-center gap-6">
                      {/* Icon */}
                      <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-zinc-500 to-zinc-600 p-4">
                        <Edit3 className="h-8 w-8 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold text-zinc-50">
                            Enter Manually
                          </h3>
                          <span className="rounded bg-zinc-800 text-zinc-400 px-3 py-1 text-xs font-medium">
                            Full Control
                          </span>
                          <span className="text-xs text-zinc-500">90 seconds</span>
                        </div>
                        <p className="mt-2 text-sm text-zinc-400">
                          Fill out the form with your AI tool details • Detailed input • Custom tools • Complete flexibility
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0">
                        <ArrowRight className="h-6 w-6 text-zinc-600 transition-all group-hover:text-emerald-500 group-hover:translate-x-1" />
                      </div>
                    </div>

                    {/* Selected Indicator */}
                    {selectedMethod === 'manual' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500"
                      >
                        <ArrowRight className="h-4 w-4 text-white" />
                      </motion.div>
                    )}
                  </Card>
                </button>
              </motion.div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-950 px-4 text-zinc-500">Or use automation</span>
                </div>
              </div>

              {/* Other Methods - 4 in a row */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {methods.filter(m => m.id !== 'manual').map((method, index) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;

                  return (
                    <motion.div
                      key={method.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + 0.1 * index }}
                    >
                      <button
                        onClick={() => !method.comingSoon && handleMethodSelect(method.id)}
                        disabled={method.comingSoon}
                        className={`group relative w-full text-left transition-all ${
                          method.comingSoon ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                        }`}
                      >
                        <Card
                          className={`h-full p-5 transition-all ${
                            isSelected
                              ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-zinc-950'
                              : 'hover:shadow-lg hover:scale-[1.02]'
                          } ${method.comingSoon ? '' : 'hover:border-emerald-700'}`}
                        >
                          {/* Icon */}
                          <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${method.gradient} p-3`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>

                          {/* Badge */}
                          <div className="mb-3 flex items-center justify-between">
                            <span className={`rounded px-2 py-1 text-xs font-medium ${method.badgeColor}`}>
                              {method.badge}
                            </span>
                            <span className="text-xs text-zinc-500">{method.time}</span>
                          </div>

                          {/* Title & Description */}
                          <h3 className="mb-2 font-semibold text-zinc-50 text-sm">
                            {method.title}
                          </h3>
                          <p className="mb-3 text-xs text-zinc-400 line-clamp-2">
                            {method.description}
                          </p>

                          {/* Features - Compact */}
                          <ul className="space-y-1.5">
                            {method.features.slice(0, 2).map((feature, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-zinc-400">
                                <ArrowRight className="mt-0.5 h-3 w-3 flex-shrink-0 text-emerald-500" />
                                <span className="line-clamp-1">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Selected Indicator */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500"
                            >
                              <ArrowRight className="h-3 w-3 text-white" />
                            </motion.div>
                          )}
                        </Card>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-zinc-400">
                All methods are secure and privacy-friendly. Your data is never shared.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
