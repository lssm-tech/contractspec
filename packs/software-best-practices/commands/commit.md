---
description: 'Create a well-structured git commit with conventional commit format'
targets: ["*"]
---

Create a git commit following these steps:

1. **Analyze changes**:
   - Run `git status` to see staged and unstaged changes
   - Run `git diff --staged` to see what will be committed
   - If nothing is staged, ask user what to stage or suggest `git add -A`

2. **Generate commit message**:
   - Use conventional commit format: `<type>(<scope>): <description>`
   - Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
   - Scope: affected package or module (e.g., `contracts`, `design-system`, `web-landing`)
   - Description: imperative mood, lowercase, no period, max 72 chars
   - Body: explain WHY, not WHAT (the diff shows what)

3. **Commit structure**:
   ```
   <type>(<scope>): <short description>

   <body explaining why this change was made>

   <footer with references, breaking changes, etc.>
   ```

4. **Pre-commit checks**:
   - Verify no secrets/credentials in staged files
   - Warn if .env files or credentials are staged
   - Check for console.log statements in production code

5. **Execute commit**:
   - Create commit with the generated message
   - Show the commit hash and summary

## Examples

**Feature commit:**
```
feat(contracts): add definePresentation helper for UI specs

Enables declarative UI state definitions that integrate with the spec
registry. This allows multi-surface generation to include React
components alongside API and database outputs.

Closes #123
```

**Fix commit:**
```
fix(design-system): correct Button disabled state contrast ratio

The disabled state was failing WCAG AA contrast requirements (3.2:1).
Adjusted to 4.8:1 by darkening the disabled text color.
```

**Breaking change:**
```
feat(schema)!: rename ValidationResult to ValidationOutcome

BREAKING CHANGE: ValidationResult type has been renamed to
ValidationOutcome to avoid confusion with browser's ValidationResult.
Update imports accordingly.
```