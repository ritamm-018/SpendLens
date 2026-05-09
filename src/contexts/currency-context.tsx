'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getDefaultCurrency, isValidCurrency } from '@/lib/currency/currencies';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<string>('USD');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize currency from localStorage or browser locale
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('preferred-currency');
    
    if (stored && isValidCurrency(stored)) {
      setCurrencyState(stored);
    } else {
      const defaultCurrency = getDefaultCurrency();
      setCurrencyState(defaultCurrency);
    }

    setIsInitialized(true);
  }, []);

  // Save to localStorage when currency changes
  const setCurrency = (newCurrency: string) => {
    if (!isValidCurrency(newCurrency)) {
      console.warn(`Invalid currency: ${newCurrency}`);
      return;
    }

    setCurrencyState(newCurrency);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-currency', newCurrency);
    }
  };

  // Don't render until initialized to avoid hydration mismatch
  if (!isInitialized) {
    return null;
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  
  return context;
}
