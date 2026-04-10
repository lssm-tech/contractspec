import { beforeEach, describe, expect, it, mock } from 'bun:test';
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
	});

	it('should run setup for all targets when none specified', async () => {
		const result = await runSetup(mockFs, {
			workspaceRoot: '/root',
			targets: [],
			interactive: false,
		});

		expect(result.success).toBe(true);
		// Should call all setup functions
		expect(mockSetupAgentsMd).toHaveBeenCalled();
		expect(mockSetupCliConfig).toHaveBeenCalled();
		expect(mockSetupBiomeConfig).toHaveBeenCalled();
		expect(mockSetupVscodeSettings).toHaveBeenCalled();
	});

	it('should run setup for specific targets', async () => {
		await runSetup(mockFs, {
			workspaceRoot: '/root',
			targets: ['agents-md'],
			interactive: false,
		});

		expect(mockSetupAgentsMd).toHaveBeenCalled();
		expect(mockSetupCliConfig).not.toHaveBeenCalled();
		expect(mockSetupBiomeConfig).not.toHaveBeenCalled();
		expect(mockSetupVscodeSettings).not.toHaveBeenCalled();
	});

	it('should prompt for targets in interactive mode', async () => {
		const mockMultiSelect = mock(() => Promise.resolve(['cli-config']));
		const prompts: SetupPromptCallbacks = {
			confirm: mock(() => Promise.resolve(true)),
			multiSelect:
				mockMultiSelect as unknown as SetupPromptCallbacks['multiSelect'],
			input: mock(() => Promise.resolve('project')),
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

		expect(mockMultiSelect).toHaveBeenCalled();
		expect(mockSetupCliConfig).toHaveBeenCalled();
		expect(mockSetupVscodeSettings).not.toHaveBeenCalled();
	});

	it('should handle monorepo scope selection in interactive mode', async () => {
		mockIsMonorepo.mockReturnValue(true);
		mockFindPackageRoot.mockReturnValue('/root/pkg');

		const mockMultiSelect = mock((msg) => {
			if (msg.includes('Monorepo')) return Promise.resolve(['package']); // Select package scope
			return Promise.resolve(['cli-config']); // Select targets
		});

		const prompts: SetupPromptCallbacks = {
			confirm: mock(),
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
			mockMultiSelect.mock.calls.some(
				(call) => typeof call[0] === 'string' && call[0].includes('Monorepo')
			)
		).toBe(true);
	});
});
