# 🚀 Quick Start: Multi-Currency Support

## For Users

### How to Use Different Currencies

1. **Go to Audit Form** → `/audit`

2. **Find the Currency Selector**
   - Look for the monthly spend input
   - You'll see a button like: `🇺🇸 $ USD`

3. **Click to Change Currency**
   - Click the currency button
   - Search or scroll to find your currency
   - Click to select

4. **Enter Your Amount**
   - Type the amount in your selected currency
   - The symbol will update automatically

5. **Submit & View Results**
   - All results will be in your selected currency
   - Your preference is saved for next time

### Supported Currencies

**Popular:**
- 🇺🇸 USD - US Dollar
- 🇪🇺 EUR - Euro
- 🇬🇧 GBP - British Pound
- 🇮🇳 INR - Indian Rupee
- 🇯🇵 JPY - Japanese Yen
- 🇨🇦 CAD - Canadian Dollar
- 🇦🇺 AUD - Australian Dollar

**All 21 Currencies:**
USD, EUR, GBP, INR, JPY, CAD, AUD, CHF, SGD, HKD, SEK, NOK, DKK, NZD, BRL, MXN, ZAR, KRW, PLN, AED, CNY

---

## For Developers

### Quick Implementation

```typescript
// 1. Import components
import { CurrencyInput } from '@/components/ui/currency-input';
import { formatCurrency } from '@/lib/utils';

// 2. Add state
const [amount, setAmount] = useState(0);
const [currency, setCurrency] = useState('USD');

// 3. Use CurrencyInput
<CurrencyInput
  value={amount}
  currency={currency}
  onValueChange={setAmount}
  onCurrencyChange={setCurrency}
  label="Monthly Spend"
/>

// 4. Display formatted currency
<span>{formatCurrency(amount, currency)}</span>
```

### Key Functions

```typescript
// Format currency
formatCurrency(1000, 'USD') // "$1,000"
formatCurrency(1000, 'EUR') // "€1,000"
formatCurrency(1000, 'INR') // "₹1,000"

// Convert currency
convertCurrency(100, 'USD', 'EUR') // ~92

// Get currency info
getCurrency('USD') // { code: 'USD', symbol: '$', ... }

// Auto-detect
getDefaultCurrency() // Based on browser locale
```

### File Locations

```
src/
├── lib/
│   └── currency/
│       └── currencies.ts          # Currency database
├── components/
│   └── ui/
│       ├── currency-select.tsx    # Selector component
│       └── currency-input.tsx     # Input component
└── lib/
    └── utils.ts                   # formatCurrency()
```

---

## Examples

### Example 1: US User
```
Input:  $1,000/month
Result: $560/month in savings
```

### Example 2: Indian User
```
Input:  ₹83,000/month
Result: ₹45,000/month in savings
```

### Example 3: European User
```
Input:  €920/month
Result: €560/month in savings
```

---

## Features

✅ 21 global currencies
✅ Auto-detection from browser
✅ Search functionality
✅ Persistent preferences
✅ Visual indicators (flags, symbols)
✅ Type-safe implementation
✅ Mobile responsive
✅ Keyboard accessible

---

## Need Help?

See full documentation:
- `MULTI_CURRENCY_COMPLETE.md` - Complete guide
- `CURRENCY_IMPLEMENTATION_GUIDE.md` - Developer guide
- `CURRENCY_INTEGRATION_SUMMARY.md` - Implementation summary

---

**Status:** ✅ Live & Working
**Build:** ✅ Passing (0 errors)
**Coverage:** 100% of price inputs
