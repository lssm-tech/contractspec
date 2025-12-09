## Presentation Runtime

Cross-platform runtime for list pages and presentation flows.

### Packages

- `@lssm/lib.presentation-runtime-core`: shared types and config helpers
- `@lssm/lib.presentation-runtime-react`: React hooks (web/native-compatible API)
- `@lssm/lib.presentation-runtime-react-native`: Native entrypoint (re-exports React API for now)

### Next.js config helper

```ts
// next.config.mjs
import { withPresentationNextAliases } from '@lssm/lib.presentation-runtime-core/next';

const nextConfig = {
  webpack: (config) => withPresentationNextAliases(config),
};

export default nextConfig;
```

### Metro config helper

```js
// metro.config.js (CJS)
const { getDefaultConfig } = require('expo/metro-config');
const {
  withPresentationMetroAliases,
} = require('@lssm/lib.presentation-runtime-core/src/metro.cjs');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

module.exports = withPresentationMetroAliases(config);
```

### React hooks

- `useListCoordinator`: URL + RHF + derived variables (no fetching)
- `usePresentationController`: Same plus `fetcher` integration
- `DataViewRenderer` (design-system): render `DataViewSpec` projections (`list`, `table`, `detail`, `grid`) using shared UI atoms

Both accept a `useUrlState` adapter. On web, use `useListUrlState` (design-system) or a Next adapter.

### KYC molecules (bundle)

- `ComplianceBadge` in `@lssm/bundle.strit/presentation/components/kyc` renders a status badge for KYC/compliance snapshots. It accepts a `state` (missing_core | incomplete | complete | expiring | unknown) and optional localized `labels`. Prefer consuming apps to pass translated labels (e.g., via `useT('appPlatformAdmin')`).

### Markdown routes and llms.txt

- Each web app exposes `/llms` (and `/llms.txt`, `/llms.md`) via rewrites. See [llmstxt.org](https://llmstxt.org/).
- Catch‑all markdown handler lives at `app/[...slug].md/route.ts`. It resolves a page descriptor from `app/.presentations.manifest.json` and renders via the `presentations.v2` engine (target: `markdown`).
- Per‑page companion convention: add `app/<route>/ai.ts` exporting a `PresentationDescriptorV2`.
- Build‑time tool: `tools/generate-presentations-manifest.mjs <app-root>` populates the manifest.
- CI check: `pnpm llms:check` verifies coverage (% of pages with descriptors) and fails if below threshold.
