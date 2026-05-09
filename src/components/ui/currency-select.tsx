'use client';

import { useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { CURRENCIES, POPULAR_CURRENCIES, ALL_CURRENCY_CODES, Currency } from '@/lib/currency/currencies';
import { motion, AnimatePresence } from 'framer-motion';

interface CurrencySelectProps {
  value: string;
  onChange: (currency: string) => void;
  className?: string;
  disabled?: boolean;
}

export function CurrencySelect({ value, onChange, className = '', disabled = false }: CurrencySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCurrency = CURRENCIES[value];

  // Filter currencies based on search
  const filteredCurrencies = ALL_CURRENCY_CODES.filter((code) => {
    const currency = CURRENCIES[code];
    const query = searchQuery.toLowerCase();
    return (
      currency.code.toLowerCase().includes(query) ||
      currency.name.toLowerCase().includes(query) ||
      currency.symbol.includes(query)
    );
  });

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm transition-all hover:border-zinc-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        }`}
      >
        <span className="text-lg">{selectedCurrency?.flag}</span>
        <span className="font-medium text-zinc-50">{selectedCurrency?.symbol}</span>
        <span className="text-zinc-400">{selectedCurrency?.code}</span>
        <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`} />
      </button>

      {/* Dropup (opens upward) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropup Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-0 right-0 z-[9999] mb-2 max-h-96 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-2xl"
            >
              {/* Search */}
              <div className="border-b border-zinc-800 p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search currencies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-10 pr-4 text-sm text-zinc-50 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    autoFocus
                  />
                </div>
              </div>

              {/* Popular Currencies */}
              {!searchQuery && (
                <div className="border-b border-zinc-800 p-2">
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Popular
                  </div>
                  <div className="space-y-1">
                    {POPULAR_CURRENCIES.map((code) => {
                      const currency = CURRENCIES[code];
                      const isSelected = value === code;

                      return (
                        <button
                          key={code}
                          onClick={() => handleSelect(code)}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                            isSelected
                              ? 'bg-emerald-950/30 text-emerald-400'
                              : 'text-zinc-300 hover:bg-zinc-800'
                          }`}
                        >
                          <span className="text-lg">{currency.flag}</span>
                          <span className="font-medium">{currency.symbol}</span>
                          <span className="flex-1 text-sm">{currency.name}</span>
                          <span className="text-xs text-zinc-500">{currency.code}</span>
                          {isSelected && <Check className="h-4 w-4 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* All Currencies */}
              <div className="max-h-64 overflow-y-auto p-2">
                {!searchQuery && (
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    All Currencies
                  </div>
                )}
                <div className="space-y-1">
                  {filteredCurrencies.length > 0 ? (
                    filteredCurrencies.map((code) => {
                      const currency = CURRENCIES[code];
                      const isSelected = value === code;
                      const isPopular = POPULAR_CURRENCIES.includes(code);

                      // Skip popular currencies in "All" section if not searching
                      if (!searchQuery && isPopular) return null;

                      return (
                        <button
                          key={code}
                          onClick={() => handleSelect(code)}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                            isSelected
                              ? 'bg-emerald-950/30 text-emerald-400'
                              : 'text-zinc-300 hover:bg-zinc-800'
                          }`}
                        >
                          <span className="text-lg">{currency.flag}</span>
                          <span className="font-medium">{currency.symbol}</span>
                          <span className="flex-1 text-sm">{currency.name}</span>
                          <span className="text-xs text-zinc-500">{currency.code}</span>
                          {isSelected && <Check className="h-4 w-4 text-emerald-400" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-8 text-center text-sm text-zinc-500">
                      No currencies found
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
