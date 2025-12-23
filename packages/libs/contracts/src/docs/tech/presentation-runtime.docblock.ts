import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '../registry';

export const tech_presentation_runtime_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.presentation-runtime',
    title: 'Presentation Runtime',
    summary: 'Cross-platform runtime for list pages and presentation flows.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/presentation-runtime',
    tags: ['tech', 'presentation-runtime'],
    body: "## Presentation Runtime\n\nCross-platform runtime for list pages and presentation flows.\n\n### Packages\n\n- `@lssm/lib.presentation-runtime-core`: shared types and config helpers\n- `@lssm/lib.presentation-runtime-react`: React hooks (web/native-compatible API)\n- `@lssm/lib.presentation-runtime-react-native`: Native entrypoint (re-exports React API for now)\n\n### Next.js config helper\n\n```ts\n// next.config.mjs\nimport { withPresentationNextAliases } from '@lssm/lib.presentation-runtime-core/next';\n\nconst nextConfig = {\n  webpack: (config) => withPresentationNextAliases(config),\n};\n\nexport default nextConfig;\n```\n\n### Metro config helper\n\n```js\n// metro.config.js (CJS)\nconst { getDefaultConfig } = require('expo/metro-config');\nconst {\n  withPresentationMetroAliases,\n} = require('@lssm/lib.presentation-runtime-core/src/metro.cjs');\n\nconst projectRoot = __dirname;\nconst config = getDefaultConfig(projectRoot);\n\nmodule.exports = withPresentationMetroAliases(config);\n```\n\n### React hooks\n\n- `useListCoordinator`: URL + RHF + derived variables (no fetching)\n- `usePresentationController`: Same plus `fetcher` integration\n- `DataViewRenderer` (design-system): render `DataViewSpec` projections (`list`, `table`, `detail`, `grid`) using shared UI atoms\n\nBoth accept a `useUrlState` adapter. On web, use `useListUrlState` (design-system) or a Next adapter.\n\n### KYC molecules (bundle)\n\n- `ComplianceBadge` in `@lssm/bundle.strit/presentation/components/kyc` renders a status badge for KYC/compliance snapshots. It accepts a `state` (missing_core | incomplete | complete | expiring | unknown) and optional localized `labels`. Prefer consuming apps to pass translated labels (e.g., via `useT('appPlatformAdmin')`).\n\n### Markdown routes and llms.txt\n\n- Each web app exposes `/llms` (and `/llms.txt`, `/llms.md`) via rewrites. See [llmstxt.org](https://llmstxt.org/).\n- Catch\u2011all markdown handler lives at `app/[...slug].md/route.ts`. It resolves a page descriptor from `app/.presentations.manifest.json` and renders via the `presentations.v2` engine (target: `markdown`).\n- Per\u2011page companion convention: add `app/<route>/ai.ts` exporting a `PresentationDescriptorV2`.\n- Build\u2011time tool: `tools/generate-presentations-manifest.mjs <app-root>` populates the manifest.\n- CI check: `pnpm llms:check` verifies coverage (% of pages with descriptors) and fails if below threshold.\n",
  },
];
registerDocBlocks(tech_presentation_runtime_DocBlocks);
