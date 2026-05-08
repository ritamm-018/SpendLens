// ─────────────────────────────────────────────
// Form Validation Schemas
// ─────────────────────────────────────────────

import { z } from 'zod';

export const toolInputSchema = z.object({
  toolId: z.enum([
    'cursor',
    'github-copilot',
    'chatgpt',
    'claude',
    'openai-api',
    'anthropic-api',
    'gemini',
    'windsurf',
    'v0',
  ]),
  planId: z.string().min(1, 'Plan is required'),
  monthlySpend: z.number().min(0, 'Monthly spend must be positive').max(100000, 'Monthly spend seems unrealistic'),
  seats: z.number().int().min(1, 'At least 1 seat required').max(10000, 'Seat count seems unrealistic'),
});

export const auditInputSchema = z.object({
  tools: z.array(toolInputSchema).min(1, 'Add at least one tool').max(20, 'Maximum 20 tools allowed'),
  teamSize: z.number().int().min(1, 'Team size must be at least 1').max(10000, 'Team size seems unrealistic'),
  primaryUseCase: z.enum(['coding', 'research', 'chat', 'api-integration', 'design', 'mixed']),
});

export const leadCaptureSchema = z.object({
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  role: z.string().optional(),
  reportId: z.string().min(1),
});

export type ToolInputFormData = z.infer<typeof toolInputSchema>;
export type AuditInputFormData = z.infer<typeof auditInputSchema>;
export type LeadCaptureFormData = z.infer<typeof leadCaptureSchema>;
