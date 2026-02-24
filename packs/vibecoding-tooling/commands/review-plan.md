---
description: 'Review a plan against all rules and best practices from multiple expert perspectives before building'
targets: ['*']
---

plan_path = $ARGUMENTS

Invoke the `plan-reviewer` subagent to perform a comprehensive multi-perspective review of the plan before execution:

1. **Locate the plan**:
   - If `plan_path` provided: use that file
   - If empty: search for `PLAN_*.md`, `IMPLEMENTATION_PLAN.md`, or `.opencode/plans/*.md`
   - If multiple found: ask the user which to review
   - If none found: error — "No plan found. Create a plan first or provide a path."

2. **Load all applicable rules**:
   - Read every `packs/**/rules/*.md` file
   - Identify which rules are relevant based on the plan's scope (frontend, backend, contracts, etc.)
   - Note the conflict resolution priority: Security > Compliance > Safety/Privacy > Stability/Quality > UX > Performance > Convenience

3. **Delegate to plan-reviewer** with two analysis phases:

   ### Phase 1: Rules Compliance Scan

   Check the plan against every applicable rule:

   | Rule                          | Check                                                     |
   | ----------------------------- | --------------------------------------------------------- |
   | `contracts-first.md`          | Does the plan define contracts before implementation?     |
   | `package-architecture.md`     | Does the plan respect libs → bundles → apps flow?         |
   | `code-splitting.md`           | Does the plan account for file size limits?               |
   | `code-quality-practices.md`   | Does the plan include tests, lint, type checks?           |
   | `observability.md`            | Does the plan include logging and analytics?              |
   | `i18n.md`                     | Does the plan account for translations if UI is involved? |
   | `mode-governance.md`          | Does the plan respect Guided/Pro/Autopilot boundaries?    |
   | `security.md`                 | Does the plan address auth, input validation, secrets?    |
   | `accessibility.md`            | Does the plan include ARIA, keyboard, contrast?           |
   | `design-system-usage.md`      | Does the plan use design system components?               |
   | `performance.md`              | Does the plan consider bundle size, lazy loading?         |
   | `type-safety-dependencies.md` | Does the plan enforce strict types?                       |
   | `docs.md`                     | Does the plan include documentation updates?              |
   | `posthog-integration.md`      | Does the plan include analytics events?                   |

   ### Phase 2: Multi-Perspective Expert Review

   Analyze the plan from 6 expert viewpoints:

   #### GTM / Business Perspective
   - Does this align with the ContractSpec mission ("stabilize AI-generated code")?
   - Does it create value for target ICPs (AI-native startups, small teams, agencies)?
   - Is the scope right for the current product stage?
   - Is there a clear value proposition for users?
   - Does it reinforce the "compiler, not prison" positioning?
   - Is this incremental enough for adoption?

   #### Product Perspective
   - Is the user journey end-to-end (not just a backend change without UI)?
   - Are all UX states covered (loading, empty, error, success)?
   - Is there a clear "done" definition?
   - Are edge cases considered (permissions, empty data, concurrent users)?
   - Is the feature discoverable in the UI?
   - Does it respect existing user mental models?

   #### Engineering Perspective
   - Is the architecture sound (correct layers, correct packages)?
   - Are dependencies in the right direction?
   - Is the plan implementation-ready (no ambiguity, clear file paths)?
   - Are quality gates included (types, lint, test, build)?
   - Is the change reversible?
   - Are there migration or backward compatibility concerns?
   - Is the scope small enough for a single PR?

   #### Security Perspective
   - Are auth boundaries considered for new endpoints?
   - Is input validation planned at all boundaries?
   - Are secrets handled correctly (env vars, not hardcoded)?
   - Is PII protected in logs and analytics?
   - Are permissions checked (workspace, user, role)?
   - Is rate limiting considered for public endpoints?

   #### Design / UX Perspective
   - Does the plan use design system components (not raw HTML)?
   - Is it accessible (ARIA, keyboard, screen reader)?
   - Is it mobile-first and responsive?
   - Does it follow atomic design (atoms → molecules → organisms)?
   - Are micro-interactions and feedback considered (toasts, loading states)?
   - Does it respect the existing visual language?

   #### Data / Analytics Perspective
   - Are tracking events planned for key user actions?
   - Will we know if this feature succeeds (success metrics)?
   - Can we measure adoption and usage?
   - Are feature flags planned for gradual rollout?
   - Is there a way to detect regressions (error rate tracking)?
   - Do analytics events follow PostHog naming conventions?

4. **Gap detection** — Identify what's missing from the plan:
   - Missing deliverables (e.g., plan says "add API" but no tests, docs, analytics)
   - Missing migration or rollback steps
   - Missing i18n for new UI surfaces
   - Missing contracts for new operations
   - Missing observability for new services
   - Missing quality gates

5. **Generate improved plan** — Produce a list of concrete additions to the plan:
   - New steps to add
   - Existing steps to expand or clarify
   - Order adjustments (e.g., contracts before implementation)
   - Quality gate insertions

6. **Report format**:

```
## Plan Review: <plan-name>

**Plan path**: [path]
**Relevant rules**: [count] / [total]
**Verdict**: [READY / NEEDS_WORK / MAJOR_GAPS]

### Rules Compliance ([X]/[Y] satisfied)

| Rule | Status | Gap |
|------|--------|-----|
| contracts-first | PASS/FAIL/N/A | [description if FAIL] |
| ... | ... | ... |

### Expert Perspectives

#### GTM / Business
- **Strengths**: [what's good]
- **Gaps**: [what's missing]
- **Recommendations**: [concrete additions]

#### Product
- **Strengths**: ...
- **Gaps**: ...
- **Recommendations**: ...

#### Engineering
- **Strengths**: ...
- **Gaps**: ...
- **Recommendations**: ...

#### Security
- **Strengths**: ...
- **Gaps**: ...
- **Recommendations**: ...

#### Design / UX
- **Strengths**: ...
- **Gaps**: ...
- **Recommendations**: ...

#### Data / Analytics
- **Strengths**: ...
- **Gaps**: ...
- **Recommendations**: ...

### Missing Deliverables
- [ ] [deliverable] — [why it's needed]

### Suggested Plan Additions
1. [Step to add or expand, with rationale]
2. ...

### Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| ...  | ...       | ...    | ...        |
```

7. **Related commands**:
   - Run `/plan-adapt` to align the plan with ContractSpec conventions
   - Run `/implementation-plan` to begin executing the plan
   - Run `/ai-audit` to verify AI governance compliance
   - Run `/audit-session` after building to detect governance gaps
