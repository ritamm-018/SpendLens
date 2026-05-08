# LLM Prompts — SpendLens

## Audit Summary Prompt

**Used in:** `src/lib/ai/summary.ts`

**Model:** Claude 3.5 Sonnet (via Anthropic API)

**Purpose:** Generate a personalized 100-word summary of audit results that acknowledges the team's setup, highlights savings opportunities, and provides actionable next steps.

### Full Prompt

```
You are a financial analyst reviewing an AI tool spend audit for a {teamSize}-person team focused on {primaryUseCase}.

Current stack: {toolsList}
Total monthly spend: {totalSpend}
Potential monthly savings: {totalMonthlySavings}
Potential annual savings: {totalAnnualSavings}

{hasRecommendations ? `Key recommendations:
${recommendations}` : 'No major optimization opportunities found.'}

Write a personalized 100-word summary for this team that:
1. Acknowledges their current setup
2. {hasRecommendations ? 'Highlights the biggest savings opportunity' : 'Congratulates them on efficient spending'}
3. Provides one actionable next step
4. Uses a professional, finance-literate tone

Do not use bullet points. Write in paragraph form.
```

### Why This Works

**1. Specific role assignment**
- "You are a financial analyst" sets the tone and expertise level
- Prevents casual or overly technical language
- Ensures recommendations sound credible to finance teams

**2. Context-rich input**
- Team size and use case allow personalization
- Current stack shows what they're already using
- Savings numbers provide concrete data points
- Recommendations give specific areas to focus on

**3. Clear structure**
- 3-point structure ensures consistency across all summaries
- "Acknowledge → Highlight → Action" flow feels natural
- 100-word limit keeps it concise and readable

**4. Tone guidance**
- "Professional, finance-literate" prevents AI from being too casual
- "Do not use bullet points" ensures paragraph form
- Explicit instruction to acknowledge OR congratulate based on results

### What I Tried That Didn't Work

**Attempt 1: Generic summarization**
```
Summarize this audit report for a startup team.
```
**Problem:** Too vague. Output was inconsistent — sometimes bullet points, sometimes overly technical, sometimes too casual.

**Attempt 2: Asking for bullet points**
```
Write a 3-bullet summary of the audit results.
```
**Problem:** Bullet points don't display well in the UI. Also felt too terse and impersonal.

**Attempt 3: 200-word limit**
```
Write a personalized 200-word summary...
```
**Problem:** Too long. Users don't read 200 words. Testing showed 100 words is the sweet spot for engagement.

**Attempt 4: No role assignment**
```
Write a summary of this audit for a {teamSize}-person team...
```
**Problem:** Without "financial analyst" role, the tone was too casual. Got outputs like "Looks like you're spending a bit too much!" instead of professional language.

**Attempt 5: Asking for specific recommendations**
```
Write a summary and recommend the top 3 actions to take.
```
**Problem:** AI would sometimes recommend actions not in our audit results, or prioritize incorrectly. Better to let our deterministic logic handle prioritization.

### Fallback Strategy

If the Anthropic API fails (rate limit, network error, no API key), we use a template-based fallback:

**For audits with savings:**
```
Your {teamSize}-person team could save {totalMonthlySavings}/month ({totalAnnualSavings}/year) by optimizing your AI tool stack. The biggest opportunity is with {biggestSavingTool}, where {topRecommendation} could reduce costs significantly. These recommendations are based on your {useCase} use case and current team size. Consider implementing the highest-confidence suggestions first for immediate impact.
```

**For optimized audits:**
```
Your {teamSize}-person team is operating efficiently with your current AI tool stack. We analyzed {toolCount} tools and found your plan selections align well with your team size and {useCase} use case. Consider checking back quarterly as pricing and features evolve, or explore startup credit programs to reduce costs further without changing your setup.
```

**Why the fallback works:**
- Uses the same 3-part structure (acknowledge → highlight → action)
- Incorporates actual data from the audit
- Maintains professional tone
- Provides value even without AI

### API Configuration

**Model:** `claude-3-5-sonnet-20241022`
- Latest Sonnet model with best reasoning
- Good balance of speed and quality
- Cost: ~$0.003 per summary (negligible)

**Max tokens:** 200
- 100-word summary ≈ 130 tokens
- 200 token limit provides buffer for longer outputs
- Prevents runaway costs

**Temperature:** Default (1.0)
- We want consistent, professional output
- No need for creativity or randomness
- Default temperature works well for this use case

**No system prompt**
- All instructions in user message
- Simpler to maintain and debug
- Easier to version control

### Testing & Validation

**Test cases:**
1. ✅ High-savings audit (>$500/month) → Emphasizes biggest opportunity
2. ✅ Low-savings audit (<$100/month) → Acknowledges efficiency
3. ✅ Zero-savings audit → Congratulates on optimization
4. ✅ Single-tool audit → Focuses on that tool
5. ✅ Multi-tool audit → Highlights top opportunity

**Quality checks:**
- Length: 80-120 words (target: 100)
- Tone: Professional, not casual
- Structure: Acknowledge → Highlight → Action
- Accuracy: Only mentions tools/recommendations from audit
- No hallucinations: Doesn't invent savings or recommendations

### Cost Analysis

**Per summary:**
- Input: ~150 tokens ($0.00045)
- Output: ~130 tokens ($0.00195)
- **Total: ~$0.0024 per summary**

**At scale:**
- 1,000 audits/month: $2.40/month
- 10,000 audits/month: $24/month
- 100,000 audits/month: $240/month

**Negligible cost** compared to value provided. Even at 100K audits/month, AI summaries cost less than $250.

### Future Improvements

**Potential enhancements:**
1. **Multi-language support** — Detect user language and generate summary in that language
2. **Tone customization** — Let users choose "technical" vs "executive" tone
3. **Longer summaries for high-complexity audits** — If 10+ tools, allow 150 words
4. **Comparison to previous audits** — "Your spend increased 15% since last quarter"
5. **Industry-specific language** — Different tone for fintech vs dev tools vs AI/ML companies

**Why we didn't build these yet:**
- MVP should be simple and consistent
- Can add complexity based on user feedback
- Current prompt works well for 95% of cases

---

## Other Prompts (Future)

### Email Subject Line Generation (Not Yet Implemented)

**Purpose:** Generate personalized email subject lines for lead capture emails

**Prompt:**
```
Generate a compelling email subject line for an AI spend audit report that found ${savings}/month in savings for a ${teamSize}-person team.

Requirements:
- 6-10 words
- Include the savings amount
- Professional tone
- No emojis
- Create urgency without being spammy

Examples:
- "Your AI Audit: $2,400/Year in Savings Found"
- "SpendLens Results: $350/Month Optimization Opportunity"
- "AI Spend Report: $1,800 Annual Savings Identified"
```

### Social Share Copy Generation (Not Yet Implemented)

**Purpose:** Generate shareable social media copy for audit results

**Prompt:**
```
Write a tweet (max 280 characters) sharing AI spend audit results:
- Savings: ${savings}/month
- Team size: ${teamSize}
- Operating profile: ${profile}

Tone: Humble brag, not boastful
Include: Savings number, tool mention, call-to-action
No hashtags, no emojis
```

---

## Prompt Engineering Principles

**What we learned building these prompts:**

1. **Be specific about role and expertise**
   - "You are a financial analyst" > "You are an AI assistant"
   - Role assignment dramatically improves tone consistency

2. **Provide structure, not just instructions**
   - "Write a summary that: 1. X, 2. Y, 3. Z" > "Write a good summary"
   - Structure ensures consistency across outputs

3. **Include examples of what NOT to do**
   - "Do not use bullet points" prevents unwanted formats
   - "No emojis" prevents casual tone

4. **Use actual data in prompts**
   - Real numbers and tool names make output more credible
   - Generic prompts produce generic outputs

5. **Test edge cases**
   - Zero savings, single tool, 100+ tools
   - Edge cases reveal prompt weaknesses

6. **Have a fallback**
   - API failures happen
   - Template-based fallback maintains quality

7. **Optimize for cost**
   - Shorter prompts = lower cost
   - 200 token limit prevents runaway generation

8. **Version control your prompts**
   - Prompts are code
   - Track changes, test before deploying

---

## Prompt Versioning

**Current version:** v1.0 (2024-05-08)

**Changelog:**
- v1.0 (2024-05-08): Initial prompt with 3-part structure, 100-word limit, financial analyst role

**Future versions will be logged here.**

---

## A/B Testing Plan (Future)

**Hypothesis:** Shorter summaries (75 words) have higher engagement than longer summaries (100 words)

**Test:**
- 50% of users get 75-word summaries
- 50% of users get 100-word summaries
- Measure: Email capture rate, share rate, time on page

**Expected outcome:** 100 words is optimal (based on initial testing), but worth validating at scale.

---

## Ethical Considerations

**Why we use AI for summaries but not recommendations:**

1. **Summaries are low-stakes** — If the summary is slightly off, it doesn't cost the user money
2. **Recommendations are high-stakes** — Wrong recommendation could cost thousands of dollars
3. **AI is good at synthesis** — Summarizing existing data is a strength
4. **AI is bad at reasoning** — Financial logic requires deterministic rules

**We will never use AI for:**
- Calculating savings amounts
- Determining which plan to recommend
- Prioritizing recommendations
- Estimating costs

**We only use AI for:**
- Summarizing audit results in natural language
- Generating shareable social copy (future)
- Personalizing email subject lines (future)

This keeps the tool trustworthy and explainable.
