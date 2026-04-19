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
	it('flags contract-aware routes that do not reference contracts', async () => {
		const fs = createFs({
			'packages/apps/web-landing/src/app/api/chat/route.ts':
				'import { createChatRoute } from "@contractspec/module.ai-chat/core";\nexport const POST = createChatRoute({});',
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
					capabilities: 'capabilities',
					policies: 'policies',
					tests: 'tests',
					translations: 'translations',
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
					capabilities: 'capabilities',
					policies: 'policies',
					tests: 'tests',
					translations: 'translations',
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

	it('does not flag support files inside contract-aware packages', async () => {
		const fs = createFs({
			'packages/examples/demo/src/contracts/demo.operation.ts':
				'defineCommand({ meta: { name: "demo.run" } });',
			'packages/examples/demo/src/handlers/task.storage.ts':
				'export async function saveValue() { return null; }',
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
					capabilities: 'capabilities',
					policies: 'policies',
					tests: 'tests',
					translations: 'translations',
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

	it('does not flag pure barrel files', async () => {
		const fs = createFs({
			'packages/examples/demo/src/contracts/demo.operation.ts':
				'defineCommand({ meta: { name: "demo.run" } });',
			'packages/examples/demo/src/handlers/index.ts':
				"export * from './demo.handler';\nexport { type DemoInput } from './demo.handler';",
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
					capabilities: 'capabilities',
					policies: 'policies',
					tests: 'tests',
					translations: 'translations',
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

	it('does not flag unrelated routes outside contract-aware packages', async () => {
		const fs = createFs({
			'packages/apps/plain-app/src/routes/packs.ts':
				'import { Elysia } from "elysia";\nexport const routes = new Elysia().get("/", () => "ok");',
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
					capabilities: 'capabilities',
					policies: 'policies',
					tests: 'tests',
					translations: 'translations',
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

	it('does not flag example runtime handlers without explicit contract context', async () => {
		const fs = createFs({
			'packages/examples/demo/src/contracts/demo.operation.ts':
				'defineCommand({ meta: { name: "demo.run" } });',
			'packages/examples/demo/src/handlers/demo.handlers.ts':
				'export async function listItems() { return []; }',
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
					capabilities: 'capabilities',
					policies: 'policies',
					tests: 'tests',
					translations: 'translations',
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
