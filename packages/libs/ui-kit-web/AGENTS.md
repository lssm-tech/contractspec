# AI Agent Guide — `@contractspec/lib.ui-kit-web`

Scope: `packages/libs/ui-kit-web/*`

Mission: keep `@contractspec/lib.ui-kit-web` a stable web-first component package for React and Next surfaces. The compatibility surface lives in `./ui/*` subpaths, especially the accessibility helpers and Radix-backed primitives.

## Public surface

Treat `./ui/*` as the real compatibility surface:

- controls and forms
- overlays and menus
- navigation and layout
- accessibility helpers
- map, marketing, organisms, use-case, and visualization surfaces
- hooks and utilities

Important source-accuracy note: the root entry is not the meaningful consumer surface today.

## Change boundaries

- Prop signatures and exported subpaths are compatibility surface.
- Preserve accessibility-first behavior for Radix wrappers and helper utilities.
- Keep docs grouped instead of turning them into exhaustive listings.
- Keep `exports` and `publishConfig.exports` aligned.

## Package invariants

- Web accessibility helpers must stay first-class and working.
- `./ui/link` remains Next-based.
- Route-announcer, live-region, and focus-on-route-change behavior must stay usable.
- Optional map-related peers should not become hard runtime assumptions without documentation and deliberate compatibility review.
- This package is the web primitive lane in `/docs/libraries/cross-platform-ui`; do not introduce native-only assumptions here.
- Keep `VStack`, `HStack`, and `Box` compatible with the documented shared subset. Changes to `gap`, `align`, `justify`, `wrap`, or web-only `as` behavior require updating the cross-platform UI docs and customer markdown kit.

## Editing guidance by area

### Radix wrappers

- Preserve keyboard, focus, dismissal, and ARIA behavior.
- Do not bypass well-established wrappers casually.

### Accessibility helpers

- Treat `skip-link`, live-region, route-announcer, visually-hidden, and focus helpers as high-value APIs.
- Be careful with timing and focus side effects.

### List, page, and navigation components

- Keep layout and navigation assumptions web-specific and explicit.
- Avoid surprising coupling between generic components and app-level routing logic.

### Map and visualization components

- Keep optional peers and browser-only behavior explicit.
- Avoid making these grouped surfaces feel like required package dependencies.

### Hooks and utilities

- Keep browser assumptions obvious.
- Preserve predictable semantics for media-query, reduced-motion, toast, and utility helpers.

## Docs maintenance rules

- README should guide consumers to `./ui/*` subpaths.
- AGENTS should call out accessibility and web-runtime constraints.
- If new public subpath groups are added, document them explicitly.

## Verification checklist

- `bun run lint:check`
- `bun run typecheck`
- `bun run test`
- Confirm docs still reflect subpath-first usage and current web-specific behavior.
