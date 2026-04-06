import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import {
	connect,
	createNodeAdapters,
} from '@contractspec/bundle.workspace';
import { createControlPlaneRuntimeContext } from '../control-plane/runtime-context';
import { loadConfigWithWorkspace } from '../../utils/config';

const execAsync = promisify(exec);

export async function createConnectCommandContext(options: { json?: boolean } = {}) {
	const cwd = process.cwd();
	const config = await loadConfigWithWorkspace(cwd);
	const adapters = createNodeAdapters({
		cwd,
		config,
		silent: options.json,
	});

	return {
		cwd,
		config,
		adapters,
	};
}

export async function runShellCommand(
	command: string,
	options: { cwd?: string } = {}
): Promise<{
	command: string;
	cwd?: string;
	exitCode: number;
	stdout: string;
	stderr: string;
}> {
	try {
		const result = await execAsync(command, {
			cwd: options.cwd ?? process.cwd(),
			shell: '/bin/zsh',
		});

		return {
			command,
			cwd: options.cwd,
			exitCode: 0,
			stdout: result.stdout,
			stderr: result.stderr,
		};
	} catch (error) {
		const failure = error as {
			code?: number;
			stdout?: string;
			stderr?: string;
		};
		return {
			command,
			cwd: options.cwd,
			exitCode: failure.code ?? 1,
			stdout: failure.stdout ?? '',
			stderr: failure.stderr ?? '',
		};
	}
}

export async function tryCreateConnectControlPlaneRuntime() {
	try {
		const context = await createControlPlaneRuntimeContext();
		return {
			controlPlane: connect.createConnectControlPlaneRuntime({
				store: context.store,
				traceService: context.traceService,
			}),
			dispose: () => context.dispose(),
		};
	} catch {
		return {
			controlPlane: undefined,
			dispose: async () => {},
		};
	}
}
