// ─────────────────────────────────────────────
// Transition Utilities
// Helper functions for animation transitions
// ─────────────────────────────────────────────

import { Variants } from 'framer-motion';
import { SPRING_CONFIGS } from './spring-configs';

/**
 * Create a stagger container variant
 */
export function createStaggerContainer(delayPerChild: number = 0.1): Variants {
  return {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: delayPerChild,
      },
    },
  };
}

/**
 * Create a stagger item variant
 */
export function createStaggerItem(): Variants {
  return {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: SPRING_CONFIGS.gentle,
    },
  };
}

/**
 * Create a fade variant with custom duration
 */
export function createFadeVariant(duration: number = 0.3): Variants {
  return {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration },
    },
    exit: {
      opacity: 0,
      transition: { duration: duration * 0.5 },
    },
  };
}

/**
 * Create a slide variant with custom direction
 */
export function createSlideVariant(
  direction: 'up' | 'down' | 'left' | 'right',
  distance: number = 20
): Variants {
  const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
  const value =
    direction === 'up' || direction === 'left' ? distance : -distance;

  const hiddenState = { opacity: 0 } as any;
  hiddenState[axis] = value;

  const showState = { opacity: 1 } as any;
  showState[axis] = 0;
  showState.transition = SPRING_CONFIGS.gentle;

  const exitState = { opacity: 0 } as any;
  exitState[axis] = -value;
  exitState.transition = SPRING_CONFIGS.gentle;

  return {
    hidden: hiddenState,
    show: showState,
    exit: exitState,
  };
}

/**
 * Create a scale variant
 */
export function createScaleVariant(
  initialScale: number = 0.9,
  exitScale: number = 0.9
): Variants {
  return {
    hidden: { opacity: 0, scale: initialScale },
    show: {
      opacity: 1,
      scale: 1,
      transition: SPRING_CONFIGS.snappy,
    },
    exit: {
      opacity: 0,
      scale: exitScale,
      transition: SPRING_CONFIGS.snappy,
    },
  };
}
