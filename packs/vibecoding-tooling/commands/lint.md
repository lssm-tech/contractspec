---
description: 'Run linting and type checking with auto-fix suggestions'
targets: ['*']
---

target_path = $ARGUMENTS

Run linting and type checks:

1. **TypeScript check** (via turborepo):

   ```bash
   turbo build:types
   ```

   - Report type errors with file:line references
   - Suggest fixes for common type errors

2. **ESLint check** (via turborepo):

   ```bash
   turbo lint
   ```

   - Report lint errors and warnings
   - Group by rule for easier understanding

3. **Auto-fix** (if `--fix` flag provided):

   ```bash
   turbo lint -- --fix
   ```

4. **Analysis**:
   - Categorize issues:
     - **Errors**: Must fix before commit
     - **Warnings**: Should fix, but not blocking
     - **Style**: Optional improvements
   - Check for rule violations specific to this project:
     - `prefer-design-system`: Raw HTML usage
     - `no-any`: TypeScript any usage
     - `file-size`: Files over 250 lines
     - `i18next/no-literal-string`: Hardcoded English in JSX (warn in presentation surfaces)

5. **Summary output**:

   ```
   Type Errors: X
   Lint Errors: Y
   Lint Warnings: Z

   Top issues:
     1. no-unused-vars (12 occurrences)
     2. prefer-const (8 occurrences)
     3. @typescript-eslint/no-explicit-any (3 occurrences)

   Quick fixes available: Y issues can be auto-fixed with --fix
   ```

6. **Suggestions**:
   - For `any` types: suggest proper type definitions
   - For unused imports: suggest removal
   - For large files: suggest splitting strategies

7. **Related commands**:
   - Run `/audit-health` for a broader scan that includes file size violations, layer compliance, reusability, and observability coverage.
   - Run `/audit-observability` for focused logging/analytics gap detection.
   - Run `/audit-i18n` for i18n compliance — hardcoded strings, missing locales, and pattern violations.
   - Run `/fix` to auto-fix lint issues that can be resolved automatically.
