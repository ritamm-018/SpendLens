// ─────────────────────────────────────────────
// Animation Configuration
// Framer Motion spring physics and transitions
// ─────────────────────────────────────────────

import { Transition } from 'framer-motion';

/**
 * Spring physics configurations for different animation feels
 */
export const SPRING_CONFIGS = {
  gentle: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 15,
  },
  snappy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 25,
  },
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 20,
  },
  smooth: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 20,
  },
} as const;

/**
 * Common transition definitions
 */
export const TRANSITIONS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: SPRING_CONFIGS.gentle,
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: SPRING_CONFIGS.gentle,
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: SPRING_CONFIGS.gentle,
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: SPRING_CONFIGS.gentle,
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: SPRING_CONFIGS.snappy,
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: SPRING_CONFIGS.smooth,
  },
} as const;

/**
 * Animation utilities
 */
export const ANIMATION_UTILS = {
  /**
   * GPU-accelerated properties
   * Only animate these for best performance
   */
  gpuAccelerated: {
    transform: true,
    opacity: true,
  },

  /**
   * Respect user motion preferences
   * Reduces animations for users who prefer reduced motion
   */
  respectMotionPreference: (animation: any) => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return { ...animation, transition: { duration: 0.01 } };
    }
    return animation;
  },

  /**
   * Stagger children animations
   */
  staggerChildren: (delayPerChild: number = 0.1): Transition => ({
    staggerChildren: delayPerChild,
  }),

  /**
   * Delay animation start
   */
  delay: (seconds: number): Transition => ({
    delay: seconds,
  }),
} as const;

/**
 * Page transition variants
 */
export const PAGE_TRANSITIONS = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: SPRING_CONFIGS.gentle,
} as const;

/**
 * Card animation variants
 */
export const CARD_ANIMATIONS = {
  hover: {
    scale: 1.02,
    transition: SPRING_CONFIGS.snappy,
  },
  tap: {
    scale: 0.98,
    transition: SPRING_CONFIGS.snappy,
  },
} as const;

/**
 * Loading animation variants
 */
export const LOADING_ANIMATIONS = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
  shimmer: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
} as const;
