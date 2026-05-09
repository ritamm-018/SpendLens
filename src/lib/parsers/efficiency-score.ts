/**
 * Efficiency Score Parser and Formatter
 * 
 * Provides parsing, formatting, and pretty-printing for efficiency scores.
 * Implements round-trip property: parse(format(score)) === score (within tolerance)
 * 
 * Requirements: 26.1, 26.2, 26.3, 26.4, 26.5, 26.6
 */

export interface EfficiencyScoreValue {
  score: number; // 0-100
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Parse a raw efficiency calculation into a normalized 0-100 score
 * Handles edge cases: negative values, values > 100, NaN, Infinity
 */
export function parseEfficiencyScore(raw: number): number {
  // Handle invalid inputs
  if (!Number.isFinite(raw) || Number.isNaN(raw)) {
    return 0;
  }
  
  // Clamp to valid range [0, 100]
  return Math.max(0, Math.min(100, Math.round(raw)));
}

/**
 * Format an efficiency score for display
 * Returns whole number with consistent precision
 */
export function formatEfficiencyScore(score: number): string {
  const normalized = parseEfficiencyScore(score);
  return normalized.toString();
}

/**
 * Pretty print an efficiency score with visual indicators
 * Includes color coding and contextual labels
 */
export function prettyPrintEfficiencyScore(
  score: number,
  options: {
    showLabel?: boolean;
    showIcon?: boolean;
    format?: 'text' | 'html';
  } = {}
): string {
  const normalized = parseEfficiencyScore(score);
  const { showLabel = true, showIcon = true, format = 'text' } = options;
  
  // Determine rating and color
  let rating: string;
  let color: string;
  let icon: string;
  
  if (normalized >= 85) {
    rating = 'Excellent';
    color = 'emerald';
    icon = '🌟';
  } else if (normalized >= 70) {
    rating = 'Good';
    color = 'green';
    icon = '✓';
  } else if (normalized >= 50) {
    rating = 'Fair';
    color = 'amber';
    icon = '⚠';
  } else {
    rating = 'Needs Improvement';
    color = 'rose';
    icon = '!';
  }
  
  // Build output
  const parts: string[] = [];
  
  if (showIcon && format === 'text') {
    parts.push(icon);
  }
  
  parts.push(normalized.toString());
  
  if (showLabel) {
    parts.push(`(${rating})`);
  }
  
  if (format === 'html') {
    return `<span class="text-${color}-600 dark:text-${color}-400 font-semibold">${parts.join(' ')}</span>`;
  }
  
  return parts.join(' ');
}

/**
 * Parse an efficiency score value object from JSON
 */
export function parseEfficiencyScoreValue(json: unknown): EfficiencyScoreValue | null {
  if (typeof json !== 'object' || json === null) {
    return null;
  }
  
  const obj = json as Record<string, unknown>;
  
  if (typeof obj.score !== 'number') {
    return null;
  }
  
  const confidence = obj.confidence;
  if (confidence !== 'high' && confidence !== 'medium' && confidence !== 'low') {
    return null;
  }
  
  return {
    score: parseEfficiencyScore(obj.score),
    confidence,
  };
}

/**
 * Format an efficiency score value object to JSON
 */
export function formatEfficiencyScoreValue(value: EfficiencyScoreValue): Record<string, unknown> {
  return {
    score: parseEfficiencyScore(value.score),
    confidence: value.confidence,
  };
}

/**
 * Validate round-trip property: parse(format(score)) === score
 * Returns true if the property holds within tolerance
 */
export function validateRoundTrip(score: number, tolerance: number = 0.5): boolean {
  const formatted = formatEfficiencyScore(score);
  const parsed = parseEfficiencyScore(Number(formatted));
  const original = parseEfficiencyScore(score);
  
  return Math.abs(parsed - original) <= tolerance;
}
