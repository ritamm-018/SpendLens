'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Share2, Link2, Check, Target, TrendingDown, User } from 'lucide-react';
import { EnhancedAuditResult } from '@/lib/intelligence/types';
import { formatCurrency } from '@/lib/utils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: EnhancedAuditResult;
}

export function ShareModal({ isOpen, onClose, result }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [selectedCard, setSelectedCard] = useState<'efficiency' | 'savings' | 'profile'>('efficiency');

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/results/${result.id}`
    : '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getShareText = () => {
    switch (selectedCard) {
      case 'efficiency':
        return `My AI Infrastructure Efficiency Score: ${result.efficiencyScore.overall}/100\n\nOperating Profile: ${result.operatingProfile.profile.name}\n\nAnalyze your AI stack efficiency:`;
      case 'savings':
        return `I analyzed my AI infrastructure and found ${formatCurrency(result.totalMonthlySavings)}/month in optimization opportunities\n\nCheck your AI efficiency:`;
      case 'profile':
        return `My AI Operating Profile: ${result.operatingProfile.profile.name}\n\n${result.operatingProfile.profile.description}\n\nDiscover your profile:`;
      default:
        return '';
    }
  };

  const handleTwitterShare = () => {
    const text = getShareText();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Share Your Results
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Card Type Selection */}
            <div className="mb-6">
              <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                Choose what to share:
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedCard('efficiency')}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    selectedCard === 'efficiency'
                      ? 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
                  }`}
                >
                  <Target className="h-8 w-8 mb-2 text-blue-600 dark:text-blue-400" />
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    Efficiency Score
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    {result.efficiencyScore.overall}/100
                  </div>
                </button>

                <button
                  onClick={() => setSelectedCard('savings')}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    selectedCard === 'savings'
                      ? 'border-green-500 bg-green-50 dark:border-green-500 dark:bg-green-950/30'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
                  }`}
                >
                  <TrendingDown className="h-8 w-8 mb-2 text-green-600 dark:text-green-400" />
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    Savings Found
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    {formatCurrency(result.totalMonthlySavings)}/mo
                  </div>
                </button>

                <button
                  onClick={() => setSelectedCard('profile')}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    selectedCard === 'profile'
                      ? 'border-purple-500 bg-purple-50 dark:border-purple-500 dark:bg-purple-950/30'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
                  }`}
                >
                  <User className="h-8 w-8 mb-2 text-purple-600 dark:text-purple-400" />
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    Operating Profile
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    {result.operatingProfile.profile.name}
                  </div>
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="mb-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
                Preview:
              </div>
              <div className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                {getShareText()}
              </div>
            </div>

            {/* Share URL */}
            <div className="mb-6">
              <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Share link:
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                />
                <Button onClick={handleCopy} variant="outline" size="sm">
                  {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleTwitterShare}
                className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share on 𝕏
              </Button>
              <Button
                onClick={handleLinkedInShare}
                className="bg-[#0A66C2] text-white hover:bg-[#004182]"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share on LinkedIn
              </Button>
            </div>

            {/* Footer Note */}
            <p className="mt-4 text-xs text-center text-zinc-500 dark:text-zinc-500">
              Shared results are public but don't include personal information
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
