import { describe, expect, test } from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateExamples } from '@contractspec/lib.contracts-spec/examples/validation';
import { listExamples } from './registry';

const testDir = path.dirname(fileURLToPath(import.meta.url));

function listPrivateWorkspaceExamples() {
	const examplesDir = path.resolve(testDir, '../../../examples');
	const entries = fs.readdirSync(examplesDir, { withFileTypes: true });

	return new Set(
		entries
			.filter((entry) => entry.isDirectory())
			.map((entry) => path.join(examplesDir, entry.name, 'package.json'))
			.filter((packageJsonPath) => fs.existsSync(packageJsonPath))
			.map((packageJsonPath) =>
				JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
			)
			.filter(
				(manifest) =>
					manifest.private === true &&
					typeof manifest.name === 'string' &&
					manifest.name.startsWith('@contractspec/example.')
			)
			.map((manifest) => manifest.name)
	);
}

function readModuleExamplesManifest() {
	return JSON.parse(
		fs.readFileSync(path.resolve(testDir, '../package.json'), 'utf8')
	);
}

describe('@contractspec/module.examples registry', () => {
	test('should contain at least one example and all manifests should validate', () => {
		const examples = [...listExamples()];
		expect(examples.length).toBeGreaterThan(0);

		const result = validateExamples(examples);
		if (!result.ok) {
			const readable = result.errors
				.map(
					(e) =>
						`${e.exampleKey ?? 'unknown'}: ${e.message}${e.path ? ` (${e.path})` : ''}`
				)
				.join('\n');
			throw new Error(`validateExamples failed:\n${readable}`);
		}
	});

	test('should have unique ids', () => {
		const examples = [...listExamples()];
		const ids = examples.map((e) => e.meta.key);
		const unique = new Set(ids);
		expect(unique.size).toBe(ids.length);
	});

	test('should exclude private workspace examples from the published registry', () => {
		const privateExamples = listPrivateWorkspaceExamples();
		const packageNames = [...listExamples()].map(
			(example) => example.entrypoints.packageName
		);

		expect(
			packageNames.some((packageName) => privateExamples.has(packageName))
		).toBe(false);
	});

	test('package manifest should not depend on private workspace examples', () => {
		const privateExamples = listPrivateWorkspaceExamples();
		const manifest = readModuleExamplesManifest();
		const dependencyNames = Object.keys(manifest.dependencies ?? {});

		expect(
			dependencyNames.some((dependencyName) =>
				privateExamples.has(dependencyName)
			)
		).toBe(false);
	});
});
