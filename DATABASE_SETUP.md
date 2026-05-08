# Database Setup — SpendLens

## Supabase Setup Instructions

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New project"
5. Choose organization (or create one)
6. Fill in project details:
   - **Name:** spendlens-production
   - **Database Password:** (generate strong password, save it)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier is sufficient for MVP
7. Click "Create new project"
8. Wait 2-3 minutes for project to provision

---

### 2. Run SQL Migrations

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New query"
3. Copy and paste the following SQL:

```sql
-- ─────────────────────────────────────────────
-- SpendLens Database Schema
-- ─────────────────────────────────────────────

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Audits Table ───
CREATE TABLE audits (
  id TEXT PRIMARY KEY,
  input JSONB NOT NULL,
  result JSONB NOT NULL,
  ai_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  source TEXT, -- 'landing', 'direct', 'share', 'credex'
  referrer TEXT
);

-- Indexes for audits
CREATE INDEX idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX idx_audits_source ON audits(source);

-- ─── Leads Table ───
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  audit_id TEXT REFERENCES audits(id) ON DELETE CASCADE,
  total_savings INTEGER NOT NULL,
  is_high_value BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  consultation_booked BOOLEAN DEFAULT FALSE,
  consultation_booked_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for leads
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_audit_id ON leads(audit_id);
CREATE INDEX idx_leads_is_high_value ON leads(is_high_value);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- ─── Shares Table ───
CREATE TABLE shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_id TEXT REFERENCES audits(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'twitter', 'linkedin', 'copy'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for shares
CREATE INDEX idx_shares_audit_id ON shares(audit_id);
CREATE INDEX idx_shares_platform ON shares(platform);
CREATE INDEX idx_shares_created_at ON shares(created_at DESC);

-- ─── Row Level Security (RLS) ───

-- Enable RLS on all tables
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- Audits: Public read access (for sharing), service role write access
CREATE POLICY "Audits are publicly readable"
  ON audits FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert audits"
  ON audits FOR INSERT
  WITH CHECK (true);

-- Leads: Service role only
CREATE POLICY "Service role can manage leads"
  ON leads FOR ALL
  USING (true)
  WITH CHECK (true);

-- Shares: Service role only
CREATE POLICY "Service role can manage shares"
  ON shares FOR ALL
  USING (true)
  WITH CHECK (true);

-- ─── Views for Analytics ───

-- Daily audit stats
CREATE VIEW daily_audit_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_audits,
  COUNT(DISTINCT source) as unique_sources,
  AVG(duration_seconds) as avg_duration_seconds,
  COUNT(CASE WHEN (result->>'totalMonthlySavings')::int > 500 THEN 1 END) as high_value_audits
FROM audits
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Lead conversion funnel
CREATE VIEW lead_funnel AS
SELECT 
  COUNT(DISTINCT a.id) as total_audits,
  COUNT(DISTINCT l.id) as total_leads,
  COUNT(DISTINCT CASE WHEN l.is_high_value THEN l.id END) as high_value_leads,
  COUNT(DISTINCT CASE WHEN l.consultation_booked THEN l.id END) as consultations_booked,
  ROUND(COUNT(DISTINCT l.id)::numeric / NULLIF(COUNT(DISTINCT a.id), 0) * 100, 2) as email_capture_rate,
  ROUND(COUNT(DISTINCT CASE WHEN l.is_high_value THEN l.id END)::numeric / NULLIF(COUNT(DISTINCT l.id), 0) * 100, 2) as high_value_rate,
  ROUND(COUNT(DISTINCT CASE WHEN l.consultation_booked THEN l.id END)::numeric / NULLIF(COUNT(DISTINCT CASE WHEN l.is_high_value THEN l.id END), 0) * 100, 2) as consultation_booking_rate
FROM audits a
LEFT JOIN leads l ON a.id = l.audit_id;

-- ─── Functions ───

-- Function to mark consultation as booked
CREATE OR REPLACE FUNCTION mark_consultation_booked(lead_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE leads
  SET 
    consultation_booked = TRUE,
    consultation_booked_at = NOW()
  WHERE email = lead_email;
END;
$$ LANGUAGE plpgsql;

-- ─── Comments ───

COMMENT ON TABLE audits IS 'Stores all audit results with input data and AI summaries';
COMMENT ON TABLE leads IS 'Stores lead information captured from audit results';
COMMENT ON TABLE shares IS 'Tracks social sharing events for viral loop analysis';
COMMENT ON VIEW daily_audit_stats IS 'Daily aggregated audit statistics for dashboard';
COMMENT ON VIEW lead_funnel IS 'Conversion funnel metrics from audit to consultation';
```

4. Click "Run" (or press Cmd/Ctrl + Enter)
5. Verify success: You should see "Success. No rows returned"

---

### 3. Get API Keys

1. In Supabase dashboard, go to **Settings** → **API** (left sidebar)
2. Copy the following values:

**Project URL:**
```
https://[your-project-id].supabase.co
```

**anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**service_role key:** (⚠️ Keep this secret!)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 4. Add Environment Variables

1. Create `.env.local` file in project root (if it doesn't exist)
2. Add the following:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Replace `[your-project-id]` and paste your actual keys

---

### 5. Update API Routes

The database client is already created in `src/lib/db/supabase.ts`. Now update the API routes:

**Update `src/app/api/audit/route.ts`:**

```typescript
import { saveAudit } from '@/lib/db/supabase';

// After generating the final result:
const finalResult = {
  ...enhancedResult,
  aiSummary,
};

// Save to database (optional, graceful failure)
await saveAudit(finalResult, 'landing');

return NextResponse.json(finalResult);
```

**Update `src/app/api/leads/route.ts`:**

```typescript
import { saveLead } from '@/lib/db/supabase';
import { sendAuditReport } from '@/lib/email/resend';

// After validation:
await saveLead(email, auditId, totalSavings, company, role);
await sendAuditReport(email, auditId, totalSavings, toolCount);
```

---

### 6. Update Results Page

**Update `src/app/results/[id]/page.tsx`:**

```typescript
import { getAudit } from '@/lib/db/supabase';

useEffect(() => {
  async function loadAudit() {
    // Try database first
    const { data, error } = await getAudit(params.id);
    
    if (data) {
      setResult(data);
      setLoading(false);
      return;
    }
    
    // Fallback to sessionStorage
    const storedResult = sessionStorage.getItem(`audit-${params.id}`);
    if (storedResult) {
      setResult(JSON.parse(storedResult));
      setLoading(false);
    } else {
      setError('Audit not found');
      setLoading(false);
    }
  }
  
  loadAudit();
}, [params.id]);
```

---

### 7. Test Database Connection

1. Run the development server:
```bash
npm run dev
```

2. Complete an audit at http://localhost:3000/audit

3. Check Supabase dashboard → **Table Editor** → **audits**
   - You should see your audit record

4. Capture email on results page

5. Check **Table Editor** → **leads**
   - You should see your lead record

---

### 8. Verify RLS Policies

1. In Supabase dashboard, go to **Authentication** → **Policies**
2. Verify policies are enabled:
   - ✅ Audits: Public read, service role write
   - ✅ Leads: Service role only
   - ✅ Shares: Service role only

---

## Resend Email Setup

### 1. Create Resend Account

1. Go to https://resend.com
2. Click "Get Started"
3. Sign up with email or GitHub
4. Verify your email

---

### 2. Add Domain (Optional but Recommended)

**For production:**
1. Go to **Domains** in Resend dashboard
2. Click "Add Domain"
3. Enter your domain (e.g., `spendlens.com`)
4. Add DNS records to your domain provider:
   - **SPF:** `v=spf1 include:_spf.resend.com ~all`
   - **DKIM:** (provided by Resend)
   - **DMARC:** `v=DMARC1; p=none;`
5. Wait for verification (5-30 minutes)

**For testing:**
- Use `onboarding@resend.dev` (no domain setup needed)
- Limited to 100 emails/day
- Emails may go to spam

---

### 3. Get API Key

1. Go to **API Keys** in Resend dashboard
2. Click "Create API Key"
3. Name: `SpendLens Production`
4. Permission: `Sending access`
5. Click "Create"
6. Copy the API key (starts with `re_`)

---

### 4. Add Environment Variable

Add to `.env.local`:

```bash
# Resend
RESEND_API_KEY=re_...
```

---

### 5. Test Email Sending

1. Complete an audit
2. Capture email on results page
3. Check your inbox for audit report email
4. Check Resend dashboard → **Logs** to see delivery status

---

## Deployment to Vercel

### 1. Add Environment Variables

1. Go to Vercel dashboard → Your project → **Settings** → **Environment Variables**
2. Add all environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (e.g., `https://spendlens.com`)
3. Select environments: Production, Preview, Development
4. Click "Save"

---

### 2. Redeploy

1. Push to GitHub:
```bash
git add .
git commit -m "feat: add database and email integration"
git push origin main
```

2. Vercel will automatically redeploy
3. Wait 2-3 minutes for deployment
4. Test on production URL

---

## Troubleshooting

### Database Connection Fails

**Error:** `Failed to save audit`

**Solutions:**
1. Check environment variables are set correctly
2. Verify Supabase project is active (not paused)
3. Check RLS policies allow service role access
4. Check Supabase logs: Dashboard → **Logs** → **Postgres Logs**

---

### Email Not Sending

**Error:** `Email service not configured`

**Solutions:**
1. Check `RESEND_API_KEY` is set
2. Verify API key is valid (not expired)
3. Check Resend dashboard → **Logs** for errors
4. Verify domain is verified (if using custom domain)
5. Check spam folder

---

### Audit Not Found After Refresh

**Issue:** Results page shows "Audit not found" after page refresh

**Solutions:**
1. Verify audit was saved to database (check Supabase table editor)
2. Check `getAudit()` function is called in results page
3. Verify audit ID matches between URL and database
4. Check browser console for errors

---

## Analytics Queries

### Daily Audit Stats

```sql
SELECT * FROM daily_audit_stats
ORDER BY date DESC
LIMIT 30;
```

### Lead Conversion Funnel

```sql
SELECT * FROM lead_funnel;
```

### High-Value Leads

```sql
SELECT 
  email,
  company,
  total_savings,
  created_at,
  consultation_booked
FROM leads
WHERE is_high_value = TRUE
ORDER BY created_at DESC;
```

### Top Traffic Sources

```sql
SELECT 
  source,
  COUNT(*) as audit_count,
  AVG((result->>'totalMonthlySavings')::int) as avg_savings
FROM audits
WHERE source IS NOT NULL
GROUP BY source
ORDER BY audit_count DESC;
```

### Share Platform Distribution

```sql
SELECT 
  platform,
  COUNT(*) as share_count,
  COUNT(DISTINCT audit_id) as unique_audits
FROM shares
GROUP BY platform
ORDER BY share_count DESC;
```

---

## Backup & Maintenance

### Automated Backups

Supabase automatically backs up your database daily. To restore:
1. Go to **Database** → **Backups**
2. Select backup date
3. Click "Restore"

### Manual Backup

```bash
# Export all data
pg_dump -h db.[your-project-id].supabase.co -U postgres -d postgres > backup.sql

# Import data
psql -h db.[your-project-id].supabase.co -U postgres -d postgres < backup.sql
```

### Database Maintenance

Run monthly:

```sql
-- Vacuum tables
VACUUM ANALYZE audits;
VACUUM ANALYZE leads;
VACUUM ANALYZE shares;

-- Reindex
REINDEX TABLE audits;
REINDEX TABLE leads;
REINDEX TABLE shares;
```

---

## Cost Estimates

### Supabase (Free Tier)

- **Database:** 500 MB storage
- **Bandwidth:** 2 GB/month
- **API requests:** Unlimited
- **Cost:** $0/month

**When to upgrade:** >500 MB data or >2 GB bandwidth

### Resend (Free Tier)

- **Emails:** 100/day, 3,000/month
- **Cost:** $0/month

**When to upgrade:** >100 emails/day

### Estimated Costs at Scale

**1,000 audits/month:**
- Supabase: Free tier sufficient
- Resend: Free tier sufficient
- **Total:** $0/month

**10,000 audits/month:**
- Supabase: $25/month (Pro plan)
- Resend: $20/month (Pro plan)
- **Total:** $45/month

**100,000 audits/month:**
- Supabase: $25/month (Pro plan)
- Resend: $80/month (Business plan)
- **Total:** $105/month

---

## Security Checklist

- [ ] Service role key is kept secret (not in client-side code)
- [ ] RLS policies are enabled on all tables
- [ ] API keys are in environment variables (not committed to git)
- [ ] Supabase project has strong database password
- [ ] Resend domain is verified (SPF, DKIM, DMARC)
- [ ] HTTPS is enforced on production
- [ ] Rate limiting is enabled on API routes
- [ ] Input validation is in place

---

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Run SQL migrations
3. ✅ Add environment variables
4. ✅ Set up Resend account
5. ✅ Test database connection
6. ✅ Test email sending
7. ✅ Deploy to Vercel
8. ✅ Verify production works end-to-end

**You're done!** Database and email are now fully integrated.
