import { afterEach, describe, expect, it } from 'bun:test';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodeFsAdapter } from '../../../adapters/fs.node';
import type { CheckContext } from '../types';
import { runConfigChecks } from './config';

const originalControlPlaneToken = process.env.CONTROL_PLANE_API_TOKEN;

const baseContext = (workspaceRoot: string): CheckContext => ({
	workspaceRoot,
	packageRoot: workspaceRoot,
	isMonorepo: false,
	verbose: false,
});

afterEach(() => {
	if (originalControlPlaneToken === undefined) {
		Reflect.deleteProperty(process.env, 'CONTROL_PLANE_API_TOKEN');
		return;
	}

	process.env.CONTROL_PLANE_API_TOKEN = originalControlPlaneToken;
});

describe('builder preset config checks', () => {
	it('warns when a builder-local preset is missing the configured control-plane token', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-doctor-config-'));

		try {
			await writeFile(
				join(root, 'package.json'),
				JSON.stringify(
					{ name: 'doctor-config-fixture', type: 'module' },
					null,
					2
				)
			);
			await writeFile(
				join(root, '.contractsrc.json'),
				JSON.stringify(
					{
						builder: {
							enabled: true,
							runtimeMode: 'local',
							bootstrapPreset: 'local_daemon_mvp',
							api: {
								baseUrl: 'https://api.contractspec.io',
								controlPlaneTokenEnvVar: 'CONTROL_PLANE_API_TOKEN',
							},
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
			Reflect.deleteProperty(process.env, 'CONTROL_PLANE_API_TOKEN');

			const checks = await runConfigChecks(
				createNodeFsAdapter(root),
				baseContext(root)
			);

			expect(
				checks.find((check) => check.name === 'Setup Preset')
			).toMatchObject({
				status: 'warn',
				message:
					'Builder preset inferred (builder-local) but setup is missing env:CONTROL_PLANE_API_TOKEN',
			});
		} finally {
			await rm(root, { recursive: true, force: true });
		}
	});

	it('verifies the VS Code API mirror for builder-local presets', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-doctor-config-'));

		try {
			await writeFile(
				join(root, 'package.json'),
				JSON.stringify(
					{ name: 'doctor-config-fixture', type: 'module' },
					null,
					2
				)
			);
			await writeFile(
				join(root, '.contractsrc.json'),
				JSON.stringify(
					{
						builder: {
							enabled: true,
							runtimeMode: 'local',
							bootstrapPreset: 'local_daemon_mvp',
							api: {
								baseUrl: 'https://api.contractspec.io',
								controlPlaneTokenEnvVar: 'CONTROL_PLANE_API_TOKEN',
							},
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
			await mkdir(join(root, '.vscode'), { recursive: true });
			await writeFile(
				join(root, '.vscode', 'settings.json'),
				JSON.stringify(
					{
						'contractspec.api.baseUrl': 'https://api.contractspec.io',
					},
					null,
					2
				)
			);
			process.env.CONTROL_PLANE_API_TOKEN = 'builder-token';

			const checks = await runConfigChecks(
				createNodeFsAdapter(root),
				baseContext(root)
			);

			expect(
				checks.find((check) => check.name === 'VS Code API Mirror')
			).toMatchObject({
				status: 'pass',
				message: 'VS Code API base URL matches Builder configuration',
			});
		} finally {
			await rm(root, { recursive: true, force: true });
		}
	});
});
