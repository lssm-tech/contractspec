## Presentation Runtime

Cross-platform runtime for list pages, presentation flows, and headless ContractSpec tables.

### Packages

- `@contractspec/lib.presentation-runtime-core`: shared state/types for URL state, list coordination, and headless table controllers
- `@contractspec/lib.presentation-runtime-react`: React hooks (web/native-compatible API)
- `@contractspec/lib.presentation-runtime-react-native`: Native entrypoint (re-exports the shared React table hooks and keeps native form/list helpers)

### Next.js config helper

```ts
// next.config.mjs
import { withPresentationNextAliases } from '@contractspec/lib.presentation-runtime-core/next';

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
} = require('@contractspec/lib.presentation-runtime-core/src/metro.cjs');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

module.exports = withPresentationMetroAliases(config);
```

### React hooks

- `useListCoordinator`: URL + RHF + derived variables (no fetching)
- `usePresentationController`: Same plus `fetcher` integration
- `useContractTable`: headless TanStack-backed controller for sorting, pagination, selection, visibility, pinning, resizing, and expansion
- `useDataViewTable`: adapter that maps `DataViewSpec` table contracts onto the generic controller
- `DataViewRenderer` (design-system): render `DataViewSpec` projections (`list`, `table`, `detail`, `grid`) using shared UI atoms

Both list hooks accept a `useUrlState` adapter. On web, use `useListUrlState` (design-system) or a Next adapter.

### Table layering

- `contracts-spec`: declarative table contract (`DataViewTableConfig`)
- `presentation-runtime-*`: headless controller state and TanStack integration
- `ui-kit` / `ui-kit-web`: platform renderers that consume controller output
- `design-system`: opinionated `DataTable`, `DataViewTable`, `ApprovalQueue`, and `ListTablePage`

### KYC molecules (bundle)

- `ComplianceBadge` in `@contractspec/bundle.strit/presentation/components/kyc` renders a status badge for KYC/compliance snapshots. It accepts a `state` (missing_core | incomplete | complete | expiring | unknown) and optional localized `labels`. Prefer consuming apps to pass translated labels (e.g., via `useT('appPlatformAdmin')`).

### Markdown routes and llms.txt

- Each web app exposes `/llms` (and `/llms.txt`, `/llms.md`) via rewrites. See [llmstxt.org](https://llmstxt.org/).
- Catch‑all markdown handler lives at `app/[...slug].md/route.ts`. It resolves a page descriptor from `app/.presentations.manifest.json` and renders via the `presentations.v2` engine (target: `markdown`).
- Per‑page companion convention: add `app/<route>/ai.ts` exporting a `PresentationSpec`.
- Build‑time tool: `tools/generate-presentations-manifest.mjs <app-root>` populates the manifest.
- CI check: `bunllms:check` verifies coverage (% of pages with descriptors) and fails if below threshold.
