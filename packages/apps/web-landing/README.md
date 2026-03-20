# @contractspec/app.web-landing

**Next.js marketing, documentation, and agent-facing site for ContractSpec and the agentpacks registry.**

## What It Does

- Serves marketing pages, docs, registry pages, LLM-friendly endpoints, and operating-workbench surfaces.
- Aggregates content and reusable UI from `@contractspec/bundle.marketing` and `@contractspec/bundle.library`.
- Publishes `/llms*` and package-specific agent-friendly documentation endpoints alongside the public site.
- Related ContractSpec packages include `@contractspec/bundle.library`, `@contractspec/bundle.marketing`, `@contractspec/example.agent-console`, `@contractspec/example.ai-chat-assistant`, `@contractspec/example.analytics-dashboard`, `@contractspec/example.crm-pipeline`, ...

## Running Locally

From `packages/apps/web-landing`:
- `bun run dev`
- `bun run start`
- `bun run build`

## Usage

```bash
bun run dev
```

## Architecture

- `src/app/` contains Next.js route groups for landing, docs, operate, sandbox, and registry pages.
- `src/components/` contains app-local UI composition that is not owned by shared bundles.
- `src/data/` contains static content, registry metadata, and curated content inputs.
- `src/lib/` contains app-local helpers such as registry API access and page utilities.

## Public Entry Points

- Next.js routes under `/`, `/docs/*`, `/registry/*`, `/operate/*`, `/sandbox`, and `/llms*`.
- API surfaces include docs MCP integration and generated LLM text endpoints.
- Primary public surface is the routed application tree under `src/app/`.

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

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Vnext ai-native.
- Contracts context, bundle exports, surface-runtime docs.
- Export, sidebar, workflow tools, slotContent.
- Implement Agent-Friendly Documentation Spec recommendations.
- Circular import issue.

## Notes

- Keep this app thin — page content and components come from `bundle.marketing` and `bundle.library`.
- No raw HTML — use Design System components.
- Uses Tailwind CSS v4 with PostCSS — do not introduce competing CSS solutions.
- Route changes affect SEO and external links; coordinate with marketing.
