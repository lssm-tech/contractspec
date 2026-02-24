---
description: 'Build the project with error analysis and suggestions'
targets: ['*']
---

target_package = $ARGUMENTS

Build the project or specific package using turborepo:

1. **Determine build scope**:
   - If `target_package` provided: build that specific package
   - If no target: build all packages in dependency order

2. **Pre-build checks**:
   - Verify dependencies are installed (`bun install`)
   - Check for TypeScript errors (`turbo build:types`)

3. **Execute build** (via turborepo):

   ```bash
   # Specific package
   turbo build --filter=@contractspec/<package>

   # All packages (with caching)
   turbo build

   # Force rebuild without cache
   turbo build --force
   ```

4. **Available turbo tasks**:
   - `turbo build` - Build all packages
   - `turbo build:bundle` - Build bundle artifacts
   - `turbo build:types` - Build TypeScript types only
   - `turbo test` - Run tests
   - `turbo lint` - Run linting

5. **Analyze build output**:
   - Report success/failure for each package
   - For failures:
     - Parse error messages
     - Identify root cause
     - Suggest fixes
   - Check bundle sizes against budgets

6. **Post-build verification**:
   - Verify output files exist in `dist/`
   - Check for unexpected large bundles
   - Report build times and cache hits

## Output format

```
Building packages...

  @contractspec/lib.contracts     [OK]     0.8s (cached)
  @contractspec/lib.design-system [OK]     1.2s
  @contractspec/bundle.studio     [FAIL]

Error in @contractspec/bundle.studio:
  src/modules/studio/index.ts:45
  Cannot find module '@contractspec/lib.evolution'

Suggestion:
  The package @contractspec/lib.evolution may not be built yet.
  Try: turbo build --filter=@contractspec/lib.evolution

Total: 2 succeeded, 1 failed
Cache: 1 hit, 1 miss
```

## Post-build suggestions

After a successful build, consider running:

- `/audit-health` to verify file organization, layer compliance, and observability coverage
- `/audit-observability` if new services or handlers were added
