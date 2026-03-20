# @contractspec/bundle.marketing

**Marketing composition bundle for the public ContractSpec site: landing narratives, product/pricing/templates pages, support pages, and email-facing marketing helpers.**

## What It Provides

- Marketing page bodies consumed by `@contractspec/app.web-landing`
- Scenario/template browsing surfaces used on `/templates`
- Support and program pages such as contact, contribute, cofounder, and design-partner
- Email/contact helpers and marketing-adjacent utilities

## Architecture

- `src/components/marketing/` owns the public marketing narratives, section composition, and page-level stories.
- `src/components/templates/` owns template browsing, preview, and template-to-CLI/Studio flows.
- `src/libs/email/` owns contact/newsletter/waitlist actions and helpers used by marketing surfaces.
- `src/index.ts` is the root public entrypoint.

The important boundary:
- `bundle.marketing` owns the story and page composition
- `app.web-landing` owns routing, metadata, OG, shell, and public delivery

## Public Entry Points

- Root export `.` through `src/index.ts`
- `./components/marketing/*` for landing, product, pricing, contact, contribute, cofounder, and design-partner surfaces
- `./components/templates/*` for templates browsing and preview surfaces
- `./libs/email/*` for marketing contact/newsletter/waitlist helpers

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rm -rf dist
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild

## Notes

- Keep the bundle focused on page storytelling and marketing interaction flows. Do not move shell/routing concerns here.
- Public positioning in this package must stay aligned with root docs and `@contractspec/app.web-landing`.
- If the page story changes materially, update the package docs and the public LLM-facing docs so human-facing and agent-facing descriptions do not drift.
