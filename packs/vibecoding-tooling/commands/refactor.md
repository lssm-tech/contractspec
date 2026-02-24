---
description: 'Guided refactoring with safety checks and rollback plan'
targets: ['*']
---

target = $ARGUMENTS

Perform guided refactoring with safety:

1. **Analyze target**:
   - Identify what needs refactoring
   - Understand current structure and dependencies
   - Find all usages/consumers of the target

2. **Propose refactoring plan**:
   - Describe the change
   - List affected files
   - Explain benefits (readability, performance, testability)
   - Note potential risks

3. **Safety checks before refactoring**:
   - Ensure tests exist for affected code
   - Run tests to establish baseline
   - Check for breaking changes to public APIs
   - Identify dependent packages/modules

4. **Common refactoring patterns**:
   - **Extract**: Move code to separate file/function
   - **Rename**: Update name across codebase
   - **Split**: Break large file into smaller ones
   - **Consolidate**: Merge duplicate code
   - **Modernize**: Update deprecated patterns

5. **Execute with checkpoints**:
   - Make changes incrementally
   - Run tests after each step
   - Provide rollback instructions

6. **Post-refactor verification**:
   - Run full test suite
   - Check type compilation
   - Verify no circular dependencies introduced
   - Ensure file sizes within limits

## Refactoring checklist

Before:

- [ ] Tests pass for affected code
- [ ] Understand all usages
- [ ] Plan reviewed

During:

- [ ] Changes are incremental
- [ ] Tests still pass
- [ ] Types still compile

After:

- [ ] All tests pass
- [ ] No new lint errors
- [ ] File sizes within limits
- [ ] No circular dependencies
- [ ] Update imports/exports as needed
- [ ] Run `/audit-health` to verify overall code health after refactoring
- [ ] Run `/audit-observability` if services were restructured (ensure logging/analytics survived the move)

**Tip**: If the refactoring involves moving logic from apps to bundles, use the `extract-to-bundle` skill for guided extraction with import rewiring.

## Example output

```
## Refactoring Plan: Extract AuthService

**Target**: src/services/userService.ts (280 lines)

**Proposal**: Extract authentication logic into AuthService

**Changes**:
1. Create src/services/authService.ts
2. Move login(), logout(), refreshToken() functions
3. Update imports in 5 consumer files
4. Add re-export in userService for backwards compatibility

**Risks**:
- Medium: 5 files need import updates
- Low: Well-tested code with 92% coverage

**Rollback**: `git checkout src/services/`

Proceed with refactoring? [y/n]
```
