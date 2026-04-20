import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const packageRoot = path.resolve(new URL('..', import.meta.url).pathname);

const syntaxTargets = [
	'dist/index.js',
	'dist/browser/index.js',
	'dist/renderers/index.js',
];

const polyfillBoundaries = [
	{
		file: 'dist/renderers/form-contract.js',
		importPath: '@contractspec/lib.ui-kit-web/ui/stack',
	},
	{
		file: 'dist/components/atoms/Input.js',
		importPath: '@contractspec/lib.ui-kit-web/ui/input',
	},
];

function assertFileExists(relativePath) {
	const absolutePath = path.join(packageRoot, relativePath);
	if (!existsSync(absolutePath)) {
		throw new Error(`Missing generated artifact: ${relativePath}`);
	}
	return absolutePath;
}

function checkSyntax(relativePath) {
	const absolutePath = assertFileExists(relativePath);
	const result = spawnSync(process.execPath, ['--check', absolutePath], {
		encoding: 'utf8',
	});

	if (result.status !== 0) {
		throw new Error(
			`Generated artifact failed syntax check: ${relativePath}\n${result.stderr}`
		);
	}
}

function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasLocalBinding(source, name) {
	const escaped = escapeRegExp(name);
	return new RegExp(
		`(?:function|class|var|let|const)\\s+${escaped}\\b|\\b${escaped}\\s*=|import\\s*\\{[^}]*\\b${escaped}\\b[^}]*\\}|import\\s+${escaped}\\b|import\\s*\\*\\s*as\\s+${escaped}\\b`
	).test(source);
}

function exportedLocals(exportClause) {
	return exportClause
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean)
		.map((item) => item.split(/\s+as\s+/)[0]?.trim())
		.filter(Boolean);
}

function checkUndefinedLocalExports(relativePath) {
	const absolutePath = assertFileExists(relativePath);
	const source = readFileSync(absolutePath, 'utf8');
	const exportBlockPattern = /export\s*\{([^}]*)\}\s*(from\s*["'][^"']+["'])?/g;
	const missing = [];

	for (const match of source.matchAll(exportBlockPattern)) {
		if (match[2]) {
			continue;
		}

		const beforeExport = source.slice(0, match.index);
		for (const localName of exportedLocals(match[1] ?? '')) {
			if (!hasLocalBinding(beforeExport, localName)) {
				missing.push(localName);
			}
		}
	}

	if (missing.length > 0) {
		throw new Error(
			`${relativePath} exports missing local bindings: ${missing.join(', ')}`
		);
	}
}

function checkPolyfillBoundary() {
	for (const boundary of polyfillBoundaries) {
		const absolutePath = assertFileExists(boundary.file);
		const source = readFileSync(absolutePath, 'utf8');
		if (!source.includes(boundary.importPath)) {
			throw new Error(
				`${boundary.file} must preserve ${boundary.importPath} so Metro aliases can remap it for Expo.`
			);
		}
	}
}

for (const target of syntaxTargets) {
	checkSyntax(target);
	checkUndefinedLocalExports(target);
}

checkPolyfillBoundary();
