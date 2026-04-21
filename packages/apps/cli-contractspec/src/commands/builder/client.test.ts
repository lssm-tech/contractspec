import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runBuilderInitCommand } from './actions';

const originalCwd = process.cwd();
const originalFetch = globalThis.fetch;
const originalApiBaseUrl = process.env.CONTRACTSPEC_API_BASE_URL;
const originalControlPlaneToken = process.env.CONTROL_PLANE_API_TOKEN;
const originalCustomBuilderToken = process.env.CUSTOM_BUILDER_TOKEN;
const originalConsoleError = console.error;
const originalExit = process.exit;

function restoreEnv(
	key:
		| 'CONTRACTSPEC_API_BASE_URL'
		| 'CONTROL_PLANE_API_TOKEN'
		| 'CUSTOM_BUILDER_TOKEN',
	value: string | undefined
) {
	if (value === undefined) {
		Reflect.deleteProperty(process.env, key);
		return;
	}

	process.env[key] = value;
}

describe('builder client config resolution', () => {
	let tempDir = '';

	beforeEach(async () => {
		tempDir = await mkdtemp(join(tmpdir(), 'contractspec-builder-'));
		await writeFile(
			join(tempDir, 'package.json'),
			JSON.stringify({ name: 'builder-fixture', type: 'module' }, null, 2)
		);
		process.chdir(tempDir);
		Reflect.deleteProperty(process.env, 'CONTRACTSPEC_API_BASE_URL');
		Reflect.deleteProperty(process.env, 'CONTROL_PLANE_API_TOKEN');
		Reflect.deleteProperty(process.env, 'CUSTOM_BUILDER_TOKEN');
		console.error = mock(() => {}) as typeof console.error;
	});

	afterEach(async () => {
		process.chdir(originalCwd);
		globalThis.fetch = originalFetch;
		restoreEnv('CONTRACTSPEC_API_BASE_URL', originalApiBaseUrl);
		restoreEnv('CONTROL_PLANE_API_TOKEN', originalControlPlaneToken);
		restoreEnv('CUSTOM_BUILDER_TOKEN', originalCustomBuilderToken);
		console.error = originalConsoleError;
		process.exit = originalExit;
		if (tempDir) {
			await rm(tempDir, { recursive: true, force: true });
		}
	});

	it('uses builder.api.baseUrl from .contractsrc.json when no env override is set', async () => {
		await writeFile(
			join(tempDir, '.contractsrc.json'),
			JSON.stringify(
				{
					builder: {
						enabled: true,
						runtimeMode: 'local',
						bootstrapPreset: 'local_daemon_mvp',
						api: {
							baseUrl: 'https://config.contractspec.test',
							controlPlaneTokenEnvVar: 'CONTROL_PLANE_API_TOKEN',
						},
					},
				},
				null,
				2
			)
		);
		process.env.CONTROL_PLANE_API_TOKEN = 'builder-token';

		const fetchMock = mock(async () => {
			return new Response(
				JSON.stringify({
					ok: true,
					result: {
						workspaceId: 'ws_cli',
						preset: 'local_daemon_mvp',
						createdWorkspace: true,
						runtimeTargetIds: ['rt_local_daemon'],
						providerIds: [],
						defaultRuntimeMode: 'local',
					},
				}),
				{ status: 200 }
			);
		});
		globalThis.fetch = fetchMock as unknown as typeof fetch;

		await runBuilderInitCommand({
			workspaceId: 'ws_cli',
			preset: 'local-daemon-mvp',
		});

		const firstCall = (fetchMock.mock.calls as unknown[][])[0];
		expect(firstCall).toBeDefined();
		expect(String(firstCall?.[0])).toContain(
			'https://config.contractspec.test/internal/builder/commands/builder.workspace.bootstrap'
		);
	});

	it('falls back to the default Builder API base URL for older local preset configs', async () => {
		await writeFile(
			join(tempDir, '.contractsrc.json'),
			JSON.stringify(
				{
					builder: {
						enabled: true,
						runtimeMode: 'local',
						bootstrapPreset: 'local_daemon_mvp',
						localRuntime: {
							runtimeId: 'rt_local_daemon',
							grantedTo: 'local:operator',
						},
					},
				},
				null,
				2
			)
		);
		process.env.CONTROL_PLANE_API_TOKEN = 'builder-token';

		const fetchMock = mock(async () => {
			return new Response(
				JSON.stringify({
					ok: true,
					result: {
						workspaceId: 'ws_cli',
						preset: 'local_daemon_mvp',
						createdWorkspace: true,
						runtimeTargetIds: ['rt_local_daemon'],
						providerIds: [],
						defaultRuntimeMode: 'local',
					},
				}),
				{ status: 200 }
			);
		});
		globalThis.fetch = fetchMock as unknown as typeof fetch;

		await runBuilderInitCommand({
			workspaceId: 'ws_cli',
			preset: 'local-daemon-mvp',
		});

		const firstCall = (fetchMock.mock.calls as unknown[][])[0];
		expect(firstCall).toBeDefined();
		expect(String(firstCall?.[0])).toContain(
			'https://api.contractspec.io/internal/builder/commands/builder.workspace.bootstrap'
		);
	});

	// it('renders a concise command error when the configured token env var is missing', async () => {
	// 	await writeFile(
	// 		join(tempDir, '.contractsrc.json'),
	// 		JSON.stringify(
	// 			{
	// 				builder: {
	// 					enabled: true,
	// 					runtimeMode: 'local',
	// 					bootstrapPreset: 'local_daemon_mvp',
	// 					api: {
	// 						baseUrl: 'https://config.contractspec.test',
	// 						controlPlaneTokenEnvVar: 'CUSTOM_BUILDER_TOKEN',
	// 					},
	// 				},
	// 			},
	// 			null,
	// 			2
	// 		)
	// 	);
	// 	process.exit = ((code?: number) => {
	// 		throw new Error(`exit:${code}`);
	// 	}) as typeof process.exit;
	//
	// 	await expect(
	// 		builderCommand.parseAsync(
	// 			['init', '--workspace-id', 'ws_cli', '--preset', 'local-daemon-mvp'],
	// 			{ from: 'user' }
	// 		)
	// 	).rejects.toThrow('exit:1');
	//
	// 	expect(console.error).toHaveBeenCalledWith(
	// 		'\n❌ Builder command failed:',
	// 		'Set CUSTOM_BUILDER_TOKEN to use Builder CLI commands.'
	// 	);
	// });
});
