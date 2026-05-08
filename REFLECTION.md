# Reflection — SpendLens

## Question 1: The hardest bug you hit this week, and how you debugged it

The hardest bug was a TypeScript error in the intelligence engine when calculating efficiency scores. The error was cryptic: `Type 'number | undefined' is not assignable to type 'number'` in the weighted scoring algorithm, specifically in the benchmark performance calculation.

**Initial hypothesis:** I thought it was a TypeScript configuration issue or a problem with how I was typing the benchmark data structure.

**What I tried first:**
1. Added explicit type annotations to every variable in the calculation
2. Checked tsconfig.json for strict null checks
3. Added console.logs to trace which values were undefined

**The breakthrough:** After 2 hours of debugging, I realized the issue wasn't the types — it was the data. When I logged the benchmark segment selection, I saw that for team size 15, no segment was being selected. My benchmark data had segments for 1-10 and 20-50, but nothing for 11-19. The lookup was returning undefined, which cascaded through the calculation.

**What worked:** I added a fallback segment selection algorithm that picks the closest match when an exact match fails. I also added TypeScript guards (`?? 50`) to provide default values for all components, ensuring the calculation never fails even with missing data.

**The fix:**
```typescript
const segment = this.getSegment(teamSize, useCase) ?? this.getClosestSegment(teamSize);
const benchmarkValue = segment?.metrics.medianSpendPerDev ?? 50;
```

**Lesson learned:** When TypeScript complains about undefined, check your data before blaming your types. The error message was technically correct — the value could be undefined — but the root cause was a gap in my benchmark data, not a type issue. This took 3 hours total because I was looking in the wrong place.

---

## Question 2: A decision you reversed mid-week, and what made you reverse it

**Original decision:** Build a progressive onboarding flow with 6 screens (welcome → use case → team size → tools → costs → review) instead of a single form.

**Reasoning:** The assignment mentioned "progressive disclosure" and "conversational" experiences. I thought a multi-screen flow would feel more engaging and modern, like Linear or Stripe's onboarding.

**Why I reversed it:** After building the first 3 screens, I realized:
1. **Time constraint:** Building 6 screens with state management, animations, and validation would take 2 full days
2. **User interviews:** When I talked to founders, they said "I just want to input my tools and see the results." Nobody asked for a conversational experience.
3. **Complexity:** The state machine for screen transitions was getting complicated, and I wasn't confident I could debug it quickly if something broke.
4. **MVP principle:** A single form with good UX is better than a half-finished multi-screen flow.

**What made me reverse it:** Interview #2 with KL (solo founder) was the turning point. He said: "Dude I literally don't care about AI costs right now... My problem is I don't know if I'm using the right tools." He wanted speed and clarity, not a journey.

**The new approach:** I built a single-page form with dynamic tool addition, clear validation, and state persistence. It's not as "innovative" as a multi-screen flow, but it works perfectly and took 1/4 the time.

**Lesson learned:** Don't over-engineer. The assignment says "ship working code," not "build the most innovative UX." When in doubt, choose the simpler solution that you can execute well. I can always add progressive onboarding in week 2 if I get there.

---

## Question 3: What you would build in week 2 if you had it

**Priority 1: Historical tracking and monitoring**
Most users won't audit their stack every week. But if I could track their spend over time and alert them when:
- A tool raises prices
- They add seats that push them into a more expensive tier
- A new startup credit program becomes available
- Their usage pattern changes (e.g., API costs spike)

This turns a one-time audit into an ongoing relationship. Implementation: cron job that re-runs audits monthly, compares to previous results, and emails diffs.

**Priority 2: Team collaboration features**
Right now it's single-player. But in reality, the eng lead runs the audit, then needs to share it with finance, the CTO, and maybe the CEO. I'd add:
- Team workspaces (multiple people can view/edit)
- Comments on specific recommendations
- Approval workflow ("Finance approved this downgrade")
- Slack integration for notifications

**Priority 3: Deeper integrations**
Instead of manual input, connect directly to:
- Stripe (see actual charges)
- Expensify/Brex (see employee expenses)
- GitHub (see who's actually using Copilot)
- Cursor/IDE telemetry (see actual usage)

This would make the audit 10x more accurate and eliminate manual data entry.

**Priority 4: Benchmark improvements**
Current benchmarks are static. I'd make them dynamic:
- Real-time data from actual users (anonymized)
- Segment by industry, not just team size
- Show trends over time ("AI spend is up 23% YoY")
- Peer comparisons ("You're in the top 15% of efficient teams")

**What I wouldn't build:** More AI features. The AI summary is nice-to-have, but the core value is the deterministic audit logic. I'd resist the temptation to add AI everywhere just because it's trendy.

---

## Question 4: How you used AI tools

**Tools used:**
- **Cursor** (primary): 80% of coding time
- **Claude 3.5 Sonnet** (via Cursor): For code generation, refactoring, and debugging
- **ChatGPT Plus** (secondary): For documentation writing and brainstorming

**What I used AI for:**
1. **Boilerplate code:** Component scaffolding, TypeScript interfaces, test setup
2. **Refactoring:** Converting class components to functional, extracting utilities
3. **Documentation:** First drafts of README sections, JSDoc comments
4. **Debugging:** Explaining TypeScript errors, suggesting fixes
5. **Data generation:** Creating realistic benchmark data (1,247 samples)

**What I didn't trust AI with:**
1. **Business logic:** The audit rules are too important to delegate to AI. I wrote every rule by hand.
2. **Architecture decisions:** AI suggested using Redux for state management. I ignored it and used React Hook Form + sessionStorage.
3. **Pricing data:** AI hallucinated prices. I manually verified every number against official sources.
4. **User interviews:** AI can't talk to real humans. I did all 5 interviews myself.
5. **Final review:** AI doesn't catch subtle bugs or UX issues. I manually tested everything.

**Specific time AI was wrong:**
I asked Claude to generate the efficiency score calculation algorithm. It suggested:
```typescript
const score = (costSavings * 0.5) + (toolCount * 0.3) + (benchmarkRank * 0.2);
```

This is wrong because:
1. `costSavings` is unbounded (could be $10K/month), so it would dominate the score
2. `toolCount` should penalize more tools, not reward them
3. The weights don't reflect what actually matters (cost efficiency should be 40%, not 50%)

I caught this immediately because I had already thought through the scoring logic. AI is great for syntax, terrible for domain logic.

**How I used AI effectively:**
- Treat it like a junior developer: good at boilerplate, needs supervision on logic
- Always review generated code line-by-line
- Use it to speed up tedious tasks (writing tests, formatting data)
- Don't use it for critical decisions (architecture, business logic, security)

**Productivity impact:** AI probably saved me 10-15 hours this week, mostly on boilerplate and refactoring. But it also cost me 2 hours debugging AI-generated bugs. Net positive, but not magic.

---

## Question 5: Self-rating on a 1–10 scale

**Discipline: 8/10**
I worked every day for 7 days, spread commits across the week, and followed the assignment requirements exactly. I didn't cut corners on documentation or tests. Lost 2 points because I spent too much time on the intelligence engine (not required) instead of finishing the AI summary earlier.

**Code quality: 9/10**
The code is production-ready: TypeScript throughout, comprehensive tests, clean architecture, no obvious bugs. It's readable, maintainable, and follows Next.js best practices. Lost 1 point because some components are too large (results page could be split further) and I didn't add E2E tests.

**Design sense: 7/10**
The UI is professional and polished, with a clear Bloomberg Terminal aesthetic. It's accessible, responsive, and screenshot-worthy. But it's not innovative — it's safe. I played it conservative instead of taking design risks. A truly great design would have more personality while staying professional.

**Problem-solving: 9/10**
I made good decisions under time pressure: chose deterministic logic over AI, simplified the form instead of building progressive onboarding, focused on core features instead of bonus features. The user interviews changed my approach mid-week, which shows adaptability. Lost 1 point for spending too long debugging the TypeScript issue (should have checked data first).

**Entrepreneurial thinking: 8/10**
The user interviews were genuine and insightful. The GTM strategy is specific and actionable. The economics are realistic with conservative assumptions. I understand the business model and the target user. Lost 2 points because I focused too much on engineering (intelligence engine, tests) and not enough on distribution (should have written the Product Hunt launch post, created social cards, etc.).

**Overall:** Strong technical execution with good entrepreneurial instincts, but I leaned too heavily toward engineering perfectionism instead of shipping and marketing. In a real startup, I'd need to balance these better.
