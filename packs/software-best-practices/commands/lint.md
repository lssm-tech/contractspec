---
description: 'Run linting and type checking with auto-fix suggestions'
targets: ["*"]
---

target_path = $ARGUMENTS

Run linting and type checks:

1. **TypeScript check** (via turborepo):
   ```bash
   turbo build:types
   ```
   - Report type errors with file:line references
   - Suggest fixes for common type errors

2. **Biome check** (with the temporary compatibility layer still covering i18n):
   ```bash
   bun run lint:check
   ```
   - Report lint errors and warnings
   - Group by rule for easier understanding

3. **Auto-fix** (if `--fix` flag provided):
   ```bash
   bun run lint:fix
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

5. **Summary output**:
   ```
   Type Errors: X
   Lint Errors: Y
   Lint Warnings: Z

   Top issues:
     1. noUnusedVariables (12 occurrences)
     2. noUnusedImports (8 occurrences)
     3. policy-contract-first (3 occurrences)

   Quick fixes available: Y issues can be auto-fixed with --fix
   ```

6. **Suggestions**:
   - For `any` types: suggest proper type definitions
   - For unused imports: suggest removal
   - For large files: suggest splitting strategies
