// Benchmark Results Generator

import type { BenchmarkInput, BenchmarkResults } from './types';

export function generateBenchmarkResults(input: BenchmarkInput): BenchmarkResults {
  const { teamSize, useCase, monthlySpend } = input;

  // Parse inputs
  const spendMid = getSpendMidpoint(monthlySpend);
  const teamMid = getTeamMidpoint(teamSize);

  // Calculate efficiency score (0-100)
  const efficiencyScore = calculateEfficiencyScore(spendMid, teamMid, useCase);

  // Generate percentile
  const percentile = Math.min(95, Math.max(5, efficiencyScore + Math.floor(Math.random() * 10 - 5)));

  // Generate statement
  const statement = generateStatement(efficiencyScore, spendMid, teamMid);

  // Generate segment description
  const segment = generateSegment(useCase, teamSize);

  // Generate distribution (bell curve)
  const distribution = generateDistribution(percentile);

  // Spend comparison
  const spendComparison = generateSpendComparison(spendMid, teamMid, efficiencyScore);

  // Spend breakdown
  const spendBreakdown = generateSpendBreakdown(useCase, spendMid);

  // Strategic insights
  const strategicInsights = generateStrategicInsights(useCase, teamSize, efficiencyScore);

  // Optimization opportunity
  const optimizationOpportunity = generateOptimizationOpportunity(spendMid, efficiencyScore);

  // Company archetype
  const archetype = generateArchetype(useCase, efficiencyScore, spendMid, teamMid);

  return {
    efficiencyScore,
    statement,
    percentile,
    segment,
    distribution,
    spendComparison,
    spendBreakdown,
    strategicInsights,
    optimizationOpportunity,
    archetype,
  };
}

function getSpendMidpoint(range: string): number {
  const map: Record<string, number> = {
    '0-100': 50,
    '100-500': 300,
    '500-1000': 750,
    '1000-2500': 1750,
    '2500+': 3500,
  };
  return map[range] || 750;
}

function getTeamMidpoint(range: string): number {
  const map: Record<string, number> = {
    '1-5': 3,
    '6-10': 8,
    '11-20': 15,
    '21-50': 35,
    '51+': 75,
  };
  return map[range] || 8;
}

function calculateEfficiencyScore(spend: number, team: number, useCase: string): number {
  const spendPerPerson = spend / team;
  
  // Ideal spend per person: $50-100/month
  let score = 100;
  
  if (spendPerPerson < 50) {
    score = 60 + (spendPerPerson / 50) * 20; // 60-80 for under-spending
  } else if (spendPerPerson <= 100) {
    score = 80 + ((spendPerPerson - 50) / 50) * 20; // 80-100 for optimal
  } else if (spendPerPerson <= 200) {
    score = 100 - ((spendPerPerson - 100) / 100) * 30; // 100-70 for moderate overspend
  } else {
    score = 70 - Math.min(40, (spendPerPerson - 200) / 50 * 10); // 70-30 for high overspend
  }

  // Adjust for use case
  if (useCase === 'api-integration') {
    score += 5; // API-heavy is expected to spend more
  } else if (useCase === 'code-completion') {
    score -= 5; // Code completion should be cheaper
  }

  return Math.round(Math.max(30, Math.min(95, score)));
}

function generateStatement(score: number, spend: number, team: number): string {
  const spendPerPerson = spend / team;
  
  if (score >= 85) {
    return `You spend ${Math.round((1 - spendPerPerson / 100) * 100)}% less than similar teams.`;
  } else if (score >= 70) {
    return 'Your organization appears moderately optimized.';
  } else if (score >= 55) {
    return `Your AI spend is ${Math.round((spendPerPerson / 100 - 1) * 100)}% above comparable startups.`;
  } else {
    return 'Significant optimization opportunities detected.';
  }
}

function generateSegment(useCase: string, teamSize: string): string {
  const useCaseMap: Record<string, string> = {
    'code-completion': 'code-completion focused',
    'api-integration': 'API-heavy',
    'content-generation': 'content-generation',
    'research': 'research-oriented',
    'mixed': 'mixed-usage',
  };

  return `${useCaseMap[useCase] || 'AI-native'} startups with ${teamSize} employees`;
}

function generateDistribution(percentile: number): number[] {
  // Generate bell curve with user's position
  const distribution: number[] = [];
  for (let i = 0; i <= 100; i += 5) {
    const distance = Math.abs(i - 50);
    const height = Math.exp(-(distance * distance) / 500);
    distribution.push(height * 100);
  }
  return distribution;
}

function generateSpendComparison(spend: number, team: number, score: number) {
  const spendPerPerson = spend / team;
  const industryAverage = 75 * team;
  const mostEfficient = 50 * team;

  return {
    yourTeam: spend,
    industryAverage,
    mostEfficient,
    trend: spend > industryAverage * 1.2 ? 'above' as const : 
           spend < industryAverage * 0.8 ? 'below' as const : 
           'aligned' as const,
  };
}

function generateSpendBreakdown(useCase: string, spend: number) {
  const breakdowns: Record<string, { category: string; percentage: number; color: string }[]> = {
    'code-completion': [
      { category: 'Coding Assistants', percentage: 52, color: '#10b981' },
      { category: 'API Infrastructure', percentage: 18, color: '#3b82f6' },
      { category: 'Research Tools', percentage: 12, color: '#8b5cf6' },
      { category: 'Unused Premium Spend', percentage: 18, color: '#ef4444' },
    ],
    'api-integration': [
      { category: 'API Infrastructure', percentage: 58, color: '#3b82f6' },
      { category: 'Coding Assistants', percentage: 22, color: '#10b981' },
      { category: 'Research Tools', percentage: 10, color: '#8b5cf6' },
      { category: 'Unused Premium Spend', percentage: 10, color: '#ef4444' },
    ],
    'content-generation': [
      { category: 'Content Tools', percentage: 48, color: '#f59e0b' },
      { category: 'API Infrastructure', percentage: 28, color: '#3b82f6' },
      { category: 'Coding Assistants', percentage: 14, color: '#10b981' },
      { category: 'Unused Premium Spend', percentage: 10, color: '#ef4444' },
    ],
    'research': [
      { category: 'Research Tools', percentage: 45, color: '#8b5cf6' },
      { category: 'API Infrastructure', percentage: 30, color: '#3b82f6' },
      { category: 'Coding Assistants', percentage: 15, color: '#10b981' },
      { category: 'Unused Premium Spend', percentage: 10, color: '#ef4444' },
    ],
    'mixed': [
      { category: 'Coding Assistants', percentage: 35, color: '#10b981' },
      { category: 'API Infrastructure', percentage: 30, color: '#3b82f6' },
      { category: 'Research Tools', percentage: 20, color: '#8b5cf6' },
      { category: 'Unused Premium Spend', percentage: 15, color: '#ef4444' },
    ],
  };

  return breakdowns[useCase] || breakdowns['mixed'];
}

function generateStrategicInsights(useCase: string, teamSize: string, score: number) {
  const insights = [];

  // Insight 1: Based on use case
  const useCaseInsights: Record<string, string> = {
    'code-completion': 'Teams with similar code-completion workflows often consolidate to a single vendor earlier to reduce overlapping subscriptions and improve developer experience consistency.',
    'api-integration': 'Your spend profile resembles fast-scaling engineering startups that prioritize API experimentation over cost efficiency. Consider implementing usage monitoring to identify optimization opportunities.',
    'content-generation': 'Content-focused teams in your segment typically achieve better ROI by standardizing on fewer, more powerful models rather than maintaining multiple subscriptions.',
    'research': 'Research-heavy organizations often benefit from enterprise API contracts with volume discounts rather than per-seat subscriptions.',
    'mixed': 'Mixed-usage patterns suggest potential for consolidation. Most efficient teams in your category standardize on 2-3 core platforms rather than 5+.',
  };

  insights.push({
    title: 'Workflow Optimization',
    description: useCaseInsights[useCase] || useCaseInsights['mixed'],
    impact: 'high' as const,
  });

  // Insight 2: Based on efficiency score
  if (score < 70) {
    insights.push({
      title: 'Premium Plan Analysis',
      description: 'Most efficient teams in your category allocate a smaller percentage of spend toward premium collaboration plans, focusing budget on API infrastructure instead.',
      impact: 'high' as const,
    });
  } else {
    insights.push({
      title: 'Efficiency Recognition',
      description: 'Your spend allocation aligns with top-performing teams. Consider maintaining this discipline as you scale to preserve efficiency gains.',
      impact: 'medium' as const,
    });
  }

  // Insight 3: Based on team size
  const teamNum = getTeamMidpoint(teamSize);
  if (teamNum >= 20) {
    insights.push({
      title: 'Enterprise Opportunity',
      description: 'At your team size, enterprise contracts with volume discounts typically offer 20-30% savings compared to per-seat pricing. Consider consolidating vendors for negotiation leverage.',
      impact: 'high' as const,
    });
  } else {
    insights.push({
      title: 'Startup Credit Programs',
      description: 'Teams at your stage often overlook $10K-$50K in available startup credits from major AI vendors. These programs can offset 6-12 months of infrastructure costs.',
      impact: 'medium' as const,
    });
  }

  return insights;
}

function generateOptimizationOpportunity(spend: number, score: number) {
  let level: 'high' | 'medium' | 'low';
  let savingsPercentage: number;

  if (score < 60) {
    level = 'high';
    savingsPercentage = 0.35;
  } else if (score < 75) {
    level = 'medium';
    savingsPercentage = 0.25;
  } else {
    level = 'low';
    savingsPercentage = 0.15;
  }

  const savingsMid = spend * savingsPercentage;
  const savingsMin = Math.round(savingsMid * 0.7);
  const savingsMax = Math.round(savingsMid * 1.3);

  const confidence = score < 60 ? 85 : score < 75 ? 75 : 65;

  return {
    level,
    savingsMin,
    savingsMax,
    confidence,
  };
}

function generateArchetype(useCase: string, score: number, spend: number, team: number) {
  const spendPerPerson = spend / team;

  // Determine archetype based on patterns
  if (score >= 80 && spendPerPerson < 70) {
    return {
      name: 'Lean AI Builder',
      description: 'Your organization resembles startups that prioritize cost efficiency while maintaining high AI productivity. You carefully evaluate each tool and avoid premium bloat.',
      icon: 'Zap',
      color: 'emerald',
    };
  } else if (useCase === 'api-integration' && spendPerPerson > 100) {
    return {
      name: 'Experimental API Team',
      description: 'Your organization resembles startups prioritizing rapid AI experimentation while accumulating overlapping tooling costs. High innovation velocity with optimization opportunities.',
      icon: 'Rocket',
      color: 'blue',
    };
  } else if (spendPerPerson > 120) {
    return {
      name: 'Premium Workflow Optimizer',
      description: 'Your team invests heavily in premium AI tooling to maximize developer experience. While spend is elevated, you prioritize velocity over cost optimization.',
      icon: 'Crown',
      color: 'violet',
    };
  } else if (team >= 20) {
    return {
      name: 'Rapid Scaling AI Org',
      description: 'Your organization is in growth mode, adding AI capabilities quickly. Typical pattern: fast expansion followed by consolidation phase for efficiency gains.',
      icon: 'TrendingUp',
      color: 'amber',
    };
  } else {
    return {
      name: 'Collaboration-Heavy Startup',
      description: 'Your spend profile suggests significant investment in team collaboration and shared AI tools. Common in product-focused startups with cross-functional AI usage.',
      icon: 'Users',
      color: 'cyan',
    };
  }
}
