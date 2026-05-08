# Deployment Guide

Complete guide to deploying SpendLens to production.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase account (optional, for database)
- Resend account (optional, for emails)
- OpenAI API key (optional, for AI summaries)

## Quick Deploy to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/spendlens)

### Option 2: Manual Deploy

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/spendlens.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next
   - Click "Deploy"

3. **Configure Environment Variables** (Optional)
   ```env
   # Supabase (when integrated)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Resend (when integrated)
   RESEND_API_KEY=your_resend_key

   # OpenAI (for AI summaries)
   OPENAI_API_KEY=your_openai_key
   ```

4. **Deploy**
   - Vercel will automatically deploy on every push to main
   - Preview deployments for every PR

## Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and region
4. Set database password (save it!)
5. Wait for project to be ready

### 2. Run Migrations

```sql
-- Create audits table
CREATE TABLE audits (
  id TEXT PRIMARY KEY,
  input JSONB NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE
);

-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  report_id TEXT REFERENCES audits(id),
  total_savings INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create public_reports table
CREATE TABLE public_reports (
  id TEXT PRIMARY KEY,
  audit_id TEXT REFERENCES audits(id),
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_public_reports_audit_id ON public_reports(audit_id);

-- Enable Row Level Security
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_reports ENABLE ROW LEVEL SECURITY;

-- Public reports are readable by anyone
CREATE POLICY "Public reports are viewable by anyone"
  ON public_reports FOR SELECT
  USING (true);

-- Audits are only readable by authenticated users (admin)
CREATE POLICY "Audits are viewable by authenticated users"
  ON audits FOR SELECT
  TO authenticated
  USING (true);

-- Leads are only readable by authenticated users (admin)
CREATE POLICY "Leads are viewable by authenticated users"
  ON leads FOR SELECT
  TO authenticated
  USING (true);
```

### 3. Get API Keys

1. Go to Project Settings → API
2. Copy:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - anon/public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - service_role key (SUPABASE_SERVICE_ROLE_KEY)

### 4. Add to Vercel

1. Go to Vercel project settings
2. Environment Variables
3. Add the three keys
4. Redeploy

## Email Setup (Resend)

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up (free tier: 100 emails/day)
3. Verify your email

### 2. Add Domain (Optional)

For production:
1. Go to Domains
2. Add your domain
3. Add DNS records
4. Verify

For development:
- Use `onboarding@resend.dev` (works without domain)

### 3. Get API Key

1. Go to API Keys
2. Create new key
3. Copy key (RESEND_API_KEY)
4. Add to Vercel environment variables

### 4. Create Email Template

```typescript
// src/lib/email/templates.ts
export const auditReportTemplate = (data: {
  email: string;
  totalSavings: number;
  reportUrl: string;
}) => ({
  from: 'SpendLens <noreply@yourdomain.com>',
  to: data.email,
  subject: 'Your AI Spend Audit Report',
  html: `
    <h1>Your AI Spend Audit Results</h1>
    <p>You could save <strong>$${data.totalSavings}/month</strong> on your AI stack.</p>
    <p><a href="${data.reportUrl}">View Full Report</a></p>
  `,
});
```

## Custom Domain

### 1. Add Domain to Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., spendlens.com)
3. Follow DNS instructions

### 2. Configure DNS

Add these records to your DNS provider:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Wait for Propagation

- Usually takes 5-60 minutes
- Vercel will auto-provision SSL certificate

## Monitoring & Analytics

### Vercel Analytics

1. Go to Project Settings → Analytics
2. Enable Web Analytics
3. Add to your app:
   ```typescript
   // src/app/layout.tsx
   import { Analytics } from '@vercel/analytics/react';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

### Error Tracking (Sentry)

1. Create Sentry account
2. Create new project (Next.js)
3. Install SDK:
   ```bash
   npm install @sentry/nextjs
   ```
4. Run setup:
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```
5. Add DSN to environment variables

## Performance Optimization

### 1. Enable Compression

Vercel automatically enables gzip/brotli compression.

### 2. Optimize Images

Use `next/image` for automatic optimization:
```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="SpendLens"
  width={200}
  height={50}
  priority
/>
```

### 3. Enable Caching

Add cache headers to API routes:
```typescript
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

### 4. Use Edge Runtime

For fast global response:
```typescript
export const runtime = 'edge';
```

## Security Checklist

- [ ] Environment variables set
- [ ] Database RLS enabled
- [ ] API rate limiting configured
- [ ] CORS configured
- [ ] CSP headers set
- [ ] HTTPS enforced
- [ ] Secrets not in code
- [ ] Dependencies updated

## Post-Deployment

### 1. Test Critical Flows

- [ ] Landing page loads
- [ ] Audit form submits
- [ ] Results page displays
- [ ] Share links work
- [ ] Lead capture works
- [ ] Emails send (if integrated)

### 2. Set Up Monitoring

- [ ] Vercel Analytics enabled
- [ ] Error tracking configured
- [ ] Uptime monitoring (e.g., UptimeRobot)
- [ ] Performance monitoring

### 3. Configure Alerts

- [ ] Error rate > 1%
- [ ] Response time > 2s
- [ ] Downtime > 1 minute

## Rollback Procedure

If something goes wrong:

1. **Instant Rollback**
   - Go to Vercel dashboard
   - Deployments tab
   - Find last working deployment
   - Click "..." → "Promote to Production"

2. **Git Revert**
   ```bash
   git revert HEAD
   git push
   ```

3. **Emergency Fix**
   - Fix locally
   - Test thoroughly
   - Deploy immediately

## Scaling Considerations

### Current Limits (Free Tier)

- **Vercel**: 100GB bandwidth, 100 serverless function executions/day
- **Supabase**: 500MB database, 2GB bandwidth
- **Resend**: 100 emails/day

### When to Upgrade

- **Vercel Pro** ($20/mo): 1TB bandwidth, unlimited functions
- **Supabase Pro** ($25/mo): 8GB database, 50GB bandwidth
- **Resend Pro** ($20/mo): 50k emails/month

### Scaling Strategy

1. **0-1k users**: Free tier
2. **1k-10k users**: Pro tiers
3. **10k+ users**: Enterprise, add caching layer

## Troubleshooting

### Build Fails

```bash
# Check locally first
npm run build

# Common issues:
# - TypeScript errors
# - Missing dependencies
# - Environment variables
```

### Database Connection Issues

```bash
# Test connection
curl https://your-project.supabase.co/rest/v1/

# Check:
# - API keys correct
# - RLS policies set
# - Network not blocked
```

### Email Not Sending

```bash
# Check:
# - API key valid
# - Domain verified (for production)
# - Rate limits not exceeded
# - Email template valid
```

## Maintenance

### Weekly

- [ ] Check error logs
- [ ] Review analytics
- [ ] Monitor performance

### Monthly

- [ ] Update dependencies
- [ ] Review pricing data
- [ ] Analyze user feedback

### Quarterly

- [ ] Security audit
- [ ] Performance optimization
- [ ] Feature planning

---

**Last Updated**: May 7, 2026
**Deployment Time**: ~15 minutes
**Difficulty**: Easy
