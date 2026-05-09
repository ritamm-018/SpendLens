/**
 * Discovery Flow Validation
 * 
 * Screen-by-screen validation logic for the progressive onboarding flow.
 * 
 * Requirements: 2.5, 20.5
 */

import type { UseCase, ToolId } from '@/lib/audit/types';
import type { DiscoveryState, CostInput } from './state-machine';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate use case selection
 */
export function validateUseCase(useCase?: UseCase): ValidationResult {
  const errors: string[] = [];

  if (!useCase) {
    errors.push('Please select a primary use case');
  }

  const validUseCases: UseCase[] = [
    'coding',
    'research',
    'chat',
    'api-integration',
    'design',
    'mixed',
  ];

  if (useCase && !validUseCases.includes(useCase)) {
    errors.push('Invalid use case selected');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate team size input
 */
export function validateTeamSize(teamSize?: number): ValidationResult {
  const errors: string[] = [];

  if (teamSize === undefined || teamSize === null) {
    errors.push('Please enter your team size');
    return { valid: false, errors };
  }

  if (!Number.isInteger(teamSize)) {
    errors.push('Team size must be a whole number');
  }

  if (teamSize < 1) {
    errors.push('Team size must be at least 1');
  }

  if (teamSize > 10000) {
    errors.push('Team size seems unusually large. Please verify.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate tool selection
 */
export function validateTools(tools: { toolId: ToolId }[]): ValidationResult {
  const errors: string[] = [];

  if (!tools || tools.length === 0) {
    errors.push('Please select at least one AI tool');
  }

  // Check for duplicates
  const toolIds = tools.map((t) => t.toolId);
  const uniqueToolIds = new Set(toolIds);
  if (toolIds.length !== uniqueToolIds.size) {
    errors.push('Duplicate tools detected. Each tool should only be added once.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate cost input for a single tool
 */
export function validateCost(
  toolId: ToolId,
  cost?: CostInput,
  teamSize?: number
): ValidationResult {
  const errors: string[] = [];

  if (!cost) {
    errors.push(`Please enter cost information for ${toolId}`);
    return { valid: false, errors };
  }

  // Validate monthly spend
  if (typeof cost.monthlySpend !== 'number') {
    errors.push('Monthly spend must be a number');
  } else if (cost.monthlySpend < 0) {
    errors.push('Monthly spend cannot be negative');
  } else if (cost.monthlySpend > 100000) {
    errors.push('Monthly spend seems unusually high. Please verify.');
  }

  // Validate seats
  if (typeof cost.seats !== 'number') {
    errors.push('Number of seats must be a number');
  } else if (!Number.isInteger(cost.seats)) {
    errors.push('Number of seats must be a whole number');
  } else if (cost.seats < 1) {
    errors.push('Number of seats must be at least 1');
  } else if (cost.seats > 10000) {
    errors.push('Number of seats seems unusually high. Please verify.');
  }

  // Warn if seats exceed team size
  if (teamSize && cost.seats > teamSize * 1.5) {
    errors.push(
      `You have ${cost.seats} seats but only ${teamSize} team members. This may indicate excess seats.`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate all costs for selected tools
 */
export function validateAllCosts(
  tools: { toolId: ToolId }[],
  costs: Record<string, CostInput>,
  teamSize?: number
): ValidationResult {
  const errors: string[] = [];

  for (const tool of tools) {
    const cost = costs[tool.toolId];
    const result = validateCost(tool.toolId, cost, teamSize);
    errors.push(...result.errors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate complete discovery state
 */
export function validateCompleteState(state: DiscoveryState): ValidationResult {
  const errors: string[] = [];

  // Validate use case
  const useCaseResult = validateUseCase(state.data.useCase);
  errors.push(...useCaseResult.errors);

  // Validate team size
  const teamSizeResult = validateTeamSize(state.data.teamSize);
  errors.push(...teamSizeResult.errors);

  // Validate tools
  const toolsResult = validateTools(state.data.tools);
  errors.push(...toolsResult.errors);

  // Validate costs
  const costsResult = validateAllCosts(
    state.data.tools,
    state.data.costs,
    state.data.teamSize
  );
  errors.push(...costsResult.errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get validation warnings (non-blocking issues)
 */
export function getValidationWarnings(state: DiscoveryState): string[] {
  const warnings: string[] = [];

  // Warn about high spend per person
  if (state.data.teamSize) {
    const totalSpend = Object.values(state.data.costs).reduce(
      (sum, cost) => sum + cost.monthlySpend,
      0
    );
    const spendPerPerson = totalSpend / state.data.teamSize;

    if (spendPerPerson > 150) {
      warnings.push(
        `Your AI spend per person ($${Math.round(spendPerPerson)}/month) is significantly above typical startups. We'll identify optimization opportunities.`
      );
    }
  }

  // Warn about potential overlaps
  const toolIds = state.data.tools.map((t) => t.toolId);
  const hasMultipleIDEAssistants =
    toolIds.filter((id) =>
      ['cursor', 'github-copilot', 'windsurf'].includes(id)
    ).length > 1;

  if (hasMultipleIDEAssistants) {
    warnings.push(
      'You have multiple IDE assistants. Most teams find one sufficient — we\'ll analyze if consolidation makes sense.'
    );
  }

  const hasMultipleChatAssistants =
    toolIds.filter((id) => ['chatgpt', 'claude', 'gemini'].includes(id))
      .length > 2;

  if (hasMultipleChatAssistants) {
    warnings.push(
      'You have multiple chat assistants. We\'ll check if there are consolidation opportunities.'
    );
  }

  return warnings;
}
