import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import {
	createPresentationAliasMap,
	createTurbopackResolveExtensions,
	type PresentationAliasOptions,
	type TurbopackAliasTarget,
	WEBPACK_WEB_EXTENSIONS,
} from './presentation-aliases';
export interface ListState<TFilters extends Record<string, unknown>> {
	q: string;
	page: number;
	limit: number;
	sort?: string | null;
	filters: TFilters;
}

export type ListFetcher<TVars, TItem> = (
	vars: TVars
) => Promise<{ items: TItem[]; totalItems?: number; totalPages?: number }>;

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

// ---- Framework config helpers (Webpack / Turbopack / Metro) ----
/** @deprecated Use PresentationAliasOptions. */
export type NextAliasOptions = PresentationAliasOptions;

export interface WebpackResolveLike {
	alias?: Record<string, unknown>;
	extensions?: string[];
	[key: string]: unknown;
}

export interface WebpackConfigLike {
	resolve?: WebpackResolveLike;
	[key: string]: unknown;
}

export interface TurbopackConfigLike {
	resolveAlias?: Record<string, TurbopackAliasTarget>;
	resolveExtensions?: string[];
	[key: string]: unknown;
}

export interface NextConfigLike {
	turbopack?: TurbopackConfigLike;
	[key: string]: unknown;
}

export function withPresentationWebpackAliases<T extends WebpackConfigLike>(
	config: T,
	opts: PresentationAliasOptions = {}
) {
	const resolve = config.resolve ?? {};

	resolve.alias = {
		...(resolve.alias ?? {}),
		...createPresentationAliasMap(opts),
	};
	resolve.extensions = [
		...WEBPACK_WEB_EXTENSIONS,
		...(resolve.extensions ?? []),
	];
	config.resolve = resolve;

	return config;
}

export function withPresentationTurbopackAliases<T extends NextConfigLike>(
	nextConfig: T,
	opts: PresentationAliasOptions = {}
) {
	const turbopack = nextConfig.turbopack ?? {};

	turbopack.resolveAlias = {
		...(turbopack.resolveAlias ?? {}),
		...createPresentationAliasMap(opts),
	};
	turbopack.resolveExtensions = createTurbopackResolveExtensions(
		turbopack.resolveExtensions
	);
	nextConfig.turbopack = turbopack;

	return nextConfig;
}

export type MetroAliasOptions = PresentationAliasOptions & {
	monorepoRoot?: string;
};

export function withPresentationMetroAliases(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	config: any,
	opts: MetroAliasOptions = {}
) {
	const uiWeb = opts.uiKitWeb ?? '@contractspec/lib.ui-kit-web';
	const uiNative = opts.uiKitNative ?? '@contractspec/lib.ui-kit';
	const presReact =
		opts.presentationReact ?? '@contractspec/lib.presentation-runtime-react';
	const presNative =
		opts.presentationNative ??
		'@contractspec/lib.presentation-runtime-react-native';

	// Prefer package exports resolution
	config.resolver ??= {};
	config.resolver.unstable_enablePackageExports = true;

	// Platform resolution ordering
	config.resolver.platforms = [
		'ios',
		'android',
		'native',
		'mobile',
		'web',
		...((config.resolver.platforms as string[]) || []),
	];

	// Map web kit → native at resolver-level
	const original = config.resolver.resolveRequest;
	config.resolver.resolveRequest = (
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		ctx: any,
		moduleName: string,
		platform: string
	) => {
		if (platform === 'ios' || platform === 'android' || platform === 'native') {
			if (
				typeof moduleName === 'string' &&
				moduleName.startsWith(uiWeb + '/ui')
			) {
				const mapped = moduleName.replace(uiWeb + '/ui', uiNative + '/ui');
				return (original ?? ctx.resolveRequest)(ctx, mapped, platform);
			}
			if (moduleName === presReact) {
				return (original ?? ctx.resolveRequest)(ctx, presNative, platform);
			}
		}
		return (original ?? ctx.resolveRequest)(ctx, moduleName, platform);
	};

	return config;
}

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
