'use client';

import { motion } from 'framer-motion';
import { ProfileClassification } from '@/lib/intelligence/types';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface ProfileBadgeProps {
  classification: ProfileClassification;
}

export function ProfileBadge({ classification }: ProfileBadgeProps) {
  const { profile, confidence, alternativeProfiles } = classification;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-12"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Your Operating Profile
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          How we classify your AI infrastructure approach
        </p>
      </div>

      {/* Main Profile Card */}
      <div
        className="rounded-2xl border p-8"
        style={{
          background: `linear-gradient(135deg, ${profile.badge.gradient})`,
          borderColor: profile.badge.color,
        }}
      >
        <div className="flex items-start gap-6">
          {/* Icon */}
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-white/90 text-5xl shadow-lg dark:bg-zinc-900/90">
            {profile.badge.icon}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-white">
                {profile.name}
              </h3>
              <Badge className="bg-white/20 text-white backdrop-blur-sm">
                {confidence === 'high' && 'High Confidence'}
                {confidence === 'medium' && 'Medium Confidence'}
                {confidence === 'low' && 'Low Confidence'}
              </Badge>
            </div>

            <p className="mt-3 text-lg text-white/90">
              {profile.description}
            </p>

            {/* Characteristics */}
            <div className="mt-6 space-y-2">
              <div className="text-sm font-semibold text-white/80">
                Key Characteristics:
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {profile.characteristics.map((char, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white backdrop-blur-sm"
                  >
                    <span className="text-white/60">•</span>
                    {char}
                  </div>
                ))}
              </div>
            </div>

            {/* Typical Spend Range */}
            <div className="mt-6 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-sm font-semibold text-white/80">
                Typical Spend Range for this Profile:
              </div>
              <div className="mt-2 text-2xl font-bold text-white">
                {formatCurrency(profile.typicalSpendRange.min)} - {formatCurrency(profile.typicalSpendRange.max)}
                <span className="text-base font-normal text-white/70">/month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative Profiles */}
      {alternativeProfiles && alternativeProfiles.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            You also show traits of:
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {alternativeProfiles.slice(0, 2).map((alt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="text-3xl">{alt.profile.badge.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {alt.profile.name}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {Math.round(alt.score * 100)}% match
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
