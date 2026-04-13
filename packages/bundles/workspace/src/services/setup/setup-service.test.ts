import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { join } from 'node:path';
import type { FsAdapter } from '../../ports/fs';
import type { SetupFileResult, SetupPromptCallbacks } from './types';

// Mocks
const mockSetupCliConfig = mock(() =>
	Promise.resolve({ action: 'created' } as SetupFileResult)
);
const mockSetupAgentsMd = mock(() =>
	Promise.resolve({ action: 'created' } as SetupFileResult)
);
const mockSetupBiomeConfig = mock(() =>
	Promise.resolve({ action: 'created' } as SetupFileResult)
);
const mockSetupVscodeSettings = mock(() =>
	Promise.resolve({ action: 'created' } as SetupFileResult)
);
const mockSetupMcpCursor = mock(() =>
	Promise.resolve({ action: 'created' } as SetupFileResult)
);
const mockSetupMcpClaude = mock(() =>
	Promise.resolve({ action: 'created' } as SetupFileResult)
);
const mockSetupCursorRules = mock(() =>
	Promise.resolve({ action: 'created' } as SetupFileResult)
);

const mockFindWorkspaceRoot = mock(() => '/root');
const mockFindPackageRoot = mock(() => '/root/pkg');
const mockIsMonorepo = mock(() => false);
const mockGetPackageName = mock(() => 'pkg');

mock.module('./targets/index', () => ({
	setupAgentsMd: mockSetupAgentsMd,
	setupCliConfig: mockSetupCliConfig,
	setupBiomeConfig: mockSetupBiomeConfig,
	setupVscodeSettings: mockSetupVscodeSettings,
	setupMcpCursor: mockSetupMcpCursor,
	setupMcpClaude: mockSetupMcpClaude,
	setupCursorRules: mockSetupCursorRules,
}));

mock.module('../../adapters/workspace', () => ({
	findWorkspaceRoot: mockFindWorkspaceRoot,
	findPackageRoot: mockFindPackageRoot,
	isMonorepo: mockIsMonorepo,
	getPackageName: mockGetPackageName,
}));

const { runSetup } = await import('./setup-service');

describe('Setup Service', () => {
	let mockFs: FsAdapter;

	beforeEach(() => {
		mockSetupAgentsMd.mockClear();
		mockSetupCliConfig.mockClear();
		mockSetupBiomeConfig.mockClear();
		mockSetupVscodeSettings.mockClear();
		mockSetupMcpCursor.mockClear();
		mockFindWorkspaceRoot.mockClear();
		mockIsMonorepo.mockClear();

		mockFs = {} as FsAdapter;

		// Reset default mock behaviors
		mockFindWorkspaceRoot.mockReturnValue('/root');
		mockFindPackageRoot.mockReturnValue('/root');
		mockIsMonorepo.mockReturnValue(false);

		mockFs = {
			join: (...parts: string[]) => join(...parts),
			exists: async () => false,
			readFile: async () => '',
			writeFile: async () => {},
		} as unknown as FsAdapter;
	});

	it('should run setup for all targets when none specified', async () => {
		const result = await runSetup(mockFs, {
			workspaceRoot: '/root',
			targets: [],
			interactive: false,
		});

		expect(result.success).toBe(true);
		expect(result.preset).toBe('core');
		expect(result.nextSteps).toEqual([
			'contractspec validate',
			'contractspec doctor',
		]);
		expect(
			result.files.find((file) => file.target === 'gitignore')?.action
		).toBe('created');
		// Should call all setup functions
		expect(mockSetupAgentsMd).toHaveBeenCalled();
		expect(mockSetupCliConfig).toHaveBeenCalled();
		expect(mockSetupBiomeConfig).toHaveBeenCalled();
		expect(mockSetupVscodeSettings).toHaveBeenCalled();
	});

	it('should run setup for specific targets', async () => {
		const result = await runSetup(mockFs, {
			workspaceRoot: '/root',
			targets: ['agents-md'],
			interactive: false,
		});

		expect(mockSetupAgentsMd).toHaveBeenCalled();
		expect(mockSetupCliConfig).not.toHaveBeenCalled();
		expect(mockSetupBiomeConfig).not.toHaveBeenCalled();
		expect(mockSetupVscodeSettings).not.toHaveBeenCalled();
		expect(
			result.files.find((file) => file.target === 'gitignore')?.action
		).toBe('created');
	});

	it('should prompt for targets in interactive mode', async () => {
		const mockMultiSelect = mock(() => Promise.resolve(['cli-config']));
		const mockSelect = mock(async <T extends string>() => 'core' as T);
		const prompts: SetupPromptCallbacks = {
			confirm: mock(() => Promise.resolve(true)),
			select: mockSelect as SetupPromptCallbacks['select'],
			multiSelect:
				mockMultiSelect as unknown as SetupPromptCallbacks['multiSelect'],
			input: mock(() => Promise.resolve('project')),
		};

		const result = await runSetup(
			mockFs,
			{
				workspaceRoot: '/root',
				targets: [],
				interactive: true,
			},
			prompts
		);

		expect(mockMultiSelect).toHaveBeenCalled();
		expect(mockSetupCliConfig).toHaveBeenCalled();
		expect(mockSetupVscodeSettings).not.toHaveBeenCalled();
		expect(
			result.files.find((file) => file.target === 'gitignore')?.action
		).toBe('created');
	});

	it('should handle monorepo scope selection in interactive mode', async () => {
		mockIsMonorepo.mockReturnValue(true);
		mockFindPackageRoot.mockReturnValue('/root/pkg');

		const mockSelect = mock((msg) => {
			if (msg.includes('Select initialization preset')) {
				return Promise.resolve('core');
			}
			if (msg.includes('Monorepo')) return Promise.resolve('package');
			return Promise.resolve('core');
		});
		const mockMultiSelect = mock(() => Promise.resolve(['cli-config']));

		const prompts: SetupPromptCallbacks = {
			confirm: mock(),
			select: mockSelect as unknown as SetupPromptCallbacks['select'],
			multiSelect:
				mockMultiSelect as unknown as SetupPromptCallbacks['multiSelect'],
			input: mock(() => Promise.resolve('pkg-name')),
		};

		await runSetup(
			mockFs,
			{
				workspaceRoot: '/root',
				targets: [],
				interactive: true,
			},
			prompts
		);

		// Verify scope selection prompt was shown
		expect(
			mockSelect.mock.calls.some(
				(call) => typeof call[0] === 'string' && call[0].includes('Monorepo')
			)
		).toBe(true);
	});

	it('should derive builder-local next steps from preset defaults', async () => {
		const result = await runSetup(mockFs, {
			workspaceRoot: '/root',
			targets: [],
			interactive: false,
			preset: 'builder-local',
			projectName: 'Demo App',
		});

		expect(result.preset).toBe('builder-local');
		expect(result.nextSteps).toEqual([
			'contractspec builder init --workspace-id ws-demo-app --preset local-daemon-mvp',
			'contractspec builder local register --workspace-id ws-demo-app --runtime-id rt_local_daemon --granted-to local:operator',
		]);
	});

	it('should skip gitignore updates when explicitly disabled', async () => {
		const result = await runSetup(mockFs, {
			workspaceRoot: '/root',
			targets: [],
			interactive: false,
			gitignoreBehavior: 'skip',
		});

		expect(result.files.some((file) => file.target === 'gitignore')).toBe(
			false
		);
	});
});
