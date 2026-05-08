# Architecture Documentation

## System Overview

SpendLens is built as a modern, scalable web application using Next.js 16 App Router with a focus on performance, maintainability, and user experience.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Landing    │  │  Audit Form  │  │   Results    │     │
│  │     Page     │  │              │  │     Page     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Routes    │
                    │  /api/audit     │
                    │  /api/leads     │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
       ┌──────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
       │   Audit     │ │ Database │ │   Email    │
       │   Engine    │ │(Supabase)│ │  (Resend)  │
       └─────────────┘ └──────────┘ └────────────┘
```

## Core Components

### 1. Audit Engine (`src/lib/audit/`)

The brain of the application. Responsible for analyzing AI spend and generating recommendations.

#### Components:

**`engine.ts`** - Main orchestrator
- Builds audit context from user input
- Coordinates rule execution
- Calculates totals and severity
- Returns structured audit result

**`rules.ts`** - Rules engine
- Pure functions: `(input, context) → recommendation | null`
- Deterministic logic (no randomness)
- Ordered by priority
- Each rule is independent and testable

**`pricing.ts`** - Pricing database
- Real pricing data verified against official sources
- Structured by tool and plan
- Includes startup credit information
- Helper functions for lookups

**`types.ts`** - Type definitions
- Comprehensive TypeScript types
- Ensures type safety across the system
- Documents data structures

#### Rule Execution Flow:

```
User Input
    ↓
Build Context (team size, use case, tool list)
    ↓
For each tool:
    ↓
Execute Rules in Priority Order
    ↓
Collect Recommendations
    ↓
Calculate Savings
    ↓
Determine Severity
    ↓
Return Audit Result
```

#### Rule Types:

1. **Excess Seats** - Highest priority, easiest win
2. **Solo on Team Plan** - Clear misallocation
3. **Enterprise Overkill** - Common startup mistake
4. **Premium Overkill** - Max/Ultra when Pro suffices
5. **Individual to Team** - Counterintuitive upgrade savings
6. **Team Plan Low Utilization** - Mixed plan opportunity
7. **Overlapping IDE Tools** - Tool consolidation
8. **Overlapping Chat Tools** - Tool consolidation (softer)
9. **API Spend Optimization** - Usage optimization
10. **Startup Credits** - Free money
11. **Free Alternative** - Last resort suggestion

### 2. Frontend Architecture

#### Pages:

**Landing Page** (`src/app/page.tsx`)
- Hero with value proposition
- Problem/solution sections
- How it works
- FAQ
- CTA

**Audit Form** (`src/app/audit/page.tsx`)
- Multi-tool input
- Dynamic plan selection
- Form validation
- State persistence

**Results Page** (`src/app/results/[id]/page.tsx`)
- Savings hero section
- Tool-by-tool breakdown
- Share functionality
- Lead capture

**Share Page** (`src/app/share/[id]/page.tsx`)
- Public view (privacy-safe)
- OG/Twitter card metadata
- CTA to run own audit

#### Component Structure:

```
components/
├── ui/                    # Base components (Button, Input, Card, etc.)
├── landing/               # Landing page sections
│   ├── hero.tsx
│   ├── problem-solution.tsx
│   ├── how-it-works.tsx
│   ├── faq.tsx
│   └── cta.tsx
├── audit/                 # Audit form
│   └── audit-form.tsx
└── results/               # Results page
    ├── results-hero.tsx
    ├── tool-breakdown.tsx
    ├── share-section.tsx
    └── lead-capture.tsx
```

### 3. API Routes

**`/api/audit`** (POST)
- Validates input with Zod
- Runs audit engine
- Returns full result
- TODO: Store in database

**`/api/leads`** (POST)
- Validates lead data
- Stores in database
- Sends email via Resend
- Returns success

### 4. Data Flow

#### Audit Flow:

```
1. User fills form
   ↓
2. Client validates with Zod
   ↓
3. POST /api/audit
   ↓
4. Server validates again
   ↓
5. Run audit engine
   ↓
6. Store in sessionStorage (temp)
   ↓
7. Redirect to /results/[id]
   ↓
8. Display results
```

#### Lead Capture Flow:

```
1. User views results
   ↓
2. Fills email form
   ↓
3. POST /api/leads
   ↓
4. Store in database
   ↓
5. Send email via Resend
   ↓
6. Show success message
```

## Technology Decisions

### Why Next.js App Router?

- **Server Components**: Better performance, smaller bundles
- **Streaming**: Progressive rendering for better UX
- **API Routes**: Integrated backend
- **File-based routing**: Intuitive structure
- **Built-in optimization**: Images, fonts, etc.

### Why Tailwind CSS?

- **Utility-first**: Fast development
- **Consistency**: Design system in code
- **Performance**: Purges unused CSS
- **Dark mode**: Built-in support
- **Responsive**: Mobile-first by default

### Why Zod?

- **Type safety**: TypeScript integration
- **Runtime validation**: Catch errors early
- **Error messages**: User-friendly
- **Composable**: Reusable schemas

### Why Vitest?

- **Fast**: Vite-powered
- **Compatible**: Jest-like API
- **TypeScript**: First-class support
- **UI**: Built-in test UI

## Database Schema (Supabase)

### Tables:

**`audits`**
```sql
CREATE TABLE audits (
  id TEXT PRIMARY KEY,
  input JSONB NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE
);
```

**`leads`**
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  report_id TEXT REFERENCES audits(id),
  total_savings INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**`public_reports`**
```sql
CREATE TABLE public_reports (
  id TEXT PRIMARY KEY,
  audit_id TEXT REFERENCES audits(id),
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Security Considerations

### Input Validation

- **Client-side**: Zod schemas for immediate feedback
- **Server-side**: Re-validate all inputs
- **Sanitization**: No raw user input in responses

### Rate Limiting

- TODO: Implement rate limiting on API routes
- Prevent abuse of free audit service
- Use Vercel Edge Config or Upstash

### Data Privacy

- **Public reports**: No PII (emails, company names)
- **Lead data**: Encrypted at rest
- **GDPR compliance**: Easy data deletion

### API Security

- **CORS**: Configured for production domain
- **CSRF**: Next.js built-in protection
- **Environment variables**: Never exposed to client

## Performance Optimization

### Frontend

- **Code splitting**: Automatic with Next.js
- **Image optimization**: next/image
- **Font optimization**: next/font
- **Lazy loading**: Framer Motion components
- **Caching**: Static generation where possible

### Backend

- **Edge functions**: Fast global response
- **Database indexes**: On frequently queried fields
- **Connection pooling**: Supabase built-in
- **Caching**: Redis for hot data (future)

## Monitoring & Observability

### Metrics to Track

- **Audit completion rate**: Form → Results
- **Lead conversion rate**: Results → Email capture
- **Share rate**: Results → Share clicks
- **Tool distribution**: Which tools are most common
- **Savings distribution**: Average savings per audit

### Error Tracking

- TODO: Integrate Sentry
- Track API errors
- Monitor client-side errors
- Alert on critical failures

## Scalability

### Current Limits

- **Concurrent users**: ~1000 (Vercel Hobby)
- **Database**: 500MB (Supabase Free)
- **API calls**: 100k/month (Resend Free)

### Scaling Strategy

1. **Horizontal**: Vercel auto-scales
2. **Database**: Upgrade Supabase tier
3. **Caching**: Add Redis layer
4. **CDN**: Cloudflare for static assets
5. **Queue**: Bull for async jobs (emails)

## Testing Strategy

### Unit Tests

- Audit engine logic
- Utility functions
- Validation schemas

### Integration Tests

- API routes
- Database operations
- Email sending

### E2E Tests (Future)

- Playwright for critical flows
- Audit form → Results
- Lead capture flow

## Deployment

### Vercel

- **Preview**: Every PR
- **Production**: Main branch
- **Environment**: Edge runtime
- **Region**: Global (Edge)

### CI/CD Pipeline

```
Push to GitHub
    ↓
GitHub Actions
    ↓
Lint → Type Check → Test → Build
    ↓
Deploy to Vercel
    ↓
Run smoke tests
    ↓
Notify team
```

## Future Enhancements

### Phase 2: Database & Email

- Persistent storage
- Email reports
- AI summaries (OpenAI)

### Phase 3: Analytics

- User dashboard
- Savings trends
- Tool popularity

### Phase 4: Advanced Features

- Team collaboration
- Historical tracking
- Budget forecasting
- API access

## Maintenance

### Pricing Data Updates

- Review quarterly
- Verify against official sources
- Update `pricing.ts`
- Add tests for new plans

### Dependency Updates

- Monthly security updates
- Quarterly major version updates
- Test thoroughly before deploying

### Performance Monitoring

- Weekly review of metrics
- Optimize slow queries
- Reduce bundle size
- Improve Core Web Vitals

---

**Last Updated**: May 2026
**Version**: 1.0.0
**Maintainer**: [Your Name]
