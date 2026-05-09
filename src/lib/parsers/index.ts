/**
 * Parser and Formatter Pipelines
 * 
 * Centralized exports for all parser and formatter functions.
 * These implement round-trip properties to ensure data integrity.
 */

// Efficiency Score
export {
  parseEfficiencyScore,
  formatEfficiencyScore,
  prettyPrintEfficiencyScore,
  parseEfficiencyScoreValue,
  formatEfficiencyScoreValue,
  validateRoundTrip as validateEfficiencyScoreRoundTrip,
  type EfficiencyScoreValue,
} from './efficiency-score';

// Benchmark Comparison
export {
  parseBenchmarkComparison,
  formatBenchmarkComparison,
  prettyPrintBenchmarkComparison,
  formatMissingBenchmark,
  validateRoundTrip as validateBenchmarkRoundTrip,
  type BenchmarkComparison,
  type FormattedBenchmarkComparison,
} from './benchmark';

// Operating Profile
export {
  parseOperatingProfile,
  formatOperatingProfile,
  prettyPrintOperatingProfile,
  formatProfileAssignment,
  prettyPrintProfileAssignment,
  validateRoundTrip as validateProfileRoundTrip,
  type OperatingProfile,
  type ProfileAssignment,
} from './profile';
