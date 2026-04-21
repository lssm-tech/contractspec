#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sections = [
	'dependencies',
	'peerDependencies',
	'devDependencies',
	'optionalDependencies',
];
const excludedSegments = new Set([
	'node_modules',
	'.next',
	'dist',
	'.turbo',
	'coverage',
]);
const sourceExtensions = /\.(?:ts|tsx|js|jsx|mjs|cjs)$/;
const testPathPattern =
	/(?:^|[/.])(?:test|spec|stories|storybook)\.[cm]?[jt]sx?$|__tests__|\.test\.|\.spec\.|\.stories\./;
const heavyFamilies = [
	/^@ai-sdk\//,
	/^@apollo\/client$/,
	/^@electric-sql\/pglite$/,
	/^@google-cloud\/storage$/,
	/^@mistralai\/mistralai$/,
	/^@modelcontextprotocol\/sdk$/,
	/^@qdrant\/js-client-rest$/,
	/^@remotion\//,
	/^@rn-primitives\//,
	/^expo(?:-.+)?$/,
	/^googleapis$/,
	/^graphql$/,
	/^maplibre-gl$/,
	/^next$/,
	/^playwright$/,
	/^react-native(?:-.+)?$/,
	/^remotion$/,
	/^stripe$/,
	/^twilio$/,
];

const expectedNoRuntimeSignal = new Set([
	'autoprefixer',
	'tailwindcss',
	'tailwindcss-animate',
	'typescript',
	'rimraf',
	'glob',
]);

const packageFiles = execFileSync(
	'find',
	[
		'packages',
		'-path',
		'*/package.json',
		'-not',
		'-path',
		'*/node_modules/*',
		'-not',
		'-path',
		'*/.next/*',
		'-not',
		'-path',
		'*/dist/*',
		'-print',
	],
	{ cwd: root, encoding: 'utf8' }
)
	.trim()
	.split('\n')
	.filter(Boolean)
	.sort();

const packages = packageFiles.map((file) => ({
	file,
	dir: path.dirname(file),
	json: JSON.parse(readFileSync(file, 'utf8')),
}));
const workspaceNames = new Set(
	packages.map((pkg) => pkg.json.name).filter(Boolean)
);

const sectionTotals = Object.fromEntries(
	sections.map((section) => [section, 0])
);
const dependencySections = new Map();
const packageSummaries = [];
const duplicateWithinPackage = [];
const runtimeWithoutImportSignal = [];
const heavyRuntimeEdges = [];

for (const pkg of packages) {
	const counts = {};
	const allSectionsByName = new Map();
	const runtimeCode = readSourceText(pkg.dir, false);
	const testCode = readSourceText(pkg.dir, true);
	const scriptsText = JSON.stringify(pkg.json.scripts ?? {});

	for (const section of sections) {
		const dependencies = pkg.json[section] ?? {};
		counts[section] = Object.keys(dependencies).length;
		sectionTotals[section] += counts[section];

		for (const [dependencyName, version] of Object.entries(dependencies)) {
			const usage = dependencySections.get(dependencyName) ?? {
				dependencies: 0,
				peerDependencies: 0,
				devDependencies: 0,
				optionalDependencies: 0,
				workspace: workspaceNames.has(dependencyName),
			};
			usage[section] += 1;
			dependencySections.set(dependencyName, usage);

			const sectionList = allSectionsByName.get(dependencyName) ?? [];
			sectionList.push(section);
			allSectionsByName.set(dependencyName, sectionList);

			if (section === 'dependencies' && isHeavy(dependencyName)) {
				heavyRuntimeEdges.push({
					package: pkg.json.name,
					file: pkg.file,
					dependency: dependencyName,
					version,
				});
			}
		}
	}

	for (const [
		dependencyName,
		dependencySectionsForPackage,
	] of allSectionsByName) {
		if (new Set(dependencySectionsForPackage).size > 1) {
			duplicateWithinPackage.push({
				package: pkg.json.name,
				file: pkg.file,
				dependency: dependencyName,
				sections: dependencySectionsForPackage,
			});
		}
	}

	for (const [dependencyName, version] of Object.entries(
		pkg.json.dependencies ?? {}
	)) {
		if (workspaceNames.has(dependencyName)) continue;
		if (expectedNoRuntimeSignal.has(dependencyName)) continue;
		const runtime = importSignal(runtimeCode, dependencyName);
		const tests = importSignal(testCode, dependencyName);
		const scripts = scriptsText.includes(dependencyName);
		if (!runtime && !scripts) {
			runtimeWithoutImportSignal.push({
				package: pkg.json.name,
				file: pkg.file,
				dependency: dependencyName,
				version,
				tests,
			});
		}
	}

	packageSummaries.push({
		name: pkg.json.name,
		file: pkg.file,
		dependencies: counts.dependencies,
		peerDependencies: counts.peerDependencies,
		devDependencies: counts.devDependencies,
		optionalDependencies: counts.optionalDependencies,
		total: Object.values(counts).reduce((total, count) => total + count, 0),
	});
}

const distSizes = packageFiles
	.map((file) => {
		const dist = path.join(path.dirname(file), 'dist');
		return existsSync(dist)
			? {
					file,
					dist,
					bytes: directorySize(dist),
				}
			: null;
	})
	.filter(Boolean)
	.sort((left, right) => right.bytes - left.bytes);

const report = {
	packageCount: packages.length,
	sectionTotals,
	distinctDependencies: dependencySections.size,
	topRuntimeDependencies: topSection('dependencies', 40),
	topDevDependencies: topSection('devDependencies', 25),
	topPeerDependencies: topSection('peerDependencies', 25),
	packagesByDependencyCount: packageSummaries
		.sort((left, right) => right.total - left.total)
		.slice(0, 40),
	duplicateWithinPackage,
	runtimeWithoutImportSignal,
	heavyRuntimeEdges,
	largestDistOutputs: distSizes.slice(0, 40).map((item) => ({
		file: item.file,
		dist: item.dist,
		size: formatBytes(item.bytes),
		bytes: item.bytes,
	})),
};

if (process.argv.includes('--json')) {
	console.log(JSON.stringify(report, null, 2));
} else {
	printHumanReport(report);
}

function topSection(section, limit) {
	return [...dependencySections.entries()]
		.map(([dependency, usage]) => [dependency, usage[section]])
		.filter(([, count]) => count > 0)
		.sort((left, right) => right[1] - left[1])
		.slice(0, limit)
		.map(([dependency, count]) => ({ dependency, count }));
}

function printHumanReport(report) {
	console.log(`# Dependency Audit`);
	console.log('');
	console.log(`Packages: ${report.packageCount}`);
	console.log(`Distinct dependencies: ${report.distinctDependencies}`);
	console.log(
		`Edges: dependencies=${report.sectionTotals.dependencies}, peerDependencies=${report.sectionTotals.peerDependencies}, devDependencies=${report.sectionTotals.devDependencies}, optionalDependencies=${report.sectionTotals.optionalDependencies}`
	);
	printTable('Top runtime dependencies', report.topRuntimeDependencies);
	printTable(
		'Largest package dependency counts',
		report.packagesByDependencyCount
	);
	printTable(
		'Heavy runtime dependency edges',
		report.heavyRuntimeEdges.slice(0, 60)
	);
	printTable(
		'Runtime dependencies without import signal',
		report.runtimeWithoutImportSignal.slice(0, 80)
	);
	printTable(
		'Duplicate dependency declarations',
		report.duplicateWithinPackage
	);
	printTable('Largest dist outputs', report.largestDistOutputs);
}

function printTable(title, rows) {
	console.log(`\n## ${title}`);
	if (rows.length === 0) {
		console.log('None.');
		return;
	}
	for (const row of rows) {
		console.log(`- ${JSON.stringify(row)}`);
	}
}

function readSourceText(directory, testsOnly) {
	return listFiles(directory)
		.filter((file) => testPathPattern.test(file) === testsOnly)
		.map((file) => readFileSync(file, 'utf8'))
		.join('\n');
}

function listFiles(directory, files = []) {
	if (!existsSync(directory)) return files;
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		if (excludedSegments.has(entry.name)) continue;
		const absolutePath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			listFiles(absolutePath, files);
			continue;
		}
		if (entry.isFile() && sourceExtensions.test(entry.name)) {
			files.push(absolutePath);
		}
	}
	return files;
}

function importSignal(sourceText, dependencyName) {
	const escaped = escapeRegExp(dependencyName);
	const pattern = new RegExp(
		`(?:from\\s+['"]${escaped}(?:/[^'"]*)?['"]|import\\(['"]${escaped}(?:/[^'"]*)?['"]|require\\(['"]${escaped}(?:/[^'"]*)?['"])`
	);
	return pattern.test(sourceText);
}

function isHeavy(dependencyName) {
	return heavyFamilies.some((pattern) => pattern.test(dependencyName));
}

function directorySize(directory) {
	let size = 0;
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const absolutePath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			size += directorySize(absolutePath);
			continue;
		}
		if (entry.isFile()) {
			size += statSync(absolutePath).size;
		}
	}
	return size;
}

function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes}B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`;
	return `${(bytes / (1024 * 1024)).toFixed(1)}M`;
}

function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
