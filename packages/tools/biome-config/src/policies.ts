import { adoptionPolicyManifest } from './policies-adoption';
import type { ContractSpecPolicyRule } from './types';

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
		files: [
			'packages/apps/**/*.{jsx,tsx}',
			'packages/bundles/**/*.{jsx,tsx}',
			'packages/examples/**/*.{jsx,tsx}',
			'packages/modules/**/*.{jsx,tsx}',
		],
		message:
			'Use ContractSpec design-system primitives instead of raw HTML in application surfaces.',
		options: {
			elements: {
				div: 'Use layout primitives from @contractspec/lib.design-system instead of <div> in application surfaces.',
				section:
					'Use layout primitives from @contractspec/lib.design-system instead of <section> in application surfaces.',
				main: 'Use an app or marketing layout component instead of <main> in application surfaces.',
				header:
					'Use a design-system header or page-header component instead of <header> in application surfaces.',
				footer:
					'Use a design-system layout primitive instead of <footer> in application surfaces.',
				nav: 'Use the shared navigation primitives instead of <nav> in application surfaces.',
				span: 'Use typography primitives instead of raw <span> in application surfaces.',
				p: 'Use typography primitives instead of raw <p> in application surfaces.',
				h1: 'Use typography primitives instead of raw heading tags in application surfaces.',
				h2: 'Use typography primitives instead of raw heading tags in application surfaces.',
				h3: 'Use typography primitives instead of raw heading tags in application surfaces.',
				h4: 'Use typography primitives instead of raw heading tags in application surfaces.',
				h5: 'Use typography primitives instead of raw heading tags in application surfaces.',
				h6: 'Use typography primitives instead of raw heading tags in application surfaces.',
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
				div: 'Prefer ContractSpec layout primitives instead of raw <div>.',
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
