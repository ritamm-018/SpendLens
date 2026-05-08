# Metrics — SpendLens

## North Star Metric

**High-Value Leads Captured**

**Definition:** Number of completed audits with >$500/month savings potential where the user provided their email address.

**Why this metric:**
1. **Aligns with business goal** — SpendLens is a B2B lead-gen tool for Credex. The goal is qualified leads, not vanity metrics.
2. **Quality over quantity** — A lead with $500/month savings is 10x more valuable than a lead with $50/month savings.
3. **Actionable** — We can optimize the entire funnel toward this metric.
4. **Measurable** — Clear definition, easy to track.

**Target:** 30 high-value leads in first 30 days

**Current:** 0 (not yet launched)

---

## Input Metrics

These are the metrics that drive the North Star metric. If we improve these, the North Star metric improves.

### 1. Audit Completion Rate

**Definition:** Percentage of users who start an audit and complete it (see results page)

**Formula:** `(Audits Completed / Audits Started) × 100`

**Target:** 80%

**Why it matters:** More completed audits = more opportunities for email capture

**How to improve:**
- Simplify form (fewer fields)
- Add progress indicator
- Improve validation (real-time feedback)
- Reduce friction (autofill, smart defaults)

**Benchmark:** Industry standard for free tools is 60-75%. We target 80% because our form is short (90 seconds).

---

### 2. Email Capture Rate

**Definition:** Percentage of users who complete an audit and provide their email

**Formula:** `(Emails Captured / Audits Completed) × 100`

**Target:** 30%

**Why it matters:** Can't convert leads without email addresses

**How to improve:**
- Increase perceived value (better results page)
- Add incentives (PDF report, quarterly re-audits)
- Improve copy ("Get your report" vs "Enter email")
- Social proof (show how many others have signed up)

**Benchmark:** Industry standard for value-first tools is 20-40%. We target 30% as a realistic middle ground.

---

### 3. High-Savings Percentage

**Definition:** Percentage of completed audits that find >$500/month in savings

**Formula:** `(Audits with >$500 Savings / Audits Completed) × 100`

**Target:** 20%

**Why it matters:** High-savings audits are more likely to convert to Credex customers

**How to improve:**
- Target larger teams (20-50 people vs 5-10)
- Improve audit rules (find more inefficiencies)
- Add more tools (more opportunities for savings)
- Better marketing (attract teams with known inefficiencies)

**Benchmark:** Based on user interviews, ~20% of startups have significant AI spend inefficiencies.

---

### 4. Share Rate

**Definition:** Percentage of users who share their audit results on social media or via link

**Formula:** `(Shares / Audits Completed) × 100`

**Target:** 10%

**Why it matters:** Viral loop drives organic growth

**How to improve:**
- Make results more impressive (benchmarks, percentiles)
- Better social cards (visual, shareable)
- Add incentives (unlock bonus insights for sharing)
- Gamification (badges, leaderboards)

**Benchmark:** Industry standard for social sharing is 5-15%. We target 10% as achievable.

---

### 5. Consultation Booking Rate

**Definition:** Percentage of high-value leads who book a Credex consultation

**Formula:** `(Consultations Booked / High-Value Leads) × 100`

**Target:** 30%

**Why it matters:** This is where leads convert to revenue

**How to improve:**
- Faster follow-up (<24 hours)
- Better email copy (emphasize savings, not sales)
- Easy booking (Calendly link, no forms)
- Credex value prop (20-30% discount)

**Benchmark:** B2B SaaS sees 20-40% demo booking from qualified leads. We target 30%.

**Note:** This metric is partially outside SpendLens's control (depends on Credex sales process).

---

## Secondary Metrics

These metrics provide additional context but aren't primary drivers.

### 6. Traffic Sources

**Definition:** Where users come from (Twitter, Reddit, Product Hunt, Credex, etc.)

**Why it matters:** Helps prioritize marketing channels

**How to track:** UTM parameters, referrer headers

**Expected distribution (first 30 days):**
- Credex customer base: 40%
- Twitter: 25%
- Reddit: 20%
- Product Hunt: 10%
- Other: 5%

---

### 7. Time to Complete Audit

**Definition:** Median time from audit start to completion

**Target:** 90 seconds

**Why it matters:** Faster = higher completion rate

**How to track:** Timestamp on start and completion

**Current:** Not yet measured (estimate: 90-120 seconds)

---

### 8. Savings Distribution

**Definition:** Distribution of savings amounts across all audits

**Why it matters:** Helps understand typical user value

**Expected distribution:**
- $0-50/month: 40%
- $50-200/month: 30%
- $200-500/month: 20%
- $500+/month: 10%

---

### 9. Tool Popularity

**Definition:** Which tools are most commonly audited

**Why it matters:** Helps prioritize tool additions and pricing data updates

**Expected top 5:**
1. Cursor (80% of audits)
2. ChatGPT (70% of audits)
3. GitHub Copilot (60% of audits)
4. Claude (40% of audits)
5. OpenAI API (30% of audits)

---

### 10. Operating Profile Distribution

**Definition:** Distribution of users across 6 operating profiles

**Why it matters:** Helps understand user segments

**Expected distribution:**
- Lean Builder: 30%
- Balanced Optimizer: 25%
- API-Heavy Research Team: 20%
- Premium Tooling Advocate: 15%
- Cost-Conscious Starter: 5%
- Enterprise-Grade Infrastructure: 5%

---

## What I'd Instrument First

If I could only track 5 metrics on day 1:

1. **Audit completion rate** — Most important funnel metric
2. **Email capture rate** — Directly drives North Star
3. **High-savings percentage** — Determines lead quality
4. **Traffic sources** — Helps prioritize marketing
5. **Savings distribution** — Validates value prop

**Why these 5:**
- Cover the entire funnel (traffic → audit → email)
- Actionable (can optimize each one)
- Easy to instrument (no complex tracking)

---

## Instrumentation Plan

### Analytics Tool: Vercel Analytics + Custom Events

**Why Vercel Analytics:**
- Built into Vercel (no extra setup)
- Privacy-friendly (no cookies)
- Fast (no third-party scripts)
- Free tier sufficient for MVP

**Custom events to track:**
```typescript
// Audit started
track('audit_started', {
  source: 'landing' | 'direct' | 'share',
  referrer: document.referrer
});

// Audit completed
track('audit_completed', {
  toolCount: number,
  totalSavings: number,
  duration: number // seconds
});

// Email captured
track('email_captured', {
  savings: number,
  isHighValue: boolean
});

// Share clicked
track('share_clicked', {
  platform: 'twitter' | 'linkedin' | 'copy'
});

// Consultation booked
track('consultation_booked', {
  savings: number,
  source: 'email' | 'results_page'
});
```

### Database Schema (Supabase)

**audits table:**
```sql
CREATE TABLE audits (
  id TEXT PRIMARY KEY,
  input JSONB NOT NULL,
  result JSONB NOT NULL,
  ai_summary TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  duration_seconds INTEGER,
  source TEXT, -- 'landing', 'direct', 'share'
  referrer TEXT
);
```

**leads table:**
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  audit_id TEXT REFERENCES audits(id),
  total_savings INTEGER,
  is_high_value BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW(),
  consultation_booked BOOLEAN DEFAULT FALSE,
  consultation_booked_at TIMESTAMP
);
```

**shares table:**
```sql
CREATE TABLE shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_id TEXT REFERENCES audits(id),
  platform TEXT, -- 'twitter', 'linkedin', 'copy'
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Dashboard (Future)

**Metrics dashboard to build:**

**Overview:**
- North Star metric (high-value leads)
- Trend chart (last 30 days)
- Funnel visualization (traffic → audit → email → consultation)

**Funnel Metrics:**
- Audit completion rate (with trend)
- Email capture rate (with trend)
- High-savings percentage (with trend)
- Share rate (with trend)

**Traffic:**
- Sources breakdown (pie chart)
- Top referrers (table)
- Geographic distribution (map)

**Savings:**
- Distribution histogram
- Median savings
- Top tools by savings potential

**Profiles:**
- Distribution (bar chart)
- Savings by profile
- Email capture by profile

**Tool:** Retool or custom Next.js dashboard

---

## Pivot Decision Criteria

**When to pivot or iterate:**

### Scenario 1: Low Completion Rate (<60%)

**Signal:** Users start audits but don't finish

**Diagnosis:**
- Form is too long or confusing
- Validation is too strict
- Value prop isn't clear

**Action:**
- Simplify form (remove optional fields)
- Improve validation UX
- Add progress indicator
- A/B test shorter form

---

### Scenario 2: Low Email Capture (<15%)

**Signal:** Users complete audits but don't provide email

**Diagnosis:**
- Results aren't valuable enough
- Email ask is too aggressive
- Trust issues (privacy concerns)

**Action:**
- Improve results page (add more insights)
- Change email copy (emphasize value, not sales)
- Add social proof (testimonials, user count)
- Offer incentive (PDF report, quarterly re-audits)

---

### Scenario 3: Low High-Savings Percentage (<10%)

**Signal:** Most audits find <$500/month savings

**Diagnosis:**
- Targeting wrong audience (too small teams)
- Audit rules aren't finding inefficiencies
- Pricing data is outdated

**Action:**
- Target larger teams (20-50 people)
- Add more audit rules
- Update pricing data
- Expand to mid-market companies

---

### Scenario 4: Low Share Rate (<5%)

**Signal:** Users don't share results

**Diagnosis:**
- Results aren't impressive or shareable
- Social cards aren't compelling
- No incentive to share

**Action:**
- Improve social cards (visual, data-rich)
- Add gamification (badges, percentiles)
- Offer incentive (unlock bonus insights)
- Make sharing easier (one-click)

---

### Scenario 5: Low Consultation Booking (<15%)

**Signal:** High-value leads don't book consultations

**Diagnosis:**
- Credex follow-up is slow or weak
- Value prop isn't clear
- Booking process is too complex

**Action:**
- Automate follow-up (immediate email)
- Improve email copy (emphasize savings)
- Simplify booking (Calendly link)
- Train Credex sales team

**Note:** This is partially outside SpendLens's control.

---

## Success Criteria (30 Days)

**Minimum viable traction:**
- 300 audits completed
- 80% completion rate
- 25% email capture rate
- 15% high-savings percentage
- 5% share rate
- 15 high-value leads
- 3 consultations booked

**Good traction:**
- 500 audits completed
- 85% completion rate
- 30% email capture rate
- 20% high-savings percentage
- 10% share rate
- 30 high-value leads
- 5 consultations booked

**Exceptional traction:**
- 1,000+ audits completed
- 90% completion rate
- 35% email capture rate
- 25% high-savings percentage
- 15% share rate
- 60+ high-value leads
- 10+ consultations booked
- Organic press coverage

**Decision:** If we hit "good traction," this is worth scaling. If we hit "exceptional," this could be a standalone product.

---

## Reporting Cadence

**Daily (first 30 days):**
- North Star metric
- Audit completion rate
- Email capture rate

**Weekly:**
- Full funnel metrics
- Traffic sources
- Savings distribution
- Top insights

**Monthly:**
- Comprehensive report
- Trend analysis
- Pivot decisions
- Roadmap updates

---

## Conclusion

**North Star:** High-value leads captured (>$500/month savings + email)

**Key drivers:**
1. Audit completion rate (80% target)
2. Email capture rate (30% target)
3. High-savings percentage (20% target)

**What to instrument first:**
1. Completion rate
2. Email capture rate
3. High-savings percentage
4. Traffic sources
5. Savings distribution

**Pivot triggers:**
- Completion rate <60%
- Email capture <15%
- High-savings <10%
- Share rate <5%

**Success criteria:** 30 high-value leads in 30 days = good traction, worth scaling.
