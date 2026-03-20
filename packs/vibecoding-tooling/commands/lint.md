---
description: 'Run linting and type checking with auto-fix suggestions'
targets: ['*']
---

target_path = $ARGUMENTS

Run linting and type checks:

1. **TypeScript check**:

   ```bash
   bun run typecheck
   ```

   - Report type errors with file:line references
   - Suggest fixes for common type errors

2. **Biome check**:

   ```bash
   bun run lint:check
   ```

   - Report lint errors and warnings
   - Group by rule for easier understanding

3. **I18n parity check** (when user-facing copy, locales, or message registries changed):

   ```bash
   bun run i18n:check
   ```

   - Report missing locale entries and copy-registry drift

4. **Auto-fix** (if `--fix` flag provided):

   ```bash
   bun run lint:fix
   ```

5. **Analysis**:
   - Categorize issues:
     - **Errors**: Must fix before commit
     - **Warnings**: Should fix, but not blocking
     - **Style**: Optional improvements
   - Check for rule violations specific to this project:
     - Design-system guardrails (`noRestrictedElements` and generated prefer-design-system diagnostics)
     - `policy-contract-first`: Implementation shipped without an explicit ContractSpec contract reference
     - `noUnusedVariables` / `noUnusedImports`
     - TypeScript strict-mode issues surfaced by `bun run typecheck`

6. **Summary output**:

   ```
   Type Errors: X
   Lint Errors: Y
   Lint Warnings: Z
   I18n Issues: N

   Top issues:
     1. noUnusedVariables (12 occurrences)
     2. noUnusedImports (8 occurrences)
     3. policy-contract-first (3 occurrences)

   Quick fixes available: Y issues can be auto-fixed with --fix
   ```

7. **Suggestions**:
   - For `any` types: suggest proper type definitions
   - For unused imports: suggest removal
   - For raw HTML in app/bundle surfaces: replace with design-system components
   - For missing contract references: import or reference the owning ContractSpec contract before shipping behavior
   - For large files: suggest splitting strategies

8. **Related commands**:
   - Run `/audit-health` for a broader scan that includes file size violations, layer compliance, reusability, and observability coverage.
   - Run `/audit-observability` for focused logging/analytics gap detection.
   - Run `/audit-i18n` for i18n compliance — hardcoded strings, missing locales, and pattern violations.
   - Run `/fix` to auto-fix lint issues that can be resolved automatically.
