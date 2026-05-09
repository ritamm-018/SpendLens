'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Loader2, Brain, TrendingUp, Target, Sparkles } from 'lucide-react';

const loadingSteps = [
  { text: 'Analyzing startup infrastructure patterns', icon: Brain },
  { text: 'Comparing against similar engineering teams', icon: TrendingUp },
  { text: 'Estimating optimization opportunities', icon: Target },
  { text: 'Generating operational insights', icon: Sparkles },
];

export function LoadingSequence() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 750);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="w-full max-w-md px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="mb-8 flex justify-center">
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 p-4"
              >
                {(() => {
                  const Icon = loadingSteps[currentStep].icon;
                  return <Icon className="h-8 w-8 text-white" />;
                })()}
              </motion.div>
            </div>

            <motion.p
              className="text-lg font-medium text-zinc-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {loadingSteps[currentStep].text}
            </motion.p>

            <motion.div
              className="mt-8 flex justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {loadingSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                    i === currentStep
                      ? 'bg-emerald-500'
                      : i < currentStep
                      ? 'bg-emerald-700'
                      : 'bg-zinc-800'
                  }`}
                />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
