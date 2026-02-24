---
targets:
  - '*'
root: false
description: 'Enforce a full AI-native delivery loop from ideation to documentation and learning'
globs:
  - '**/*'
cursor:
  alwaysApply: true
  description: 'Enforce a full AI-native delivery loop from ideation to documentation and learning'
  globs:
    - '**/*'
---

# Delivery Lifecycle Loop

Every significant change should follow the same loop:

1. **Ideation**
2. **Plan**
3. **Ship**
4. **QA and review**
5. **Observability**
6. **Documentation and learning**

This loop is mandatory for high-impact work and strongly recommended for all product-facing changes.

## Lifecycle Command Map

- Ideation: `/ideate`
- Plan: `/plan-adapt`, `/review-plan`, `/implementation-plan`
- Ship: `/lint`, `/test`, `/build`, `/ship`, `/draft-pr`
- QA and review: `/review-pr`, `/ai-audit`
- Observability: `/audit-observability`, `/audit-health`
- Documentation and learning: `/document`, `/ai-audit`

## Required Outcomes Per Phase

### 1) Ideation

- Problem statement, target user, and non-goals are explicit
- Scope is incremental and reversible
- Success metrics and risks are defined

### 2) Plan

- Contracts are defined before implementation for new operations/events
- Delivery steps are clear and ordered
- Quality gates are listed (types, lint, tests, build, docs)

### 3) Ship

- Code changes are minimal and traceable
- Feature flags/config guards are used for risky behavior
- Branch, commit, and PR context are explicit

### 4) QA and Review

- Tests and lint are green
- Security and architecture risks are reviewed
- High-risk findings are resolved before merge

### 5) Observability

- New runtime behavior emits structured logs and meaningful analytics
- Error paths are instrumented
- Service-level health and latency visibility exists

### 6) Documentation and Learning

- DocBlocks/JSDoc/READMEs are updated for behavior changes
- Decision rationale is preserved in plan/PR context
- Follow-up improvements are captured with clear ownership

## Governance Heuristics

✅ Prefer small loops and frequent checkpoints over large one-shot changes.
✅ Treat observability and documentation as deliverables, not optional polish.
✅ Keep model and tool choices explicit for reproducibility.
❌ Do not skip straight from implementation to merge without review and observability checks.
❌ Do not leave lifecycle phases implicit for high-impact changes.
