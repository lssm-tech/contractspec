import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
export interface ListState<TFilters extends Record<string, unknown>> {
	q: string;
	page: number;
	limit: number;
	sort?: string | null;
	filters: TFilters;
}

export interface ListFilterScope<
	TFilters extends Record<string, unknown> = Record<string, unknown>,
> {
	initial?: Partial<TFilters>;
	locked?: Partial<TFilters>;
}

export function sanitizeListUserFilters<
	TFilters extends Record<string, unknown>,
>(filters: TFilters, scope?: ListFilterScope<TFilters>): TFilters {
	const lockedKeys = new Set(Object.keys(scope?.locked ?? {}));
	return Object.fromEntries(
		Object.entries(filters).filter(
			([key, value]) =>
				!lockedKeys.has(key) &&
				value !== undefined &&
				value !== null &&
				value !== ''
		)
	) as TFilters;
}

export function createInitialListFilters<
	TFilters extends Record<string, unknown>,
>(scope?: ListFilterScope<TFilters>): TFilters {
	return sanitizeListUserFilters(
		{ ...(scope?.initial ?? {}) } as TFilters,
		scope
	);
}

export function resolveListStateFilters<
	TFilters extends Record<string, unknown>,
>(filters: TFilters, scope?: ListFilterScope<TFilters>): TFilters {
	return {
		...sanitizeListUserFilters(filters, scope),
		...(scope?.locked ?? {}),
	} as TFilters;
}

export function createScopedListState<TFilters extends Record<string, unknown>>(
	state: ListState<TFilters>,
	scope?: ListFilterScope<TFilters>
): ListState<TFilters> {
	return {
		...state,
		filters: resolveListStateFilters(state.filters, scope),
	};
}

export type ListFetcher<TVars, TItem> = (
	vars: TVars
) => Promise<{ items: TItem[]; totalItems?: number; totalPages?: number }>;

// ---- Framework config helpers (Webpack / Turbopack / Metro) ----
export type {
	MetroAliasOptions,
	MetroConfigLike,
	MetroResolveContextLike,
	MetroResolveRequestLike,
	MetroResolveResult,
	MetroResolverLike,
} from './metro';
export { withPresentationMetroAliases } from './metro';
export type {
	NextAliasOptions,
	NextConfigLike,
	TurbopackConfigLike,
	WebpackConfigLike,
	WebpackResolveLike,
} from './next';
export {
	withPresentationTurbopackAliases,
	withPresentationWebpackAliases,
} from './next';
export type {
	ContractTableCellAlign,
	ContractTableCellRenderModel,
	ContractTableColumnRenderModel,
	ContractTableController,
	ContractTableExecutionMode,
	ContractTableExpandedState,
	ContractTableInitialState,
	ContractTablePaginationState,
	ContractTablePinningState,
	ContractTablePinState,
	ContractTableRowRenderModel,
	ContractTableRowSelectionState,
	ContractTableSelectionMode,
	ContractTableSizingState,
	ContractTableSort,
	ContractTableState,
	ContractTableVisibilityState,
} from './table';
export { createEmptyTableState } from './table';
export type {
	ContractVisualizationAnnotationModel,
	ContractVisualizationAxisModel,
	ContractVisualizationGeoModel,
	ContractVisualizationMetricModel,
	ContractVisualizationPoint,
	ContractVisualizationRenderModel,
	ContractVisualizationSeriesModel,
	ContractVisualizationTableAlternative,
} from './visualization';
export {
	createVisualizationModel,
	formatVisualizationValue,
} from './visualization';
export { buildVisualizationEChartsOption } from './visualization.echarts';

export const tech_presentation_runtime_DocBlocks: DocBlock[] = [
	{
		id: 'docs.tech.presentation-runtime',
		title: 'Presentation Runtime',
		summary:
			'Cross-platform runtime for list pages, presentation flows, and headless ContractSpec tables.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/presentation-runtime',
		tags: ['tech', 'presentation-runtime'],
		body: "## Presentation Runtime\n\nCross-platform runtime for list pages, presentation flows, and headless ContractSpec tables.\n\n### Packages\n\n- `@contractspec/lib.presentation-runtime-core`: shared state/types for URL state, list coordination, headless table controllers, and bundler alias helpers\n- `@contractspec/lib.presentation-runtime-react`: React hooks (web/native-compatible API)\n- `@contractspec/lib.presentation-runtime-react-native`: Native entrypoint (re-exports the shared React table hooks and keeps native form/list helpers)\n\n### Next.js Turbopack helper (default)\n\n```ts\n// next.config.mjs\nimport { withPresentationTurbopackAliases } from '@contractspec/lib.presentation-runtime-core';\n\nconst nextConfig = withPresentationTurbopackAliases({\n  turbopack: {\n    resolveAlias: {\n      fs: { browser: 'browserify-fs' },\n    },\n  },\n});\n\nexport default nextConfig;\n```\n\n### Next.js Webpack helper (fallback)\n\n```ts\n// next.config.mjs\nimport { withPresentationWebpackAliases } from '@contractspec/lib.presentation-runtime-core';\n\nconst nextConfig = {\n  webpack: (config) => withPresentationWebpackAliases(config),\n};\n\nexport default nextConfig;\n```\n\nUse Webpack only when you explicitly opt in with `next dev --webpack` or `next build --webpack`.\n\n### Metro config helper\n\n```js\n// metro.config.js (CJS)\nconst { getDefaultConfig } = require('expo/metro-config');\nconst {\n  withPresentationMetroAliases,\n} = require('@contractspec/lib.presentation-runtime-core');\n\nconst projectRoot = __dirname;\nconst config = getDefaultConfig(projectRoot);\n\nmodule.exports = withPresentationMetroAliases(config);\n```\n\n### React hooks\n\n- `useListCoordinator`: URL + RHF + derived variables (no fetching)\n- `usePresentationController`: Same plus `fetcher` integration\n- `useContractTable`: headless TanStack-backed controller for sorting, pagination, selection, visibility, pinning, resizing, and expansion\n- `useDataViewTable`: adapter that maps `DataViewSpec` table contracts onto the generic controller\n- `DataViewRenderer` (design-system): render `DataViewSpec` projections (`list`, `table`, `detail`, `grid`) using shared UI atoms\n\nBoth list hooks accept a `useUrlState` adapter. On web, use `useListUrlState` (design-system) or a Next adapter.\n\n### Table layering\n\n- `contracts-spec`: declarative table contract (`DataViewTableConfig`)\n- `presentation-runtime-*`: headless controller state and TanStack integration\n- `ui-kit` / `ui-kit-web`: platform renderers that consume controller output\n- `design-system`: opinionated `DataTable`, `DataViewTable`, `ApprovalQueue`, and `ListTablePage`\n\n### KYC molecules (bundle)\n\n- `ComplianceBadge` in `@contractspec/bundle.strit/presentation/components/kyc` renders a status badge for KYC/compliance snapshots. It accepts a `state` (missing_core | incomplete | complete | expiring | unknown) and optional localized `labels`. Prefer consuming apps to pass translated labels (e.g., via `useT('appPlatformAdmin')`).\n\n### Markdown routes and llms.txt\n\n- Each web app exposes `/llms` (and `/llms.txt`, `/llms.md`) via rewrites. See [llmstxt.org](https://llmstxt.org/).\n- Catch\u2011all markdown handler lives at `app/[...slug].md/route.ts`. It resolves a page descriptor from `app/.presentations.manifest.json` and renders via the `presentations.v2` engine (target: `markdown`).\n- Per\u2011page companion convention: add `app/<route>/ai.ts` exporting a `PresentationSpec`.\n- Build\u2011time tool: `tools/generate-presentations-manifest.mjs <app-root>` populates the manifest.\n- CI check: `bunllms:check` verifies coverage (% of pages with descriptors) and fails if below threshold.\n",
	},
];
export * from './presentation-runtime-core.feature';
