import { afterEach, describe, expect, it } from 'bun:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { AgentBrowserHarnessAdapter } from './agentBrowserHarnessAdapter';

let tempDir: string | null = null;

afterEach(async () => {
	if (tempDir) {
		await rm(tempDir, { recursive: true, force: true });
		tempDir = null;
	}
});

describe('AgentBrowserHarnessAdapter', () => {
	it('builds safe agent-browser argv and captures evidence', async () => {
		tempDir = await mkdtemp(join(tmpdir(), 'agent-browser-harness-'));
		const calls: string[][] = [];
		const adapter = new AgentBrowserHarnessAdapter({
			screenshotDir: tempDir,
			authProfiles: {
				operator: {
					key: 'operator',
					kind: 'session-name',
					ref: 'operator-session',
				},
			},
			execFile: async (_file, args) => {
				calls.push(args);
				if (args.includes('screenshot')) {
					await writeFile(args.at(-1) ?? '', 'fake-png');
				}
				if (args.includes('snapshot')) {
					return { stdout: '{"nodes":[]}', stderr: '' };
				}
				if (args.includes('get') && args.includes('title')) {
					return { stdout: 'Harness App\n', stderr: '' };
				}
				return { stdout: '', stderr: '' };
			},
		});

		const result = await adapter.execute({
			context: { metadata: { authProfile: 'operator' } },
			scenario: {} as never,
			runId: 'run-1',
			target: {
				targetId: 'target-1',
				kind: 'preview',
				isolation: 'preview',
				environment: 'preview',
				baseUrl: 'http://127.0.0.1:3000',
				allowlistedDomains: ['127.0.0.1'],
			},
			step: {
				key: 'open',
				description: 'Open app',
				actionClass: 'navigate',
				intent: 'Verify app',
				input: {
					actions: [{ type: 'click', selector: '#confirm' }],
				},
			},
		});

		expect(result.status).toBe('completed');
		expect(result.summary).toBe('Harness App');
		expect(result.artifacts?.map((artifact) => artifact.kind)).toContain(
			'screenshot'
		);
		expect(result.artifacts?.map((artifact) => artifact.kind)).toContain(
			'accessibility-snapshot'
		);
		expect(calls[0]).toContain('--allowed-domains');
		expect(calls[0]).toContain('--session-name');
		expect(calls.some((args) => args.includes('click'))).toBe(true);

		await adapter.dispose();

		expect(calls.some((args) => args.includes('close'))).toBe(true);
	});

	it('returns unsupported when the agent-browser binary is missing', async () => {
		const adapter = new AgentBrowserHarnessAdapter({
			execFile: async () => {
				const error = new Error('not found') as Error & { code: string };
				error.code = 'ENOENT';
				throw error;
			},
		});

		const result = await adapter.execute({
			context: {},
			scenario: {} as never,
			runId: 'run-1',
			target: {
				targetId: 'target-1',
				kind: 'preview',
				isolation: 'preview',
				environment: 'preview',
				baseUrl: 'http://127.0.0.1:3000',
			},
			step: {
				key: 'open',
				description: 'Open app',
				actionClass: 'navigate',
				intent: 'Verify app',
			},
		});

		expect(result.status).toBe('unsupported');
		expect(result.reasons).toContain('agent_browser_missing');
	});

	it('blocks navigation outside allowlisted domains before shelling out', async () => {
		let called = false;
		const adapter = new AgentBrowserHarnessAdapter({
			execFile: async () => {
				called = true;
				return { stdout: '', stderr: '' };
			},
		});

		const result = await adapter.execute({
			context: {},
			scenario: {} as never,
			runId: 'run-1',
			target: {
				targetId: 'target-1',
				kind: 'preview',
				isolation: 'preview',
				environment: 'preview',
				baseUrl: 'https://evil.test',
				allowlistedDomains: ['example.test'],
			},
			step: {
				key: 'open',
				description: 'Open app',
				actionClass: 'navigate',
				intent: 'Verify app',
			},
		});

		expect(result.status).toBe('blocked');
		expect(called).toBe(false);
	});
});
