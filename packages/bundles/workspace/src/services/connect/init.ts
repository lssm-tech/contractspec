import { DEFAULT_CONTRACTSRC } from '@contractspec/lib.contracts-spec/workspace-config';
import { deepMergePreserve, formatJson, safeParseJson } from '../setup/file-merger';
import type { FsAdapter } from '../../ports/fs';
import type { ConnectInitInput } from './types';
import { resolveWorkspace } from './shared';
import { ensureStorage, resolveStoragePaths } from './storage';

export async function initConnectWorkspace(
	fs: FsAdapter,
	input: ConnectInitInput = {}
): Promise<{
	configPath: string;
	targetRoot: string;
	action: 'created' | 'merged';
}> {
	const workspace = resolveWorkspace(input);
	const targetRoot =
		input.scope === 'package' ? workspace.packageRoot : workspace.workspaceRoot;
	const configPath = fs.join(targetRoot, '.contractsrc.json');
	const defaults = {
		connect: {
			...DEFAULT_CONTRACTSRC.connect,
			enabled: true,
		},
	} satisfies Record<string, unknown>;

	let action: 'created' | 'merged' = 'created';
	if (await fs.exists(configPath)) {
		const existing = safeParseJson<Record<string, unknown>>(
			await fs.readFile(configPath)
		);
		const merged = deepMergePreserve(existing ?? {}, defaults);
		if (existing?.['connect'] && typeof existing['connect'] === 'object') {
			(merged['connect'] as Record<string, unknown>)['enabled'] = true;
		}
		await fs.writeFile(configPath, formatJson(merged));
		action = 'merged';
	} else {
		await fs.writeFile(configPath, formatJson(defaults));
	}

	const storage = resolveStoragePaths(resolveWorkspace({ ...input, workspaceRoot: targetRoot, packageRoot: targetRoot }));
	await ensureStorage(fs, storage);

	return {
		configPath,
		targetRoot,
		action,
	};
}
