// ─────────────────────────────────────────────
// Strategic Insights Generator
// Generates executive-level strategic insights
// ─────────────────────────────────────────────

import { AuditResult } from '../audit/types';
import { StrategicInsight } from './types';
import { getToolPricing } from '../audit/pricing';

export class InsightsGenerator {
  /**
   * Generate strategic insights for an audit
   */
  generate(audit: AuditResult): StrategicInsight[] {
    const insights: StrategicInsight[] = [];

    // Operational efficiency insights
    insights.push(...this.generateOperationalInsights(audit));

    // Workflow analysis insights
    insights.push(...this.generateWorkflowInsights(audit));

    // Risk management insights
    insights.push(...this.generateRiskInsights(audit));

    // Strategic positioning insights
    insights.push(...this.generateStrategicInsights(audit));

    // Sort by impact (high first)
    insights.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      return impactOrder[b.impact] - impactOrder[a.impact];
    });

    return insights;
  }

  /**
   * Generate operational efficiency insights
   */
  private generateOperationalInsights(
    audit: AuditResult
  ): StrategicInsight[] {
    const insights: StrategicInsight[] = [];

    // Excess seats insight
    const excessSeatsTools = audit.toolResults.filter((t) =>
      t.recommendations.some((r) => r.type === 'optimize-seats')
    );

    if (excessSeatsTools.length > 0) {
      const totalExcessSeats = excessSeatsTools.reduce((sum, t) => {
        const rec = t.recommendations.find((r) => r.type === 'optimize-seats');
        return sum + (rec?.monthlySavings || 0);
      }, 0);

      insights.push({
        id: 'operational-excess-seats',
        category: 'operational',
        title: 'Seat Utilization Optimization',
        description: `Your organization has ${excessSeatsTools.length} tool${excessSeatsTools.length > 1 ? 's' : ''} with excess seat allocation. Right-sizing seat counts could save $${Math.round(totalExcessSeats)}/month while maintaining full team coverage.`,
        impact: totalExcessSeats > 200 ? 'high' : 'medium',
        actionable: true,
        relatedTools: excessSeatsTools.map((t) => t.toolId),
      });
    }

    // Tool overlap insight
    const overlapTools = audit.toolResults.filter((t) =>
      t.recommendations.some((r) => r.type === 'consolidate')
    );

    if (overlapTools.length > 0) {
      insights.push({
        id: 'operational-tool-overlap',
        category: 'operational',
        title: 'Tool Consolidation Opportunity',
        description: `Multiple tools with overlapping functionality detected. Standardizing on fewer tools could reduce complexity, improve team alignment, and lower costs.`,
        impact: 'medium',
        actionable: true,
        relatedTools: overlapTools.map((t) => t.toolId),
      });
    }

    return insights;
  }

  /**
   * Generate workflow analysis insights
   */
  private generateWorkflowInsights(audit: AuditResult): StrategicInsight[] {
    const insights: StrategicInsight[] = [];

    // Calculate category distribution
    const categorySpend: Record<string, number> = {};
    for (const tool of audit.toolResults) {
      const pricing = getToolPricing(tool.toolId);
      if (pricing) {
        categorySpend[pricing.category] =
          (categorySpend[pricing.category] || 0) + tool.currentMonthlyCost;
      }
    }

    const total = audit.totalCurrentSpend;
    const apiRatio = (categorySpend['api-provider'] || 0) / total;
    const ideRatio = (categorySpend['ide-assistant'] || 0) / total;
    const chatRatio = (categorySpend['chat-assistant'] || 0) / total;

    // API-heavy workflow
    if (apiRatio > 0.4) {
      insights.push({
        id: 'workflow-api-heavy',
        category: 'workflow',
        title: 'API-Heavy Infrastructure Pattern',
        description: `Your spend distribution suggests heavy API utilization (${Math.round(apiRatio * 100)}% of budget). This indicates custom integration work and programmatic AI access, typical of research or production-scale deployments.`,
        impact: 'medium',
        actionable: false,
      });
    }

    // Coding-focused workflow
    if (ideRatio > 0.4 && audit.input.primaryUseCase === 'coding') {
      insights.push({
        id: 'workflow-coding-focused',
        category: 'workflow',
        title: 'Engineering Velocity Investment',
        description: `Your organization allocates ${Math.round(ideRatio * 100)}% of AI spend to IDE assistants, demonstrating strong commitment to developer productivity and code generation workflows.`,
        impact: 'low',
        actionable: false,
      });
    }

    // Research-focused workflow
    if (chatRatio > 0.4) {
      insights.push({
        id: 'workflow-research-focused',
        category: 'workflow',
        title: 'Research and Analysis Focus',
        description: `Chat-based AI assistants represent ${Math.round(chatRatio * 100)}% of your spend, suggesting workflows centered on research, analysis, and knowledge work rather than code generation.`,
        impact: 'low',
        actionable: false,
      });
    }

    return insights;
  }

  /**
   * Generate risk management insights
   */
  private generateRiskInsights(audit: AuditResult): StrategicInsight[] {
    const insights: StrategicInsight[] = [];

    // Vendor concentration risk
    const vendorCounts: Record<string, number> = {};
    for (const tool of audit.input.tools) {
      const vendor = tool.toolId.split('-')[0];
      vendorCounts[vendor] = (vendorCounts[vendor] || 0) + 1;
    }

    const maxVendor = Object.entries(vendorCounts).sort(
      ([, a], [, b]) => b - a
    )[0];
    const concentration = (maxVendor[1] / audit.input.tools.length) * 100;

    if (concentration > 60) {
      insights.push({
        id: 'risk-vendor-concentration',
        category: 'risk',
        title: 'Vendor Concentration Risk',
        description: `${Math.round(concentration)}% of your AI tools come from a single vendor. Consider diversifying to reduce dependency risk and maintain negotiating leverage.`,
        impact: concentration > 75 ? 'high' : 'medium',
        actionable: true,
      });
    }

    // Enterprise plan on small team
    const enterpriseTools = audit.toolResults.filter(
      (t) =>
        t.currentPlan.toLowerCase().includes('enterprise') &&
        audit.input.teamSize < 20
    );

    if (enterpriseTools.length > 0) {
      insights.push({
        id: 'risk-enterprise-overprovisioning',
        category: 'risk',
        title: 'Enterprise Tier Overprovisioning',
        description: `Your team size (${audit.input.teamSize}) may not justify enterprise-tier plans. Team or Business tiers typically provide sufficient features at lower cost for organizations under 50 people.`,
        impact: 'medium',
        actionable: true,
        relatedTools: enterpriseTools.map((t) => t.toolId),
      });
    }

    return insights;
  }

  /**
   * Generate strategic positioning insights
   */
  private generateStrategicInsights(audit: AuditResult): StrategicInsight[] {
    const insights: StrategicInsight[] = [];

    // High spend per developer
    const spendPerDev = audit.totalCurrentSpend / audit.input.teamSize;

    if (spendPerDev > 100) {
      insights.push({
        id: 'strategic-premium-positioning',
        category: 'strategic',
        title: 'Premium Tooling Investment',
        description: `At $${Math.round(spendPerDev)}/developer/month, your AI infrastructure spend is in the top quartile. This positions your team for maximum velocity but warrants periodic ROI assessment.`,
        impact: 'medium',
        actionable: false,
      });
    }

    // Startup credits opportunity
    const creditsRecs = audit.toolResults.filter((t) =>
      t.recommendations.some((r) => r.type === 'credits-program')
    );

    if (creditsRecs.length > 0) {
      const totalCredits = creditsRecs.reduce((sum, t) => {
        const rec = t.recommendations.find((r) => r.type === 'credits-program');
        return sum + (rec?.monthlySavings || 0);
      }, 0);

      insights.push({
        id: 'strategic-startup-credits',
        category: 'strategic',
        title: 'Startup Credit Programs Available',
        description: `Your organization may qualify for $${Math.round(totalCredits * 12)}/year in startup credits across ${creditsRecs.length} provider${creditsRecs.length > 1 ? 's' : ''}. These programs typically require minimal effort to access.`,
        impact: 'high',
        actionable: true,
        relatedTools: creditsRecs.map((t) => t.toolId),
      });
    }

    return insights;
  }
}
