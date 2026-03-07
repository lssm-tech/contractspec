# AI Agent Guide — `@contractspec/lib.ai-agent`

Scope: `packages/libs/ai-agent/*`

AI agent orchestration with MCP and tool support, providing the core agent runtime for the platform.

## Quick Context

- **Layer**: lib
- **Consumers**: evolution, support-bot, design-system, bundles

## Public Exports

- `.` — main entry
- `./agent`
- `./approval`
- `./exporters`
- `./i18n`
- `./interop`
- `./knowledge`
- `./memory`
- `./providers`
- `./schema`
- `./session`
- `./spec`
- `./telemetry`
- `./tools`
- `./types`

## Guardrails

- High blast radius — used by multiple bundles and libs.
- `AgentSpec` interface is a public contract; do not change its shape without a migration plan.
- MCP transport adapters must stay runtime-agnostic (no Node/browser-specific globals).

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
