import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import {
	DEFAULT_CONTRACTSRC,
	type ResolvedContractsrcConfig,
} from '@contractspec/lib.contracts-spec/workspace-config';
import type { SpecScanResult } from '@contractspec/module.workspace';
import type { FsAdapter } from '../ports/fs';
import type { LoggerAdapter } from '../ports/logger';
import { buildSpec } from './build';

// Mock module.workspace
const mockScanSpecSource = mock();
const mockInferSpecType = mock();
const mockGenerateHandler = mock(() => 'handler code');
const mockGenerateComponent = mock(() => 'component code');
const mockGenerateTest = mock(() => 'test code');

const mockWorkspace = {
	scanSpecSource: mockScanSpecSource,
	inferSpecTypeFromFilePath: mockInferSpecType,
	generateHandlerTemplate: mockGenerateHandler,
	generateComponentTemplate: mockGenerateComponent,
	generateTestTemplate: mockGenerateTest,
} as unknown;

describe('Build Service', () => {
	const mockFs = {
		readFile: mock(() => Promise.resolve('spec content')),
		writeFile: mock(() => Promise.resolve()),
		exists: mock(() => Promise.resolve(false)),
		mkdir: mock(() => Promise.resolve()),
		resolve: mock((...args: string[]) => args.join('/')),
		dirname: mock((p: string) => p.split('/').slice(0, -1).join('/')),
		join: mock((...args: string[]) => args.join('/')),
		relative: mock((from: string, to: string) => to.replace(`${from}/`, '')),
		basename: mock((p: string) => p.split('/').pop() ?? p),
	};

	const mockLogger = {
		info: mock(),
		warn: mock(),
		error: mock(),
		debug: mock(),
		createProgress: mock(() => ({
			start: mock(),
			update: mock(),
			stop: mock(),
			succeed: mock(),
			fail: mock(),
			warn: mock(),
		})),
	};

	beforeEach(() => {
		mockFs.readFile.mockClear();
		mockFs.writeFile.mockClear();
		mockFs.writeFile.mockImplementation(() => Promise.resolve());
		mockFs.exists.mockClear();
		mockFs.exists.mockImplementation(() => Promise.resolve(false));
		mockLogger.info.mockClear();
		mockLogger.error.mockClear();

		mockScanSpecSource.mockClear();
	});

	afterEach(() => {
		mock.restore();
	});

	const config: ResolvedContractsrcConfig = {
		...DEFAULT_CONTRACTSRC,
		outputDir: 'src',
	};

	it('should build handler for operation spec', async () => {
		mockInferSpecType.mockReturnValue('operation');
		mockScanSpecSource.mockReturnValue({
			kind: 'command',
			key: 'my.cmd',
		} as SpecScanResult);

		const result = await buildSpec(
			'specs/my.cmd.ts',
			{
				fs: mockFs as unknown as FsAdapter,
				logger: mockLogger as unknown as LoggerAdapter,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				workspace: mockWorkspace as unknown as any,
			},
			config
		);

		// buildSpec returns BuildSpecResult which doesn't have success property directly
		expect(result.results).toHaveLength(1);
		expect(result.results[0]?.target).toBe('handler');
		expect(result.results[0]?.success).toBe(true);
		expect(mockFs.writeFile).toHaveBeenCalled();
		expect(mockGenerateHandler).toHaveBeenCalledWith('my.cmd', 'command');
	});

	it('should build component for presentation spec', async () => {
		mockInferSpecType.mockReturnValue('presentation');
		mockScanSpecSource.mockReturnValue({
			key: 'my.component',
			description: 'desc',
		} as SpecScanResult);

		const result = await buildSpec(
			'specs/my.component.ts',
			{
				fs: mockFs as unknown as FsAdapter,
				logger: mockLogger as unknown as LoggerAdapter,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				workspace: mockWorkspace as unknown as any,
			},
			config
		);

		expect(result.results).toHaveLength(1);
		expect(result.results[0]?.target).toBe('component');
		expect(mockGenerateComponent).toHaveBeenCalledWith('my.component', 'desc');
	});

	it('should skip existing files unless overwrite is true', async () => {
		mockInferSpecType.mockReturnValue('operation');
		mockScanSpecSource.mockReturnValue({
			kind: 'command',
			key: 'my.cmd',
		} as SpecScanResult);
		mockFs.exists.mockResolvedValueOnce(true);

		const result = await buildSpec(
			'specs/my.cmd.ts',
			{
				fs: mockFs as unknown as FsAdapter,
				logger: mockLogger as unknown as LoggerAdapter,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				workspace: mockWorkspace as unknown as any,
			},
			config
		);

		expect(result.results[0]?.skipped).toBe(true);
		expect(mockFs.writeFile).not.toHaveBeenCalled();
	});

	it('should generate tests when requested', async () => {
		mockInferSpecType.mockReturnValue('operation');
		mockScanSpecSource.mockReturnValue({
			kind: 'command',
			key: 'my.cmd',
		} as SpecScanResult);

		const result = await buildSpec(
			'specs/my.cmd.ts',
			{
				fs: mockFs as unknown as FsAdapter,
				logger: mockLogger as unknown as LoggerAdapter,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				workspace: mockWorkspace as unknown as any,
			},
			config,
			{ targets: ['handler', 'test'] }
		);

		expect(result.results).toHaveLength(2);
		expect(mockGenerateTest).toHaveBeenCalled();
	});

	it('should skip overwrite if file exists', async () => {
		mockFs.exists.mockResolvedValue(true);
		mockInferSpecType.mockReturnValue('operation');
		mockScanSpecSource.mockReturnValue({
			kind: 'command',
			key: 'my.cmd',
		} as SpecScanResult);

		const result = await buildSpec(
			'specs/my.cmd.ts',
			{
				fs: mockFs as unknown as FsAdapter,
				logger: mockLogger as unknown as LoggerAdapter,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				workspace: mockWorkspace as unknown as any,
			},
			config
		);

		expect(result.results[0]?.skipped).toBe(true);
		expect(mockFs.writeFile).not.toHaveBeenCalled();
	});

	it('should overwrite existing files if overwrite is true', async () => {
		mockInferSpecType.mockReturnValue('operation');
		mockScanSpecSource.mockReturnValue({
			kind: 'command',
			key: 'my.cmd',
		} as SpecScanResult);
		mockFs.exists.mockResolvedValueOnce(true);

		const result = await buildSpec(
			'specs/my.cmd.ts',
			{
				fs: mockFs as unknown as FsAdapter,
				logger: mockLogger as unknown as LoggerAdapter,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				workspace: mockWorkspace as unknown as any,
			},
			config,
			{ overwrite: true }
		);

		expect(result.results[0]?.success).toBe(true);
		expect(result.results[0]?.skipped).toBeUndefined();
		expect(mockFs.writeFile).toHaveBeenCalled();
	});

	it('should respect dryRun', async () => {
		mockInferSpecType.mockReturnValue('operation');
		mockScanSpecSource.mockReturnValue({
			kind: 'command',
			key: 'my.cmd',
		} as SpecScanResult);

		const result = await buildSpec(
			'specs/my.cmd.ts',
			{
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				fs: mockFs as any,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				logger: mockLogger as any,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				workspace: mockWorkspace as unknown as any,
			},
			config,
			{ dryRun: true, overwrite: true, targets: ['handler'] }
		);

		expect(result.results[0]?.success).toBe(true);
		expect(mockFs.writeFile).not.toHaveBeenCalled();
	});

	it('should handle errors gracefully', async () => {
		mockInferSpecType.mockReturnValue('operation');
		mockScanSpecSource.mockImplementation(() => {
			throw new Error('Scan failed');
		});

		// scanSpecSource exception bubbles up if it happens before the loop
		expect(
			buildSpec(
				'specs/my.cmd.ts',
				{
					fs: mockFs as unknown as FsAdapter,
					logger: mockLogger as unknown as LoggerAdapter,
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					workspace: mockWorkspace as unknown as any,
				},
				config
			)
		).rejects.toThrow('Scan failed');
	});

	it('should handle build errors for specific targets', async () => {
		mockInferSpecType.mockReturnValue('operation');
		mockScanSpecSource.mockReturnValue({
			kind: 'command',
			key: 'my.cmd',
		} as SpecScanResult);
		mockFs.exists.mockResolvedValue(false);
		mockFs.writeFile.mockRejectedValue(new Error('Write failed'));

		const result = await buildSpec(
			'specs/my.cmd.ts',
			{
				fs: mockFs as unknown as FsAdapter,
				logger: mockLogger as unknown as LoggerAdapter,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				workspace: mockWorkspace as unknown as any,
			},
			config,
			{ targets: ['handler'], overwrite: true }
		);

		expect(result.results[0]?.success).toBe(false);
		expect(result.results[0]?.error).toBe('Write failed');
	});

	it('should build a data-view renderer for data-view specs', async () => {
		mockInferSpecType.mockReturnValue('data-view');
		mockScanSpecSource.mockReturnValue({
			specType: 'data-view',
			key: 'users.list',
		} as SpecScanResult);

		const result = await buildSpec(
			'specs/users.data-view.ts',
			{
				fs: mockFs as unknown as FsAdapter,
				logger: mockLogger as unknown as LoggerAdapter,
				workspace: mockWorkspace as never,
			},
			config,
			{ targets: ['data-view-renderer'], overwrite: true }
		);

		expect(result.results[0]?.success).toBe(true);
		expect(result.results[0]?.target).toBe('data-view-renderer');
		expect(mockFs.writeFile).toHaveBeenCalled();
	});

	it('should scaffold package targets for module bundles', async () => {
		mockInferSpecType.mockReturnValue('module-bundle');
		mockScanSpecSource.mockReturnValue({
			specType: 'module-bundle',
			key: 'workspace.bundle',
			description: 'Workspace bundle scaffold',
		} as SpecScanResult);

		const result = await buildSpec(
			'packages/bundles/workspace/src/bundles/WorkspaceBundle.ts',
			{
				fs: mockFs as unknown as FsAdapter,
				logger: mockLogger as unknown as LoggerAdapter,
				workspace: mockWorkspace as never,
			},
			config,
			{ targets: ['package-scaffold'], overwrite: true }
		);

		expect(result.results[0]?.success).toBe(true);
		expect(result.results[0]?.target).toBe('package-scaffold');
		expect(mockFs.writeFile).toHaveBeenCalled();
	});

	it('uses the runtime generation strategy when provided', async () => {
		mockInferSpecType.mockReturnValue('operation');
		mockScanSpecSource.mockReturnValue({
			kind: 'command',
			key: 'my.cmd',
		} as SpecScanResult);

		const result = await buildSpec(
			'specs/my.cmd.ts',
			{
				fs: mockFs as unknown as FsAdapter,
				logger: mockLogger as unknown as LoggerAdapter,
				workspace: mockWorkspace as never,
			},
			config,
			{
				targets: ['handler', 'test'],
				runtimeGeneration: {
					generateArtifact: async () => 'agent handler',
					generateTest: async () => 'agent test',
				},
			}
		);

		expect(result.results.map((entry) => entry.success)).toEqual([true, true]);
		expect(mockFs.writeFile).toHaveBeenCalledWith(
			expect.stringContaining('.handler.ts'),
			expect.stringContaining('agent handler')
		);
		expect(mockFs.writeFile).toHaveBeenCalledWith(
			expect.stringContaining('.test.ts'),
			expect.stringContaining('agent test')
		);
	});

	it('builds form and workflow runtime targets through the shared service', async () => {
		mockInferSpecType.mockReturnValue('form');
		mockScanSpecSource.mockReturnValue({
			specType: 'form',
			key: 'profile.edit',
		} as SpecScanResult);

		const formResult = await buildSpec(
			'specs/profile.form.ts',
			{
				fs: mockFs as unknown as FsAdapter,
				logger: mockLogger as unknown as LoggerAdapter,
				workspace: mockWorkspace as never,
			},
			config,
			{ targets: ['form'] }
		);

		mockInferSpecType.mockReturnValue('workflow');
		mockScanSpecSource.mockReturnValue({
			specType: 'workflow',
			key: 'approval.flow',
		} as SpecScanResult);
		mockFs.readFile.mockResolvedValueOnce(
			'export const ApprovalFlow: WorkflowSpec = { workflowDevkit: true };'
		);

		const workflowResult = await buildSpec(
			'specs/approval.workflow.ts',
			{
				fs: mockFs as unknown as FsAdapter,
				logger: mockLogger as unknown as LoggerAdapter,
				workspace: mockWorkspace as never,
			},
			config,
			{ targets: ['workflow-runner'], overwrite: true }
		);

		expect(formResult.results[0]?.success).toBe(true);
		expect(workflowResult.results[0]?.success).toBe(true);
		expect(mockFs.writeFile).toHaveBeenCalledWith(
			expect.stringContaining('.runner.ts'),
			expect.any(String)
		);
		expect(mockFs.writeFile).toHaveBeenCalledWith(
			expect.stringContaining('.workflow-devkit.ts'),
			expect.any(String)
		);
	});
});
