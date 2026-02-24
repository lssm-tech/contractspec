---
name: create-feature
description: 'Scaffold a new feature with all required files and structure'
targets: ['*']
claudecode:
  allowed-tools:
    - 'Bash'
    - 'Read'
    - 'Write'
    - 'Glob'
    - 'Grep'
---

# Create Feature Skill

This skill scaffolds a complete feature following ContractSpec architecture, including observability and analytics from day one.

## Usage

Invoke when user wants to create a new feature, module, or capability.

## Process

### Step 1: Gather Requirements

Ask for:

- Feature name (kebab-case)
- Feature domain (studio, lifecycle, integrations, evolution, etc.)
- Feature type (UI component, service, full-stack)
- Brief description

### Step 2: Determine Package Location

Based on architecture rules:

- **Pure domain logic**: `packages/libs/`
- **Business feature**: `packages/bundles/contractspec-studio/src/modules/<domain>/`
- **UI components**: `packages/bundles/contractspec-studio/src/presentation/<domain>/`
- **Platform-specific**: `packages/apps/<app>/`

### Step 3: Create File Structure

For a full-stack feature in bundles:

```
modules/<feature>/
├── index.ts              # Public exports
├── types.ts              # Type definitions
├── <feature>.service.ts  # Business logic (with logging + analytics)
├── <feature>.test.ts     # Tests (incl. logging/analytics assertions)
└── README.md             # Feature documentation
```

For a UI feature:

```
presentation/<domain>/<feature>/
├── index.ts              # Public exports
├── types.ts              # Type definitions
├── <Feature>.tsx         # UI component (with interaction tracking)
├── use<Feature>.ts       # Logic hook (with logging)
└── <Feature>.test.tsx    # Tests
```

### Step 4: Configure Observability

Before generating files, determine:

- **Logger context**: What module/domain name to use as logger prefix (e.g., `studio.versioning`)
- **Key events to track**: Which user-visible operations need analytics (e.g., `feature_created`, `feature_updated`)
- **Error categories**: Which errors are expected vs. unexpected for logging levels

### Step 5: Generate Files

Create each file with:

- Proper TypeScript types
- JSDoc comments
- Structured logger import and usage
- Analytics tracking for significant operations
- Error handling with structured logging
- Basic implementation skeleton
- Test file with logging/analytics assertions
- Exports in index.ts

### Step 6: Update Imports

- Add exports to parent module index.ts
- Verify no circular dependencies

### Step 7: Verification

- Run TypeScript check
- Run lint
- Verify structure matches architecture rules
- Verify observability instrumentation is present

## Templates

### Service Template

```typescript
/**
 * <Feature description>
 *
 * @module <feature>
 */

import type { <FeatureInput>, <FeatureOutput> } from "./types";
import { logger } from "@contractspec/lib.observability";
import { analytics } from "@contractspec/lib.analytics";

const log = logger.child({ module: "<domain>.<feature>" });

/**
 * <Description of what this service does>
 */
export class <Feature>Service {
  /**
   * <Method description>
   *
   * @param input - <Input description>
   * @returns <Output description>
   * @throws {<ErrorType>} <When this error occurs>
   */
  async execute(input: <FeatureInput>): Promise<<FeatureOutput>> {
    log.info("<feature>.execute.start", { inputId: input.id });

    try {
      // TODO: Implement
      const result = {} as <FeatureOutput>;

      log.info("<feature>.execute.success", { resultId: result.id });
      analytics.track("<feature>_executed", {
        inputId: input.id,
        // Add relevant properties for analytics
      });

      return result;
    } catch (error) {
      log.error("<feature>.execute.failed", {
        inputId: input.id,
        error,
      });
      throw error;
    }
  }
}
```

### Component Template

```tsx
/**
 * <Component description>
 */

import { use<Feature> } from "./use<Feature>";
import { useAnalytics } from "@contractspec/lib.analytics";
import type { <Feature>Props } from "./types";

export const <Feature> = (props: <Feature>Props) => {
  const { /* state, handlers */ } = use<Feature>(props);
  const { track } = useAnalytics();

  const handlePrimaryAction = () => {
    track("<feature>_action_clicked", {
      // Add relevant properties
    });
    // TODO: Implement action
  };

  return (
    // TODO: Implement using design system components
    // Use components from @contractspec/lib.design-system
    // or @contractspec/lib.ui-kit-web
    null
  );
};
```

### Hook Template

```typescript
/**
 * Hook for <Feature> logic and state management.
 *
 * @param props - <Feature> component props
 * @returns State and handlers for <Feature>
 */

import { logger } from "@contractspec/lib.observability";
import type { <Feature>Props } from "./types";

const log = logger.child({ module: "<domain>.<feature>" });

export const use<Feature> = (props: <Feature>Props) => {
  // TODO: Implement state and handlers

  const handleError = (error: unknown) => {
    log.error("<feature>.hook.error", {
      error,
      // Add context
    });
  };

  return {
    // state and handlers
  };
};
```

### Test Template

```typescript
import { describe, it, expect, vi } from "vitest";
import { <Feature>Service } from "./<feature>.service";

// Mock observability and analytics
vi.mock("@contractspec/lib.observability", () => ({
  logger: {
    child: () => ({
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    }),
  },
}));

vi.mock("@contractspec/lib.analytics", () => ({
  analytics: {
    track: vi.fn(),
  },
}));

describe("<Feature>Service", () => {
  describe("execute", () => {
    it("should <expected behavior>", async () => {
      // Arrange
      const service = new <Feature>Service();
      const input = {};

      // Act
      const result = await service.execute(input);

      // Assert
      expect(result).toBeDefined();
    });

    it("should log on success", async () => {
      // Arrange
      const { logger } = await import("@contractspec/lib.observability");
      const service = new <Feature>Service();
      const input = {};

      // Act
      await service.execute(input);

      // Assert — verify logging was called
      const log = logger.child({ module: "<domain>.<feature>" });
      expect(log.info).toHaveBeenCalled();
    });

    it("should track analytics on success", async () => {
      // Arrange
      const { analytics } = await import("@contractspec/lib.analytics");
      const service = new <Feature>Service();
      const input = {};

      // Act
      await service.execute(input);

      // Assert — verify analytics tracking
      expect(analytics.track).toHaveBeenCalledWith(
        "<feature>_executed",
        expect.objectContaining({})
      );
    });

    it("should log error on failure", async () => {
      // Arrange
      const { logger } = await import("@contractspec/lib.observability");
      const service = new <Feature>Service();
      const input = { /* invalid input */ };

      // Act & Assert
      await expect(service.execute(input)).rejects.toThrow();
      const log = logger.child({ module: "<domain>.<feature>" });
      expect(log.error).toHaveBeenCalled();
    });
  });
});
```

## Output

After completion, report:

- Files created
- Observability instrumentation added (logger prefix, tracked events)
- Next steps for implementation
- Related docs to update
