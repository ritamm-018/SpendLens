// ─────────────────────────────────────────────
// SpendLens Audit Types
// ─────────────────────────────────────────────

export type ToolId =
  | 'cursor'
  | 'github-copilot'
  | 'chatgpt'
  | 'claude'
  | 'openai-api'
  | 'anthropic-api'
  | 'gemini'
  | 'windsurf'
  | 'v0';

export type UseCase = 'coding' | 'research' | 'chat' | 'api-integration' | 'design' | 'mixed';

export type PlanType = 'free' | 'individual' | 'team' | 'enterprise' | 'usage-based';

export type RecommendationType =
  | 'downgrade'
  | 'upgrade'
  | 'consolidate'
  | 'eliminate'
  | 'switch-plan'
  | 'optimize-seats'
  | 'credits-program'
  | 'keep';

export type Severity = 'optimized' | 'minor' | 'moderate' | 'significant';

export type Confidence = 'high' | 'medium' | 'low';

// ─── Pricing Data Structures ────────────────

export interface PlanTier {
  id: string;
  name: string;
  type: PlanType;
  monthlyPricePerSeat: number;
  isPerSeat: boolean;
  minSeats?: number;
  maxSeats?: number;
  features: string[];
  bestFor: string;
}

export interface ToolPricing {
  id: ToolId;
  name: string;
  category: 'ide-assistant' | 'chat-assistant' | 'api-provider' | 'design-tool';
  website: string;
  plans: PlanTier[];
  overlaps: ToolId[];  // tools with overlapping functionality
  startupCredits?: {
    available: boolean;
    description: string;
    estimatedValue?: string;
  };
}

// ─── User Input ─────────────────────────────

export interface ToolInput {
  toolId: ToolId;
  planId: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolInput[];
  teamSize: number;
  primaryUseCase: UseCase;
  currency?: string; // ISO 4217 currency code (e.g., 'USD', 'EUR', 'INR')
}

// ─── Audit Context (derived from input) ─────

export interface AuditContext {
  teamSize: number;
  primaryUseCase: UseCase;
  totalMonthlySpend: number;
  toolCount: number;
  allToolIds: ToolId[];
  hasIdeAssistant: boolean;
  hasChatAssistant: boolean;
  hasApiProvider: boolean;
}

// ─── Audit Output ───────────────────────────

export interface Recommendation {
  type: RecommendationType;
  title: string;
  reasoning: string;
  suggestedPlan?: string;
  currentCost: number;
  suggestedCost: number;
  monthlySavings: number;
  confidence: Confidence;
  priority: number; // 1 = highest
}

export interface ToolAuditResult {
  toolId: ToolId;
  toolName: string;
  currentPlan: string;
  currentMonthlyCost: number;
  currentSeats: number;
  recommendations: Recommendation[];
  potentialMonthlySavings: number;
  severity: Severity;
}

export interface AuditResult {
  id: string;
  input: AuditInput;
  toolResults: ToolAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  totalCurrentSpend: number;
  savingsPercentage: number;
  overallSeverity: Severity;
  generatedAt: string;
  aiSummary?: string;
  currency?: string; // Currency used for all monetary values
}

// ─── Database / Share ───────────────────────

export interface PublicReportData {
  id: string;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  totalCurrentSpend: number;
  savingsPercentage: number;
  toolCount: number;
  teamSize: number;
  toolSummaries: {
    toolName: string;
    severity: Severity;
    monthlySavings: number;
    topRecommendation: string;
  }[];
  generatedAt: string;
}

export interface LeadData {
  email: string;
  company?: string;
  role?: string;
  reportId: string;
  totalSavings: number;
}
