// ─────────────────────────────────────────────
// Benchmarking System
// Compares user performance to similar teams
// ─────────────────────────────────────────────

import { AuditResult } from '../audit/types';
import {
  BenchmarkComparison,
  BenchmarkData,
  BenchmarkSegment,
} from './types';
import { getToolPricing } from '../audit/pricing';

export class BenchmarkComparator {
  constructor(private benchmarks: BenchmarkData) {}

  /**
   * Generate benchmark comparisons for an audit
   */
  generateComparisons(audit: AuditResult): BenchmarkComparison[] {
    const segment = this.selectSegment(audit);
    if (!segment) return [];

    const comparisons: BenchmarkComparison[] = [];

    // Spend per developer comparison
    const spendPerDev = audit.totalCurrentSpend / audit.input.teamSize;
    const spendPercentile = this.calculatePercentile(
      spendPerDev,
      segment.metrics.medianSpendPerDev,
      segment.metrics.p25SpendPerDev,
      segment.metrics.p75SpendPerDev
    );

    comparisons.push({
      type: 'spend-per-developer',
      userValue: spendPerDev,
      benchmarkValue: segment.metrics.medianSpendPerDev,
      percentile: spendPercentile,
      statement: this.generateSpendStatement(
        spendPerDev,
        segment,
        spendPercentile
      ),
      sentiment: spendPercentile < 50 ? 'positive' : 'negative',
    });

    // Tool count comparison
    const toolCount = audit.input.tools.length;
    const toolCountPercentile =
      toolCount <= segment.metrics.medianToolCount ? 40 : 60;

    comparisons.push({
      type: 'tool-count',
      userValue: toolCount,
      benchmarkValue: segment.metrics.medianToolCount,
      percentile: toolCountPercentile,
      statement: this.generateToolCountStatement(toolCount, segment),
      sentiment: 'neutral',
    });

    // Category allocation comparisons
    const userAllocation = this.calculateCategoryAllocation(audit);
    const categoryComparisons = this.compareCategoryAllocation(
      userAllocation,
      segment.metrics.categoryAllocation
    );
    comparisons.push(...categoryComparisons);

    return comparisons;
  }

  /**
   * Select appropriate benchmark segment for audit
   */
  selectSegment(audit: AuditResult): BenchmarkSegment | null {
    const teamSize = audit.input.teamSize;
    const useCase = audit.input.primaryUseCase;

    // Try to find exact match
    for (const segment of Object.values(this.benchmarks.segments)) {
      if (
        teamSize >= segment.criteria.teamSizeMin &&
        teamSize <= segment.criteria.teamSizeMax &&
        (!segment.criteria.useCase || segment.criteria.useCase === useCase)
      ) {
        return segment;
      }
    }

    // Fallback to default segment
    return this.benchmarks.segments['default'] || null;
  }

  /**
   * Calculate percentile for a value
   */
  private calculatePercentile(
    value: number,
    median: number,
    p25: number,
    p75: number
  ): number {
    if (value <= p25) return 25;
    if (value <= median) return 25 + ((value - p25) / (median - p25)) * 25;
    if (value <= p75) return 50 + ((value - median) / (p75 - median)) * 25;
    return Math.min(100, 75 + ((value - p75) / p75) * 25);
  }

  /**
   * Generate spend comparison statement
   */
  private generateSpendStatement(
    userSpend: number,
    segment: BenchmarkSegment,
    percentile: number
  ): string {
    const diff = userSpend - segment.metrics.medianSpendPerDev;
    const diffPercent = Math.abs(
      Math.round((diff / segment.metrics.medianSpendPerDev) * 100)
    );

    if (percentile < 40) {
      return `Your spend of $${Math.round(userSpend)}/developer is ${diffPercent}% below the median for ${segment.name.toLowerCase()}. You're operating efficiently.`;
    } else if (percentile > 60) {
      return `Your spend of $${Math.round(userSpend)}/developer is ${diffPercent}% above the median for ${segment.name.toLowerCase()}. There may be optimization opportunities.`;
    } else {
      return `Your spend of $${Math.round(userSpend)}/developer is close to the median for ${segment.name.toLowerCase()}.`;
    }
  }

  /**
   * Generate tool count statement
   */
  private generateToolCountStatement(
    toolCount: number,
    segment: BenchmarkSegment
  ): string {
    const median = segment.metrics.medianToolCount;

    if (toolCount < median) {
      return `You're using ${toolCount} tools, which is below the median of ${median} for ${segment.name.toLowerCase()}. This suggests a focused approach.`;
    } else if (toolCount > median) {
      return `You're using ${toolCount} tools, which is above the median of ${median} for ${segment.name.toLowerCase()}. Consider consolidation opportunities.`;
    } else {
      return `You're using ${toolCount} tools, matching the median for ${segment.name.toLowerCase()}.`;
    }
  }

  /**
   * Calculate category allocation for audit
   */
  private calculateCategoryAllocation(
    audit: AuditResult
  ): Record<string, number> {
    const allocation: Record<string, number> = {};
    const total = audit.totalCurrentSpend;

    for (const tool of audit.toolResults) {
      const pricing = getToolPricing(tool.toolId);
      if (!pricing) continue;

      const category = pricing.category;
      const percentage = (tool.currentMonthlyCost / total) * 100;
      allocation[category] = (allocation[category] || 0) + percentage;
    }

    return allocation;
  }

  /**
   * Compare category allocation to benchmark
   */
  private compareCategoryAllocation(
    userAllocation: Record<string, number>,
    benchmarkAllocation: Record<string, number>
  ): BenchmarkComparison[] {
    const comparisons: BenchmarkComparison[] = [];

    for (const [category, userPercentage] of Object.entries(userAllocation)) {
      const benchmarkPercentage = benchmarkAllocation[category];
      if (!benchmarkPercentage) continue;

      const deviation = userPercentage - benchmarkPercentage;

      if (Math.abs(deviation) > 15) {
        const type =
          deviation > 0 ? 'category-over-indexed' : 'category-under-indexed';
        const statement = this.generateCategoryStatement(
          category,
          userPercentage,
          benchmarkPercentage,
          deviation
        );

        comparisons.push({
          type: `category-${category}`,
          userValue: userPercentage,
          benchmarkValue: benchmarkPercentage,
          percentile: deviation > 0 ? 75 : 25,
          statement,
          sentiment: Math.abs(deviation) > 25 ? 'negative' : 'neutral',
        });
      }
    }

    return comparisons;
  }

  /**
   * Generate category comparison statement
   */
  private generateCategoryStatement(
    category: string,
    userPercentage: number,
    benchmarkPercentage: number,
    deviation: number
  ): string {
    const absDeviation = Math.abs(Math.round(deviation));
    const categoryName = this.getCategoryDisplayName(category);

    if (deviation > 0) {
      return `Your ${categoryName} spend (${Math.round(userPercentage)}%) is ${absDeviation}pp above the ${Math.round(benchmarkPercentage)}% median. This suggests heavy investment in ${categoryName.toLowerCase()}.`;
    } else {
      return `Your ${categoryName} spend (${Math.round(userPercentage)}%) is ${absDeviation}pp below the ${Math.round(benchmarkPercentage)}% median. You may be under-investing in ${categoryName.toLowerCase()}.`;
    }
  }

  /**
   * Get display name for category
   */
  private getCategoryDisplayName(category: string): string {
    const names: Record<string, string> = {
      'ide-assistant': 'Coding AI',
      'chat-assistant': 'Research AI',
      'api-provider': 'API Infrastructure',
      'design-tool': 'Design & Prototyping',
    };
    return names[category] || category;
  }
}
