import {
	ChannelApprovalService,
	type ChannelRuntimeStore,
	ChannelTraceService,
	createExecutionLaneOperatorRuntime,
	ExecutionLaneOperatorService,
	InMemoryChannelRuntimeStore,
	type LaneRuntimeStore,
	PostgresChannelRuntimeStore,
} from '@contractspec/integration.runtime/channel';

export interface ControlPlaneRuntimeContext {
	store: ChannelRuntimeStore;
	executionLaneStore: LaneRuntimeStore;
	approvalService: ChannelApprovalService;
	traceService: ChannelTraceService;
	executionLaneService: ExecutionLaneOperatorService;
	dispose: () => Promise<void>;
}

export async function createControlPlaneRuntimeContext(): Promise<ControlPlaneRuntimeContext> {
	const storageMode = process.env.CHANNEL_RUNTIME_STORAGE ?? 'postgres';
	if (storageMode !== 'memory' && storageMode !== 'postgres') {
		throw new Error(
			`Unsupported CHANNEL_RUNTIME_STORAGE value: ${storageMode}. Use "memory" or "postgres".`
		);
	}
	if (storageMode === 'memory') {
		const store = new InMemoryChannelRuntimeStore();
		const executionLaneRuntime = await createExecutionLaneOperatorRuntime({
			storageMode: 'memory',
		});
		return {
			store,
			executionLaneStore: executionLaneRuntime.store,
			approvalService: new ChannelApprovalService(store),
			traceService: new ChannelTraceService(store),
			executionLaneService: executionLaneRuntime.service,
			dispose: executionLaneRuntime.dispose,
		};
	}

	const databaseUrl =
		process.env.CHANNEL_RUNTIME_DATABASE_URL ?? process.env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error(
			'CHANNEL_RUNTIME_DATABASE_URL (or DATABASE_URL) must be set for control-plane CLI commands.'
		);
	}

	const { Pool } = await import('pg');
	const pool = new Pool({ connectionString: databaseUrl });
	const store = new PostgresChannelRuntimeStore(pool);
	const executionLaneRuntime = await createExecutionLaneOperatorRuntime({
		storageMode: 'postgres',
		databaseUrl,
		createPool(connectionString) {
			return new Pool({ connectionString });
		},
	});
	await store.initializeSchema();
	await executionLaneRuntime.initialize();

	return {
		store,
		executionLaneStore: executionLaneRuntime.store,
		approvalService: new ChannelApprovalService(store),
		traceService: new ChannelTraceService(store),
		executionLaneService: executionLaneRuntime.service,
		dispose: async () => {
			await Promise.all([pool.end(), executionLaneRuntime.dispose()]);
		},
	};
}
