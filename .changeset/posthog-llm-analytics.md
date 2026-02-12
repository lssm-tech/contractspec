---
'@contractspec/lib.ai-agent': minor
'@contractspec/lib.contracts': minor
---

feat: add PostHog LLM Analytics and Evaluations support

Adds PostHog LLM observability to the ai-agent package via two integration approaches:

- **Model wrapping** (`createPostHogTracedModel`): wraps any Vercel AI SDK `LanguageModel` with `@posthog/ai` `withTracing` to automatically capture `$ai_generation` events (tokens, latency, cost, I/O)
- **TelemetryCollector bridge** (`PostHogTelemetryCollector`): implements the existing `TelemetryCollector` interface to forward `trackAgentStep` data to PostHog
- **CompositeTelemetryCollector**: fan-out to multiple telemetry collectors simultaneously

Both `ContractSpecAgentConfig` and `AgentFactoryConfig` now accept an optional `posthogConfig` for automatic model wrapping.

PostHog Evaluations (Relevance, Helpfulness, Hallucination, Toxicity, Jailbreak) run server-side on captured events with no additional client code.

Contracts updated: PostHog integration spec bumped to v1.1.0 with `analytics.llm-tracing` and `analytics.llm-evaluations` capabilities. New `posthogLLMTelemetrySpec` defines the generation event schema, PII fields, and evaluation templates.

`@posthog/ai` and `posthog-node` added as optional peer dependencies.
