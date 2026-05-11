# Development Log — SpendLens

## Day 1 — 2026-05-07

**Hours worked:** 2

**What I did:**
- Set up Next.js 16 project with TypeScript, Tailwind CSS 4, and ESLint using Create Next App
- Initialized git repository
- Created basic project structure
- Configured initial dependencies and build tools

**What I learned:**
- Next.js 16 App Router has breaking changes from v14 — had to read the migration docs carefully
- Tailwind CSS 4 has a new configuration approach
- Setting up the foundation properly saves time later

**Blockers / what I'm stuck on:**
- Need to decide on the overall architecture and feature scope
- Planning out the audit engine logic

**Plan for tomorrow:**
- Build out the full landing page
- Create audit form with multi-tool support
- Research pricing for all 9 AI tools
- Start on audit engine logic

---

## Day 2 — 2026-05-08

**Hours worked:** 10

**What I did:**
- Built complete landing page with hero section, problem/solution, how-it-works, FAQ, and CTA
- Researched pricing for 9 AI tools (Cursor, GitHub Copilot, ChatGPT, Claude, Gemini, OpenAI API, Anthropic API, Windsurf, v0)
- Created audit form with React Hook Form + Zod validation for multi-tool input
- Set up form state persistence using sessionStorage
- Built audit engine with 11 optimization rules in priority order
- Created pricing database with 40+ plans across 9 tools, all with source URLs
- Implemented rule execution logic: excess seats, enterprise overkill, premium overkill, tool overlaps, etc.
- Added confidence scoring for each recommendation (high/medium/low)
- Created results page with savings hero, tool-by-tool breakdown, and recommendations
- Set up API route for audit processing with Zod validation

**What I learned:**
- Zod's discriminated unions are perfect for tool-specific validation (different plans per tool)
- Pricing data is harder to find than expected — enterprise plans are often "Contact Sales" with no public pricing
- sessionStorage is better than localStorage for audit data since it's temporary
- Deterministic rules are the right choice — AI would hallucinate savings or make inconsistent recommendations
- Priority ordering matters — excess seats should be detected before suggesting plan changes
- Conservative estimates build trust — better to underestimate savings than overestimate
- The "already optimized" path is important — don't force recommendations when none exist

**Blockers / what I'm stuck on:**
- Struggling with TypeScript types for the audit result — lots of nested objects
- Not sure how to handle tools with unknown pricing (enterprise "Contact Sales")
- Debating whether to show $0 savings as "You're doing great!" or hide those audits

**Plan for tomorrow:**
- Add intelligence engine (efficiency scores, benchmarking, operating profiles)
- Create benchmark data with realistic segments
- Build category analysis for spend breakdown
- Update UI to professional aesthetic

---

## Day 3 — 2026-05-09

**Hours worked:** 8

**What I did:**
- Built intelligence engine with efficiency score calculator (weighted: 40% cost, 30% tool optimization, 20% benchmark, 10% risk)
- Created benchmark data with 6 segments and 1,247 sample data points
- Implemented operating profile classifier with 6 profiles (Lean Builder, API-Heavy Research Team, etc.)
- Added category analysis engine for spend breakdown by category
- Built strategic insights generator for executive-level recommendations
- Created results components: efficiency hero, benchmark section, profile badge, category chart
- Refactored entire UI to professional Bloomberg Terminal aesthetic
- Removed all emojis, replaced with Lucide icons
- Updated typography to use tabular numbers, proper spacing, uppercase labels
- Changed color palette to subtle zinc-based with emerald/amber/rose for status
- Added share modal with 3 card types (efficiency, savings, profile)
- Created trust badges component with verification timestamps
- Added multi-currency support (21 global currencies with auto-detection)
- Built CurrencySelect and CurrencyInput components
- Integrated currency throughout audit form and results

**What I learned:**
- Weighted scoring is tricky — had to ensure components sum to 100 and handle edge cases
- Benchmark data needs to be realistic but not too specific (privacy concerns)
- Operating profiles need to feel aspirational, not judgmental
- Recharts is great for data visualization but has a learning curve
- Professional design is about restraint — less is more
- Tabular numbers make metrics look more credible
- Subtle shadows and borders are better than flashy gradients
- Consistency matters — every component should feel like the same product

**Blockers / what I'm stuck on:**
- TypeScript errors with benchmark data lookup — some team sizes fall between segments
- Currency dropdown z-index issues with overlapping elements
- Debating whether to show alternative profiles or just the top match

**Plan for tomorrow:**
- Write comprehensive tests for audit engine and utilities
- Set up CI/CD with GitHub Actions
- Create documentation files (README, ARCHITECTURE, etc.)
- Conduct user interviews

---

## Day 4 — 2026-05-10

**Hours worked:** 8

**What I did:**
- Wrote 10 tests covering audit engine logic, utility functions, and edge cases
- Achieved 85% test coverage (90% on audit engine, 100% on utilities)
- Set up GitHub Actions workflow for lint, type-check, test, and build
- Created comprehensive documentation: README, ARCHITECTURE, DEVLOG (this file), REFLECTION
- Added Mermaid diagram for system architecture
- Documented all technical decisions and trade-offs
- Conducted 5 user interviews with founders and engineering leads (exceeded requirement of 3)
- Discovered surprising insights: people care more about "not being dumb" than "saving money"
- Added AI summary feature using Anthropic Claude API with fallback for failures
- Set up Supabase project with database schema for audits and leads
- Integrated Resend for transactional emails on lead capture
- Created email templates for audit report delivery
- Added rate limiting and honeypot for abuse protection
- Wrote remaining documentation (GTM, ECONOMICS, LANDING_COPY, METRICS, PRICING_DATA, PROMPTS, TESTS, USER_INTERVIEWS)

**What I learned:**
- Vitest is much faster than Jest — tests run in under 3 seconds
- Property-based testing with fast-check would be ideal but takes too long to implement
- Good tests focus on business logic, not UI components
- Documentation is as important as code — shows thinking process
- User interviews are incredibly valuable — changed my entire messaging strategy
- People say "cost doesn't matter" but then care deeply about specific dollar amounts
- AI is great for summaries but terrible for financial recommendations (as expected)
- Supabase is much easier to set up than I thought
- Resend's free tier (100 emails/day) is perfect for MVP

**Blockers / what I'm stuck on:**
- Should I add E2E tests with Playwright? Probably overkill for MVP
- Not sure if 85% coverage is enough or if I should aim for 90%+
- Anthropic API rate limits during testing — had to add retry logic
- Supabase RLS policies are confusing — spent 2 hours on permissions
- Email deliverability concerns (will emails go to spam?)

**Plan for tomorrow:**
- Deploy to Vercel with environment variables
- Final polish and testing
- Prepare for submission

---

## Day 5 — 2026-05-11

**Hours worked:** 6

**What I did:**
- Deployed to Vercel with all environment variables configured
- Verified deployment at https://spend-lens-jpbqm82oo-ritams-projects-83d26bdd.vercel.app
- Tested full user flow on production: landing → audit → results → share
- Fixed deployment issues with environment variables
- Updated README with deployed URL
- Added "Decisions" section to README with 5 key trade-offs
- Added 2-3 sentence project summary to README
- Cleaned up project by removing 49 unnecessary markdown files
- Removed `.kiro/`, `.vscode/`, `docs/` folders
- Moved `ARCHITECTURE.md` from `docs/` to root
- Verified all 12 required markdown files are at root
- Final testing of build, tests, and CI/CD
- Pushed all Day 5 changes to GitHub

**What I learned:**
- Vercel deployment is incredibly smooth — took 5 minutes
- Environment variables need to be prefixed with `NEXT_PUBLIC_` for client-side access
- Small details matter — proper OG tags, accessibility, mobile responsiveness
- Project cleanup is important for submission — shows attention to detail
- Git commit history matters — need 5+ distinct calendar days

**Blockers / what I'm stuck on:**
- Need to add 3 screenshots to README (landing, audit form, results)
- Screenshots should be from deployed URL, not localhost
- Lighthouse performance score is 87 (target: 85+) ✅
- Lighthouse accessibility score is 92 (target: 90+) ✅

**Plan for tomorrow:**
- Take 3 screenshots from deployed application
- Add screenshots to README
- Final verification of all requirements
- Submit via Google Form

---

**Total hours:** 42 hours across 5 days (May 7-11, 2026)
