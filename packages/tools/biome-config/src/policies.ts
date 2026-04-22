import { adoptionPolicyManifest } from './policies-adoption';
import type { ContractSpecPolicyRule } from './types';

const typographyTextContainers = [
	'Text',
	'H1',
	'H2',
	'H3',
	'H4',
	'P',
	'Lead',
	'Large',
	'Small',
	'Muted',
	'Code',
	'BlockQuote',
	'LegalText',
	'LegalHeading',
];

const repoSharedPresentationSurfaceFiles = [
	'packages/bundles/**/*.{jsx,tsx}',
	'packages/examples/**/*.{jsx,tsx}',
	'packages/modules/**/*.{jsx,tsx}',
];

export const policyManifest: ContractSpecPolicyRule[] = [
	{
		id: 'repo/no-native-ui-kit-in-web-surfaces',
		audience: 'repo',
		engine: 'biome-native',
		severity: 'error',
		files: [
			'packages/apps/**/*.{js,jsx,ts,tsx}',
			'packages/bundles/**/*.{js,jsx,ts,tsx}',
			'packages/examples/**/*.{js,jsx,ts,tsx}',
			'packages/modules/**/*.{js,jsx,ts,tsx}',
			'!packages/apps/mobile-demo/**/*.{js,jsx,ts,tsx}',
		],
		message: 'Web surfaces must not import the native ui-kit directly.',
		options: {
			paths: {
				'@contractspec/lib.ui-kit':
					'Do not import native ui-kit in web code. Use @contractspec/lib.design-system or @contractspec/lib.ui-kit-web.',
			},
		},
		docsSource: 'packs/workspace-specific/rules/design-system-usage.md',
	},
	{
		id: 'repo/no-web-ui-kit-in-native-surfaces',
		audience: 'repo',
		engine: 'biome-native',
		severity: 'error',
		files: ['packages/apps/mobile-demo/**/*.{js,jsx,ts,tsx}'],
		message: 'Native surfaces must not import the web ui-kit directly.',
		options: {
			paths: {
				'@contractspec/lib.ui-kit-web':
					'Do not import web ui-kit in native code directly. Use the design-system boundary or platform mapping.',
			},
		},
		docsSource: 'packs/workspace-specific/rules/design-system-usage.md',
	},
	{
		id: 'repo/no-raw-html-in-app-surfaces',
		audience: 'repo',
		engine: 'biome-native',
		severity: 'error',
		files: repoSharedPresentationSurfaceFiles,
		message:
			'Use ContractSpec design-system primitives instead of raw HTML in application surfaces.',
		options: {
			appPackageAllowList: [],
			elements: {
				div: 'Use HStack, VStack, or Box from @contractspec/lib.design-system/layout instead of <div> in application surfaces.',
				section:
					'Use HStack, VStack, or Box from @contractspec/lib.design-system/layout instead of <section> in application surfaces.',
				main: 'Use an app or marketing layout component instead of <main> in application surfaces.',
				header:
					'Use a design-system header or page-header component instead of <header> in application surfaces.',
				footer:
					'Use HStack, VStack, or Box from @contractspec/lib.design-system/layout instead of <footer> in application surfaces.',
				nav: 'Use the shared navigation primitives instead of <nav> in application surfaces.',
				span: 'Use Text or a typography component from @contractspec/lib.design-system instead of raw <span> in application surfaces.',
				p: 'Use Text or a typography component from @contractspec/lib.design-system instead of raw <p> in application surfaces.',
				h1: 'Use Text or a typography heading component from @contractspec/lib.design-system instead of raw heading tags in application surfaces.',
				h2: 'Use Text or a typography heading component from @contractspec/lib.design-system instead of raw heading tags in application surfaces.',
				h3: 'Use Text or a typography heading component from @contractspec/lib.design-system instead of raw heading tags in application surfaces.',
				h4: 'Use Text or a typography heading component from @contractspec/lib.design-system instead of raw heading tags in application surfaces.',
				h5: 'Use Text or a typography heading component from @contractspec/lib.design-system instead of raw heading tags in application surfaces.',
				h6: 'Use Text or a typography heading component from @contractspec/lib.design-system instead of raw heading tags in application surfaces.',
				ul: 'Use List from @contractspec/lib.design-system/list instead of raw <ul> in application surfaces.',
				ol: 'Use List with type="ordered" from @contractspec/lib.design-system/list instead of raw <ol> in application surfaces.',
				li: 'Use ListItem from @contractspec/lib.design-system/list instead of raw <li> in application surfaces.',
				button:
					'Use a design-system action primitive instead of raw <button> in application surfaces.',
				input:
					'Use a design-system form primitive instead of raw <input> in application surfaces.',
				textarea:
					'Use a design-system form primitive instead of raw <textarea> in application surfaces.',
				select:
					'Use a design-system form primitive instead of raw <select> in application surfaces.',
				form: 'Use a design-system form primitive instead of raw <form> in application surfaces.',
				label:
					'Use a design-system form primitive instead of raw <label> in application surfaces.',
			},
		},
		docsSource: 'packs/workspace-specific/rules/design-system-usage.md',
	},
	{
		id: 'repo/no-raw-jsx-text-outside-typography',
		audience: 'repo',
		engine: 'biome-grit',
		severity: 'error',
		files: repoSharedPresentationSurfaceFiles,
		message:
			'Wrap visible JSX text with Text or another approved typography component for React and React Native compatibility.',
		options: {
			appPackageAllowList: [],
			textContainers: typographyTextContainers,
		},
		docsSource: 'packs/workspace-specific/rules/design-system-usage.md',
	},
	{
		id: 'repo/prefer-design-system-imports',
		audience: 'repo',
		engine: 'biome-grit',
		severity: 'error',
		files: [
			'packages/apps/**/*.{jsx,tsx}',
			'packages/bundles/**/*.{jsx,tsx}',
			'packages/examples/**/*.{jsx,tsx}',
			'packages/modules/**/*.{jsx,tsx}',
		],
		message:
			'Prefer @contractspec/lib.design-system over leaf ui-kit-web control imports in application surfaces.',
		options: {
			replacements: {
				'@contractspec/lib.ui-kit-web/ui/button':
					'@contractspec/lib.design-system',
				'@contractspec/lib.ui-kit-web/ui/input':
					'@contractspec/lib.design-system',
				'@contractspec/lib.ui-kit-web/ui/textarea':
					'@contractspec/lib.design-system',
				'@contractspec/lib.ui-kit-web/ui/card':
					'@contractspec/lib.design-system',
				'@contractspec/lib.ui-kit-web/ui/form':
					'@contractspec/lib.design-system',
				'@contractspec/lib.ui-kit-web/ui/label':
					'@contractspec/lib.design-system',
			},
		},
		docsSource: 'packs/workspace-specific/rules/design-system-usage.md',
	},
	{
		id: 'consumer/no-native-html-components',
		audience: 'consumer',
		engine: 'biome-native',
		severity: 'error',
		files: [
			'src/**/*.{jsx,tsx}',
			'app/**/*.{jsx,tsx}',
			'components/**/*.{jsx,tsx}',
		],
		message:
			'Consumer applications should use ContractSpec design-system and ui-kit components instead of native HTML primitives.',
		options: {
			elements: {
				div: 'Prefer HStack, VStack, or Box from @contractspec/lib.design-system/layout instead of raw <div>.',
				section:
					'Prefer HStack, VStack, or Box from @contractspec/lib.design-system/layout instead of raw <section>.',
				main: 'Prefer an app layout primitive instead of raw <main>.',
				header:
					'Prefer a design-system header primitive instead of raw <header>.',
				footer:
					'Prefer HStack, VStack, or Box from @contractspec/lib.design-system/layout instead of raw <footer>.',
				nav: 'Prefer shared navigation primitives instead of raw <nav>.',
				span: 'Prefer Text or a typography component instead of raw <span>.',
				p: 'Prefer Text or a typography component instead of raw <p>.',
				h1: 'Prefer Text or a typography heading component instead of raw <h1>.',
				h2: 'Prefer Text or a typography heading component instead of raw <h2>.',
				h3: 'Prefer Text or a typography heading component instead of raw <h3>.',
				h4: 'Prefer Text or a typography heading component instead of raw <h4>.',
				h5: 'Prefer Text or a typography heading component instead of raw <h5>.',
				h6: 'Prefer Text or a typography heading component instead of raw <h6>.',
				ul: 'Prefer List from @contractspec/lib.design-system/list instead of raw <ul>.',
				ol: 'Prefer List with type="ordered" from @contractspec/lib.design-system/list instead of raw <ol>.',
				li: 'Prefer ListItem from @contractspec/lib.design-system/list instead of raw <li>.',
				button:
					'Prefer a ContractSpec button primitive instead of raw <button>.',
				input: 'Prefer a ContractSpec input primitive instead of raw <input>.',
				textarea:
					'Prefer a ContractSpec textarea primitive instead of raw <textarea>.',
				select:
					'Prefer a ContractSpec select primitive instead of raw <select>.',
				form: 'Prefer a ContractSpec form primitive instead of raw <form>.',
			},
		},
		docsSource: 'packs/workspace-specific/rules/design-system-usage.md',
	},
	{
		id: 'consumer/no-raw-jsx-text-outside-typography',
		audience: 'consumer',
		engine: 'biome-grit',
		severity: 'error',
		files: [
			'src/**/*.{jsx,tsx}',
			'app/**/*.{jsx,tsx}',
			'components/**/*.{jsx,tsx}',
		],
		message:
			'Wrap visible JSX text with Text or another approved typography component for React and React Native compatibility.',
		options: {
			textContainers: typographyTextContainers,
		},
		docsSource: 'packs/workspace-specific/rules/design-system-usage.md',
	},
	{
		id: 'consumer/prefer-contractspec-design-system-imports',
		audience: 'consumer',
		engine: 'biome-grit',
		severity: 'error',
		files: [
			'src/**/*.{jsx,tsx}',
			'app/**/*.{jsx,tsx}',
			'components/**/*.{jsx,tsx}',
		],
		message:
			'Consumer applications should import controls from @contractspec/lib.design-system before reaching for ui-kit-web leaf imports.',
		options: {
			replacements: {
				'@contractspec/lib.ui-kit-web/ui/button':
					'@contractspec/lib.design-system',
				'@contractspec/lib.ui-kit-web/ui/input':
					'@contractspec/lib.design-system',
				'@contractspec/lib.ui-kit-web/ui/textarea':
					'@contractspec/lib.design-system',
			},
		},
		docsSource: 'packs/workspace-specific/rules/design-system-usage.md',
	},
	{
		id: 'consumer/require-contract-first',
		audience: 'consumer',
		engine: 'contractspec-ci',
		severity: 'error',
		files: [
			'src/**/*.{ts,tsx}',
			'app/**/*.{ts,tsx}',
			'routes/**/*.{ts,tsx}',
			'handlers/**/*.{ts,tsx}',
		],
		message:
			'Handlers, routes, and implementation entrypoints must import or reference a ContractSpec contract before shipping behavior.',
		docsSource: 'packs/contractspec-rules/rules/contracts-first.md',
	},
	...adoptionPolicyManifest,
];
