export const layerCards = [
	{
		title: '@contractspec/lib.presentation-runtime-core',
		body: 'Shared state, table models, workflow logic, visualization helpers, and the alias helpers consumed by web and native builds.',
	},
	{
		title: '@contractspec/lib.presentation-runtime-react',
		body: 'React-facing hooks such as useContractTable, useDataViewTable, and useWorkflow. This is the shared hook surface most product code starts from.',
	},
	{
		title: '@contractspec/lib.presentation-runtime-react-native',
		body: 'Native entrypoint for mobile apps. It re-exports the shared table and data-view hooks so the controller API stays aligned with the React package.',
	},
	{
		title: '@contractspec/lib.ui-kit-web',
		body: 'Browser-first primitives and accessibility helpers. Reach for this layer when you want direct control over the web renderer.',
	},
	{
		title: '@contractspec/lib.ui-kit',
		body: 'Native-first primitives for Expo and React Native. Reach for this layer when the render surface should stay mobile-native.',
	},
	{
		title: '@contractspec/lib.design-system',
		body: 'Composed components, ThemeSpec/TranslationSpec-aware controls, token helpers, and paired web/mobile implementations that sit on top of both UI kits.',
	},
] as const;
export const hookCards = [
	{
		title: 'useContractTable',
		body: 'Use this when your rows and column definitions already live in product code and you want one headless controller for sorting, pagination, selection, visibility, pinning, sizing, and expansion.',
	},
	{
		title: 'useDataViewTable',
		body: 'Use this when the table should stay driven by a DataViewSpec instead of hand-authored columns. It adapts the spec to the same generic controller model.',
	},
	{
		title: 'Native re-export boundary',
		body: 'On native apps, import the same hook names from @contractspec/lib.presentation-runtime-react-native when you want the import path itself to signal a mobile boundary.',
	},
] as const;
export const aliasSetupCards = [
	{
		title: 'Next.js / Turbopack',
		body: 'Use withPresentationTurbopackAliases as the default path in current Next.js apps. It patches nextConfig.turbopack instead of mutating a webpack config object.',
	},
	{
		title: 'Next.js / Webpack fallback',
		body: 'Use withPresentationWebpackAliases only when a Next.js app explicitly opts back into webpack via the CLI flags.',
	},
	{
		title: 'Expo / Metro',
		body: 'Use withPresentationMetroAliases on Metro when native platforms should resolve web ui-kit /ui imports and the shared React runtime root to native implementations.',
	},
] as const;
export const designSystemHelperCards = [
	{
		title: 'withPlatformUI',
		body: 'Use this lightweight adapter when a design-system surface needs one object that carries the current platform, tokens, and breakpoints.',
	},
	{
		title: 'mapTokensForPlatform',
		body: 'Use this when resolved tokens need to be mapped into platform-specific token shapes before the final renderer consumes them.',
	},
] as const;
export const remapCards = [
	{
		title: 'What Webpack remaps',
		items: [
			'@contractspec/lib.ui-kit -> @contractspec/lib.ui-kit-web',
			'@contractspec/lib.presentation-runtime-react-native -> @contractspec/lib.presentation-runtime-react',
			'Prepends .web.js, .web.jsx, .web.ts, and .web.tsx to webpack resolve.extensions',
		],
	},
	{
		title: 'What Turbopack remaps',
		items: [
			'@contractspec/lib.ui-kit -> @contractspec/lib.ui-kit-web',
			'@contractspec/lib.presentation-runtime-react-native -> @contractspec/lib.presentation-runtime-react',
			'Initializes or merges turbopack.resolveExtensions with a web-first extension list',
		],
	},
	{
		title: 'What Metro remaps',
		items: [
			'@contractspec/lib.ui-kit-web/ui/* -> @contractspec/lib.ui-kit/ui/* on ios/android/native/mobile',
			'Root @contractspec/lib.presentation-runtime-react -> @contractspec/lib.presentation-runtime-react-native',
			'Enables package exports and expands platform resolution ordering',
		],
	},
] as const;
export const layoutRules = [
	'Set gap, align, justify, and wrap explicitly in shared code because defaults are not identical between web and native.',
	'Shared-safe subset: VStack, HStack, and Box with className, gap, align, justify, and wrap.',
	'Web-only feature: as lets stack primitives emit semantic elements such as section, header, main, or article.',
	'Native-only extras: spacing, width, and padding exist on the native stack primitives and should stay out of shared renderer code.',
	'HStack and Box reverse-wrap tokens differ: wrapReverse on web, reverse on native. Prefer nowrap or wrap in shared code.',
	'Box defaults to nowrap on web and wrap on native, so shared code should set wrap intentionally.',
] as const;

export const gotchas = [
	'withPresentationNextAliases no longer exists. Use withPresentationTurbopackAliases for the default Next.js path or withPresentationWebpackAliases for explicit webpack fallback.',
	'Prefer root runtime imports when alias helpers matter. Metro remaps the root @contractspec/lib.presentation-runtime-react package, not arbitrary deep hook subpaths.',
	'Metro only rewrites @contractspec/lib.ui-kit-web/ui/* imports. Router-specific web packages and other web-only helpers still need platform-aware imports.',
	'presentation-runtime-core is headless. It owns models and config helpers, not rendered React components.',
	'design-system compatibility comes from paired .tsx / .native.tsx implementations and token helpers such as withPlatformUI and mapTokensForPlatform.',
	'Form controls should come from @contractspec/lib.design-system when product code needs ThemeSpec or TranslationSpec support.',
	'Stack primitives are similar across platforms, but the prop surface is not identical. Stay inside the common subset for shared renderers.',
	'Alias helpers solve module resolution only. They do not replace app-level monorepo watchFolders, Expo Router setup, or other Next configuration.',
] as const;

export const markdownKitIntro =
	'Copy these markdown snippets into your own AGENTS.md, LLM guide, README, or engineering playbook when you want to enforce the same cross-surface rules across customer projects.';

export const turbopackAliasExample = `import { withPresentationTurbopackAliases } from '@contractspec/lib.presentation-runtime-core';

/** @type {import('next').NextConfig} */
const nextConfig = withPresentationTurbopackAliases({
  turbopack: {
    resolveAlias: {
      fs: { browser: 'browserify-fs' },
    },
  },
});

export default nextConfig;`;

export const webpackAliasExample = `import { withPresentationWebpackAliases } from '@contractspec/lib.presentation-runtime-core';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => withPresentationWebpackAliases(config),
};

export default nextConfig;`;

export const metroAliasExample = `const { getDefaultConfig } = require('expo/metro-config');
const {
  withPresentationMetroAliases,
} = require('@contractspec/lib.presentation-runtime-core');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

module.exports = withPresentationMetroAliases(config);`;

export const designSystemHelperExample = [
	'import {',
	'  defaultTokens,',
	'  mapTokensForPlatform,',
	'  withPlatformUI,',
	"} from '@contractspec/lib.design-system';",
	'',
	"const nativeTokens = mapTokensForPlatform('native', defaultTokens);",
	'',
	'const ui = withPlatformUI({',
	'  tokens: defaultTokens,',
	"  platform: 'web',",
	'});',
	'',
	'// ui is a lightweight config object for design-system consumers.',
	'// nativeTokens is the mapped token shape for a native renderer.',
].join('\n');

export const stackExample = `import { Box, HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';

export function AccountSummaryHeader() {
  return (
    <VStack gap="lg" align="stretch" className="w-full">
      <HStack gap="sm" align="center" justify="between" wrap="wrap">
        <Box gap="xs" align="center" justify="start" wrap="nowrap">
          <StatusDot />
          <Title />
        </Box>
        <Actions />
      </HStack>
      <Filters />
    </VStack>
  );
}

// In native-only files, swap the import to:
// @contractspec/lib.ui-kit/ui/stack
//
// On web-only pages, VStack / HStack / Box also support:
// <VStack as="section">...</VStack>`;

export const renderingExample = `import { DataTable as DesignSystemTable } from '@contractspec/lib.design-system';
import { DataTable as NativeTable } from '@contractspec/lib.ui-kit/ui/data-table';
import { DataTable as WebTable } from '@contractspec/lib.ui-kit-web/ui/data-table';
import { useContractTable } from '@contractspec/lib.presentation-runtime-react';

export function useAccountsController(data, columns) {
  return useContractTable({
    data,
    columns,
    selectionMode: 'single',
    initialState: {
      sorting: [{ id: 'arr', desc: true }],
      pagination: { pageIndex: 0, pageSize: 5 },
    },
  });
}

export function WebAccounts({ controller }) {
  return <WebTable controller={controller} />;
}

export function NativeAccounts({ controller }) {
  return <NativeTable controller={controller} />;
}

export function ProductAccounts({ controller }) {
  return (
    <DesignSystemTable
      controller={controller}
      title="Accounts"
      description="Same controller, composed ContractSpec shell."
    />
  );
}

// If the table is spec-driven instead of hand-authored,
// swap useContractTable for useDataViewTable.`;

export const customerPolicyMarkdown = `# Cross-Surface Rendering Policy

- Import runtime bundler helpers from \`@contractspec/lib.presentation-runtime-core\` root only.
- Use \`withPresentationTurbopackAliases\` for default Next.js projects.
- Use \`withPresentationWebpackAliases\` only when the app explicitly opts into webpack.
- Use \`withPresentationMetroAliases\` for Expo and Metro builds.
- Prefer \`@contractspec/lib.design-system\` for shared product-facing surfaces.
- Use design-system controls when a field must respect ThemeSpec component variants or TranslationSpec messages.
- Use \`@contractspec/lib.ui-kit-web\` only for web-specific primitive lanes.
- Use \`@contractspec/lib.ui-kit\` only for native-specific primitive lanes.
- Keep shared layout code inside the common \`VStack\` / \`HStack\` / \`Box\` subset.
- Do not use removed \`withPresentationNextAliases\`.
- Treat \`.tsx\` / \`.native.tsx\` pairs as the standard design-system compatibility boundary.`;

export const customerChecklistMarkdown = `# Cross-Surface Rendering Checklist

1. Configure the bundler aliases before sharing any UI code.
2. Choose the controller layer:
   - use \`useContractTable\` for app-owned rows and columns
   - use \`useDataViewTable\` for DataViewSpec-driven tables
3. Choose the renderer lane:
   - web primitive: \`@contractspec/lib.ui-kit-web\`
   - native primitive: \`@contractspec/lib.ui-kit\`
   - shared product surface: \`@contractspec/lib.design-system\`
4. Verify mirrored \`.tsx\` / \`.native.tsx\` implementations where the design-system owns the surface.
5. Wrap product surfaces in \`DesignSystemThemeProvider\` and \`DesignSystemTranslationProvider\` when ThemeSpec or TranslationSpec data is available.
6. In shared layout code, set \`gap\`, \`align\`, \`justify\`, and \`wrap\` explicitly.
7. Check docs and examples for root imports and current helper names before copying them into product code.`;
