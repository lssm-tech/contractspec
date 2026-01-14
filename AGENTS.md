Please also reference the following rules as needed. The list below is provided in TOON format, and `@` stands for the project root directory.

rules[21]:
  - path: @.codex/memories/accessibility.md
    description: "Accessibility checklist (ARIA, keyboard, contrast, motion)"
    applyTo[1]: **/*
  - path: @.codex/memories/ai-agent.md
    description: AI governance baseline and decision traceability
    applyTo[1]: **/*
  - path: @.codex/memories/backend.md
    description: "AI is generating APIs, services, or data workflows."
    applyTo[1]: **/*
  - path: @.codex/memories/code-quality-practices.md
    description: "Enforce code quality standards, testing requirements, and innovation practices"
    applyTo[1]: **/*
  - path: @.codex/memories/code-splitting.md
    description: "Governs file size limits, splitting strategies, and code reusability patterns across the ContractSpec monorepo."
    applyTo[1]: **/*
  - path: @.codex/memories/contractspec-mission.md
    applyTo[1]: **/*
  - path: @.codex/memories/design-system-usage.md
    description: Enforce design-system-first UI for marketing/web surfaces.
  - path: @.codex/memories/docs.md
    description: Documentation governance — keep `docs/` synchronized with the codebase. The agent MUST review docs before code edits and update them after.
    applyTo[1]: **/*
  - path: @.codex/memories/frontend.md
    description: "AI is generating UI components, screens, or flows."
  - path: @.codex/memories/llms-guide.md
    description: "LLMs Guide Policy — every app must expose a single, canonical llms file and URL"
    applyTo[1]: **/*
  - path: @.codex/memories/move-efficient.md
    applyTo[1]: **/*
  - path: @.codex/memories/observability.md
    description: "Observability, logging, and tracing standards"
    applyTo[1]: **/*
  - path: @.codex/memories/package-architecture.md
    description: "Governs package responsibilities, component hierarchy, and dependency flow across the ContractSpec monorepo."
    applyTo[1]: **/*
  - path: @.codex/memories/performance.md
    description: Performance budgets and optimization guardrails
    applyTo[1]: **/*
  - path: @.codex/memories/plan-coding.md
    description: When following instruction of a plan in mardkown file PLAN_VNEXT.md
  - path: @.codex/memories/plan-done.md
  - path: @.codex/memories/posthog-integration.md
    description: apply when interacting with PostHog/analytics tasks
    applyTo[1]: **/*
  - path: @.codex/memories/security.md
    description: "Security, secrets handling, and PII hygiene"
    applyTo[1]: **/*
  - path: @.codex/memories/type-safety-dependencies.md
    description: Enforce strict type safety and dependency hygiene across the codebase
    applyTo[1]: **/*
  - path: @.codex/memories/user.md
    applyTo[1]: **/*
  - path: @.codex/memories/ux.md
    applyTo[1]: **/*

# Additional Conventions Beyond the Built-in Functions

As this project's AI coding tool, you must follow the additional conventions below, in addition to the built-in functions.

# Project Overview

## General Guidelines

- Use TypeScript for all new code
- Follow consistent naming conventions
- Write self-documenting code with clear variable and function names
- Prefer composition over inheritance
- Use meaningful comments for complex business logic

## Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use double quotes for strings
- Use trailing commas in multi-line objects and arrays

## Architecture Principles

- Organize code by feature, not by file type
- Keep related files close together
- Use dependency injection for better testability
- Implement proper error handling
- Follow single responsibility principle
