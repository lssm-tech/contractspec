import { describe, expect, it } from 'bun:test';
import type { FsAdapter } from '../../../ports/fs';
import type { CICheckOptions } from '../types';
import { runPolicyChecks } from './policy';

function createFs(files: Record<string, string>): FsAdapter {
	const normalized = new Map(
		Object.entries(files).map(([path, content]) => [
			path.replaceAll('\\', '/'),
			content,
		])
	);

	return {
		exists: async (path) => normalized.has(path.replaceAll('\\', '/')),
		readFile: async (path) => {
			const content = normalized.get(path.replaceAll('\\', '/'));
			if (content === undefined) {
				throw new Error(`Missing file: ${path}`);
			}
			return content;
		},
		writeFile: async () => {},
		remove: async () => {},
		stat: async () => ({
			size: 0,
			isFile: true,
			isDirectory: false,
			mtime: new Date(),
		}),
		mkdir: async () => {},
		glob: async ({ pattern }) => {
			if (pattern === '**/*.{ts,tsx}') {
				return [...normalized.keys()].filter((path) =>
					/\.(ts|tsx)$/.test(path)
				);
			}

			return [...normalized.keys()].filter(
				(path) =>
					path.endsWith('.operation.ts') ||
					path.endsWith('.event.ts') ||
					path.endsWith('.presentation.ts') ||
					path.endsWith('.feature.ts') ||
					path.endsWith('.test-spec.ts')
			);
		},
		resolve: (...paths) => paths.join('/'),
		dirname: (path) => path.split('/').slice(0, -1).join('/'),
		basename: (path) => path.split('/').pop() ?? '',
		join: (...paths) => paths.join('/'),
		relative: (_from, to) => to,
	};
}

const logger = {
	debug: () => {},
	info: () => {},
	warn: () => {},
	error: () => {},
	createProgress: () => ({
		start: () => {},
		update: () => {},
		succeed: () => {},
		fail: () => {},
		warn: () => {},
		stop: () => {},
	}),
};

describe('runPolicyChecks', () => {
	it('flags handler files that do not reference contracts', async () => {
		const fs = createFs({
			'src/contracts/user.operation.ts':
				'defineCommand({ meta: { name: "user.create" } });',
			'src/handlers/user.handler.ts':
				'export async function handler() { return null; }',
		});

		const options: CICheckOptions = {
			config: {
				aiProvider: 'claude',
				agentMode: 'simple',
				outputDir: './src',
				conventions: {
					models: 'models',
					operations: 'contracts',
					events: 'events',
					presentations: 'presentations',
					forms: 'forms',
					groupByFeature: true,
				},
				defaultOwners: [],
				defaultTags: [],
				schemaFormat: 'contractspec',
			},
		};

		const issues = await runPolicyChecks({ fs, logger }, options);

		expect(issues).toHaveLength(1);
		expect(issues[0]?.ruleId).toBe('policy-contract-first');
	});

	it('does not flag handler files that reference contracts', async () => {
		const fs = createFs({
			'src/contracts/user.operation.ts':
				'defineCommand({ meta: { name: "user.create" } });',
			'src/handlers/user.handler.ts':
				'import type { ContractHandler } from "@contractspec/lib.contracts-spec";\nexport const handler: ContractHandler = async () => null;',
		});

		const options: CICheckOptions = {
			config: {
				aiProvider: 'claude',
				agentMode: 'simple',
				outputDir: './src',
				conventions: {
					models: 'models',
					operations: 'contracts',
					events: 'events',
					presentations: 'presentations',
					forms: 'forms',
					groupByFeature: true,
				},
				defaultOwners: [],
				defaultTags: [],
				schemaFormat: 'contractspec',
			},
		};

		const issues = await runPolicyChecks({ fs, logger }, options);

		expect(issues).toHaveLength(0);
	});
});
