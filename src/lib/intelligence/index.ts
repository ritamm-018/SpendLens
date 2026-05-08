// ─────────────────────────────────────────────
// Intelligence Engine
// Main export point for intelligence platform
// ─────────────────────────────────────────────

export * from './types';
export * from './efficiency-score';
export * from './benchmarking';
export * from './profile-classifier';
export * from './category-analyzer';
export * from './insights-generator';

import { AuditResult } from '../audit/types';
import { EnhancedAuditResult, BenchmarkData } from './types';
import { EfficiencyScoreCalculator } from './efficiency-score';
import { BenchmarkComparator } from './benchmarking';
import { OperatingProfileClassifier } from './profile-classifier';
import { CategoryAnalyzer } from './category-analyzer';
import { InsightsGenerator } from './insights-generator';
import benchmarksData from '@/data/benchmarks.json';

/**
 * Main intelligence engine
 * Enhances audit results with intelligence features
 */
export class IntelligenceEngine {
  private efficiencyCalculator: EfficiencyScoreCalculator;
  private benchmarkComparator: BenchmarkComparator;
  private profileClassifier: OperatingProfileClassifier;
  private categoryAnalyzer: CategoryAnalyzer;
  private insightsGenerator: InsightsGenerator;
  private benchmarks: BenchmarkData;

  constructor() {
    this.benchmarks = benchmarksData as BenchmarkData;
    this.efficiencyCalculator = new EfficiencyScoreCalculator();
    this.benchmarkComparator = new BenchmarkComparator(this.benchmarks);
    this.profileClassifier = new OperatingProfileClassifier();
    this.categoryAnalyzer = new CategoryAnalyzer();
    this.insightsGenerator = new InsightsGenerator();
  }

  /**
   * Enhance audit result with intelligence
   */
  async enhance(audit: AuditResult): Promise<EnhancedAuditResult> {
    const startTime = performance.now();

    // Calculate all intelligence components
    const efficiencyScore = this.efficiencyCalculator.calculate(
      audit,
      this.benchmarks
    );
    const benchmarkComparisons =
      this.benchmarkComparator.generateComparisons(audit);
    const operatingProfile = this.profileClassifier.classify(audit);
    const categoryBreakdown = this.categoryAnalyzer.analyze(
      audit,
      this.benchmarks
    );
    const strategicInsights = this.insightsGenerator.generate(audit);

    const processingTime = performance.now() - startTime;

    return {
      ...audit,
      efficiencyScore,
      benchmarkComparisons,
      operatingProfile,
      categoryBreakdown,
      strategicInsights,
      intelligenceVersion: '1.0.0',
      processingTime,
      teamSize: audit.input.teamSize,
    };
  }

  /**
   * Get benchmark data
   */
  getBenchmarks(): BenchmarkData {
    return this.benchmarks;
  }
}

// Export singleton instance
export const intelligenceEngine = new IntelligenceEngine();
