import { beforeEach, describe, expect, it, mock } from 'bun:test';
import type { BridgeWorkspaceServices } from './BridgeServer';
import { BridgeServer } from './BridgeServer';

const discoverSpecs = mock(async () => [
	{
		filePath: '/repo/packages/modules/audit/src/contracts/ai-contracts.ts',
		specType: 'event',
		key: 'audit.recorded',
		exportName: 'auditRecorded',
		declarationLine: 2,
		version: '1.0.0',
		hasMeta: true,
		hasIo: false,
		hasPolicy: false,
		hasPayload: true,
		hasContent: false,
		hasDefinition: false,
		kind: 'event',
	},
]);
const validateDiscoveredSpecs = mock(
	async (specs: Array<Record<string, unknown>>) =>
		specs.map((spec) => ({
			spec,
			valid: true,
			errors: [],
			warnings: [],
		}))
);
const getWorkspaceInfo = mock(() => ({ workspaceRoot: '/repo' }));
const runDoctor = mock(async () => ({ healthy: true }));
const runSetup = mock(async (fsArg, options) => ({
	success: true,
	preset: options.preset ?? 'core',
	files: [],
	summary: 'ok',
	nextSteps: ['contractspec validate'],
}));

const bridgeServices = {
	discoverSpecs,
	getWorkspaceInfo,
	runDoctor,
	runSetup,
	validateDiscoveredSpecs,
};

function createServer() {
	return new BridgeServer(
		{
			onRequest: mock(),
			console: { log: mock(), error: mock() },
		} as never,
		bridgeServices as Partial<BridgeWorkspaceServices>
	);
}

describe('BridgeServer spec discovery payloads', () => {
	beforeEach(() => {
		discoverSpecs.mockClear();
		validateDiscoveredSpecs.mockClear();
		runSetup.mockClear();
		runDoctor.mockClear();
		getWorkspaceInfo.mockClear();
	});

	it('wraps listSpecs responses under specs', async () => {
		const server = createServer();

		(server as any).workspaceAdapters = { fs: {}, logger: {} };
		(server as any).workspaceConfig = { outputDir: './src' };

		const result = await (server as any).handleListSpecs();

		expect(result.specs).toHaveLength(1);
		expect(result.specs[0]?.exportName).toBe('auditRecorded');
	});

	it('wraps validateSpecs responses under results', async () => {
		const server = createServer();

		(server as any).workspaceAdapters = { fs: {}, logger: {} };
		(server as any).workspaceConfig = { outputDir: './src' };

		const result = await (server as any).handleValidateSpecs({
			filePaths: ['/repo/packages/modules/audit/src/contracts/ai-contracts.ts'],
		});

		expect(result.results).toHaveLength(1);
		expect(result.results[0]?.spec.exportName).toBe('auditRecorded');
	});

	it('passes setup presets through the setup handler', async () => {
		const server = createServer();

		(server as any).workspaceAdapters = { fs: {}, logger: {} };
		(server as any).workspaceRoot = '/repo';

		const result = await (server as any).handleRunSetupWizard({
			preset: 'builder-hybrid',
			projectName: 'Demo App',
			builderApiBaseUrl: 'https://api.contractspec.io',
		});

		expect(runSetup).toHaveBeenCalledWith(
			{},
			expect.objectContaining({
				workspaceRoot: '/repo',
				preset: 'builder-hybrid',
				projectName: 'Demo App',
				builderApiBaseUrl: 'https://api.contractspec.io',
			})
		);
		expect(result.preset).toBe('builder-hybrid');
	});

	it('proxies doctor and workspace info results', async () => {
		const server = createServer();

		(server as any).workspaceAdapters = { fs: {}, logger: {} };
		(server as any).workspaceRoot = '/repo';

		const doctorResult = await (server as any).handleRunDoctorCheck();
		const workspaceResult = await (server as any).handleGetWorkspaceInfo();

		expect(runDoctor).toHaveBeenCalled();
		expect(getWorkspaceInfo).toHaveBeenCalledWith('/repo');
		expect(doctorResult).toEqual({ healthy: true });
		expect(workspaceResult).toEqual({ workspaceRoot: '/repo' });
	});
});
