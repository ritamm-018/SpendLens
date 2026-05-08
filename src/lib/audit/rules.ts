// ─────────────────────────────────────────────
// SpendLens Audit Rules Engine
// Deterministic, defensible optimization rules
// ─────────────────────────────────────────────

import { ToolInput, AuditContext, Recommendation, ToolPricing, PlanTier } from './types';
import { getToolPricing, findPlan } from './pricing';

// A rule is a pure function: (toolInput, context, toolPricing) → Recommendation | null
type AuditRule = (
  input: ToolInput,
  context: AuditContext,
  pricing: ToolPricing,
  currentPlan: PlanTier | undefined
) => Recommendation | null;

// ─── Rule: Solo User on Team/Enterprise Plan ───
const soloOnTeamPlan: AuditRule = (input, context, pricing, currentPlan) => {
  if (!currentPlan) return null;
  if (input.seats > 1) return null;
  if (currentPlan.type !== 'team' && currentPlan.type !== 'enterprise') return null;

  // Find best individual plan
  const individualPlans = pricing.plans
    .filter(p => p.type === 'individual' || p.type === 'free')
    .sort((a, b) => b.monthlyPricePerSeat - a.monthlyPricePerSeat);

  // Recommend the most feature-rich individual plan
  const recommended = individualPlans.find(p => p.monthlyPricePerSeat > 0) || individualPlans[0];
  if (!recommended) return null;

  const currentCost = input.monthlySpend;
  const suggestedCost = recommended.monthlyPricePerSeat;
  const savings = currentCost - suggestedCost;

  if (savings <= 0) return null;

  return {
    type: 'downgrade',
    title: `Switch from ${currentPlan.name} to ${recommended.name}`,
    reasoning: `You're the only user on a ${currentPlan.name} plan designed for teams. The ${recommended.name} plan ($${suggestedCost}/mo) gives you the same core AI features without team management overhead.`,
    suggestedPlan: recommended.id,
    currentCost,
    suggestedCost,
    monthlySavings: savings,
    confidence: 'high',
    priority: 1,
  };
};

// ─── Rule: Team Plan with More Seats Than Team Members ───
const excessSeats: AuditRule = (input, context, pricing, currentPlan) => {
  if (!currentPlan) return null;
  if (!currentPlan.isPerSeat) return null;
  if (input.seats <= context.teamSize) return null;

  const excessCount = input.seats - context.teamSize;
  const costPerSeat = currentPlan.monthlyPricePerSeat;
  const savings = excessCount * costPerSeat;

  if (savings <= 0) return null;

  return {
    type: 'optimize-seats',
    title: `Remove ${excessCount} unused ${pricing.name} seat${excessCount > 1 ? 's' : ''}`,
    reasoning: `You have ${input.seats} seats but only ${context.teamSize} team members. Removing ${excessCount} excess seat${excessCount > 1 ? 's' : ''} saves $${savings}/mo immediately with zero workflow impact.`,
    suggestedPlan: currentPlan.id,
    currentCost: input.monthlySpend,
    suggestedCost: input.monthlySpend - savings,
    monthlySavings: savings,
    confidence: 'high',
    priority: 1,
  };
};

// ─── Rule: Enterprise Plan for Small Teams ───
const enterpriseOverkill: AuditRule = (input, context, pricing, currentPlan) => {
  if (!currentPlan) return null;
  if (currentPlan.type !== 'enterprise') return null;
  if (context.teamSize >= 50) return null; // Enterprise might be justified

  // Find team-tier plan
  const teamPlan = pricing.plans.find(p => p.type === 'team');
  if (!teamPlan) return null;

  const currentCost = input.monthlySpend;
  const suggestedCost = teamPlan.monthlyPricePerSeat * input.seats;
  const savings = currentCost - suggestedCost;

  if (savings <= 0) return null;

  return {
    type: 'downgrade',
    title: `Downgrade ${pricing.name} from Enterprise to ${teamPlan.name}`,
    reasoning: `Enterprise plans are designed for organizations with 50+ employees needing compliance features (SCIM, audit logs, dedicated support). At ${context.teamSize} team members, the ${teamPlan.name} plan provides the collaboration features you need at a lower cost.`,
    suggestedPlan: teamPlan.id,
    currentCost,
    suggestedCost,
    monthlySavings: savings,
    confidence: context.teamSize < 20 ? 'high' : 'medium',
    priority: 2,
  };
};

// ─── Rule: Individual Seats Cheaper as Team Plan ───
const individualToTeam: AuditRule = (input, context, pricing, currentPlan) => {
  if (!currentPlan) return null;
  if (currentPlan.type !== 'individual') return null;
  if (input.seats < 3) return null; // Below 3 seats, team plans rarely save money

  // Find team plan
  const teamPlan = pricing.plans.find(p => p.type === 'team');
  if (!teamPlan) return null;

  const currentCost = input.monthlySpend;
  const teamCost = teamPlan.monthlyPricePerSeat * input.seats;

  // Team plan might actually be more expensive per seat but include admin features
  // Only recommend if it's actually cheaper
  if (teamCost >= currentCost) return null;

  const savings = currentCost - teamCost;

  return {
    type: 'upgrade',
    title: `Consolidate ${input.seats} individual ${pricing.name} seats into ${teamPlan.name}`,
    reasoning: `You're paying for ${input.seats} separate individual subscriptions at $${currentPlan.monthlyPricePerSeat}/each. The ${teamPlan.name} plan at $${teamPlan.monthlyPricePerSeat}/seat gives you team management features and could reduce your total cost.`,
    suggestedPlan: teamPlan.id,
    currentCost,
    suggestedCost: teamCost,
    monthlySavings: savings,
    confidence: 'medium',
    priority: 3,
  };
};

// ─── Rule: Premium Plan When Pro Suffices ───
const premiumOverkill: AuditRule = (input, context, pricing, currentPlan) => {
  if (!currentPlan) return null;

  // Check if user is on an expensive individual plan
  const isExpensivePlan = currentPlan.monthlyPricePerSeat >= 100 && currentPlan.type === 'individual';
  if (!isExpensivePlan) return null;

  // Find the standard pro-tier plan
  const proPlan = pricing.plans.find(
    p => p.type === 'individual' && p.monthlyPricePerSeat >= 15 && p.monthlyPricePerSeat <= 25
  );
  if (!proPlan) return null;

  const currentCost = input.monthlySpend;
  const suggestedCost = proPlan.monthlyPricePerSeat * input.seats;
  const savings = currentCost - suggestedCost;

  if (savings <= 0) return null;

  // Be conservative: only suggest if the use case doesn't scream power-user
  const isPowerUseCase = context.primaryUseCase === 'research' || context.primaryUseCase === 'api-integration';
  
  return {
    type: 'downgrade',
    title: `Consider ${proPlan.name} instead of ${currentPlan.name}`,
    reasoning: isPowerUseCase
      ? `You're on ${currentPlan.name} ($${currentPlan.monthlyPricePerSeat}/mo) which offers maximum usage limits. If you're not consistently hitting ${proPlan.name}-tier limits, the standard plan at $${proPlan.monthlyPricePerSeat}/mo covers most workflows. Monitor your usage for a billing cycle before switching.`
      : `Most ${context.primaryUseCase} workflows don't require the extended limits of ${currentPlan.name}. The ${proPlan.name} plan at $${proPlan.monthlyPricePerSeat}/mo handles the vast majority of use cases. The ${currentPlan.name} tier is designed for users who consistently exhaust Pro-level quotas.`,
    suggestedPlan: proPlan.id,
    currentCost,
    suggestedCost,
    monthlySavings: savings,
    confidence: isPowerUseCase ? 'low' : 'medium',
    priority: isPowerUseCase ? 4 : 2,
  };
};

// ─── Rule: Overlapping IDE Assistants ───
const overlappingIdeTools: AuditRule = (input, context, pricing) => {
  if (pricing.category !== 'ide-assistant') return null;

  // Check if user has multiple IDE assistants
  const ideTools = context.allToolIds.filter(id => {
    const p = getToolPricing(id);
    return p?.category === 'ide-assistant';
  });

  if (ideTools.length < 2) return null;

  // Only flag on the more expensive one
  const otherIdeTools = ideTools.filter(id => id !== input.toolId);
  const otherCosts = otherIdeTools.map(id => {
    // We don't have the spend for other tools here, so we flag the overlap
    return id;
  });

  // Don't double-count: only recommend on this tool if it's in the overlaps list
  const hasOverlap = pricing.overlaps.some(o => context.allToolIds.includes(o));
  if (!hasOverlap) return null;

  const overlappingNames = pricing.overlaps
    .filter(o => context.allToolIds.includes(o))
    .map(o => getToolPricing(o)?.name || o)
    .join(', ');

  return {
    type: 'consolidate',
    title: `Evaluate overlap between ${pricing.name} and ${overlappingNames}`,
    reasoning: `You're paying for both ${pricing.name} and ${overlappingNames}, which serve similar functions (AI-powered code completion and generation). Most teams find one IDE assistant sufficient. Consider standardizing on the one your team prefers and dropping the other.`,
    currentCost: input.monthlySpend,
    suggestedCost: 0, // Full elimination would save everything
    monthlySavings: input.monthlySpend,
    confidence: 'medium',
    priority: 3,
  };
};

// ─── Rule: Overlapping Chat Assistants ───
const overlappingChatTools: AuditRule = (input, context, pricing) => {
  if (pricing.category !== 'chat-assistant') return null;

  const chatTools = context.allToolIds.filter(id => {
    const p = getToolPricing(id);
    return p?.category === 'chat-assistant';
  });

  if (chatTools.length < 2) return null;

  const hasOverlap = pricing.overlaps.some(o => context.allToolIds.includes(o));
  if (!hasOverlap) return null;

  const overlappingNames = pricing.overlaps
    .filter(o => context.allToolIds.includes(o))
    .map(o => getToolPricing(o)?.name || o)
    .join(', ');

  // Chat tools overlap is less severe than IDE tools — many teams use both Claude and ChatGPT
  return {
    type: 'consolidate',
    title: `Review overlap between ${pricing.name} and ${overlappingNames}`,
    reasoning: `Your team uses both ${pricing.name} and ${overlappingNames} for chat/research. While each has unique strengths, if most team members default to one, you could reduce seats on the other. Consider auditing which tool gets actual daily usage.`,
    currentCost: input.monthlySpend,
    suggestedCost: input.monthlySpend, // Don't assume full elimination
    monthlySavings: 0, // Conservative: don't claim savings for consolidation advice
    confidence: 'low',
    priority: 5,
  };
};

// ─── Rule: Startup Credits Available ───
const startupCreditsRule: AuditRule = (input, context, pricing) => {
  if (!pricing.startupCredits?.available) return null;
  if (input.monthlySpend === 0) return null;

  return {
    type: 'credits-program',
    title: `Apply for ${pricing.name} startup credits`,
    reasoning: pricing.startupCredits.description + (
      pricing.startupCredits.estimatedValue
        ? ` (estimated value: ${pricing.startupCredits.estimatedValue}). These programs typically require being an early-stage startup with under $10M in funding. Application is free and takes 5-10 minutes.`
        : `. Application is free and takes 5-10 minutes.`
    ),
    currentCost: input.monthlySpend,
    suggestedCost: input.monthlySpend, // Credits are a bonus, not a guaranteed saving
    monthlySavings: 0, // Don't count credits as monthly savings — they're one-time
    confidence: 'medium',
    priority: 4,
  };
};

// ─── Rule: API Spend Optimization ───
const apiSpendOptimization: AuditRule = (input, context, pricing) => {
  if (pricing.category !== 'api-provider') return null;
  if (input.monthlySpend < 100) return null;

  const suggestions: string[] = [];
  
  if (input.monthlySpend > 500) {
    suggestions.push('Use batch API processing for non-real-time workloads (50% cost reduction on batch requests)');
  }
  if (input.monthlySpend > 200) {
    suggestions.push('Implement prompt caching for repeated queries (up to 90% savings on cached input tokens)');
  }
  if (input.monthlySpend > 1000) {
    suggestions.push('Consider fine-tuning a smaller model for your specific use case — can reduce per-query costs by 5-10x');
  }
  suggestions.push('Audit model selection: use cheaper models (GPT-4o-mini, Haiku) for simple tasks and reserve expensive models for complex reasoning');

  const estimatedSavings = Math.round(input.monthlySpend * 0.15); // Conservative 15% estimate

  return {
    type: 'switch-plan',
    title: `Optimize ${pricing.name} usage patterns`,
    reasoning: `At $${input.monthlySpend}/mo in API spend, there are likely optimization opportunities:\n\n${suggestions.map(s => `• ${s}`).join('\n')}\n\nConservative estimate: 15-30% reduction through these optimizations.`,
    currentCost: input.monthlySpend,
    suggestedCost: input.monthlySpend - estimatedSavings,
    monthlySavings: estimatedSavings,
    confidence: 'medium',
    priority: 2,
  };
};

// ─── Rule: Paying for Free Tier Features ───
const freeAlternativeAvailable: AuditRule = (input, context, pricing, currentPlan) => {
  if (!currentPlan) return null;
  if (currentPlan.type === 'free') return null;
  if (input.seats > 1) return null; // Free tiers are usually single-user
  if (input.monthlySpend > 25) return null; // Skip if already on a cheap plan — there's value

  // Only suggest free if team is very small and use is occasional
  if (context.teamSize > 3) return null;

  const freePlan = pricing.plans.find(p => p.type === 'free');
  if (!freePlan) return null;

  // Very conservative: only suggest for clear cases
  return {
    type: 'downgrade',
    title: `Evaluate if ${pricing.name} Free tier suffices`,
    reasoning: `With a team of ${context.teamSize} and a single seat, the free tier may cover your current usage. Free tiers have rate limits, but if your usage is light or exploratory, you could save $${input.monthlySpend}/mo. Test the free tier for a week before committing.`,
    suggestedPlan: freePlan.id,
    currentCost: input.monthlySpend,
    suggestedCost: 0,
    monthlySavings: input.monthlySpend,
    confidence: 'low',
    priority: 5,
  };
};

// ─── Rule: ChatGPT Business but Small Active Users ───
const teamPlanLowUtilization: AuditRule = (input, context, pricing, currentPlan) => {
  if (!currentPlan) return null;
  if (currentPlan.type !== 'team') return null;
  if (!currentPlan.isPerSeat) return null;

  // If seats are less than 60% of team size, some members aren't using it
  // But if seats are MORE than team size, that's handled by excessSeats rule
  // This rule: if team plan seats < team members, consider mixed approach
  
  // Heuristic: if only a fraction of team uses it, mixed individual + free might work
  const utilizationRatio = input.seats / context.teamSize;
  if (utilizationRatio >= 0.5) return null; // Most of team uses it — team plan is fine

  const individualPlan = pricing.plans.find(
    p => p.type === 'individual' && p.monthlyPricePerSeat >= 15 && p.monthlyPricePerSeat <= 25
  );
  if (!individualPlan) return null;

  const currentCost = input.monthlySpend;
  const mixedCost = individualPlan.monthlyPricePerSeat * input.seats;
  const savings = currentCost - mixedCost;

  if (savings <= 0) return null;

  return {
    type: 'switch-plan',
    title: `Switch ${pricing.name} to individual plans for active users`,
    reasoning: `Only ${input.seats} of ${context.teamSize} team members use ${pricing.name}. Instead of a team plan at $${currentPlan.monthlyPricePerSeat}/seat, individual ${individualPlan.name} subscriptions at $${individualPlan.monthlyPricePerSeat}/user for just the active users could save $${savings}/mo. You lose team admin features but gain per-user flexibility.`,
    suggestedPlan: individualPlan.id,
    currentCost,
    suggestedCost: mixedCost,
    monthlySavings: savings,
    confidence: 'medium',
    priority: 3,
  };
};

// ─── All Rules (execution order matters) ───

export const AUDIT_RULES: AuditRule[] = [
  excessSeats,               // Highest confidence, easiest win
  soloOnTeamPlan,            // Clear misallocation
  enterpriseOverkill,        // Common startup mistake
  premiumOverkill,           // Max/Ultra when Pro suffices
  individualToTeam,          // Counterintuitive upgrade savings
  teamPlanLowUtilization,    // Mixed plan opportunity
  overlappingIdeTools,       // Tool consolidation
  overlappingChatTools,      // Tool consolidation (softer)
  apiSpendOptimization,      // Usage optimization
  startupCreditsRule,        // Free money
  freeAlternativeAvailable,  // Last resort suggestion
];

// Execute all rules against a tool input
export function evaluateRules(
  input: ToolInput,
  context: AuditContext,
): Recommendation[] {
  const pricing = getToolPricing(input.toolId);
  if (!pricing) return [];

  const currentPlan = pricing.plans.find(p => p.id === input.planId);
  const recommendations: Recommendation[] = [];

  for (const rule of AUDIT_RULES) {
    const result = rule(input, context, pricing, currentPlan);
    if (result) {
      recommendations.push(result);
    }
  }

  // Sort by priority (lower = higher priority)
  return recommendations.sort((a, b) => a.priority - b.priority);
}
