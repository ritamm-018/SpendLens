// ─────────────────────────────────────────────
// SpendLens Pricing Database
// All prices verified against official sources as of May 2026
// See docs/PRICING_DATA.md for sources and methodology
// ─────────────────────────────────────────────

import { ToolPricing } from './types';

export const PRICING_DATA: Record<string, ToolPricing> = {
  // ─── IDE Assistants ───────────────────────

  'cursor': {
    id: 'cursor',
    name: 'Cursor',
    category: 'ide-assistant',
    website: 'https://cursor.com',
    overlaps: ['github-copilot', 'windsurf'],
    startupCredits: {
      available: false,
      description: 'No known startup program',
    },
    plans: [
      {
        id: 'cursor-hobby',
        name: 'Hobby',
        type: 'free',
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        features: ['Limited completions', 'Limited agent requests'],
        bestFor: 'Trying it out',
      },
      {
        id: 'cursor-pro',
        name: 'Pro',
        type: 'individual',
        monthlyPricePerSeat: 20,
        isPerSeat: false,
        features: ['Unlimited completions', 'Extended agent limits', 'Frontier models', '$20 credit pool'],
        bestFor: 'Individual developers',
      },
      {
        id: 'cursor-pro-plus',
        name: 'Pro+',
        type: 'individual',
        monthlyPricePerSeat: 60,
        isPerSeat: false,
        features: ['Everything in Pro', '3x usage credits', 'Priority support'],
        bestFor: 'Power users who hit Pro limits frequently',
      },
      {
        id: 'cursor-ultra',
        name: 'Ultra',
        type: 'individual',
        monthlyPricePerSeat: 200,
        isPerSeat: false,
        features: ['Everything in Pro', '20x usage credits', 'Priority features'],
        bestFor: 'Heavy daily users processing large codebases',
      },
      {
        id: 'cursor-teams',
        name: 'Teams',
        type: 'team',
        monthlyPricePerSeat: 40,
        isPerSeat: true,
        minSeats: 2,
        features: ['Everything in Pro', 'Shared chats', 'Usage analytics', 'SSO', 'Admin controls'],
        bestFor: 'Teams needing collaboration + admin features',
      },
      {
        id: 'cursor-enterprise',
        name: 'Enterprise',
        type: 'enterprise',
        monthlyPricePerSeat: 40,
        isPerSeat: true,
        minSeats: 10,
        features: ['Everything in Teams', 'Pooled usage', 'SCIM', 'Audit logs', 'Priority support'],
        bestFor: 'Large organizations with compliance needs',
      },
    ],
  },

  'github-copilot': {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    category: 'ide-assistant',
    website: 'https://github.com/features/copilot',
    overlaps: ['cursor', 'windsurf'],
    startupCredits: {
      available: true,
      description: 'GitHub for Startups program offers free Copilot Enterprise for up to 20 seats for 1 year',
      estimatedValue: '$9,360/year',
    },
    plans: [
      {
        id: 'copilot-free',
        name: 'Free',
        type: 'free',
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        features: ['Limited completions', 'Limited chat'],
        bestFor: 'Trying it out',
      },
      {
        id: 'copilot-pro',
        name: 'Pro',
        type: 'individual',
        monthlyPricePerSeat: 10,
        isPerSeat: false,
        features: ['Unlimited completions', 'Chat', 'Multi-model support'],
        bestFor: 'Individual developers wanting affordable AI assist',
      },
      {
        id: 'copilot-pro-plus',
        name: 'Pro+',
        type: 'individual',
        monthlyPricePerSeat: 39,
        isPerSeat: false,
        features: ['Everything in Pro', 'Agent mode', 'Premium models'],
        bestFor: 'Power users who want agentic coding',
      },
      {
        id: 'copilot-business',
        name: 'Business',
        type: 'team',
        monthlyPricePerSeat: 19,
        isPerSeat: true,
        minSeats: 1,
        features: ['Organization management', 'Policy controls', 'Audit logs'],
        bestFor: 'Teams needing org-level controls',
      },
      {
        id: 'copilot-enterprise',
        name: 'Enterprise',
        type: 'enterprise',
        monthlyPricePerSeat: 39,
        isPerSeat: true,
        minSeats: 1,
        features: ['Everything in Business', 'Knowledge bases', 'Fine-tuning', 'IP indemnity'],
        bestFor: 'Large orgs with custom knowledge needs',
      },
    ],
  },

  'windsurf': {
    id: 'windsurf',
    name: 'Windsurf',
    category: 'ide-assistant',
    website: 'https://windsurf.com',
    overlaps: ['cursor', 'github-copilot'],
    startupCredits: {
      available: false,
      description: 'No known startup program',
    },
    plans: [
      {
        id: 'windsurf-free',
        name: 'Free',
        type: 'free',
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        features: ['Limited completions', 'Basic Cascade agent'],
        bestFor: 'Trying the editor',
      },
      {
        id: 'windsurf-pro',
        name: 'Pro',
        type: 'individual',
        monthlyPricePerSeat: 20,
        isPerSeat: false,
        features: ['Unlimited completions', 'Full Cascade', 'Frontier models'],
        bestFor: 'Individual developers',
      },
      {
        id: 'windsurf-max',
        name: 'Max',
        type: 'individual',
        monthlyPricePerSeat: 200,
        isPerSeat: false,
        features: ['Everything in Pro', 'Maximum usage limits'],
        bestFor: 'Heavy daily users',
      },
      {
        id: 'windsurf-teams',
        name: 'Teams',
        type: 'team',
        monthlyPricePerSeat: 40,
        isPerSeat: true,
        minSeats: 2,
        features: ['Everything in Pro', 'Team management', 'Shared context'],
        bestFor: 'Development teams',
      },
      {
        id: 'windsurf-enterprise',
        name: 'Enterprise',
        type: 'enterprise',
        monthlyPricePerSeat: 60,
        isPerSeat: true,
        minSeats: 10,
        features: ['Everything in Teams', 'SSO', 'Compliance', 'Dedicated support'],
        bestFor: 'Large organizations',
      },
    ],
  },

  // ─── Chat Assistants ──────────────────────

  'chatgpt': {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'chat-assistant',
    website: 'https://chat.openai.com',
    overlaps: ['claude', 'gemini'],
    startupCredits: {
      available: true,
      description: 'OpenAI Startup Program: API credits up to $25k for qualifying startups',
      estimatedValue: '$1,000–$25,000',
    },
    plans: [
      {
        id: 'chatgpt-free',
        name: 'Free',
        type: 'free',
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        features: ['Limited model access', 'Ads', 'Rate-limited'],
        bestFor: 'Occasional personal use',
      },
      {
        id: 'chatgpt-plus',
        name: 'Plus',
        type: 'individual',
        monthlyPricePerSeat: 20,
        isPerSeat: false,
        features: ['GPT-4o access', 'DALL-E', 'Advanced tools', 'Ad-free'],
        bestFor: 'Individual power users',
      },
      {
        id: 'chatgpt-pro',
        name: 'Pro',
        type: 'individual',
        monthlyPricePerSeat: 200,
        isPerSeat: false,
        features: ['20x Plus limits', 'Pro model variants', 'Priority'],
        bestFor: 'Researchers and heavy daily users',
      },
      {
        id: 'chatgpt-business',
        name: 'Business',
        type: 'team',
        monthlyPricePerSeat: 25,
        isPerSeat: true,
        minSeats: 2,
        features: ['Admin console', 'Data privacy', 'Higher limits', 'SSO'],
        bestFor: 'Teams needing shared workspace + privacy',
      },
      {
        id: 'chatgpt-enterprise',
        name: 'Enterprise',
        type: 'enterprise',
        monthlyPricePerSeat: 60,
        isPerSeat: true,
        minSeats: 50,
        features: ['Unlimited usage', 'Advanced security', 'Custom models', 'Dedicated CSM'],
        bestFor: 'Large organizations (50+ seats)',
      },
    ],
  },

  'claude': {
    id: 'claude',
    name: 'Claude',
    category: 'chat-assistant',
    website: 'https://claude.ai',
    overlaps: ['chatgpt', 'gemini'],
    startupCredits: {
      available: true,
      description: 'Anthropic Startup Program: API credits for qualifying startups',
      estimatedValue: '$1,000–$25,000',
    },
    plans: [
      {
        id: 'claude-free',
        name: 'Free',
        type: 'free',
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        features: ['Limited access', 'Rate-limited'],
        bestFor: 'Occasional personal use',
      },
      {
        id: 'claude-pro',
        name: 'Pro',
        type: 'individual',
        monthlyPricePerSeat: 20,
        isPerSeat: false,
        features: ['5x Free limits', 'Priority access', 'Projects', 'Claude Code'],
        bestFor: 'Individual power users',
      },
      {
        id: 'claude-max-5x',
        name: 'Max (5x)',
        type: 'individual',
        monthlyPricePerSeat: 100,
        isPerSeat: false,
        features: ['5x Pro limits', 'Extended context', 'Priority'],
        bestFor: 'Heavy research and coding users',
      },
      {
        id: 'claude-max-20x',
        name: 'Max (20x)',
        type: 'individual',
        monthlyPricePerSeat: 200,
        isPerSeat: false,
        features: ['20x Pro limits', 'Maximum capacity'],
        bestFor: 'Power users with extreme usage needs',
      },
      {
        id: 'claude-team',
        name: 'Team',
        type: 'team',
        monthlyPricePerSeat: 25,
        isPerSeat: true,
        minSeats: 5,
        features: ['Higher limits', 'Team management', 'Shared projects', 'Admin'],
        bestFor: 'Small to medium teams (5+ members)',
      },
    ],
  },

  'gemini': {
    id: 'gemini',
    name: 'Gemini',
    category: 'chat-assistant',
    website: 'https://gemini.google.com',
    overlaps: ['chatgpt', 'claude'],
    startupCredits: {
      available: true,
      description: 'Google for Startups Cloud Program: up to $350k in Google Cloud + AI credits',
      estimatedValue: '$2,000–$350,000',
    },
    plans: [
      {
        id: 'gemini-free',
        name: 'Free',
        type: 'free',
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        features: ['Basic access', 'Rate-limited'],
        bestFor: 'Occasional personal use',
      },
      {
        id: 'gemini-pro',
        name: 'AI Pro',
        type: 'individual',
        monthlyPricePerSeat: 20,
        isPerSeat: false,
        features: ['Gemini Pro models', 'Deep Research', 'Workspace integration'],
        bestFor: 'Individual power users in Google ecosystem',
      },
      {
        id: 'gemini-ultra',
        name: 'AI Ultra',
        type: 'individual',
        monthlyPricePerSeat: 250,
        isPerSeat: false,
        features: ['Flagship models', 'Maximum limits', '30TB storage', 'Agentic features'],
        bestFor: 'Power users needing maximum capability',
      },
    ],
  },

  // ─── API Providers ────────────────────────

  'openai-api': {
    id: 'openai-api',
    name: 'OpenAI API',
    category: 'api-provider',
    website: 'https://platform.openai.com',
    overlaps: ['anthropic-api'],
    startupCredits: {
      available: true,
      description: 'OpenAI Startup Program: API credits up to $25k',
      estimatedValue: '$1,000–$25,000',
    },
    plans: [
      {
        id: 'openai-api-payg',
        name: 'Pay-as-you-go',
        type: 'usage-based',
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        features: ['All models', 'Per-token billing', 'Batch API (50% off)', 'Fine-tuning'],
        bestFor: 'Any team building with OpenAI models',
      },
    ],
  },

  'anthropic-api': {
    id: 'anthropic-api',
    name: 'Anthropic API',
    category: 'api-provider',
    website: 'https://console.anthropic.com',
    overlaps: ['openai-api'],
    startupCredits: {
      available: true,
      description: 'Anthropic Startup Program: API credits for qualifying startups',
      estimatedValue: '$1,000–$25,000',
    },
    plans: [
      {
        id: 'anthropic-api-payg',
        name: 'Pay-as-you-go',
        type: 'usage-based',
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        features: ['All Claude models', 'Per-token billing', 'Batch API (50% off)', 'Prompt caching'],
        bestFor: 'Any team building with Claude models',
      },
    ],
  },

  // ─── Design Tools ─────────────────────────

  'v0': {
    id: 'v0',
    name: 'v0',
    category: 'design-tool',
    website: 'https://v0.dev',
    overlaps: [],
    startupCredits: {
      available: false,
      description: 'No known startup program',
    },
    plans: [
      {
        id: 'v0-free',
        name: 'Free',
        type: 'free',
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        features: ['$5 credits/month', '200 project limit'],
        bestFor: 'Occasional prototyping',
      },
      {
        id: 'v0-premium',
        name: 'Premium',
        type: 'individual',
        monthlyPricePerSeat: 20,
        isPerSeat: false,
        features: ['$20 credits/month', 'Unlimited projects', 'Buy extra credits'],
        bestFor: 'Solo builders and power users',
      },
      {
        id: 'v0-team',
        name: 'Team',
        type: 'team',
        monthlyPricePerSeat: 30,
        isPerSeat: true,
        minSeats: 2,
        features: ['$30 credits/user/month', 'Collaboration', 'Shared projects', 'Pooled credits'],
        bestFor: 'Design/dev teams building UI together',
      },
      {
        id: 'v0-business',
        name: 'Business',
        type: 'team',
        monthlyPricePerSeat: 100,
        isPerSeat: true,
        minSeats: 2,
        features: ['$30 credits/user', 'Data opt-out', 'Everything in Team'],
        bestFor: 'Teams needing data privacy guarantees',
      },
    ],
  },
};

// Helper to look up tool pricing
export function getToolPricing(toolId: string): ToolPricing | undefined {
  return PRICING_DATA[toolId];
}

// Helper to find a plan within a tool
export function findPlan(toolId: string, planId: string) {
  const tool = PRICING_DATA[toolId];
  if (!tool) return undefined;
  return tool.plans.find(p => p.id === planId);
}

// Get all tool IDs
export function getAllToolIds(): string[] {
  return Object.keys(PRICING_DATA);
}

// Get tools by category
export function getToolsByCategory(category: ToolPricing['category']): ToolPricing[] {
  return Object.values(PRICING_DATA).filter(t => t.category === category);
}
