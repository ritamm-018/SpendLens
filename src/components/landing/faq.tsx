'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FAQ() {
  const faqs = [
    {
      question: 'Is this really free?',
      answer: 'Yes, completely free. No credit card required. We built this as a genuinely useful tool for the startup community and as a lead generation engine for Credex infrastructure credits.',
    },
    {
      question: 'How accurate are the recommendations?',
      answer: 'Very. We use real pricing data verified against official sources and conservative, defensible logic. Our recommendations are finance-literate and designed to be trustworthy, not aggressive.',
    },
    {
      question: 'Do you store my data?',
      answer: 'We store anonymized audit results for public sharing. If you provide your email, we store that for sending your report. We never share personal information publicly.',
    },
    {
      question: 'What tools do you analyze?',
      answer: 'We currently analyze Cursor, GitHub Copilot, Windsurf, ChatGPT, Claude, Gemini, OpenAI API, Anthropic API, and v0. More tools coming soon.',
    },
    {
      question: 'Can I share my results?',
      answer: 'Yes! Every audit gets a unique shareable URL with Open Graph previews optimized for Twitter/X, LinkedIn, and other platforms.',
    },
    {
      question: 'What is Credex?',
      answer: 'Credex helps startups access infrastructure credits from cloud providers and AI platforms. If your audit shows significant savings opportunities, Credex can help you optimize further.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-b border-zinc-800 bg-zinc-950 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Everything you need to know about SpendLens
          </p>
        </motion.div>

        <div className="mt-16 space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-zinc-800/50"
              >
                <span className="text-lg font-semibold text-zinc-50">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 text-zinc-500 transition-transform',
                    openIndex === i && 'rotate-180'
                  )}
                />
              </button>
              {openIndex === i && (
                <div className="border-t border-zinc-800 px-6 py-4">
                  <p className="text-zinc-400">{faq.answer}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
