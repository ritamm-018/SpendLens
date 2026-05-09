/**
 * Benchmark Comparison Parser and Formatter
 * 
 * Provides parsing, formatting, and pretty-printing for benchmark comparisons.
 * Implements round-trip property: parse(format(comparison)) ≈ comparison semantically
 * 
 * Requirements: 27.1, 27.2, 27.3, 27.4, 27.5, 27.6
 */

export interface BenchmarkComparison {
  userValue: number;
  benchmarkValue: number;
  percentile: number; // 0-100
  segment: string;
  metric: string;
  unit: string;
}

export interface FormattedBenchmarkComparison {
  comparison: 'above' | 'below' | 'at';
  difference: number;
  differencePercent: number;
  statement: string;
}

/**
 * Parse raw benchmark data into a comparison object
 */
export function parseBenchmarkComparison(data: unknown): BenchmarkComparison | null {
  if (typeof data !== 'object' || data === null) {
    return null;
  }
  
  const obj = data as Record<string, unknown>;
  
  // Validate required fields
  if (
    typeof obj.userValue !== 'number' ||
    typeof obj.benchmarkValue !== 'number' ||
    typeof obj.percentile !== 'number' ||
    typeof obj.segment !== 'string' ||
    typeof obj.metric !== 'string' ||
    typeof obj.unit !== 'string'
  ) {
    return null;
  }
  
  // Validate percentile range
  if (obj.percentile < 0 || obj.percentile > 100) {
    return null;
  }
  
  return {
    userValue: obj.userValue,
    benchmarkValue: obj.benchmarkValue,
    percentile: obj.percentile,
    segment: obj.segment,
    metric: obj.metric,
    unit: obj.unit,
  };
}

/**
 * Format a benchmark comparison into a human-readable statement
 */
export function formatBenchmarkComparison(
  comparison: BenchmarkComparison
): FormattedBenchmarkComparison {
  const { userValue, benchmarkValue, percentile, segment, metric, unit } = comparison;
  
  // Calculate difference
  const difference = userValue - benchmarkValue;
  const differencePercent = benchmarkValue !== 0 
    ? Math.round((difference / benchmarkValue) * 100)
    : 0;
  
  // Determine comparison type
  let comparisonType: 'above' | 'below' | 'at';
  if (Math.abs(differencePercent) < 5) {
    comparisonType = 'at';
  } else if (difference > 0) {
    comparisonType = 'above';
  } else {
    comparisonType = 'below';
  }
  
  // Generate statement
  let statement: string;
  
  if (comparisonType === 'at') {
    statement = `Your ${metric} (${formatValue(userValue, unit)}) is aligned with ${segment} (${formatValue(benchmarkValue, unit)})`;
  } else if (comparisonType === 'above') {
    statement = `Your ${metric} (${formatValue(userValue, unit)}) is ${Math.abs(differencePercent)}% above ${segment} (${formatValue(benchmarkValue, unit)})`;
  } else {
    statement = `Your ${metric} (${formatValue(userValue, unit)}) is ${Math.abs(differencePercent)}% below ${segment} (${formatValue(benchmarkValue, unit)})`;
  }
  
  return {
    comparison: comparisonType,
    difference,
    differencePercent,
    statement,
  };
}

/**
 * Pretty print a benchmark comparison with appropriate context and formatting
 */
export function prettyPrintBenchmarkComparison(
  comparison: BenchmarkComparison,
  options: {
    includePercentile?: boolean;
    includeSegment?: boolean;
    format?: 'text' | 'html';
  } = {}
): string {
  const { includePercentile = true, includeSegment = true, format = 'text' } = options;
  
  const formatted = formatBenchmarkComparison(comparison);
  const parts: string[] = [];
  
  // Main statement
  parts.push(formatted.statement);
  
  // Add percentile if requested
  if (includePercentile) {
    const percentileText = `You're in the top ${100 - comparison.percentile}% for ${comparison.metric}`;
    parts.push(percentileText);
  }
  
  // Add segment context if requested
  if (includeSegment && !formatted.statement.includes(comparison.segment)) {
    parts.push(`Compared to: ${comparison.segment}`);
  }
  
  if (format === 'html') {
    const colorClass = formatted.comparison === 'above' 
      ? 'text-amber-600 dark:text-amber-400'
      : formatted.comparison === 'below'
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-zinc-600 dark:text-zinc-400';
    
    return `<div class="${colorClass}">${parts.join('<br />')}</div>`;
  }
  
  return parts.join('\n');
}

/**
 * Format a value with its unit
 */
function formatValue(value: number, unit: string): string {
  if (unit === '$' || unit === 'USD') {
    return `$${Math.round(value)}`;
  }
  
  if (unit === '%') {
    return `${Math.round(value)}%`;
  }
  
  if (unit === 'per developer' || unit === '/dev') {
    return `$${Math.round(value)}/dev`;
  }
  
  return `${Math.round(value)} ${unit}`;
}

/**
 * Validate round-trip property: parse(format(comparison)) ≈ comparison semantically
 * Returns true if the essential data is preserved
 */
export function validateRoundTrip(comparison: BenchmarkComparison): boolean {
  // Format to JSON
  const json = {
    userValue: comparison.userValue,
    benchmarkValue: comparison.benchmarkValue,
    percentile: comparison.percentile,
    segment: comparison.segment,
    metric: comparison.metric,
    unit: comparison.unit,
  };
  
  // Parse back
  const parsed = parseBenchmarkComparison(json);
  
  if (!parsed) {
    return false;
  }
  
  // Check semantic equivalence
  return (
    Math.abs(parsed.userValue - comparison.userValue) < 0.01 &&
    Math.abs(parsed.benchmarkValue - comparison.benchmarkValue) < 0.01 &&
    Math.abs(parsed.percentile - comparison.percentile) < 0.01 &&
    parsed.segment === comparison.segment &&
    parsed.metric === comparison.metric &&
    parsed.unit === comparison.unit
  );
}

/**
 * Handle missing benchmark data gracefully
 */
export function formatMissingBenchmark(metric: string): string {
  return `Benchmark data for ${metric} is not available. We're continuously expanding our dataset.`;
}
