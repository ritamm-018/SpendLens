import { Hero } from '@/components/landing/hero';
import { ProblemSolution } from '@/components/landing/problem-solution';
import { HowItWorks } from '@/components/landing/how-it-works';
import { FAQ } from '@/components/landing/faq';
import { CTA } from '@/components/landing/cta';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <FAQ />
      <CTA />
    </div>
  );
}
