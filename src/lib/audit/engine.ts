// ─────────────────────────────────────────────
// SpendLens Audit Engine
// Orchestrates the full audit process
// ─────────────────────────────────────────────

import {
  AuditInput,
  AuditResult,
  AuditContext,
  ToolAuditResult,
  Severity,
  ToolId,
} from './types';
import { getToolPricing } from './pricing';
import { evaluateRules } from './rules';
import { generateId } from '../utils';

/**
 * Build audit context from user input
 */
function buildContext(input: AuditInput): AuditContext {
  const allToolIds = input.tools.map(t => t.toolId);
  const totalMonthlySpend = input.tools.reduce((sum, t) => sum + t.monthlySpend, 0);

  const hasIdeAssistant = input.tools.some(t => {
    const pricing = getToolPricing(t.toolId);
    return pricing?.category === 'ide-assistant';
  });

  const hasChatAssistant = input.tools.some(t => {
    const pricing = getToolPricing(t.toolId);
    return pricing?.category === 'chat-assistant';
  });

  const hasApiProvider = input.tools.some(t => {
    const pricing = getToolPricing(t.toolId);
    return pricing?.category === 'api-provider';
  });

  return {
    teamSize: input.teamSize,
    primaryUseCase: input.primaryUseCase,
    totalMonthlySpend,
    toolCount: input.tools.length,
    allToolIds,
    hasIdeAssistant,
    hasChatAssistant,
    hasApiProvider,
  };
}

/**
 * Determine severity based on savings percentage
 */
function calculateSeverity(savingsPercentage: number): Severity {
  if (savingsPercentage === 0) return 'optimized';
  if (savingsPercentage < 15) return 'minor';
  if (savingsPercentage < 30) return 'moderate';
  return 'significant';
}

/**
 * Run audit for a single tool
 */
function auditTool(
  toolInput: AuditInput['tools'][0],
  context: AuditContext
): ToolAuditResult {
  const pricing = getToolPricing(toolInput.toolId);
  
  if (!pricing) {
    throw new Error(`Unknown tool: ${toolInput.toolId}`);
  }

  const recommendations = evaluateRules(toolInput, context);
  const potentialMonthlySavings = recommendations.reduce(
    (sum, rec) => sum + rec.monthlySavings,
    0
  );

  const savingsPercentage = toolInput.monthlySpend > 0
    ? (potentialMonthlySavings / toolInput.monthlySpend) * 100
    : 0;

  const severity = calculateSeverity(savingsPercentage);

  const currentPlan = pricing.plans.find(p => p.id === toolInput.planId);

  return {
    toolId: toolInput.toolId,
    toolName: pricing.name,
    currentPlan: currentPlan?.name || 'Unknown',
    currentMonthlyCost: toolInput.monthlySpend,
    currentSeats: toolInput.seats,
    recommendations,
    potentialMonthlySavings,
    severity,
  };
}

/**
 * Main audit function
 */
export function runAudit(input: AuditInput): AuditResult {
  const context = buildContext(input);
  const toolResults: ToolAuditResult[] = [];

  // Audit each tool
  for (const toolInput of input.tools) {
    const result = auditTool(toolInput, context);
    toolResults.push(result);
  }

  // Calculate totals
  const totalMonthlySavings = toolResults.reduce(
    (sum, r) => sum + r.potentialMonthlySavings,
    0
  );
  const totalAnnualSavings = totalMonthlySavings * 12;
  const totalCurrentSpend = context.totalMonthlySpend;
  const savingsPercentage = totalCurrentSpend > 0
    ? (totalMonthlySavings / totalCurrentSpend) * 100
    : 0;

  const overallSeverity = calculateSeverity(savingsPercentage);

  return {
    id: generateId(12),
    input,
    toolResults,
    totalMonthlySavings,
    totalAnnualSavings,
    totalCurrentSpend,
    savingsPercentage,
    overallSeverity,
    generatedAt: new Date().toISOString(),
  };
}
