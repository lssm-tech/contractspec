# Phase 2: AI-Native Operations

_Last updated: 2025-11-20_

Phase 2 turns ContractSpec into an AI-first operations stack. The new libraries below are the building blocks used by support bots, growth agents, and human-in-the-loop flows.

## Libraries

### @lssm/lib.ai-agent

- **Spec + Registry**: `defineAgent`, `AgentRegistry` keep agent definitions type-safe.
- **Runner**: `AgentRunner` drives LLM conversations, tool calls, retries, escalation, and telemetry hooks.
- **Tools**: `ToolExecutor` standardizes schema validation + timeouts.
- **Memory**: `InMemoryAgentMemory` + interfaces for plugging persistent stores.
- **Approvals**: new `ApprovalWorkflow` + `InMemoryApprovalStore` capture low-confidence decisions and surface them to reviewers.

### @lssm/lib.support-bot

Composable support automation primitives:

- `TicketClassifier` → heuristics + optional LLM validation for category, priority, sentiment.
- `TicketResolver` → RAG pipeline backed by knowledge spaces.
- `AutoResponder` → tone-aware drafts with citations.
- `SupportFeedbackLoop` → tracks resolution rates.
- `createSupportTools` → ready-made tool definitions for AgentRunner.

### @lssm/lib.content-gen

Content generators that consume a `ContentBrief` and output production-ready assets:

- `BlogGenerator`, `LandingPageGenerator`, `EmailCampaignGenerator`, `SocialPostGenerator`.
- `SeoOptimizer` builds metadata + schema markup.

### @lssm/lib.analytics

Queryless analytics helpers:

- `FunnelAnalyzer` – conversion/drop-off per step.
- `CohortTracker` – retention + LTV per cohort.
- `ChurnPredictor` – recency/frequency/error scoring.
- `GrowthHypothesisGenerator` – surfaces experiment ideas from metric trends.

### @lssm/lib.growth

A/B testing toolkit:

- `ExperimentRegistry` + `ExperimentRunner` – deterministic bucketing.
- `ExperimentTracker` – persist exposures + metrics.
- `StatsEngine` – Welch’s t-test + improvement calculations.

### Human-in-the-loop UI

`@lssm/lib.design-system` now exposes:

- `ApprovalQueue` – list + act on pending approvals.
- `AgentMonitor` – live view of agent sessions with confidence + status.

## Examples

- `examples/ai-support-bot/setup.ts` shows ticket classification → resolution → response draft.
- `examples/content-generation/generate.ts` produces blog, landing, email, social, SEO output from one brief.

## Next Steps

1. Wire these libraries into vertical apps (H-Circle, ArtisanOS, etc.).
2. Add background workers that consume the new analytics/growth trackers.
3. Expand web-landing to highlight these Phase 2 capabilities (see separate TODO).
