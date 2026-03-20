# AI Agent Guide — `@contractspec/app.web-landing`

Scope: `packages/apps/web-landing/*`

Next.js marketing, documentation, and agent-facing site for ContractSpec and the agentpacks registry.

## Quick Context

- Layer: `app`.
- Package visibility: private workspace package.
- Primary consumers are deployed users, operators, or external clients of this app surface.
- Related packages: `@contractspec/bundle.library`, `@contractspec/bundle.marketing`, `@contractspec/example.agent-console`, `@contractspec/example.ai-chat-assistant`, `@contractspec/example.analytics-dashboard`, `@contractspec/example.crm-pipeline`, ...

## Architecture

- `src/app/` contains Next.js route groups for landing, docs, operate, sandbox, and registry pages.
- `src/components/` contains app-local UI composition that is not owned by shared bundles.
- `src/data/` contains static content, registry metadata, and curated content inputs.
- `src/lib/` contains app-local helpers such as registry API access and page utilities.

## Public Surface

- Next.js routes under `/`, `/docs/*`, `/registry/*`, `/operate/*`, `/sandbox`, and `/llms*`.
- API surfaces include docs MCP integration and generated LLM text endpoints.
- Primary public surface is the routed application tree under `src/app/`.

## Guardrails

- Keep this app thin; reusable product logic and heavy UI should stay in bundles and libs.
- Route changes affect SEO, external links, and agent-discovery flows such as `/llms.txt`.
- Agent-facing documentation endpoints and generated LLM artifacts must stay consistent with package docs.
- Changes here can affect downstream packages such as `@contractspec/bundle.library`, `@contractspec/bundle.marketing`, `@contractspec/example.agent-console`, `@contractspec/example.ai-chat-assistant`, `@contractspec/example.analytics-dashboard`, `@contractspec/example.crm-pipeline`, ...

## Local Commands

- `bun run dev` — bun --bun next dev
- `bun run start` — bun --bun next start
- `bun run build` — bun run llms:generate && bun --bun next build
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run clean` — rimraf .next dist .turbo
- `bun run llms:generate` — bun scripts/generate-llms-full.mjs
- `bun run build:types` — tsc --noEmit
