# Currency Implementation Guide

## 🚀 Quick Start

### 1. Import Components
```tsx
import { CurrencyInput } from '@/components/ui/currency-input';
import { CurrencySelect } from '@/components/ui/currency-select';
import { formatCurrencyAmount } from '@/lib/currency/currencies';
```

### 2. Replace Dollar-Only Inputs

**Before (USD Only):**
```tsx
<Input
  type="number"
  value={amount}
  onChange={(e) => setAmount(Number(e.target.value))}
  placeholder="Enter amount in USD"
/>
<span>${amount}</span>
```

**After (Multi-Currency):**
```tsx
<CurrencyInput
  value={amount}
  currency={currency}
  onValueChange={setAmount}
  onCurrencyChange={setCurrency}
  label="Amount"
/>
<span>{formatCurrencyAmount(amount, currency)}</span>
```

### 3. Update State Management
```tsx
// Add currency state
const [currency, setCurrency] = useState('USD');

// Or use global context
const { currency, setCurrency } = useCurrency();
```

---

## 📝 Component Examples

### Basic Currency Input
```tsx
function PriceForm() {
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('USD');

  return (
    <CurrencyInput
      value={amount}
      currency={currency}
      onValueChange={setAmount}
      onCurrencyChange={setCurrency}
      label="Monthly Spend"
      placeholder="0.00"
    />
  );
}
```

### Currency Selector Only
```tsx
function CurrencyPicker() {
  const [currency, setCurrency] = useState('USD');

  return (
    <div>
      <label>Select Currency</label>
      <CurrencySelect
        value={currency}
        onChange={setCurrency}
      />
    </div>
  );
}
```

### Display Formatted Price
```tsx
function PriceDisplay({ amount, currency }) {
  return (
    <div className="text-2xl font-bold">
      {formatCurrencyAmount(amount, currency)}
    </div>
  );
}
```

---

## 🔄 Migration Checklist

### Step 1: Find All Price Inputs
Search for:
- `type="number"` with dollar amounts
- `$` hardcoded in JSX
- `formatCurrency` calls
- Price-related form fields

### Step 2: Add Currency State
```tsx
// Add to component state
const [currency, setCurrency] = useState('USD');

// Or use context
const { currency } = useCurrency();
```

### Step 3: Replace Inputs
```tsx
// Replace this:
<Input type="number" value={price} onChange={...} />

// With this:
<CurrencyInput
  value={price}
  currency={currency}
  onValueChange={setPrice}
  onCurrencyChange={setCurrency}
/>
```

### Step 4: Update Display
```tsx
// Replace this:
<span>${price}</span>

// With this:
<span>{formatCurrencyAmount(price, currency)}</span>
```

### Step 5: Update Data Storage
```tsx
// Store currency with amount
const data = {
  amount: price,
  currency: currency,
};
```

---

## 🎯 Common Patterns

### Pattern 1: Form with Multiple Prices
```tsx
function ToolForm() {
  const [currency, setCurrency] = useState('USD');
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [setupFee, setSetupFee] = useState(0);

  return (
    <>
      {/* Currency selector at top */}
      <CurrencySelect value={currency} onChange={setCurrency} />
      
      {/* All prices use same currency */}
      <CurrencyInput
        value={monthlyPrice}
        currency={currency}
        onValueChange={setMonthlyPrice}
        onCurrencyChange={setCurrency}
        label="Monthly Price"
      />
      
      <CurrencyInput
        value={setupFee}
        currency={currency}
        onValueChange={setSetupFee}
        onCurrencyChange={setCurrency}
        label="Setup Fee"
      />
    </>
  );
}
```

### Pattern 2: Display with Conversion
```tsx
function PriceComparison({ amount, fromCurrency, toCurrency }) {
  const converted = convertCurrency(amount, fromCurrency, toCurrency);
  
  return (
    <div>
      <div>{formatCurrencyAmount(amount, fromCurrency)}</div>
      <div className="text-sm text-zinc-400">
        ≈ {formatCurrencyAmount(converted, toCurrency)}
      </div>
    </div>
  );
}
```

### Pattern 3: Global Currency Preference
```tsx
// In root layout
import { CurrencyProvider } from '@/contexts/currency-context';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}

// In any component
import { useCurrency } from '@/contexts/currency-context';

function MyComponent() {
  const { currency, setCurrency } = useCurrency();
  // Use global currency
}
```

---

## ⚠️ Important Notes

### 1. Always Store Currency
```tsx
// ❌ Bad: Only store amount
{ amount: 1000 }

// ✅ Good: Store amount + currency
{ amount: 1000, currency: 'INR' }
```

### 2. Use Conversion for Comparisons
```tsx
// ❌ Bad: Compare different currencies directly
if (priceA > priceB) // Wrong if different currencies!

// ✅ Good: Convert to same currency first
const priceAinUSD = convertCurrency(priceA, currencyA, 'USD');
const priceBinUSD = convertCurrency(priceB, currencyB, 'USD');
if (priceAinUSD > priceBinUSD) // Correct!
```

### 3. Format for Display
```tsx
// ❌ Bad: Hardcode symbol
<span>${amount}</span>

// ✅ Good: Use formatter
<span>{formatCurrencyAmount(amount, currency)}</span>
```

---

## 🧪 Testing

### Test Currency Selection
```tsx
// Test all currencies are selectable
CURRENCIES.forEach(currency => {
  render(<CurrencySelect value={currency} onChange={...} />);
  // Verify it renders
});
```

### Test Conversion
```tsx
// Test conversion accuracy
const result = convertCurrency(100, 'USD', 'EUR');
expect(result).toBeCloseTo(92, 1); // ~92 EUR
```

### Test Formatting
```tsx
// Test formatting
expect(formatCurrencyAmount(1000, 'INR')).toBe('₹1,000');
expect(formatCurrencyAmount(1000, 'USD')).toBe('$1,000');
```

---

## 📚 API Reference

### CurrencyInput Props
```typescript
interface CurrencyInputProps {
  value: number;              // Amount value
  currency: string;           // Currency code (e.g., 'USD')
  onValueChange: (n) => void; // Amount change handler
  onCurrencyChange: (s) => void; // Currency change handler
  placeholder?: string;       // Input placeholder
  disabled?: boolean;         // Disable input
  className?: string;         // Additional classes
  label?: string;             // Input label
  error?: string;             // Error message
}
```

### CurrencySelect Props
```typescript
interface CurrencySelectProps {
  value: string;              // Selected currency code
  onChange: (s) => void;      // Change handler
  className?: string;         // Additional classes
  disabled?: boolean;         // Disable selector
}
```

### Utility Functions
```typescript
// Convert between currencies
convertCurrency(amount: number, from: string, to: string): number

// Format with symbol
formatCurrencyAmount(amount: number, code: string, options?: {
  showSymbol?: boolean;  // Show currency symbol (default: true)
  showCode?: boolean;    // Show currency code (default: false)
  decimals?: number;     // Decimal places (default: 2)
}): string

// Get currency info
getCurrency(code: string): Currency | undefined

// Validate currency code
isValidCurrency(code: string): boolean

// Get default based on locale
getDefaultCurrency(): string
```

---

## ✅ Checklist

Before deploying:

- [ ] All price inputs use CurrencyInput
- [ ] All price displays use formatCurrencyAmount
- [ ] Currency stored with amounts in database
- [ ] Conversions use convertCurrency function
- [ ] Global currency context set up (optional)
- [ ] Exchange rates are current
- [ ] Tested with multiple currencies
- [ ] Mobile responsive
- [ ] Keyboard navigation works
- [ ] Build passes

---

## 🎉 You're Done!

Your app now supports 21 global currencies! 🌍

**Next Steps:**
1. Test with different currencies
2. Update exchange rates periodically
3. Consider adding more currencies
4. Integrate with live rate API (future)

**Questions?** Check `MULTI_CURRENCY_SUPPORT.md` for full documentation.
