Please also reference the following rules as needed. The list below is provided in TOON format, and `@` stands for the project root directory.

rules[22]:
  - path: @.opencode/memories/accessibility.md
    description: "Accessibility checklist (ARIA, keyboard, contrast, motion)"
    applyTo[1]: **/*
  - path: @.opencode/memories/ai-agent.md
    description: AI governance baseline and decision traceability
    applyTo[1]: **/*
  - path: @.opencode/memories/backend.md
    description: "AI is generating APIs, services, or data workflows."
    applyTo[1]: **/*
  - path: @.opencode/memories/code-quality-practices.md
    description: "Enforce code quality standards, testing requirements, and innovation practices"
    applyTo[1]: **/*
  - path: @.opencode/memories/code-splitting.md
    description: "Governs file size limits, splitting strategies, and code reusability patterns across the ContractSpec monorepo."
    applyTo[1]: **/*
  - path: @.opencode/memories/contracts-first.md
    description: "Enforce spec-first development using ContractSpec contracts for all operations, events, and features"
    applyTo[1]: **/*
  - path: @.opencode/memories/contractspec-mission.md
    applyTo[1]: **/*
  - path: @.opencode/memories/design-system-usage.md
    description: Enforce design-system-first UI for marketing/web surfaces.
  - path: @.opencode/memories/docs.md
    description: Documentation governance — keep `docs/` synchronized with the codebase. The agent MUST review docs before code edits and update them after.
    applyTo[1]: **/*
  - path: @.opencode/memories/frontend.md
    description: "AI is generating UI components, screens, or flows."
  - path: @.opencode/memories/llms-guide.md
    description: "LLMs Guide Policy — every app must expose a single, canonical llms file and URL"
    applyTo[1]: **/*
  - path: @.opencode/memories/move-efficient.md
    applyTo[1]: **/*
  - path: @.opencode/memories/observability.md
    description: "Observability, logging, and tracing standards"
    applyTo[1]: **/*
  - path: @.opencode/memories/package-architecture.md
    description: "Governs package responsibilities, component hierarchy, and dependency flow across the ContractSpec monorepo."
    applyTo[1]: **/*
  - path: @.opencode/memories/performance.md
    description: Performance budgets and optimization guardrails
    applyTo[1]: **/*
  - path: @.opencode/memories/plan-coding.md
    description: When following instruction of a plan in mardkown file PLAN_VNEXT.md
  - path: @.opencode/memories/plan-done.md
  - path: @.opencode/memories/posthog-integration.md
    description: apply when interacting with PostHog/analytics tasks
    applyTo[1]: **/*
  - path: @.opencode/memories/security.md
    description: "Security, secrets handling, and PII hygiene"
    applyTo[1]: **/*
  - path: @.opencode/memories/type-safety-dependencies.md
    description: Enforce strict type safety and dependency hygiene across the codebase
    applyTo[1]: **/*
  - path: @.opencode/memories/user.md
    applyTo[1]: **/*
  - path: @.opencode/memories/ux.md
    applyTo[1]: **/*

# ContractSpec Codebase

**Mission**: ContractSpec is the deterministic, spec-first compiler that keeps AI-written software coherent, safe, and regenerable.

## Quick Reference

| Concern | Rule File | Key Points |
|---------|-----------|------------|
| **Contracts** | `contracts-first.md` | Spec before implementation |
| Mission & Context | `contractspec-mission.md` | Why we exist, who we serve |
| Architecture | `package-architecture.md` | libs → bundles → apps |
| Code Quality | `code-quality-practices.md` | Testing, naming, standards |
| File Organization | `code-splitting.md` | Max 250 lines, domain grouping |
| Type Safety | `type-safety-dependencies.md` | No `any`, latest deps |
| Frontend | `frontend.md` | Atomic design, state handling |
| Backend | `backend.md` | Hexagonal, DDD |
| Design System | `design-system-usage.md` | No raw HTML |
| AI Governance | `ai-agent.md` | Traceability, composability |
| Documentation | `docs.md` | DocBlocks first |

## Core Principles

1. **Spec-First**: Contracts define behavior before implementation
2. **Multi-Surface Consistency**: One spec → API, DB, UI, events
3. **Safe Regeneration**: Code can be regenerated without breaking invariants
4. **Standard Tech**: TypeScript, Zod, no magic abstractions
5. **Incremental Adoption**: Stabilize one module at a time

## Code Style (Enforced)

- **Language**: TypeScript (strict mode)
- **Formatting**: 2 spaces, semicolons, double quotes, trailing commas
- **Types**: Explicit, no `any`, proper type guards
- **Files**: Max 250 lines (components: 150, utilities: 100)

## Before You Code

1. Read relevant rules for your change type
2. Check existing patterns in the codebase
3. Plan with DocBlocks if adding new features
4. Run `/ai-audit` to verify decisions

## AI Agent Guidelines

When working with AI assistants:
- Rules are applied contextually based on file type
- Conflicts resolved by: Security > Compliance > Safety > Quality > UX > Performance
- All decisions should be traceable and reversible
- Use `/ai-audit` to verify governance compliance

## Commands Available

- `/commit` - Create conventional commit
- `/test` - Run tests with analysis
- `/lint` - Check and fix lint issues
- `/fix` - Auto-fix common issues
- `/explain` - Understand code
- `/refactor` - Guided refactoring
- `/review-pr` - Code review
- `/ai-audit` - Governance check

## Getting Help

- Check the specific rule file for detailed guidance
- Use `/explain <concept>` for architecture questions
- Run `/ai-audit` to verify your approach
