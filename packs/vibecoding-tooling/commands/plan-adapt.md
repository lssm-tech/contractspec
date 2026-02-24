---
description: 'Adapt an implementation plan to ContractSpec requirements'
targets: ['*']
---

plan_path = $ARGUMENTS

Transform the plan to be ContractSpec-ready before execution:

1. **Create or locate the plan**:
   - If `plan_path` provided: use that file
   - If empty: default to `IMPLEMENTATION_PLAN.md`
   - If missing: create `IMPLEMENTATION_PLAN.md` with the template below

2. **Parse the existing plan**:
   - Capture goals, constraints, pain points, deliverables, and success metrics
   - Preserve intent, but rewrite the steps to be spec-first and executable

3. **State applicable rules**:
   - Identify relevant rule files (AI governance, contracts-first, architecture, quality)
   - Note conflict resolution priority: Security > Compliance > Safety/Privacy > Stability/Quality > UX > Performance > Convenience
   - Record the rules applied in your response for traceability

4. **Add ContractSpec alignment**:
   - Map each deliverable to required contracts (command, query, event, capability, presentation, form, data view)
   - Specify contract locations under `packages/libs/contracts/src/`
   - Require meta fields: `name`, `version`, `description`, `goal`, `context`, `owners`, `tags`
   - Require IO schema and policy definitions
   - Add registry updates as explicit tasks

5. **Add impact and diff steps**:
   - `contractspec impact` before committing
   - `contractspec impact --baseline main` for PR summaries
   - `contractspec diff <refA>..<refB> --json` when comparing versions
   - Include version bump or deprecation strategy for breaking changes

6. **Add generation and validation steps**:
   - `contractspec generate` when scaffolding is needed
   - `contractspec ci --check-drift` before PR/push
   - Include lint/test gates required by the plan

7. **Plan review** (recommended):
   - Run `/review-plan` to verify the plan against all rules and get multi-perspective feedback
   - Address any BLOCKER or MAJOR findings before proceeding

8. **Plan execution**:
   - Hand off to `/implementation-plan` once the plan is reviewed and updated

9. **Post-plan verification**:
   - **Product/business**: verify contract goals and context align with intended outcomes
   - **Technical**: run Greptile/Graphite review if configured, and summarize findings
   - Confirm `contractspec impact` reports no unexpected breaking changes

## Plan template (use when creating or rewriting)

```md
# Implementation Plan: <title>

## Goal

## Background

## Constraints

## ContractSpec Alignment

- Contracts to create (type + path + owners)
- Registry updates
- Versioning strategy

## Delivery Steps

1. Define contracts (spec-first)
2. Implement handlers/UI using contract types
3. Tests and docs updates

## Impact & Diff

- contractspec impact
- contractspec diff (if needed)

## Validation

- contractspec ci --check-drift
- lint/test

## Post-plan Verification

- Business outcomes verified
- Technical review (Greptile/Graphite)
```

## Output format

```
Plan: <path>
Rules: <list of applied rules>
Contracts: <list>
Impact/Diff: <status>
Next: /implementation-plan
```
