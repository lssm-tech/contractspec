---
root: true
description: "Repository rule index for AGENTS.md"
targets: ["agentsmd"]
globs:
  - "**/*"
---

Please also reference the following rules as needed. The list below is provided in TOON format, and `@` stands for the project root directory.

rules[24]:
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
    applyTo[5]: packages/apps/web-application/src/app/(app)/**,packages/apps/web-marketing/**,packages/bundles/**/src/presentation/**,packages/libs/design-system/**,packages/libs/ui-kit-web/**
  - path: @.opencode/memories/docs.md
    description: Documentation governance — keep `docs/` synchronized with the codebase. The agent MUST review docs before code edits and update them after.
    applyTo[1]: **/*
  - path: @.opencode/memories/frontend.md
    description: "AI is generating UI components, screens, or flows."
    applyTo[5]: packages/apps/web-application/src/app/(app)/**,packages/apps/web-marketing/**,packages/bundles/**/src/presentation/**,packages/libs/design-system/**,packages/libs/ui-kit-web/**
  - path: @.opencode/memories/i18n.md
    description: "Internationalization governance — translation patterns, copy conventions, and locale compliance"
    applyTo[1]: **/*
  - path: @.opencode/memories/llms-guide.md
    description: "LLMs Guide Policy — every app must expose a single, canonical llms file and URL"
    applyTo[1]: **/*
  - path: @.opencode/memories/mode-governance.md
    description: "Enforce Guided / Pro / Autopilot mode contracts, capabilities matrix, guardrails, and safety invariants"
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
