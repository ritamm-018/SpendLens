// AI Summary Generator using Anthropic API

import Anthropic from '@anthropic-ai/sdk';
import { AuditResult } from '../audit/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function generateAuditSummary(audit: AuditResult): Promise<string> {
  // Fallback if no API key
  if (!process.env.ANTHROPIC_API_KEY) {
    return generateFallbackSummary(audit);
  }

  try {
    const prompt = buildPrompt(audit);
    
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const summary = message.content[0].type === 'text' 
      ? message.content[0].text 
      : generateFallbackSummary(audit);

    return summary;
  } catch (error) {
    console.error('AI summary generation failed:', error);
    return generateFallbackSummary(audit);
  }
}

function buildPrompt(audit: AuditResult): string {
  const { input, totalMonthlySavings, totalAnnualSavings, toolResults } = audit;
  
  const toolsList = toolResults.map(t => `${t.toolName} (${t.currentPlan})`).join(', ');
  const hasRecommendations = toolResults.some(t => t.recommendations.length > 0);
  
  return `You are a financial analyst reviewing an AI tool spend audit for a ${input.teamSize}-person team focused on ${input.primaryUseCase}.

Current stack: ${toolsList}
Total monthly spend: $${input.tools.reduce((sum, t) => sum + t.monthlySpend, 0)}
Potential monthly savings: $${totalMonthlySavings}
Potential annual savings: $${totalAnnualSavings}

${hasRecommendations ? `Key recommendations:
${toolResults.flatMap(t => t.recommendations).slice(0, 3).map(r => `- ${r.title}`).join('\n')}` : 'No major optimization opportunities found.'}

Write a personalized 100-word summary for this team that:
1. Acknowledges their current setup
2. ${hasRecommendations ? 'Highlights the biggest savings opportunity' : 'Congratulates them on efficient spending'}
3. Provides one actionable next step
4. Uses a professional, finance-literate tone

Do not use bullet points. Write in paragraph form.`;
}

function generateFallbackSummary(audit: AuditResult): string {
  const { input, totalMonthlySavings, totalAnnualSavings, toolResults } = audit;
  
  if (totalMonthlySavings === 0) {
    return `Your ${input.teamSize}-person team is operating efficiently with your current AI tool stack. We analyzed ${toolResults.length} tools and found your plan selections align well with your team size and ${input.primaryUseCase} use case. Consider checking back quarterly as pricing and features evolve, or explore startup credit programs to reduce costs further without changing your setup.`;
  }
  
  const biggestSaving = toolResults
    .filter(t => t.potentialMonthlySavings > 0)
    .sort((a, b) => b.potentialMonthlySavings - a.potentialMonthlySavings)[0];
  
  return `Your ${input.teamSize}-person team could save $${totalMonthlySavings}/month ($${totalAnnualSavings}/year) by optimizing your AI tool stack. The biggest opportunity is with ${biggestSaving?.toolName || 'your current setup'}, where ${biggestSaving?.recommendations[0]?.title.toLowerCase() || 'right-sizing your plan'} could reduce costs significantly. These recommendations are based on your ${input.primaryUseCase} use case and current team size. Consider implementing the highest-confidence suggestions first for immediate impact.`;
}
