---
description: Enforce code quality, type safety, dependency hygiene, and innovation practices
globs:
alwaysApply: true
---

# Code Quality, Stability & Innovation

"Every line of code must be strongly typed, testable, maintainable, and built on the latest stable dependencies. Technical debt is a conscious choice, not an accident. Innovation happens through disciplined iteration, not shortcuts."

---

## Core Principles

- **Type Safety First**: Strong typing is non-negotiable. The type system is documentation, validation, and refactoring safety.
- **Dependency Hygiene**: Always use latest stable versions. Dependencies are liabilities—keep them fresh, minimal, and auditable.
- **Testability by Design**: Code that's hard to test is code that's hard to maintain. Design for testability from the start.
- **Progressive Enhancement**: Innovation happens incrementally. Ship small, iterate fast, measure impact.
- **Explicit Over Implicit**: Magic is for libraries, not application code. Be explicit about behavior, dependencies, and side effects.

---

## Type Safety Rules

### Rule: No `any` Type

**Policy**: The `any` type is **forbidden** in application code. Every value must have an explicit, meaningful type.

**Exceptions** (require explicit justification):

1. **Third-party library gaps**: When a library lacks proper types, create a typed wrapper
2. **Gradual migration**: When refactoring legacy code, use `unknown` instead of `any` and narrow progressively
3. **Dynamic external data**: When dealing with truly dynamic external data, use `unknown` and validate with type guards

### ✅ Good: Explicit Types

```typescript
// Domain entity with full typing
interface Portfolio {
  id: string;
  userId: string;
  totalValue: number;
  currency: 'EUR' | 'USD' | 'GBP';
  assets: Asset[];
  lastUpdated: Date;
}

// Type-safe API response
interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    version: string;
  };
  errors?: ApiError[];
}

// Type guard for runtime validation
function isPortfolio(value: unknown): value is Portfolio {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'userId' in value &&
    'totalValue' in value &&
    typeof (value as Portfolio).totalValue === 'number'
  );
}

// Using unknown with type narrowing
async function fetchPortfolio(id: string): Promise<Portfolio> {
  const response: unknown = await fetch(`/api/portfolio/${id}`);

  if (!isPortfolio(response)) {
    throw new Error('Invalid portfolio data');
  }

  return response;
}
```

### ❌ Forbidden: Using `any`

```typescript
// NEVER do this
function processData(data: any) {
  return data.value.map((item: any) => item.id);
}

// NEVER do this
const config: any = loadConfig();

// NEVER do this
function handleEvent(event: any) {
  console.log(event.target.value);
}
```

### Handling Third-Party Library Gaps

```typescript
// ✅ Good: Create typed wrapper for untyped library
import { untypedLibrary } from 'some-untyped-lib';

interface LibraryConfig {
  apiKey: string;
  endpoint: string;
  timeout: number;
}

interface LibraryResponse {
  status: 'success' | 'error';
  data: unknown;
}

class TypedLibraryWrapper {
  private client: typeof untypedLibrary;

  constructor(config: LibraryConfig) {
    this.client = untypedLibrary.init(config);
  }

  async fetch<T>(path: string): Promise<T> {
    const response = (await this.client.get(path)) as LibraryResponse;

    if (response.status !== 'success') {
      throw new Error('Library request failed');
    }

    return response.data as T;
  }
}
```

### TypeScript Configuration Enforcement

**Required `tsconfig.json` settings** (already configured in your project):

```json
{
  "compilerOptions": {
    "strict": true, // Enable all strict checks
    "noUncheckedIndexedAccess": true, // Array/object access returns T | undefined
    "noImplicitOverride": true, // Require explicit override keyword
    "noFallthroughCasesInSwitch": true, // Prevent switch fallthrough bugs
    "noImplicitReturns": true, // All code paths must return
    "noUnusedLocals": true, // Flag unused variables
    "noUnusedParameters": true, // Flag unused parameters
    "exactOptionalPropertyTypes": true, // Distinguish undefined from missing
    "noPropertyAccessFromIndexSignature": true // Use bracket notation for dynamic access
  }
}
```

---

## Dependency Management Rules

### Rule: Always Use Latest Stable Versions

**Policy**: Dependencies must be kept up-to-date. Outdated dependencies are security risks and technical debt.

### Installation Process

**✅ Correct: Use package manager to install latest**

```bash
# Install latest version of a package
bun add package-name

# Install latest version of a dev dependency
bun add -d package-name

# Update all dependencies to latest
bun update

# Update specific package to latest
bun update package-name
```

**❌ Forbidden: Manual version specification without justification**

```bash
# Don't do this unless you have a specific compatibility reason
bun add package-name@1.2.3
```

### Dependency Audit Workflow

**Before adding a new dependency**:

1. **Check if it's necessary**: Can you solve this with existing dependencies or standard library?
2. **Evaluate maintenance**: Is the package actively maintained? Check last commit date, open issues, release frequency
3. **Check bundle size**: Will this significantly increase bundle size? Use `bundlephobia.com`
4. **Review license**: Is the license compatible with your project?
5. **Check types**: Does it have TypeScript types? Either built-in or via `@types/*`

**Monthly dependency maintenance**:

```bash
# Check for outdated packages
bun outdated

# Update all dependencies
bun update

# Run tests after updates
bun test

# Check for security vulnerabilities
bun audit
```

### Version Pinning Exceptions

**When to pin versions** (use exact versions in `package.json`):

1. **Known breaking changes**: A package has announced breaking changes in latest version
2. **Platform constraints**: Specific platform (React Native, Next.js) requires specific version
3. **Peer dependency conflicts**: Multiple packages require incompatible versions

**Document the reason**:

```json
{
  "dependencies": {
    // Pinned to 1.2.3 due to breaking change in 1.3.0 that affects our auth flow
    // TODO: Migrate to 1.3.0 - see issue #123
    "auth-library": "1.2.3"
  }
}
```

### Dependency Hygiene Checklist

✅ All dependencies are at latest stable version (unless explicitly documented)
✅ No unused dependencies (use `knip` to detect)
✅ No duplicate dependencies with different versions
✅ All `@types/*` packages match their corresponding library versions
✅ `package.json` and lock file are in sync
✅ Security audit passes with no high/critical vulnerabilities

---

## Production Readiness (must)

- Performance: respect budgets (API p95 latency per service; bundle-size budgets per app); eliminate N+1; cache with clear TTL/invalidations.
- Security: no secrets in code; env vars only; validate inputs at boundaries; redact PII in logs; minimal surface permissions.
- Observability: structured logging with correlation/trace ids; emit latency/error metrics; provide health/readiness probes.
- Flags/config: risky or user-facing changes ship behind feature flags or config switches with safe defaults and rollback.

## Logging Policy

- Use approved logging utilities; **never** `console.log` in production paths.
- Include context (request id, user/tenant when allowed) without logging secrets/PII; prefer field-level redaction.
- Choose levels intentionally (info/warn/error); avoid noisy debug logs in production; sample if high volume.

## Code Quality Standards

### File Size Limits (from `code-organization.mdc`)

- **Components**: Max 150 lines
- **Services/Use Cases**: Max 200 lines
- **Utilities/Helpers**: Max 100 lines
- **Any file >250 lines**: Must be split immediately

### Naming Conventions

**Files & Directories**:

- Components: `PascalCase.tsx` (e.g., `PortfolioCard.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `usePortfolioData.ts`)
- Utilities: `kebab-case.ts` (e.g., `format-currency.ts`)
- Types: `PascalCase.ts` or `types.ts` (e.g., `Portfolio.ts` or `types.ts`)
- Constants: `UPPER_SNAKE_CASE.ts` (e.g., `API_ENDPOINTS.ts`)

**Variables & Functions**:

- Variables: `camelCase` (e.g., `portfolioValue`)
- Functions: `camelCase` (e.g., `calculateTotalValue`)
- Classes: `PascalCase` (e.g., `PortfolioService`)
- Interfaces/Types: `PascalCase` (e.g., `Portfolio`, `ApiResponse`)
- Enums: `PascalCase` with `UPPER_SNAKE_CASE` members (e.g., `Currency.EUR`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_ATTEMPTS`)

### Error Handling

**✅ Good: Explicit error types and handling**

```typescript
// Define specific error types
class PortfolioNotFoundError extends Error {
  constructor(portfolioId: string) {
    super(`Portfolio not found: ${portfolioId}`);
    this.name = 'PortfolioNotFoundError';
  }
}

class InsufficientDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InsufficientDataError';
  }
}

// Use discriminated unions for results
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Explicit error handling
async function getPortfolio(id: string): Promise<Result<Portfolio>> {
  try {
    const portfolio = await db.portfolio.findUnique({ where: { id } });

    if (!portfolio) {
      return {
        success: false,
        error: new PortfolioNotFoundError(id),
      };
    }

    return { success: true, data: portfolio };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}
```

**❌ Forbidden: Silent failures and generic error handling**

```typescript
// NEVER do this
try {
  await doSomething();
} catch (e) {
  console.log(e); // Silent failure
}

// NEVER do this
function processData(data: any) {
  try {
    return data.value.map((item) => item.id);
  } catch {
    return []; // Hiding errors
  }
}
```

### Null Safety

**✅ Good: Explicit null/undefined handling**

```typescript
// Use optional chaining and nullish coalescing
const userName = user?.profile?.name ?? 'Anonymous';

// Use type guards
function processUser(user: User | null) {
  if (!user) {
    throw new Error('User is required');
  }

  // user is now guaranteed to be User
  return user.name;
}

// Use discriminated unions
type LoadingState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

---

## Testing Requirements

### Test Coverage Standards

**Minimum coverage** (enforced by CI):

- **Domain logic**: 90% coverage
- **Application services**: 80% coverage
- **UI components**: 70% coverage
- **Utilities**: 95% coverage

### Test Structure

```typescript
// ✅ Good: Comprehensive test structure
describe('PortfolioService', () => {
  describe('calculateTotalValue', () => {
    it('should sum all asset values correctly', () => {
      // Arrange
      const portfolio = createTestPortfolio({
        assets: [{ value: 1000 }, { value: 2000 }, { value: 3000 }],
      });

      // Act
      const total = portfolioService.calculateTotalValue(portfolio);

      // Assert
      expect(total).toBe(6000);
    });

    it('should handle empty portfolio', () => {
      const portfolio = createTestPortfolio({ assets: [] });
      const total = portfolioService.calculateTotalValue(portfolio);
      expect(total).toBe(0);
    });

    it('should throw error for invalid asset values', () => {
      const portfolio = createTestPortfolio({
        assets: [{ value: -1000 }],
      });

      expect(() => portfolioService.calculateTotalValue(portfolio)).toThrow(
        InvalidAssetValueError
      );
    });
  });
});
```

### Test Naming Convention

```typescript
// Pattern: should [expected behavior] when [condition]
it('should return user data when authentication succeeds');
it('should throw error when user not found');
it('should format currency with correct locale');

// For edge cases
it('should handle empty array gracefully');
it('should prevent division by zero');
it('should validate email format before submission');
```

---

### Minimum test expectations by layer

| Layer                   | Required tests                                                      |
| ----------------------- | ------------------------------------------------------------------- |
| Domain logic            | Unit + property-based where applicable; ≥90% coverage target        |
| Application/services    | Unit + integration against ports; error/idempotency cases           |
| Infrastructure/adapters | Contract/smoke tests against fakes; retries/timeouts covered        |
| UI components           | Rendering + accessibility states; interactions; loading/error/empty |
| Utilities               | Pure unit tests; edge cases and invalid inputs                      |

---

## Innovation & Iteration Practices

### Feature Flags for Progressive Rollout

**Use feature flags for**:

- New features in development
- A/B testing experiments
- Gradual rollouts to production
- Emergency kill switches

```typescript
// ✅ Good: Feature flag usage
import { featureFlags } from '@/lib/feature-flags'

export function PortfolioDashboard() {
  const showNewChart = featureFlags.isEnabled('new-portfolio-chart')

  return (
    <div>
      {showNewChart ? (
        <NewPortfolioChart />
      ) : (
        <LegacyPortfolioChart />
      )}
    </div>
  )
}
```

### Metrics & Observability

**Every feature must be measurable**:

```typescript
// ✅ Good: Track feature usage and performance
import { analytics } from '@/lib/analytics';

export async function generateRecommendations(userId: string) {
  const startTime = performance.now();

  try {
    const recommendations = await recommendationService.generate(userId);

    analytics.track('recommendations_generated', {
      userId,
      count: recommendations.length,
      duration: performance.now() - startTime,
    });

    return recommendations;
  } catch (error) {
    analytics.track('recommendations_error', {
      userId,
      error: error.message,
      duration: performance.now() - startTime,
    });

    throw error;
  }
}
```

### Documentation Requirements

**Every public API must have**:

1. **JSDoc comments** with description, parameters, return type, and examples
2. **Type definitions** (TypeScript interfaces/types)
3. **Usage examples** in code comments or separate docs
4. **Error cases** documented

````typescript
/**
 * Calculates the total value of a portfolio including all assets.
 *
 * @param portfolio - The portfolio to calculate value for
 * @param options - Optional calculation parameters
 * @returns The total portfolio value in the portfolio's currency
 *
 * @throws {InsufficientDataError} When portfolio has no assets
 * @throws {InvalidCurrencyError} When currency conversion fails
 *
 * @example
 * ```typescript
 * const portfolio = await getPortfolio('user-123')
 * const totalValue = calculatePortfolioValue(portfolio, {
 *   includePending: true
 * })
 * console.log(`Total: ${totalValue}`)
 * ```
 */
export function calculatePortfolioValue(
  portfolio: Portfolio,
  options?: CalculationOptions
): number {
  // Implementation
}
````

---

## Code Review Checklist

### Before Submitting PR

✅ All types are explicit (no `any`)
✅ All dependencies are latest stable versions
✅ Tests written and passing (meeting coverage requirements)
✅ No linter errors or warnings
✅ File sizes within limits (<250 lines)
✅ Code follows naming conventions
✅ Error handling is explicit and comprehensive
✅ Public APIs have JSDoc comments
✅ Feature flags used for new/experimental features
✅ Analytics/metrics added for measurable features
✅ No console.log or debugging code
✅ Sensitive data not logged or exposed

### Reviewer Responsibilities

✅ Verify type safety (no `any` usage)
✅ Check dependency versions and justification for pinning
✅ Ensure tests are meaningful (not just for coverage)
✅ Validate error handling covers edge cases
✅ Confirm code follows architectural patterns
✅ Check for potential performance issues
✅ Verify accessibility (for UI components)
✅ Ensure documentation is clear and accurate

---

## Automated Enforcement

### Pre-commit Hooks

```bash
# Type checking
bun run tsc --noEmit

# Linting
bun run lint

# Tests
bun test

# Dependency audit
bun audit
```

### CI/CD Pipeline

**Required checks** (must pass before merge):

1. TypeScript compilation (strict mode)
2. Linter (no errors, warnings allowed with justification)
3. Tests (minimum coverage thresholds)
4. Security audit (no high/critical vulnerabilities)
5. Bundle size check (no unexpected increases)
6. Dependency freshness check (flag outdated packages)

---

## Migration & Adoption

### For Existing Code

**Opportunistic refactoring**: When touching existing code, bring it up to standards

- Replace `any` with proper types
- Update outdated dependencies
- Add missing tests
- Split oversized files

**Dedicated cleanup sprints**: Schedule periodic cleanup tasks

- Dependency updates
- Type safety improvements
- Test coverage increases
- Documentation updates

### For New Code

**Zero tolerance**: All new code must meet these standards from day one

- No `any` types
- Latest dependencies
- Full test coverage
- Proper documentation

---

## Dev Heuristics

### Type Safety

✅ Is every value explicitly typed?
✅ Are type guards used for runtime validation?
✅ Are third-party library gaps wrapped with types?
✅ Does TypeScript compilation pass in strict mode?
❌ Am I about to use `any`? → Stop, define proper types
❌ Am I using `as` to force a type? → Validate with type guard instead

### Dependencies

✅ Is this dependency necessary?
✅ Is it at the latest stable version?
✅ Is it actively maintained?
✅ Does it have proper TypeScript types?
❌ Am I adding a dependency for a simple utility? → Write it yourself
❌ Am I pinning a version? → Document why

### Code Quality

✅ Is this file under size limits?
✅ Does this have a single, clear responsibility?
✅ Is error handling explicit and comprehensive?
✅ Are edge cases covered by tests?
✅ Is the code self-documenting or well-commented?
❌ Is this getting complex? → Break it down
❌ Am I repeating code? → Extract and reuse

### Innovation

✅ Is this feature behind a feature flag?
✅ Are metrics/analytics in place?
✅ Is there a rollback plan?
✅ Is the impact measurable?
❌ Am I building without validation? → Add measurement first
❌ Am I shipping without monitoring? → Add observability

---

## References

- See `code-organization.mdc` for architectural patterns and file organization
- See `backend.mdc` for hexagonal architecture and domain logic
- See `frontend.mdc` for component patterns and UI structure
- See `ai-agent.mdc` for AI-specific code quality standards
- See root `tsconfig.json` for TypeScript configuration baseline
