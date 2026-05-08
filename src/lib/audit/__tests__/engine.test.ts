import { describe, it, expect } from 'vitest';
import { runAudit } from '../engine';
import { AuditInput } from '../types';

describe('Audit Engine', () => {
  it('should identify excess seats', () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: 'cursor',
          planId: 'cursor-teams',
          monthlySpend: 480, // 12 seats * $40
          seats: 12,
        },
      ],
      teamSize: 8, // Only 8 team members
      primaryUseCase: 'coding',
    };

    const result = runAudit(input);

    expect(result.toolResults).toHaveLength(1);
    expect(result.toolResults[0].recommendations).toContainEqual(
      expect.objectContaining({
        type: 'optimize-seats',
        monthlySavings: 160, // 4 excess seats * $40
      })
    );
  });

  it('should identify solo user on team plan', () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: 'chatgpt',
          planId: 'chatgpt-business',
          monthlySpend: 25,
          seats: 1,
        },
      ],
      teamSize: 1,
      primaryUseCase: 'chat',
    };

    const result = runAudit(input);

    expect(result.toolResults[0].recommendations).toContainEqual(
      expect.objectContaining({
        type: 'downgrade',
      })
    );
    expect(result.totalMonthlySavings).toBeGreaterThan(0);
  });

  it('should identify enterprise overkill for small teams', () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: 'github-copilot',
          planId: 'copilot-enterprise',
          monthlySpend: 390, // 10 seats * $39
          seats: 10,
        },
      ],
      teamSize: 10,
      primaryUseCase: 'coding',
    };

    const result = runAudit(input);

    // Enterprise plan should trigger downgrade recommendation for small teams
    const hasDowngrade = result.toolResults[0].recommendations.some(
      r => r.type === 'downgrade' && r.confidence === 'high'
    );
    expect(hasDowngrade).toBe(true);
  });

  it('should handle well-optimized stacks appropriately', () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: 'github-copilot',
          planId: 'copilot-pro',
          monthlySpend: 10,
          seats: 1,
        },
      ],
      teamSize: 5,
      primaryUseCase: 'coding',
    };

    const result = runAudit(input);

    // Copilot Pro for a solo user in a 5-person team is reasonable
    // Should not have significant savings
    expect(result.overallSeverity).not.toBe('significant');
  });

  it('should calculate correct annual savings', () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: 'cursor',
          planId: 'cursor-teams',
          monthlySpend: 480,
          seats: 12,
        },
      ],
      teamSize: 8,
      primaryUseCase: 'coding',
    };

    const result = runAudit(input);

    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });
});
