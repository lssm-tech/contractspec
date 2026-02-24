---
targets:
  - '*'
root: false
description: 'Enforce code quality standards, testing requirements, and innovation practices'
globs:
  - '**/*'
cursor:
  alwaysApply: true
  description: 'Enforce code quality standards, testing requirements, and innovation practices'
  globs:
    - '**/*'
---

# Code Quality Practices & Standards

"Code that's hard to test is code that's hard to maintain. Innovation happens through disciplined iteration, not shortcuts. Every feature must be measurable, every change must be reversible."

## Core Principles

- **Testability by Design**: Code that's hard to test is code that's hard to maintain. Design for testability from the start.
- **Progressive Enhancement**: Innovation happens incrementally. Ship small, iterate fast, measure impact.
- **Quality as Process**: Code reviews, automated checks, and continuous improvement are non-negotiable.
- **Conscious Debt**: Technical debt is a conscious choice, not an accident. Make it explicit and track it.

---

## Production Readiness (must)

- **Performance**: respect budgets (API p95 latency per service; bundle-size budgets per app); eliminate N+1; cache with clear TTL/invalidations.
- **Security**: no secrets in code; env vars only; validate inputs at boundaries; redact PII in logs; minimal surface permissions.
- **Observability**: structured logging with correlation/trace ids; emit latency/error metrics; provide health/readiness probes.
- **Flags/config**: risky or user-facing changes ship behind feature flags or config switches with safe defaults and rollback.

---

## Logging Policy

- Use approved logging utilities; **never** `console.log` in production paths.
- Include context (request id, user/tenant when allowed) without logging secrets/PII; prefer field-level redaction.
- Choose levels intentionally (info/warn/error); avoid noisy debug logs in production; sample if high volume.

---

## Code Quality Standards

### File Size Limits

- **Components**: Max 150 lines
- **Services/Use Cases**: Max 200 lines
- **Utilities/Helpers**: Max 100 lines
- **Any file >250 lines**: Must be split immediately

See `code-splitting.md` for detailed splitting strategies.

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

### Minimum Test Expectations by Layer

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
# Linting
bun run lint

# Tests
bun test

# Type checking
bun run tsc --noEmit
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

- Add missing tests
- Split oversized files
- Add JSDoc comments
- Add feature flags for risky changes

**Dedicated cleanup sprints**: Schedule periodic cleanup tasks

- Test coverage increases
- Documentation updates
- Performance optimization
- Accessibility improvements

### For New Code

**Zero tolerance**: All new code must meet these standards from day one

- Full test coverage
- Proper documentation
- Feature flags where appropriate
- Metrics and observability

---

## Dev Heuristics

### Code Quality

✅ Is this file under size limits?
✅ Does this have a single, clear responsibility?
✅ Is error handling explicit and comprehensive?
✅ Are edge cases covered by tests?
✅ Is the code self-documenting or well-commented?
✅ Does this follow naming conventions?
✅ Is performance within budget?
✅ Are there no `console.log` statements?
❌ Is this getting complex? → Break it down
❌ Am I repeating code? → Extract and reuse
❌ Am I skipping tests? → Write them now, not later
❌ Is this hard to test? → Refactor for testability

### Testing

✅ Do tests cover happy paths?
✅ Do tests cover edge cases and errors?
✅ Are tests readable and maintainable?
✅ Do tests use arrange-act-assert pattern?
✅ Are test names descriptive?
✅ Do tests avoid implementation details?
✅ Does coverage meet minimum thresholds?
❌ Am I testing implementation instead of behavior? → Focus on outcomes
❌ Are tests brittle and breaking often? → Refactor tests
❌ Am I skipping error cases? → Add negative tests

### Innovation

✅ Is this feature behind a feature flag?
✅ Are metrics/analytics in place?
✅ Is there a rollback plan?
✅ Is the impact measurable?
✅ Are performance implications understood?
✅ Is this shipped incrementally?
✅ Is user feedback captured?
❌ Am I building without validation? → Add measurement first
❌ Am I shipping without monitoring? → Add observability
❌ Am I building a big-bang feature? → Break it down

---

## Tooling

- **Health audit**: Run `/audit-health` for a holistic scan of file sizes, layer compliance, reusability, and observability coverage.
- **Observability audit**: Run `/audit-observability` for a focused scan of logging, analytics, and error tracking gaps.
- **Fix**: Run `/fix` to auto-fix console.log, unused imports, and formatting issues.
- **Extract**: Use the `extract-to-bundle` skill to move misplaced logic to the correct architectural layer.
- **Create**: Use the `create-feature` skill to scaffold new features with logging, analytics, and tests from day one.
- **Subagent**: The `code-health-auditor` subagent powers both audit commands and can be invoked for targeted analysis.
- **Plan review**: Run `/review-plan` before building to catch gaps from 6 expert perspectives (GTM, product, engineering, security, design, data).
- **Session retro**: Run `/audit-session` after a coding session to detect agentpacks governance gaps.

## References

- See `type-safety-dependencies.md` for type safety and dependency management
- See `code-splitting.md` for file size limits and splitting strategies
- See `package-architecture.md` for dependency flow and component hierarchy
- See `backend.md` for hexagonal architecture and domain logic
- See `frontend.md` for component patterns and UI structure
- See `observability.md` for structured logging and tracing standards
- See `posthog-integration.md` for analytics event naming and feature flag conventions
