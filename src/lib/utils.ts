// ─────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatCurrencyAmount } from './currency/currencies';

/**
 * Merge Tailwind classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency with multi-currency support
 */
export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  return formatCurrencyAmount(amount, currencyCode, { showSymbol: true, decimals: 0 });
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Generate a short unique ID
 */
export function generateId(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get severity color classes
 */
export function getSeverityColor(severity: 'optimized' | 'minor' | 'moderate' | 'significant'): string {
  switch (severity) {
    case 'optimized':
      return 'text-green-400';
    case 'minor':
      return 'text-blue-400';
    case 'moderate':
      return 'text-yellow-400';
    case 'significant':
      return 'text-red-400';
  }
}

/**
 * Get severity badge classes
 */
export function getSeverityBadge(severity: 'optimized' | 'minor' | 'moderate' | 'significant'): string {
  switch (severity) {
    case 'optimized':
      return 'bg-green-900/30 text-green-300';
    case 'minor':
      return 'bg-blue-900/30 text-blue-300';
    case 'moderate':
      return 'bg-yellow-900/30 text-yellow-300';
    case 'significant':
      return 'bg-red-900/30 text-red-300';
  }
}
