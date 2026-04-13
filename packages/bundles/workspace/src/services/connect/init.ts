import { DEFAULT_CONTRACTSRC } from '@contractspec/lib.contracts-spec/workspace-config';
import type { FsAdapter } from '../../ports/fs';
import {
	deepMergePreserve,
	formatJson,
	safeParseJson,
} from '../setup/file-merger';
import { setupGitignore } from '../setup/gitignore';
import { SETUP_GITIGNORE_PATTERNS } from '../setup/presets';
import { resolveWorkspace } from './shared';
import { ensureStorage, resolveStoragePaths } from './storage';
import type { ConnectInitInput, ConnectInitResult } from './types';

export async function initConnectWorkspace(
	fs: FsAdapter,
	input: ConnectInitInput = {}
): Promise<ConnectInitResult> {
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

	const storage = resolveStoragePaths(
		resolveWorkspace({
			...input,
			workspaceRoot: targetRoot,
			packageRoot: targetRoot,
		})
	);
	await ensureStorage(fs, storage);

	const gitignore = await setupGitignore(fs, {
		behavior: input.gitignoreBehavior,
		interactive: input.interactive ?? false,
		patterns: [
			SETUP_GITIGNORE_PATTERNS.connect,
			SETUP_GITIGNORE_PATTERNS.verificationCache,
		],
		prompts: input.prompts,
		root: workspace.workspaceRoot,
	});

	return {
		configPath,
		targetRoot,
		action,
		gitignore,
	};
}
