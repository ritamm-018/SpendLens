// Benchmark Types

export interface BenchmarkInput {
  teamSize: string;
  useCase: string;
  monthlySpend: string;
}

export interface BenchmarkResults {
  efficiencyScore: number;
  statement: string;
  percentile: number;
  segment: string;
  distribution: number[];
  spendComparison: {
    yourTeam: number;
    industryAverage: number;
    mostEfficient: number;
    trend: 'above' | 'below' | 'aligned';
  };
  spendBreakdown: {
    category: string;
    percentage: number;
    color: string;
  }[];
  strategicInsights: {
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }[];
  optimizationOpportunity: {
    level: 'high' | 'medium' | 'low';
    savingsMin: number;
    savingsMax: number;
    confidence: number;
  };
  archetype: {
    name: string;
    description: string;
    icon: string;
    color: string;
  };
}
