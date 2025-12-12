---
trigger: always_on
description: Enforce strict type safety and dependency hygiene across the codebase
---

# Type Safety & Dependency Management

"Every line of code must be strongly typed, and every dependency must be fresh, minimal, and auditable. The type system is documentation, validation, and refactoring safety. Dependencies are liabilities—keep them current."

## Core Principles

- **Type Safety First**: Strong typing is non-negotiable. The type system is documentation, validation, and refactoring safety.
- **Dependency Hygiene**: Always use latest stable versions. Dependencies are liabilities—keep them fresh, minimal, and auditable.
- **Explicit Over Implicit**: Magic is for libraries, not application code. Be explicit about behavior, dependencies, and side effects.
- **Zero Tolerance**: No `any` types, no outdated dependencies without explicit justification.

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

### Error Handling with Types

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

## Automated Enforcement

### Pre-commit Hooks

```bash
# Type checking
bun run tsc --noEmit

# Dependency audit
bun audit
```

### CI/CD Pipeline

**Required checks** (must pass before merge):

1. TypeScript compilation (strict mode)
2. Security audit (no high/critical vulnerabilities)
3. Dependency freshness check (flag outdated packages)

---

## Migration & Adoption

### For Existing Code

**Opportunistic refactoring**: When touching existing code, bring it up to standards

- Replace `any` with proper types
- Update outdated dependencies
- Add type guards for external data

**Dedicated cleanup sprints**: Schedule periodic cleanup tasks

- Dependency updates
- Type safety improvements
- Wrapper creation for untyped libraries

### For New Code

**Zero tolerance**: All new code must meet these standards from day one

- No `any` types
- Latest dependencies
- Explicit type guards

---

## Dev Heuristics

### Type Safety

✅ Is every value explicitly typed?
✅ Are type guards used for runtime validation?
✅ Are third-party library gaps wrapped with types?
✅ Does TypeScript compilation pass in strict mode?
✅ Are discriminated unions used for complex states?
✅ Is null/undefined handling explicit and safe?
❌ Am I about to use `any`? → Stop, define proper types
❌ Am I using `as` to force a type? → Validate with type guard instead
❌ Am I ignoring a type error? → Fix the root cause, don't bypass

### Dependencies

✅ Is this dependency necessary?
✅ Is it at the latest stable version?
✅ Is it actively maintained?
✅ Does it have proper TypeScript types?
✅ Will it significantly increase bundle size?
✅ Is the license compatible?
❌ Am I adding a dependency for a simple utility? → Write it yourself
❌ Am I pinning a version? → Document why
❌ Am I installing without checking alternatives? → Research first

---

## References

- See `code-quality-practices.md` for testing, code review, and innovation practices
- See `code-splitting.md` for file size limits and splitting strategies
- See `package-architecture.md` for dependency flow rules
- See root `tsconfig.json` for TypeScript configuration baseline

