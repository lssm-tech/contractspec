import { describe, expect, test } from 'bun:test';
import { buildExportMaps } from '../lib/exports.mjs';

const TARGETS = {
	node: true,
	browser: true,
};

const TARGET_ROOTS = {
	bun: 'src',
	node: 'src',
	browser: 'src',
	native: 'src',
	types: 'src',
};

describe('buildExportMaps', () => {
	test('keeps simple base-only exports as plain dev strings', () => {
		const { devExports, publishExports } = buildExportMaps(
			['src/index.ts'],
			TARGETS,
			TARGET_ROOTS
		);

		expect(devExports).toEqual({
			'.': './src/index.ts',
		});
		expect(publishExports['.']).toEqual({
			types: './dist/index.d.ts',
			browser: './dist/browser/index.js',
			bun: './dist/index.js',
			node: './dist/node/index.js',
			default: './dist/index.js',
		});
	});

	test('adds style conditional exports for css entries', () => {
		const { devExports, publishExports } = buildExportMaps(
			['src/index.ts'],
			TARGETS,
			TARGET_ROOTS,
			['styles/globals.css', 'src/styles.css']
		);

		expect(devExports['./styles/globals.css']).toEqual({
			style: './styles/globals.css',
			default: './styles/globals.css',
		});
		expect(devExports['./styles.css']).toEqual({
			style: './src/styles.css',
			default: './src/styles.css',
		});
		expect(publishExports['./styles/globals.css']).toEqual({
			style: './dist/styles/globals.css',
			default: './dist/styles/globals.css',
		});
		expect(publishExports['./styles.css']).toEqual({
			style: './dist/styles.css',
			default: './dist/styles.css',
		});
		expect(publishExports['./styles/globals.css']).not.toHaveProperty('types');
		expect(publishExports['./styles/globals.css']).not.toHaveProperty('bun');
		expect(publishExports['./styles/globals.css']).not.toHaveProperty('node');
		expect(publishExports['./styles/globals.css']).not.toHaveProperty(
			'browser'
		);
	});

	test('builds canonical and exact exports for web-only entries', () => {
		const { devExports, publishExports } = buildExportMaps(
			['src/foo.web.ts'],
			TARGETS,
			TARGET_ROOTS
		);

		expect(devExports['./foo']).toEqual({
			types: './src/foo.web.ts',
			browser: './src/foo.web.ts',
			default: './src/foo.web.ts',
		});
		expect(devExports['./foo.web']).toBe('./src/foo.web.ts');
		expect(publishExports['./foo']).toEqual({
			types: './dist/foo.web.d.ts',
			browser: './dist/browser/foo.web.js',
			bun: './dist/foo.web.js',
			default: './dist/foo.web.js',
		});
		expect(publishExports['./foo.web']).toEqual({
			types: './dist/foo.web.d.ts',
			browser: './dist/browser/foo.web.js',
			bun: './dist/foo.web.js',
			default: './dist/foo.web.js',
		});
	});

	test('builds canonical and exact exports for native-only entries', () => {
		const { devExports, publishExports } = buildExportMaps(
			['src/foo.native.ts'],
			TARGETS,
			TARGET_ROOTS
		);

		expect(devExports['./foo']).toEqual({
			types: './src/foo.native.ts',
			'react-native': './src/foo.native.ts',
		});
		expect(devExports['./foo.native']).toBe('./src/foo.native.ts');
		expect(publishExports['./foo']).toEqual({
			types: './dist/foo.native.d.ts',
			'react-native': './dist/native/foo.native.js',
		});
		expect(publishExports['./foo.native']).toEqual({
			types: './dist/foo.native.d.ts',
			'react-native': './dist/native/foo.native.js',
			default: './dist/native/foo.native.js',
		});
	});

	test('builds canonical and exact exports for ios and android entries', () => {
		const { devExports, publishExports } = buildExportMaps(
			['src/foo.ios.ts', 'src/foo.android.ts'],
			TARGETS,
			TARGET_ROOTS
		);

		expect(devExports['./foo']).toEqual({
			types: './src/foo.ios.ts',
			ios: './src/foo.ios.ts',
			android: './src/foo.android.ts',
		});
		expect(devExports['./foo.android']).toBe('./src/foo.android.ts');
		expect(devExports['./foo.ios']).toBe('./src/foo.ios.ts');
		expect(publishExports['./foo']).toEqual({
			types: './dist/foo.ios.d.ts',
			ios: './dist/native/foo.ios.js',
			android: './dist/native/foo.android.js',
		});
		expect(publishExports['./foo.android']).toEqual({
			types: './dist/foo.android.d.ts',
			android: './dist/native/foo.android.js',
			default: './dist/native/foo.android.js',
		});
		expect(publishExports['./foo.ios']).toEqual({
			types: './dist/foo.ios.d.ts',
			ios: './dist/native/foo.ios.js',
			default: './dist/native/foo.ios.js',
		});
	});

	test('merges native, ios, and android variants into canonical conditional exports', () => {
		const { devExports, publishExports } = buildExportMaps(
			['src/foo.native.ts', 'src/foo.ios.ts', 'src/foo.android.ts'],
			TARGETS,
			TARGET_ROOTS
		);

		expect(devExports['./foo']).toEqual({
			types: './src/foo.native.ts',
			ios: './src/foo.ios.ts',
			android: './src/foo.android.ts',
			'react-native': './src/foo.native.ts',
		});
		expect(devExports['./foo.android']).toBe('./src/foo.android.ts');
		expect(devExports['./foo.ios']).toBe('./src/foo.ios.ts');
		expect(devExports['./foo.native']).toBe('./src/foo.native.ts');
		expect(publishExports['./foo']).toEqual({
			types: './dist/foo.native.d.ts',
			ios: './dist/native/foo.ios.js',
			android: './dist/native/foo.android.js',
			'react-native': './dist/native/foo.native.js',
		});
		expect(publishExports['./foo.native']).toEqual({
			types: './dist/foo.native.d.ts',
			'react-native': './dist/native/foo.native.js',
			default: './dist/native/foo.native.js',
		});
	});

	test('merges paired web and native variants into canonical conditional exports', () => {
		const { devExports, publishExports } = buildExportMaps(
			['src/foo.web.ts', 'src/foo.native.ts'],
			TARGETS,
			TARGET_ROOTS
		);

		expect(devExports['./foo']).toEqual({
			types: './src/foo.web.ts',
			browser: './src/foo.web.ts',
			'react-native': './src/foo.native.ts',
			default: './src/foo.web.ts',
		});
		expect(devExports['./foo.native']).toBe('./src/foo.native.ts');
		expect(devExports['./foo.web']).toBe('./src/foo.web.ts');
		expect(publishExports['./foo']).toEqual({
			types: './dist/foo.web.d.ts',
			browser: './dist/browser/foo.web.js',
			'react-native': './dist/native/foo.native.js',
			bun: './dist/foo.web.js',
			default: './dist/foo.web.js',
		});
	});

	test('merges web and native-family variants into canonical conditional exports', () => {
		const { devExports, publishExports } = buildExportMaps(
			[
				'src/foo.web.ts',
				'src/foo.native.ts',
				'src/foo.ios.ts',
				'src/foo.android.ts',
			],
			TARGETS,
			TARGET_ROOTS
		);

		expect(devExports['./foo']).toEqual({
			types: './src/foo.web.ts',
			browser: './src/foo.web.ts',
			ios: './src/foo.ios.ts',
			android: './src/foo.android.ts',
			'react-native': './src/foo.native.ts',
			default: './src/foo.web.ts',
		});
		expect(devExports['./foo.android']).toBe('./src/foo.android.ts');
		expect(devExports['./foo.ios']).toBe('./src/foo.ios.ts');
		expect(devExports['./foo.native']).toBe('./src/foo.native.ts');
		expect(devExports['./foo.web']).toBe('./src/foo.web.ts');
		expect(publishExports['./foo']).toEqual({
			types: './dist/foo.web.d.ts',
			browser: './dist/browser/foo.web.js',
			ios: './dist/native/foo.ios.js',
			android: './dist/native/foo.android.js',
			'react-native': './dist/native/foo.native.js',
			bun: './dist/foo.web.js',
			default: './dist/foo.web.js',
		});
	});

	test('prefers the base file for generic conditions when a web variant exists', () => {
		const { devExports, publishExports } = buildExportMaps(
			['src/foo.ts', 'src/foo.web.ts'],
			TARGETS,
			TARGET_ROOTS
		);

		expect(devExports['./foo']).toEqual({
			types: './src/foo.ts',
			browser: './src/foo.web.ts',
			default: './src/foo.ts',
		});
		expect(publishExports['./foo']).toEqual({
			types: './dist/foo.d.ts',
			browser: './dist/browser/foo.web.js',
			bun: './dist/foo.js',
			node: './dist/node/foo.js',
			default: './dist/foo.js',
		});
	});

	test('adds react-native while keeping the base export as the default fallback', () => {
		const { devExports, publishExports } = buildExportMaps(
			['src/foo.ts', 'src/foo.native.ts'],
			TARGETS,
			TARGET_ROOTS
		);

		expect(devExports['./foo']).toEqual({
			types: './src/foo.ts',
			'react-native': './src/foo.native.ts',
			default: './src/foo.ts',
		});
		expect(publishExports['./foo']).toEqual({
			types: './dist/foo.d.ts',
			'react-native': './dist/native/foo.native.js',
			bun: './dist/foo.js',
			node: './dist/node/foo.js',
			browser: './dist/browser/foo.js',
			default: './dist/foo.js',
		});
	});

	test('handles base, web, and native variants together', () => {
		const { devExports, publishExports } = buildExportMaps(
			['src/foo.ts', 'src/foo.web.ts', 'src/foo.native.ts'],
			TARGETS,
			TARGET_ROOTS
		);

		expect(devExports['./foo']).toEqual({
			types: './src/foo.ts',
			browser: './src/foo.web.ts',
			'react-native': './src/foo.native.ts',
			default: './src/foo.ts',
		});
		expect(publishExports['./foo']).toEqual({
			types: './dist/foo.d.ts',
			browser: './dist/browser/foo.web.js',
			'react-native': './dist/native/foo.native.js',
			bun: './dist/foo.js',
			node: './dist/node/foo.js',
			default: './dist/foo.js',
		});
	});

	test('does not emit empty publish export objects', () => {
		const { publishExports } = buildExportMaps(
			['src/foo.native.ts'],
			{ node: false, browser: false },
			TARGET_ROOTS
		);

		for (const value of Object.values(publishExports)) {
			expect(Object.keys(value).length).toBeGreaterThan(0);
		}
	});
});
