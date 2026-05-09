'use client';

import { CurrencySelect } from './currency-select';
import { CURRENCIES } from '@/lib/currency/currencies';

interface CurrencyInputProps {
  value: number;
  currency: string;
  onValueChange: (value: number) => void;
  onCurrencyChange: (currency: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

export function CurrencyInput({
  value,
  currency,
  onValueChange,
  onCurrencyChange,
  placeholder = '0.00',
  disabled = false,
  className = '',
  label,
  error,
}: CurrencyInputProps) {
  const selectedCurrency = CURRENCIES[currency];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty string
    if (inputValue === '') {
      onValueChange(0);
      return;
    }

    // Parse as float
    const numValue = parseFloat(inputValue);
    
    // Only update if valid number
    if (!isNaN(numValue) && numValue >= 0) {
      onValueChange(numValue);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}
      
      <div className="flex gap-2">
        {/* Currency Selector - Very high z-index to appear above all other elements */}
        <div className="relative z-[9999]">
          <CurrencySelect
            value={currency}
            onChange={onCurrencyChange}
            disabled={disabled}
            className="flex-shrink-0"
          />
        </div>

        {/* Amount Input */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            {selectedCurrency?.symbol}
          </span>
          <input
            type="number"
            value={value || ''}
            onChange={handleAmountChange}
            placeholder={placeholder}
            disabled={disabled}
            min="0"
            step="0.01"
            className={`w-full rounded-lg border bg-zinc-900 py-2 pl-8 pr-4 text-sm text-zinc-50 placeholder-zinc-500 transition-all focus:outline-none focus:ring-2 ${
              error
                ? 'border-rose-800 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-zinc-800 hover:border-zinc-700 focus:border-emerald-500 focus:ring-emerald-500/20'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          />
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-rose-400">{error}</p>
      )}
    </div>
  );
}
