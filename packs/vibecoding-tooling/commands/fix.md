---
description: 'Auto-fix common issues in the codebase'
targets: ['*']
---

target_path = $ARGUMENTS

Automatically fix common issues:

1. **Identify fixable issues**:
   - Run lint and type checks to find issues
   - Categorize by auto-fixability

2. **Safe auto-fixes** (apply automatically):
   - Formatting (prettier/eslint --fix)
   - Unused imports removal
   - Missing semicolons
   - Trailing whitespace
   - Import sorting
   - Const vs let optimization

3. **Guided fixes** (require confirmation):
   - `any` type replacements (suggest proper types)
   - Missing return types (infer from usage)
   - Deprecated API usage (suggest alternatives)
   - File splitting (when over 250 lines)

4. **Execution flow** (via turborepo):

   ```bash
   # Step 1: Safe fixes
   turbo lint -- --fix
   bun run prettier --write .

   # Step 2: Report remaining issues
   turbo build:types
   turbo lint
   ```

5. **Report changes**:
   - List files modified
   - Summarize changes made
   - List remaining issues that need manual fixes

6. **Remaining issues guidance**:
   For each unfixed issue, provide:
   - File and line number
   - Issue description
   - Suggested fix with code example

## Example output

```
Auto-fixed:
  - 23 formatting issues
  - 8 unused imports removed
  - 5 const/let optimizations

Manual fixes needed:
  1. src/services/auth.ts:45
     Issue: Using 'any' type
     Fix: Replace with 'User | null'

  2. src/components/Form.tsx:120
     Issue: File exceeds 150 lines (currently 180)
     Fix: Extract FormFields into separate component
```

## Related commands

- Run `/audit-health` for a broader scan beyond lint issues (file sizes, layer compliance, reusability, observability).
- Run `/audit-observability` for detailed logging/analytics gap analysis.
- Use the `extract-to-bundle` skill if business logic needs to move from apps to bundles.
