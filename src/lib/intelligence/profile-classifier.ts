// ─────────────────────────────────────────────
// Operating Profile Classifier
// Classifies organizations into operating profiles
// ─────────────────────────────────────────────

import { AuditResult } from '../audit/types';
import {
  OperatingProfile,
  ProfileClassification,
  ClassificationContext,
} from './types';
import { getToolPricing } from '../audit/pricing';
import profilesData from '@/data/profiles.json';

type ClassificationRule = (context: ClassificationContext) => number;

interface ProfileWithRules extends OperatingProfile {
  rules: ClassificationRule[];
}

export class OperatingProfileClassifier {
  private profiles: ProfileWithRules[];

  constructor() {
    this.profiles = this.initializeProfiles();
  }

  /**
   * Classify an audit into an operating profile
   */
  classify(audit: AuditResult): ProfileClassification {
    const context = this.buildContext(audit);
    const scores: Record<string, number> = {};

    // Calculate confidence score for each profile
    for (const profile of this.profiles) {
      const ruleScores = profile.rules.map((rule) => rule(context));
      // Average of all rule scores
      scores[profile.id] =
        ruleScores.reduce((sum, score) => sum + score, 0) / ruleScores.length;
    }

    // Select profile with highest score
    const sortedProfiles = Object.entries(scores).sort(
      ([, a], [, b]) => b - a
    );

    const [topProfileId, topScore] = sortedProfiles[0];
    const profile = this.profiles.find((p) => p.id === topProfileId)!;

    return {
      profile: this.stripRules(profile),
      confidence: this.mapConfidence(topScore),
      alternativeProfiles: sortedProfiles.slice(1, 3).map(([id, score]) => ({
        profile: this.stripRules(this.profiles.find((p) => p.id === id)!),
        score,
      })),
    };
  }

  /**
   * Initialize profiles with classification rules
   */
  private initializeProfiles(): ProfileWithRules[] {
    const profiles = profilesData.profiles as OperatingProfile[];

    return profiles.map((profile) => ({
      ...profile,
      rules: this.getRulesForProfile(profile.id),
    }));
  }

  /**
   * Get classification rules for a profile
   */
  private getRulesForProfile(profileId: string): ClassificationRule[] {
    const rules: Record<string, ClassificationRule[]> = {
      'lean-builder': [
        // Low spend per developer
        (ctx) => {
          const spendPerDev = ctx.totalSpend / ctx.teamSize;
          return spendPerDev < 50 ? 0.8 : spendPerDev < 70 ? 0.5 : 0.2;
        },
        // High seat utilization
        (ctx) => {
          const utilization = ctx.totalSeats / ctx.teamSize;
          return utilization <= 1.2 ? 0.9 : utilization <= 1.5 ? 0.5 : 0.3;
        },
        // Few tools
        (ctx) => {
          return ctx.tools.length <= 3 ? 0.7 : ctx.tools.length <= 4 ? 0.5 : 0.3;
        },
      ],

      'api-heavy-research': [
        // High API spend ratio
        (ctx) => {
          const apiSpend = ctx.categorySpend['api-provider'] || 0;
          const ratio = apiSpend / ctx.totalSpend;
          return ratio > 0.5 ? 0.9 : ratio > 0.3 ? 0.6 : 0.2;
        },
        // Multiple API providers
        (ctx) => {
          const apiTools = ctx.tools.filter((t) => t.includes('api')).length;
          return apiTools >= 2 ? 0.8 : apiTools >= 1 ? 0.5 : 0.2;
        },
        // High total spend
        (ctx) => {
          const spendPerDev = ctx.totalSpend / ctx.teamSize;
          return spendPerDev > 100 ? 0.7 : spendPerDev > 70 ? 0.5 : 0.3;
        },
      ],

      'premium-workflow-optimizer': [
        // Premium tools
        (ctx) => {
          const premiumTools = ctx.tools.filter(
            (t) => t.includes('pro') || t.includes('plus') || t.includes('ultra')
          ).length;
          return premiumTools >= 2 ? 0.9 : premiumTools >= 1 ? 0.6 : 0.2;
        },
        // High spend per developer
        (ctx) => {
          const spendPerDev = ctx.totalSpend / ctx.teamSize;
          return spendPerDev > 80 ? 0.8 : spendPerDev > 60 ? 0.5 : 0.3;
        },
        // Multiple tools
        (ctx) => {
          return ctx.tools.length >= 4 ? 0.7 : ctx.tools.length >= 3 ? 0.5 : 0.3;
        },
      ],

      'collaboration-overpayer': [
        // Excess seats
        (ctx) => {
          const utilization = ctx.totalSeats / ctx.teamSize;
          return utilization > 1.5 ? 0.9 : utilization > 1.2 ? 0.6 : 0.2;
        },
        // Team/Business plans
        (ctx) => {
          const hasTeamPlan = ctx.tools.some(
            (t) => t.includes('team') || t.includes('business')
          );
          return hasTeamPlan ? 0.7 : 0.3;
        },
        // Moderate spend
        (ctx) => {
          const spendPerDev = ctx.totalSpend / ctx.teamSize;
          return spendPerDev > 50 && spendPerDev < 150 ? 0.6 : 0.3;
        },
      ],

      'enterprise-overprovisioned': [
        // Enterprise plans
        (ctx) => {
          const hasEnterprise = ctx.tools.some((t) => t.includes('enterprise'));
          return hasEnterprise ? 0.9 : 0.1;
        },
        // Small team size
        (ctx) => {
          return ctx.teamSize < 50 ? 0.8 : ctx.teamSize < 100 ? 0.5 : 0.2;
        },
        // High spend
        (ctx) => {
          const spendPerDev = ctx.totalSpend / ctx.teamSize;
          return spendPerDev > 100 ? 0.7 : spendPerDev > 70 ? 0.5 : 0.3;
        },
      ],

      'experimental-ai-native': [
        // Many tools
        (ctx) => {
          return ctx.tools.length >= 5
            ? 0.8
            : ctx.tools.length >= 4
              ? 0.5
              : 0.2;
        },
        // Diverse categories
        (ctx) => {
          const categories = Object.keys(ctx.categorySpend).length;
          return categories >= 3 ? 0.7 : categories >= 2 ? 0.5 : 0.3;
        },
        // Moderate to high spend
        (ctx) => {
          const spendPerDev = ctx.totalSpend / ctx.teamSize;
          return spendPerDev > 60 && spendPerDev < 180 ? 0.6 : 0.3;
        },
      ],
    };

    return rules[profileId] || [];
  }

  /**
   * Build classification context from audit
   */
  private buildContext(audit: AuditResult): ClassificationContext {
    const categorySpend: Record<string, number> = {};

    for (const tool of audit.toolResults) {
      const pricing = getToolPricing(tool.toolId);
      if (pricing) {
        categorySpend[pricing.category] =
          (categorySpend[pricing.category] || 0) + tool.currentMonthlyCost;
      }
    }

    return {
      totalSpend: audit.totalCurrentSpend,
      teamSize: audit.input.teamSize,
      tools: audit.input.tools.map((t) => t.toolId),
      totalSeats: audit.input.tools.reduce((sum, t) => sum + t.seats, 0),
      categorySpend,
    };
  }

  /**
   * Map confidence score to level
   */
  private mapConfidence(score: number): 'high' | 'medium' | 'low' {
    if (score >= 0.7) return 'high';
    if (score >= 0.5) return 'medium';
    return 'low';
  }

  /**
   * Strip rules from profile for output
   */
  private stripRules(profile: ProfileWithRules): OperatingProfile {
    const { rules, ...profileWithoutRules } = profile;
    return profileWithoutRules;
  }
}
