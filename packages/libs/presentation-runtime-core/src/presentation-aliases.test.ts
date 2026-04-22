import { describe, expect, test } from 'bun:test';
import type { NextConfigLike } from './index';
import {
	withPresentationMetroAliases,
	withPresentationTurbopackAliases,
	withPresentationWebpackAliases,
} from './index';
import { withPresentationMetroAliases as withPresentationMetroAliasesFromSubpath } from './metro';
import {
	withPresentationTurbopackAliases as withPresentationTurbopackAliasesFromSubpath,
	withPresentationWebpackAliases as withPresentationWebpackAliasesFromSubpath,
} from './next';

describe('presentation alias helpers', () => {
	test('withPresentationWebpackAliases merges aliases and prepends web extensions', () => {
		const config = {
			resolve: {
				alias: {
					existing: 'value',
				},
				extensions: ['.tsx', '.ts'],
			},
		};

		const result = withPresentationWebpackAliases(config);

		expect(result).toBe(config);
		expect(config.resolve.alias).toMatchObject({
			existing: 'value',
			'@contractspec/lib.ui-kit': '@contractspec/lib.ui-kit-web',
			'@contractspec/lib.presentation-runtime-react-native':
				'@contractspec/lib.presentation-runtime-react',
			'lucide-react-native': 'lucide-react',
		});
		expect(config.resolve.extensions).toEqual([
			'.web.js',
			'.web.jsx',
			'.web.ts',
			'.web.tsx',
			'.tsx',
			'.ts',
		]);
	});

	test('withPresentationTurbopackAliases patches resolveAlias and initializes default extensions', () => {
		const nextConfig: NextConfigLike = {
			reactStrictMode: true,
		};

		const result = withPresentationTurbopackAliases(nextConfig);

		expect(result).toBe(nextConfig);
		expect(nextConfig.turbopack).toEqual({
			resolveAlias: {
				'@contractspec/lib.ui-kit': '@contractspec/lib.ui-kit-web',
				'@contractspec/lib.presentation-runtime-react-native':
					'@contractspec/lib.presentation-runtime-react',
				'lucide-react-native': 'lucide-react',
			},
			resolveExtensions: [
				'.web.tsx',
				'.web.ts',
				'.web.jsx',
				'.web.js',
				'.tsx',
				'.ts',
				'.jsx',
				'.js',
				'.mjs',
				'.json',
			],
		});
	});

	test('withPresentationTurbopackAliases prepends web extensions and preserves caller order after them', () => {
		const nextConfig = {
			turbopack: {
				resolveAlias: {
					existing: 'alias',
				},
				resolveExtensions: ['.mdx', '.web.tsx', '.tsx', '.js'],
			},
		};

		withPresentationTurbopackAliases(nextConfig);

		expect(nextConfig.turbopack.resolveAlias).toMatchObject({
			existing: 'alias',
			'@contractspec/lib.ui-kit': '@contractspec/lib.ui-kit-web',
			'@contractspec/lib.presentation-runtime-react-native':
				'@contractspec/lib.presentation-runtime-react',
			'lucide-react-native': 'lucide-react',
		});
		expect(nextConfig.turbopack.resolveExtensions).toEqual([
			'.web.tsx',
			'.web.ts',
			'.web.jsx',
			'.web.js',
			'.mdx',
			'.tsx',
			'.js',
		]);
	});

	test('withPresentationMetroAliases keeps native remapping behavior unchanged', () => {
		const calls: Array<{ moduleName: string; platform: string }> = [];
		const originalResolve = (
			_ctx: unknown,
			moduleName: string,
			platform: string
		) => {
			calls.push({ moduleName, platform });
			return { moduleName, platform };
		};

		const config: {
			resolver: {
				platforms: string[];
				resolveRequest: (
					_ctx: unknown,
					moduleName: string,
					platform: string
				) => { moduleName: string; platform: string };
				unstable_enablePackageExports?: boolean;
			};
		} = {
			resolver: {
				platforms: ['web'],
				resolveRequest: originalResolve,
			},
		};

		withPresentationMetroAliases(config);

		expect(config.resolver.unstable_enablePackageExports).toBe(true);
		expect(config.resolver.platforms).toEqual([
			'ios',
			'android',
			'native',
			'mobile',
			'web',
			'web',
		]);

		config.resolver.resolveRequest(
			{},
			'@contractspec/lib.ui-kit-web/ui/stack',
			'ios'
		);
		config.resolver.resolveRequest(
			{},
			'@contractspec/lib.presentation-runtime-react',
			'native'
		);
		config.resolver.resolveRequest({}, 'lucide-react', 'android');
		config.resolver.resolveRequest({}, 'tslib', 'ios');
		config.resolver.resolveRequest(
			{},
			'@contractspec/lib.ui-kit-web/ui/stack',
			'web'
		);
		config.resolver.resolveRequest({}, 'lucide-react', 'web');
		config.resolver.resolveRequest({}, 'tslib', 'web');

		expect(calls).toEqual([
			{
				moduleName: '@contractspec/lib.ui-kit/ui/stack',
				platform: 'ios',
			},
			{
				moduleName: '@contractspec/lib.presentation-runtime-react-native',
				platform: 'native',
			},
			{
				moduleName: 'lucide-react-native',
				platform: 'android',
			},
			{
				moduleName: 'tslib/tslib.es6.js',
				platform: 'ios',
			},
			{
				moduleName: '@contractspec/lib.ui-kit-web/ui/stack',
				platform: 'web',
			},
			{
				moduleName: 'lucide-react',
				platform: 'web',
			},
			{
				moduleName: 'tslib',
				platform: 'web',
			},
		]);
	});

	test('subpath helpers remain importable', () => {
		expect(typeof withPresentationMetroAliasesFromSubpath).toBe('function');
		expect(typeof withPresentationTurbopackAliasesFromSubpath).toBe('function');
		expect(typeof withPresentationWebpackAliasesFromSubpath).toBe('function');
	});
});
