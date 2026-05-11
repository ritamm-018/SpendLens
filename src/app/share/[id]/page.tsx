import { Metadata } from 'next';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// This would come from database in production
const mockData = {
  totalMonthlySavings: 560,
  totalAnnualSavings: 6720,
  totalCurrentSpend: 1400,
  savingsPercentage: 40,
  toolCount: 4,
  teamSize: 12,
  currency: 'USD',
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // In production, fetch from database
  const data = mockData;
  const currency = data.currency || 'USD';
  
  return {
    title: `AI Spend Audit Results - ${formatCurrency(data.totalAnnualSavings, currency)}/year in savings`,
    description: `This startup could save ${formatCurrency(data.totalMonthlySavings, currency)}/month on their AI stack. Run your own free audit with SpendLens.`,
    openGraph: {
      title: `${formatCurrency(data.totalAnnualSavings, currency)}/year in AI Spend Savings Found`,
      description: `SpendLens found ${formatCurrency(data.totalMonthlySavings, currency)}/month in optimization opportunities across ${data.toolCount} AI tools.`,
      images: [
        {
          url: '/og-image.png', // TODO: Generate dynamic OG image
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${formatCurrency(data.totalAnnualSavings, currency)}/year in AI Spend Savings`,
      description: `Found ${formatCurrency(data.totalMonthlySavings, currency)}/month in savings. Audit your AI stack for free.`,
    },
  };
}

export default function SharePage({ params }: { params: { id: string } }) {
  const data = mockData;
  const currency = data.currency || 'USD';

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-zinc-50">
            {formatCurrency(data.totalAnnualSavings, currency)}
            <span className="text-zinc-500">/year</span>
          </h1>
          <p className="mt-4 text-xl text-zinc-400">
            in potential AI spend savings
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="text-3xl font-bold text-zinc-50">
                {formatCurrency(data.totalMonthlySavings, currency)}
              </div>
              <div className="mt-2 text-sm text-zinc-400">Monthly Savings</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="text-3xl font-bold text-zinc-50">
                {data.toolCount}
              </div>
              <div className="mt-2 text-sm text-zinc-400">Tools Analyzed</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="text-3xl font-bold text-zinc-50">
                {data.savingsPercentage}%
              </div>
              <div className="mt-2 text-sm text-zinc-400">Potential Savings</div>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-lg text-zinc-400">
              Want to find your own savings?
            </p>
            <Link href="/audit" className="mt-6 inline-block">
              <Button size="lg" className="group">
                Run Your Free Audit
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-zinc-500">
            Powered by <Link href="/" className="font-medium hover:text-zinc-50">SpendLens</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
