// ─────────────────────────────────────────────
// Intelligence Engine Types
// Type definitions for intelligence platform
// ─────────────────────────────────────────────

import { AuditResult } from '../audit/types';

/**
 * Efficiency Score Components
 */
export interface EfficiencyScoreComponents {
  costEfficiency: number; // 0-100, weight: 40%
  toolOptimization: number; // 0-100, weight: 30%
  benchmarkPerformance: number; // 0-100, weight: 20%
  riskFactors: number; // 0-100, weight: 10%
}

/**
 * Efficiency Score with breakdown
 */
export interface EfficiencyScore {
  overall: number; // 0-100
  components: EfficiencyScoreComponents;
  breakdown: {
    component: keyof EfficiencyScoreComponents;
    score: number;
    weight: number;
    contribution: number;
    description: string;
  }[];
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Benchmark Comparison
 */
export interface BenchmarkComparison {
  type: string;
  userValue: number;
  benchmarkValue: number;
  percentile: number;
  statement: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

/**
 * Benchmark Segment
 */
export interface BenchmarkSegment {
  id: string;
  name: string;
  criteria: {
    teamSizeMin: number;
    teamSizeMax: number;
    useCase?: string | null;
  };
  sampleSize: number;
  metrics: {
    medianSpendPerDev: number;
    p25SpendPerDev: number;
    p75SpendPerDev: number;
    p90SpendPerDev: number;
    medianToolCount: number;
    categoryAllocation: Record<string, number>;
    commonTools: { toolId: string; percentage: number }[];
  };
}

/**
 * Benchmark Data
 */
export interface BenchmarkData {
  version: string;
  lastUpdated: string;
  metadata: {
    totalSamples: number;
    dataSource: string;
    methodology: string;
  };
  segments: Record<string, BenchmarkSegment>;
}

/**
 * Operating Profile
 */
export interface OperatingProfile {
  id: string;
  name: string;
  description: string;
  badge: {
    icon: string;
    color: string;
    gradient: string;
  };
  characteristics: string[];
  typicalSpendRange: { min: number; max: number };
}

/**
 * Profile Classification
 */
export interface ProfileClassification {
  profile: OperatingProfile;
  confidence: 'high' | 'medium' | 'low';
  alternativeProfiles: { profile: OperatingProfile; score: number }[];
}

/**
 * Category Analysis
 */
export interface CategoryAnalysis {
  category: string;
  displayName: string;
  totalSpend: number;
  percentage: number;
  spendPerTeamMember: number;
  tools: {
    toolId: string;
    toolName: string;
    spend: number;
  }[];
  benchmarkComparison?: {
    userPercentage: number;
    benchmarkPercentage: number;
    deviation: number;
  };
}

/**
 * Category Breakdown
 */
export interface CategoryBreakdown {
  categories: CategoryAnalysis[];
  totalSpend: number;
  insights: CategoryInsight[];
}

/**
 * Category Insight
 */
export interface CategoryInsight {
  category: string;
  type: 'over-indexed' | 'under-indexed' | 'balanced';
  message: string;
  severity: 'info' | 'warning';
}

/**
 * Strategic Insight
 */
export interface StrategicInsight {
  id: string;
  category: 'operational' | 'workflow' | 'risk' | 'strategic';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  relatedTools?: string[];
}

/**
 * Enhanced Audit Result with Intelligence
 */
export interface EnhancedAuditResult extends AuditResult {
  efficiencyScore: EfficiencyScore;
  benchmarkComparisons: BenchmarkComparison[];
  operatingProfile: ProfileClassification;
  categoryBreakdown: CategoryBreakdown;
  strategicInsights: StrategicInsight[];
  intelligenceVersion: string;
  processingTime: number;
  teamSize: number; // From input, needed for UI components
  aiSummary?: string; // AI-generated summary (optional)
}

/**
 * Classification Context
 */
export interface ClassificationContext {
  totalSpend: number;
  teamSize: number;
  tools: string[];
  totalSeats: number;
  categorySpend: Record<string, number>;
}
