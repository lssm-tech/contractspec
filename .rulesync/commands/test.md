---
description: 'Run tests with smart filtering and analysis'
targets: ["*"]
---

target_path = $ARGUMENTS

Run tests intelligently based on context:

1. **Determine scope**:
   - If `target_path` provided: run tests for that specific file/directory
   - If no path: detect changed files and run related tests
   - Use `git diff --name-only HEAD` to find recently changed files

2. **Run appropriate tests** (via turborepo):
   ```bash
   # All tests across packages
   turbo test

   # Specific package
   turbo test --filter=@contractspec/<package>

   # Specific file (use bun directly)
   bun test <path>

   # Watch mode (use bun directly)
   bun test --watch <path>
   ```

3. **Analyze results**:
   - Report pass/fail counts
   - For failures, show:
     - Test name and file location
     - Expected vs actual values
     - Relevant stack trace (truncated)
   - Suggest fixes for common failure patterns

4. **Coverage check** (if enabled):
   - Compare against thresholds:
     - Domain logic: 90%
     - Application services: 80%
     - UI components: 70%
     - Utilities: 95%
   - Flag files below threshold

5. **Smart suggestions**:
   - If tests fail due to missing mocks, suggest mock implementation
   - If tests are slow, identify potential optimizations
   - If coverage dropped, identify uncovered lines

## Output format

```
Tests: X passed, Y failed, Z skipped
Coverage: XX% (threshold: YY%)

Failed tests:
  - path/to/test.ts:42 - should handle empty input
    Expected: []
    Received: undefined

Suggestions:
  - Consider mocking the API call in line 38
  - Add test for edge case: null input
```