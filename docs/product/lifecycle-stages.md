## ContractSpec Lifecycle Stages

ContractSpec tracks seven lifecycle stages (0–6) plus three parallel axes (Product, Company, Capital) so artisans and operators share one vocabulary. This document is the canonical reference for stage definitions, signals, and the ContractSpec offerings (libraries, modules, bundles) that support each milestone.

### Stage Summary

| Stage | Name | Core Question | Primary Signals | Red Flags |
| --- | --- | --- | --- | --- |
| 0 | Exploration / Ideation | “Is there a problem worth my time?” | 20+ discovery interviews, vivid problem narratives | Branding or tech decisions before validated pain |
| 1 | Problem–Solution Fit | “Do people care enough about this solution?” | Repeated demo demand, prototype reuse, referrals | “Market is huge” rhetoric without users |
| 2 | MVP & Early Traction | “Can we get real usage and learn fast?” | 20–50 named active users, weekly releases | Overbuilt infra, undefined retention |
| 3 | Product–Market Fit | “Is this pulling us forward?” | Retention without heroics, word-of-mouth | Growth fueled only by founder heroics |
| 4 | Growth / Scale-up | “Can we grow repeatably?” | Predictable channels, hiring specialization | Paid spend masking churn |
| 5 | Expansion / Platform | “What’s the next curve?” | Stable core metrics, partner/API demand | Platform work before solid wedge |
| 6 | Maturity / Renewal | “Optimize, reinvent, or sunset?” | Margin focus, portfolio bets, narrative refresh | Assuming past success guarantees future relevance |

### Three Axes

- **Product Phase**: Sketch → Prototype → MVP → V1 → Ecosystem. Tracks product completeness and extensibility.
- **Company Phase**: Solo/Duo → Tiny Team (3–7) → Functional Org (10–30) → Multi-team (30–120) → Bureaucratic (>120). Captures org depth.
- **Capital Phase**: Bootstrapped → Pre-seed → Seed → Series A/B → Late-stage/PE/IPO. Signals funding pressure and reporting obligations.

An organization can be early on one axis and late on another; lifecycle tooling must display all three simultaneously.

### Stage Details & ContractSpec Support

#### Stage 0 – Exploration / Ideation
- **Focus**: Validate painful problems before committing code.
- **Signals**: Interview cadence, sharpened ICP, willingness to pre-pay for research.
- **ContractSpec Support**:
  - Libraries: `@lssm/lib.content-gen` for interview synthesis, `@lssm/lib.presentation-runtime` for storyboards.
  - Modules: Lifecycle questionnaire templates (from `lifecycle-core`).
  - Bundles: Future Studio experience for rapid discovery logging.

#### Stage 1 – Problem–Solution Fit
- **Focus**: Prove *this* solution resonates with a narrow audience.
- **Signals**: Prototype re-use, referrals, “send this to a friend.”
- **Support**:
  - Libraries: `@lssm/lib.personalization`, `@lssm/lib.progressive-delivery` for gated prototypes.
  - Modules: Lifecycle signals referencing qualitative feedback.
  - Bundles: Managed lifecycle assessments for early feedback loops.

#### Stage 2 – MVP & Early Traction
- **Focus**: Ship one core job weekly/daily for known users.
- **Signals**: 20–50 active users, weekly releases, high feedback signal.
- **Support**:
  - Libraries: `@lssm/lib.analytics`, `@lssm/lib.observability` minimum viable telemetry.
  - Modules: Lifecycle core metrics and milestone planner.
  - Bundles: Managed assessment service to surface gaps in onboarding, activation.

#### Stage 3 – Product–Market Fit
- **Focus**: Retention and pull-based growth.
- **Signals**: Users return without nurture, organic value stories.
- **Support**:
  - Libraries: `@lssm/lib.evolution` (auto-specs) with lifecycle context.
  - Modules: Advisor recommendations targeting retention and core jobs.
  - Bundles: Lifecycle advisor agent + ceremony designer for PMF celebrations.

#### Stage 4 – Growth / Scale-up
- **Focus**: Install repeatable systems (growth, support, sales).
- **Signals**: Predictable channels, specialized hires, steady infra.
- **Support**:
  - Libraries: `@lssm/lib.growth`, `@lssm/lib.resilience`, `@lssm/lib.multi-tenancy`.
  - Modules: Experiment templates tied to lifecycle guardrails.
  - Bundles: Managed lifecycle dashboards inside ContractSpec Studio.

#### Stage 5 – Expansion / Platform
- **Focus**: Launch second/third growth curves (partners, platform plays).
- **Signals**: Stable core metrics, partner demand, API traction.
- **Support**:
  - Libraries: `@lssm/lib.integration`, `@lssm/lib.workflow-composer`.
  - Modules: Advisor playbooks for partner onboarding and ecosystem KPIs.
  - Bundles: Managed integration blueprints within Studio.

#### Stage 6 – Maturity / Renewal
- **Focus**: Decide between optimization, reinvention, or sunset.
- **Signals**: Margin obsession, reinvention experiments, M&A exploration.
- **Support**:
  - Libraries: `@lssm/lib.cost-tracking`, `@lssm/lib.workflow-composer`, `@lssm/lib.ai-agent` for ops automation.
  - Modules: Renewal playbooks, milestone tracking for optimization cycles.
  - Bundles: Managed ceremonies to mark reinvention/retires.

### Capability Map

| Stage Range | Libraries | Modules | Bundles / Managed |
| --- | --- | --- | --- |
| 0–1 | Content Gen, Presentation Runtime, Progressive Delivery | Lifecycle questionnaire templates | Studio research logging (future) |
| 2 | Analytics, Observability, Overlay Engine | Lifecycle signal collector, milestone planner | Managed assessment service |
| 3 | Evolution, Growth (core), AI Agent | Lifecycle orchestrator, advisor recommendations | Advisor agent surface, PMF ceremonies |
| 4 | Growth (advanced), Resilience, Multi-tenancy | Experiment template catalog, KPI guardrails | Studio lifecycle dashboards |
| 5 | Integrations, Workflow Composer, Bus | Partner playbooks, expansion ceremonies | Managed platform readiness reviews |
| 6 | Cost Tracking, Workflow Composer, AI Ops | Optimization & renewal playbooks | Managed renewal governance |

### Rituals & Ceremonies

- Each stage transition should trigger:
  - **Narrative Summary**: Before/after story generated via lifecycle advisor module.
  - **Milestone Snapshot**: Completed vs. remaining tasks.
  - **Ceremonial Cues**: Copy, color palette, or animation references for apps (mobile-first, low-tech friendly).

ContractSpec experiences must remain accessible: clear copy, mobile-ready components, and forgiving flows that explain next steps.

### Usage Guidelines

- Use these definitions in all lifecycle-aware code (`@lssm/lib.lifecycle` exports).
- Reference this doc when updating marketing assets (`web-landing`) or Studio surfaces so language stays synchronized.
- If future industries require variants, extend via module configuration—not by mutating these baseline definitions.
## Lifecycle Stages Reference

ContractSpec guides artisans through seven lifecycle stages (0–6). Each stage pairs with a primary question, target outcomes, and the ContractSpec modules that accelerate progress.

### Quick Overview

| Stage | Name | Guiding Question | Primary Signals |
| --- | --- | --- | --- |
| 0 | Exploration / Ideation | “Is there a problem worth my time?” | 20+ discovery interviews, crisp problem statement, target persona clarity |
| 1 | Problem–Solution Fit | “Do people care enough about this solution?” | Repeated demo requests, prototype reuse, early referral energy |
| 2 | MVP & Early Traction | “Can we get real usage and learn fast?” | 20–50 named active users, weekly releases, noisy feedback loops |
| 3 | Product–Market Fit | “Is demand pulling us forward?” | High retention without heroics, organic word-of-mouth, value stories |
| 4 | Growth / Scale-up | “Can we grow this repeatably?” | Predictable acquisition channels, hiring specialization, steady infra |
| 5 | Expansion / Platform | “What are the next curves?” | Second product lines, integrations, partner-led demand |
| 6 | Maturity / Renewal | “Optimize, reinvent, or sunset?” | Margin focus, M&A exploration, renewal bets |

### 3-Axis Tracking

- **Product Phase**: Sketch → Prototype → MVP → V1 → Ecosystem. Tracks product completeness and extensibility.
- **Company Phase**: Solo/Duo → Tiny Team (3–7) → Functional Org (10–30) → Multi-team (30–120) → Bureaucratic (>120). Captures org structure and process depth.
- **Capital Phase**: Bootstrapped → Pre-seed → Seed → Series A/B → Late-stage / PE / IPO. Indicates financial constraints + expectations.

Lifecycle dashboards surface all three axes because a company can be “Stage 3 product, Stage 1 org, bootstrapped capital.”

### Stage Details

#### Stage 0 – Exploration / Ideation
- **Goal**: Validate a painful problem before building.
- **Signals**: Interview volume, “must solve” stories, clear ICP.
- **Red Flags**: Branding or tech stack work before insights.
- **ContractSpec Support**: `@lssm/lib.content-gen` for interview summaries, overlay prototypes for storyboards, Notion-style docs via Presentation Runtime.

#### Stage 1 – Problem–Solution Fit
- **Goal**: Demonstrate that a narrow audience wants *this* solution.
- **Signals**: People ask to reuse prototypes, send it to peers, or pre-pay.
- **Red Flags**: “Market is huge but no committed testers.”
- **ContractSpec Support**: Feature flag bundles for gated prototypes, Growth experiment templates for qualitative validation, PostHog funnels for repeated demo tracking.

#### Stage 2 – MVP & Early Traction
- **Goal**: Ship one core job weekly/daily for a known cohort.
- **Signals**: 20–50 named active users, commitment to regular feedback.
- **Red Flags**: Over-built infra, unclear retention metrics.
- **ContractSpec Support**: `@lssm/lib.analytics` for user cohorts, `@lssm/lib.observability` for basic telemetry, Overlay Engine for targeted onboarding flows.

#### Stage 3 – Product–Market Fit
- **Goal**: Validate that retention and word-of-mouth emerge without brute force.
- **Signals**: Users return without nudges, crisp before/after story, expansions.
- **Red Flags**: Growth only through founder heroics, churn masked by top-of-funnel pushes.
- **ContractSpec Support**: Auto-evolution suggestions, multi-tenant workflows, lifecycle advisor guidance on retention levers.

#### Stage 4 – Growth / Scale-up
- **Goal**: Install semi-repeatable systems (growth, support, sales).
- **Signals**: Predictable monthly growth, unit economics in range, specialization hires.
- **Red Flags**: Paid acquisition without retention, infra fires limiting launches.
- **ContractSpec Support**: Experiment registries, CRM integrations, observability baselines, ContractSpec overlays for localized onboarding.

#### Stage 5 – Expansion / Platform
- **Goal**: Launch secondary growth curves (new markets, platforms, partners).
- **Signals**: Stable core metrics, partner/API requests, ecosystem contributions.
- **Red Flags**: Platform work without a solid wedge, unclear ownership for new bets.
- **ContractSpec Support**: Integration hub modules, workflow composer for partner automation, analytics segments for adjacent markets.

#### Stage 6 – Maturity / Optimization / Renewal
- **Goal**: Decide between optimization, reinvention, or graceful decline.
- **Signals**: Margin focus, portfolio plays, renewed brand narrative.
- **Red Flags**: Assuming past success guarantees future relevance, ignoring churn indicators.
- **ContractSpec Support**: Cost tracking, scenario planning overlays, AI Ops automation, lifecycle ceremonies that prompt reinvention moments.

### Platform Mapping

| Stage | Focused Modules |
| --- | --- |
| 0–1 | Interview workflows, persona research overlays, qualitative analytics |
| 2 | MVP scaffolding, feature flags, user research automations |
| 3 | Retention telemetry, auto-evolution, lifecycle scoring pipelines |
| 4 | Growth experiment runners, multi-tenant ops, resilience toolkits |
| 5 | API ecosystems, partner onboarding, integration registry |
| 6 | Cost optimization, workflow composer, C-suite dashboards |

### Signals & Alerts

- **Stage Confidence**: Weighted composite of active usage, retention, revenue, and questionnaire scores.
- **Stage Drift Alerts**: Triggered when KPIs regress for 3+ weeks.
- **Transition Milestones**: Task lists stored in `LifecycleMilestone` records and surfaced in lifecycle dashboards.

Use this document as the canonical reference for lifecycle terminology across product experiences, marketing content, and AI guidance flows.

