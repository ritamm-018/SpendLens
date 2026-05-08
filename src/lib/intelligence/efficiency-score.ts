// ─────────────────────────────────────────────
// Efficiency Score Calculator
// Calculates AI Stack Efficiency Score (0-100)
// ─────────────────────────────────────────────

import { AuditResult } from '../audit/types';
import {
  EfficiencyScore,
  EfficiencyScoreComponents,
  BenchmarkData,
  BenchmarkSegment,
} from './types';

export class EfficiencyScoreCalculator {
  private readonly WEIGHTS = {
    costEfficiency: 0.4,
    toolOptimization: 0.3,
    benchmarkPerformance: 0.2,
    riskFactors: 0.1,
  };

  /**
   * Calculate efficiency score for an audit
   */
  calculate(audit: AuditResult, benchmarks: BenchmarkData): EfficiencyScore {
    const components: EfficiencyScoreComponents = {
      costEfficiency: this.calculateCostEfficiency(audit),
      toolOptimization: this.calculateToolOptimization(audit),
      benchmarkPerformance: this.calculateBenchmarkPerformance(
        audit,
        benchmarks
      ),
      riskFactors: this.calculateRiskFactors(audit),
    };

    // Weighted sum
    const overall = Math.round(
      components.costEfficiency * this.WEIGHTS.costEfficiency +
        components.toolOptimization * this.WEIGHTS.toolOptimization +
        components.benchmarkPerformance * this.WEIGHTS.benchmarkPerformance +
        components.riskFactors * this.WEIGHTS.riskFactors
    );

    // Clamp to 0-100
    const clampedOverall = Math.max(0, Math.min(100, overall));

    const breakdown = this.generateBreakdown(components);
    const confidence = this.calculateConfidence(audit, benchmarks);

    return {
      overall: clampedOverall,
      components,
      breakdown,
      confidence,
    };
  }

  /**
   * Calculate cost efficiency component (40% weight)
   * Higher savings potential = lower efficiency
   */
  private calculateCostEfficiency(audit: AuditResult): number {
    // 0% savings = 100 score
    // 50%+ savings = 0 score
    const savingsPercentage = audit.savingsPercentage;
    const score = Math.max(0, 100 - savingsPercentage * 2);
    return Math.round(score);
  }

  /**
   * Calculate tool optimization component (30% weight)
   * Factors: excess seats, overlaps, plan mismatches, credits
   */
  private calculateToolOptimization(audit: AuditResult): number {
    let score = 100;

    // Penalize excess seats
    const excessSeatRecs = audit.toolResults.filter((t) =>
      t.recommendations.some((r) => r.type === 'optimize-seats')
    );
    score -= excessSeatRecs.length * 10;

    // Penalize overlaps
    const overlapRecs = audit.toolResults.filter((t) =>
      t.recommendations.some((r) => r.type === 'consolidate')
    );
    score -= overlapRecs.length * 15;

    // Penalize plan mismatches
    const planMismatchRecs = audit.toolResults.filter((t) =>
      t.recommendations.some(
        (r) => r.type === 'downgrade' || r.type === 'upgrade'
      )
    );
    score -= planMismatchRecs.length * 8;

    // Bonus for using startup credits
    const creditsRecs = audit.toolResults.filter((t) =>
      t.recommendations.some((r) => r.type === 'credits-program')
    );
    score += creditsRecs.length * 5;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Calculate benchmark performance component (20% weight)
   * Compare to similar teams
   */
  private calculateBenchmarkPerformance(
    audit: AuditResult,
    benchmarks: BenchmarkData
  ): number {
    const segment = this.getSegment(audit, benchmarks);

    if (!segment) return 50; // Neutral if no benchmark

    const spendPerDev = audit.totalCurrentSpend / audit.input.teamSize;
    const benchmarkSpendPerDev = segment.metrics.medianSpendPerDev;

    // Better than median = higher score
    // At median = 50 score
    // 2x median = 0 score
    const ratio = spendPerDev / benchmarkSpendPerDev;
    const score = Math.max(0, 100 - (ratio - 1) * 100);

    return Math.round(score);
  }

  /**
   * Calculate risk factors component (10% weight)
   * Factors: vendor concentration, missing tools, over-provisioning
   */
  private calculateRiskFactors(audit: AuditResult): number {
    let score = 100;

    // Vendor concentration risk
    const vendorCounts = this.countByVendor(audit.input.tools);
    const maxVendorPercentage =
      Math.max(...Object.values(vendorCounts)) / audit.input.tools.length;
    if (maxVendorPercentage > 0.7) {
      score -= 20; // High concentration risk
    }

    // Missing IDE assistant (for coding teams)
    if (
      audit.input.primaryUseCase === 'coding' &&
      !audit.toolResults.some(
        (t) =>
          t.toolId.includes('cursor') ||
          t.toolId.includes('copilot') ||
          t.toolId.includes('windsurf')
      )
    ) {
      score -= 10;
    }

    // Over-provisioning (enterprise plans for small teams)
    const enterpriseOnSmallTeam = audit.toolResults.filter(
      (t) =>
        t.currentPlan.toLowerCase().includes('enterprise') &&
        audit.input.teamSize < 20
    );
    score -= enterpriseOnSmallTeam.length * 15;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Generate breakdown of score components
   */
  private generateBreakdown(components: EfficiencyScoreComponents) {
    return [
      {
        component: 'costEfficiency' as const,
        score: components.costEfficiency,
        weight: this.WEIGHTS.costEfficiency,
        contribution: components.costEfficiency * this.WEIGHTS.costEfficiency,
        description: 'How much you could save through optimization',
      },
      {
        component: 'toolOptimization' as const,
        score: components.toolOptimization,
        weight: this.WEIGHTS.toolOptimization,
        contribution:
          components.toolOptimization * this.WEIGHTS.toolOptimization,
        description: 'How well your tools are configured and utilized',
      },
      {
        component: 'benchmarkPerformance' as const,
        score: components.benchmarkPerformance,
        weight: this.WEIGHTS.benchmarkPerformance,
        contribution:
          components.benchmarkPerformance * this.WEIGHTS.benchmarkPerformance,
        description: 'How you compare to similar organizations',
      },
      {
        component: 'riskFactors' as const,
        score: components.riskFactors,
        weight: this.WEIGHTS.riskFactors,
        contribution: components.riskFactors * this.WEIGHTS.riskFactors,
        description: 'Vendor concentration and infrastructure risks',
      },
    ];
  }

  /**
   * Calculate confidence level
   */
  private calculateConfidence(
    audit: AuditResult,
    benchmarks: BenchmarkData
  ): 'high' | 'medium' | 'low' {
    const toolCount = audit.input.tools.length;
    const segment = this.getSegment(audit, benchmarks);
    const hasBenchmark = !!segment;

    if (toolCount >= 5 && hasBenchmark) return 'high';
    if (toolCount >= 3) return 'medium';
    return 'low';
  }

  /**
   * Get benchmark segment for audit
   */
  private getSegment(
    audit: AuditResult,
    benchmarks: BenchmarkData
  ): BenchmarkSegment | null {
    const teamSize = audit.input.teamSize;
    const useCase = audit.input.primaryUseCase;

    // Try to find exact match
    for (const segment of Object.values(benchmarks.segments)) {
      if (
        teamSize >= segment.criteria.teamSizeMin &&
        teamSize <= segment.criteria.teamSizeMax &&
        (!segment.criteria.useCase || segment.criteria.useCase === useCase)
      ) {
        return segment;
      }
    }

    // Fallback to default segment
    return benchmarks.segments['default'] || null;
  }

  /**
   * Count tools by vendor
   */
  private countByVendor(tools: any[]): Record<string, number> {
    const counts: Record<string, number> = {};

    for (const tool of tools) {
      // Simple vendor extraction from tool ID
      const vendor = tool.toolId.split('-')[0];
      counts[vendor] = (counts[vendor] || 0) + 1;
    }

    return counts;
  }
}
