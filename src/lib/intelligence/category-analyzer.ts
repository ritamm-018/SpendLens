// ─────────────────────────────────────────────
// Category Analysis Engine
// Analyzes spend by functional category
// ─────────────────────────────────────────────

import { AuditResult } from '../audit/types';
import {
  CategoryBreakdown,
  CategoryAnalysis,
  CategoryInsight,
  BenchmarkData,
  BenchmarkSegment,
} from './types';
import { getToolPricing } from '../audit/pricing';

export class CategoryAnalyzer {
  private readonly CATEGORY_NAMES: Record<string, string> = {
    'ide-assistant': 'Coding AI',
    'chat-assistant': 'Research AI',
    'api-provider': 'API Infrastructure',
    'design-tool': 'Design & Prototyping',
  };

  /**
   * Analyze spend by category
   */
  analyze(audit: AuditResult, benchmarks: BenchmarkData): CategoryBreakdown {
    const categories = this.calculateCategories(audit);
    const insights = this.generateInsights(categories, audit, benchmarks);

    return {
      categories,
      totalSpend: audit.totalCurrentSpend,
      insights,
    };
  }

  /**
   * Calculate category breakdown
   */
  private calculateCategories(audit: AuditResult): CategoryAnalysis[] {
    const categoryMap = new Map<string, CategoryAnalysis>();

    for (const tool of audit.toolResults) {
      const pricing = getToolPricing(tool.toolId);
      if (!pricing) continue;

      const category = pricing.category;

      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          category,
          displayName: this.CATEGORY_NAMES[category] || category,
          totalSpend: 0,
          percentage: 0,
          spendPerTeamMember: 0,
          tools: [],
        });
      }

      const categoryData = categoryMap.get(category)!;
      categoryData.totalSpend += tool.currentMonthlyCost;
      categoryData.tools.push({
        toolId: tool.toolId,
        toolName: tool.toolName,
        spend: tool.currentMonthlyCost,
      });
    }

    // Calculate percentages
    const categories = Array.from(categoryMap.values());
    for (const category of categories) {
      category.percentage =
        (category.totalSpend / audit.totalCurrentSpend) * 100;
      category.spendPerTeamMember = category.totalSpend / audit.input.teamSize;
    }

    // Sort by spend (descending)
    categories.sort((a, b) => b.totalSpend - a.totalSpend);

    return categories;
  }

  /**
   * Generate category insights
   */
  private generateInsights(
    categories: CategoryAnalysis[],
    audit: AuditResult,
    benchmarks: BenchmarkData
  ): CategoryInsight[] {
    const insights: CategoryInsight[] = [];
    const segment = this.getSegment(audit, benchmarks);

    if (!segment) return insights;

    for (const category of categories) {
      const benchmarkPercentage =
        segment.metrics.categoryAllocation[category.category];
      if (!benchmarkPercentage) continue;

      const deviation = category.percentage - benchmarkPercentage;

      if (Math.abs(deviation) > 15) {
        const type = deviation > 0 ? 'over-indexed' : 'under-indexed';
        const message = this.generateCategoryInsightMessage(
          category,
          benchmarkPercentage,
          deviation,
          type
        );

        insights.push({
          category: category.category,
          type: deviation > 0 ? 'over-indexed' : 'under-indexed',
          message,
          severity: Math.abs(deviation) > 25 ? 'warning' : 'info',
        });
      }
    }

    return insights;
  }

  /**
   * Generate category insight message
   */
  private generateCategoryInsightMessage(
    category: CategoryAnalysis,
    benchmarkPercentage: number,
    deviation: number,
    type: 'over-indexed' | 'under-indexed'
  ): string {
    const absDeviation = Math.abs(Math.round(deviation));

    if (type === 'over-indexed') {
      return `Your ${category.displayName} spend (${Math.round(category.percentage)}%) is ${absDeviation}pp above the ${Math.round(benchmarkPercentage)}% median for similar teams. This suggests heavy investment in ${category.displayName.toLowerCase()}.`;
    } else {
      return `Your ${category.displayName} spend (${Math.round(category.percentage)}%) is ${absDeviation}pp below the ${Math.round(benchmarkPercentage)}% median. You may be under-investing in ${category.displayName.toLowerCase()}.`;
    }
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
}
