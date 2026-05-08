# Contributing to SpendLens

Thank you for your interest in contributing to SpendLens! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, constructive, and professional. We're all here to build something great.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, browser, Node version)

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue with:
   - Clear use case
   - Expected behavior
   - Why it would be valuable
   - Potential implementation approach

### Submitting Code

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/spendlens.git
   cd spendlens
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the code style (see below)
   - Add tests for new features
   - Update documentation if needed

4. **Test your changes**
   ```bash
   npm run lint
   npm test
   npm run build
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Wait for review

## Development Setup

### Prerequisites

- Node.js 20+
- npm or yarn
- Git

### Installation

```bash
# Clone your fork
git clone https://github.com/yourusername/spendlens.git
cd spendlens

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Project Structure

```
spendlens/
├── src/
│   ├── app/              # Next.js pages and API routes
│   ├── components/       # React components
│   └── lib/              # Business logic and utilities
├── docs/                 # Documentation
├── tests/                # Test files
└── public/               # Static assets
```

## Code Style

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types
- Define interfaces for complex objects
- Use type inference where possible

```typescript
// Good
interface User {
  id: string;
  email: string;
}

function getUser(id: string): User {
  // ...
}

// Bad
function getUser(id: any): any {
  // ...
}
```

### React Components

- Use functional components
- Use hooks for state management
- Keep components small and focused
- Extract reusable logic into custom hooks

```typescript
// Good
export function Button({ children, onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

// Bad
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.children}</button>;
}
```

### Naming Conventions

- **Components**: PascalCase (`Button`, `AuditForm`)
- **Functions**: camelCase (`formatCurrency`, `runAudit`)
- **Constants**: UPPER_SNAKE_CASE (`PRICING_DATA`, `API_URL`)
- **Files**: kebab-case (`audit-form.tsx`, `pricing-data.ts`)

### File Organization

- One component per file
- Co-locate related files
- Use index files for public exports

```
components/
├── audit/
│   ├── audit-form.tsx
│   ├── tool-input.tsx
│   └── index.ts
```

## Testing

### Writing Tests

- Test business logic thoroughly
- Test edge cases
- Use descriptive test names
- Keep tests focused and simple

```typescript
describe('Audit Engine', () => {
  it('should identify excess seats', () => {
    const input = { /* ... */ };
    const result = runAudit(input);
    expect(result.toolResults[0].recommendations).toContainEqual(
      expect.objectContaining({ type: 'optimize-seats' })
    );
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Documentation

### Code Comments

- Comment "why" not "what"
- Use JSDoc for public APIs
- Keep comments up to date

```typescript
/**
 * Calculate potential savings from excess seats
 * 
 * @param seats - Current number of seats
 * @param teamSize - Actual team size
 * @param pricePerSeat - Monthly price per seat
 * @returns Monthly savings amount
 */
function calculateExcessSeatSavings(
  seats: number,
  teamSize: number,
  pricePerSeat: number
): number {
  // Only count seats above team size
  const excessSeats = Math.max(0, seats - teamSize);
  return excessSeats * pricePerSeat;
}
```

### Documentation Files

- Update README.md for user-facing changes
- Update ARCHITECTURE.md for architectural changes
- Add examples for new features

## Pull Request Guidelines

### PR Title

Use conventional commit format:
- `feat: add support for Perplexity`
- `fix: correct pricing for Claude Max`
- `docs: update deployment guide`

### PR Description

Include:
- What changed
- Why it changed
- How to test it
- Screenshots (if UI changes)
- Breaking changes (if any)

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] All tests pass
- [ ] Build succeeds
- [ ] No console errors
- [ ] Reviewed own code

## Review Process

1. **Automated Checks**
   - Linting
   - Type checking
   - Tests
   - Build

2. **Code Review**
   - Maintainer reviews code
   - Provides feedback
   - Requests changes if needed

3. **Merge**
   - Once approved, PR is merged
   - Deployed automatically to preview
   - Promoted to production after testing

## Areas for Contribution

### High Priority

- [ ] Supabase integration
- [ ] Resend email integration
- [ ] AI summary generation
- [ ] Dynamic OG image generation
- [ ] E2E tests with Playwright

### Medium Priority

- [ ] More tools (Perplexity, Replit, Codeium)
- [ ] Historical tracking
- [ ] Team collaboration features
- [ ] Analytics dashboard
- [ ] Performance optimizations

### Low Priority

- [ ] White-label option
- [ ] API access
- [ ] Budget forecasting
- [ ] Billing integrations

## Questions?

- Open an issue for questions
- Tag maintainers for urgent matters
- Check existing issues and PRs first

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to SpendLens! 🚀
