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
   - Check for TypeScript errors (`bun run typecheck`)

3. **Execute build**:

   ```bash
   # Specific package
   bun x turbo run build --filter=@contractspec/<package>

   # All packages (with caching)
   bun run build

   # Force rebuild without cache
   bun x turbo run build --force
   ```

4. **Available commands**:
   - `bun run build` - Build all packages
   - `bun run typecheck` - Run TypeScript checks
   - `bun run lint:check` - Run the Biome pipeline
   - `bun x turbo run test` - Run tests across packages

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
  Try: bun x turbo run build --filter=@contractspec/lib.evolution

Total: 2 succeeded, 1 failed
Cache: 1 hit, 1 miss
```

## Post-build suggestions

After a successful build, consider running:

- `/audit-health` to verify file organization, layer compliance, and observability coverage
- `/audit-observability` if new services or handlers were added
