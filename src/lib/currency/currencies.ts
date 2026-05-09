/**
 * Comprehensive currency support for global users
 */

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  flag: string;
  exchangeRate: number; // Rate to USD (base currency)
}

export const CURRENCIES: Record<string, Currency> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    flag: '🇺🇸',
    exchangeRate: 1.0,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'de-DE',
    flag: '🇪🇺',
    exchangeRate: 0.92, // 1 USD = 0.92 EUR (approximate)
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
    flag: '🇬🇧',
    exchangeRate: 0.79, // 1 USD = 0.79 GBP (approximate)
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    locale: 'en-IN',
    flag: '🇮🇳',
    exchangeRate: 83.12, // 1 USD = 83.12 INR (approximate)
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    locale: 'ja-JP',
    flag: '🇯🇵',
    exchangeRate: 149.50, // 1 USD = 149.50 JPY (approximate)
  },
  CNY: {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    locale: 'zh-CN',
    flag: '🇨🇳',
    exchangeRate: 7.24, // 1 USD = 7.24 CNY (approximate)
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    locale: 'en-CA',
    flag: '🇨🇦',
    exchangeRate: 1.36, // 1 USD = 1.36 CAD (approximate)
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    locale: 'en-AU',
    flag: '🇦🇺',
    exchangeRate: 1.53, // 1 USD = 1.53 AUD (approximate)
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Swiss Franc',
    locale: 'de-CH',
    flag: '🇨🇭',
    exchangeRate: 0.88, // 1 USD = 0.88 CHF (approximate)
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    locale: 'en-SG',
    flag: '🇸🇬',
    exchangeRate: 1.34, // 1 USD = 1.34 SGD (approximate)
  },
  HKD: {
    code: 'HKD',
    symbol: 'HK$',
    name: 'Hong Kong Dollar',
    locale: 'zh-HK',
    flag: '🇭🇰',
    exchangeRate: 7.83, // 1 USD = 7.83 HKD (approximate)
  },
  SEK: {
    code: 'SEK',
    symbol: 'kr',
    name: 'Swedish Krona',
    locale: 'sv-SE',
    flag: '🇸🇪',
    exchangeRate: 10.87, // 1 USD = 10.87 SEK (approximate)
  },
  NOK: {
    code: 'NOK',
    symbol: 'kr',
    name: 'Norwegian Krone',
    locale: 'nb-NO',
    flag: '🇳🇴',
    exchangeRate: 10.78, // 1 USD = 10.78 NOK (approximate)
  },
  DKK: {
    code: 'DKK',
    symbol: 'kr',
    name: 'Danish Krone',
    locale: 'da-DK',
    flag: '🇩🇰',
    exchangeRate: 6.87, // 1 USD = 6.87 DKK (approximate)
  },
  NZD: {
    code: 'NZD',
    symbol: 'NZ$',
    name: 'New Zealand Dollar',
    locale: 'en-NZ',
    flag: '🇳🇿',
    exchangeRate: 1.65, // 1 USD = 1.65 NZD (approximate)
  },
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    name: 'Brazilian Real',
    locale: 'pt-BR',
    flag: '🇧🇷',
    exchangeRate: 4.97, // 1 USD = 4.97 BRL (approximate)
  },
  MXN: {
    code: 'MXN',
    symbol: 'MX$',
    name: 'Mexican Peso',
    locale: 'es-MX',
    flag: '🇲🇽',
    exchangeRate: 17.12, // 1 USD = 17.12 MXN (approximate)
  },
  ZAR: {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    locale: 'en-ZA',
    flag: '🇿🇦',
    exchangeRate: 18.75, // 1 USD = 18.75 ZAR (approximate)
  },
  KRW: {
    code: 'KRW',
    symbol: '₩',
    name: 'South Korean Won',
    locale: 'ko-KR',
    flag: '🇰🇷',
    exchangeRate: 1320.50, // 1 USD = 1320.50 KRW (approximate)
  },
  PLN: {
    code: 'PLN',
    symbol: 'zł',
    name: 'Polish Zloty',
    locale: 'pl-PL',
    flag: '🇵🇱',
    exchangeRate: 4.02, // 1 USD = 4.02 PLN (approximate)
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham',
    locale: 'ar-AE',
    flag: '🇦🇪',
    exchangeRate: 3.67, // 1 USD = 3.67 AED (approximate)
  },
};

// Popular currencies for quick access
export const POPULAR_CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'];

// All currency codes sorted alphabetically
export const ALL_CURRENCY_CODES = Object.keys(CURRENCIES).sort();

/**
 * Convert amount from one currency to another
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  const from = CURRENCIES[fromCurrency];
  const to = CURRENCIES[toCurrency];

  if (!from || !to) {
    console.warn(`Currency not found: ${fromCurrency} or ${toCurrency}`);
    return amount;
  }

  // Convert to USD first, then to target currency
  const amountInUSD = amount / from.exchangeRate;
  const convertedAmount = amountInUSD * to.exchangeRate;

  return convertedAmount;
}

/**
 * Format currency amount with proper symbol and locale
 */
export function formatCurrencyAmount(
  amount: number,
  currencyCode: string,
  options?: {
    showSymbol?: boolean;
    showCode?: boolean;
    decimals?: number;
  }
): string {
  const currency = CURRENCIES[currencyCode];
  
  if (!currency) {
    return amount.toFixed(2);
  }

  const {
    showSymbol = true,
    showCode = false,
    decimals = 2,
  } = options || {};

  const formattedAmount = new Intl.NumberFormat(currency.locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  let result = '';
  
  if (showSymbol) {
    result = `${currency.symbol}${formattedAmount}`;
  } else {
    result = formattedAmount;
  }

  if (showCode) {
    result = `${result} ${currency.code}`;
  }

  return result;
}

/**
 * Get currency by code
 */
export function getCurrency(code: string): Currency | undefined {
  return CURRENCIES[code];
}

/**
 * Get default currency based on user's locale
 */
export function getDefaultCurrency(): string {
  if (typeof window === 'undefined') {
    return 'USD';
  }

  const locale = navigator.language || 'en-US';
  
  // Map common locales to currencies
  const localeMap: Record<string, string> = {
    'en-US': 'USD',
    'en-GB': 'GBP',
    'en-IN': 'INR',
    'en-CA': 'CAD',
    'en-AU': 'AUD',
    'de-DE': 'EUR',
    'fr-FR': 'EUR',
    'es-ES': 'EUR',
    'it-IT': 'EUR',
    'ja-JP': 'JPY',
    'zh-CN': 'CNY',
    'ko-KR': 'KRW',
    'pt-BR': 'BRL',
    'es-MX': 'MXN',
  };

  return localeMap[locale] || 'USD';
}

/**
 * Validate currency code
 */
export function isValidCurrency(code: string): boolean {
  return code in CURRENCIES;
}
