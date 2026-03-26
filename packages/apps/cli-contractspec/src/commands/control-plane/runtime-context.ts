import {
	ChannelApprovalService,
	type ChannelRuntimeStore,
	ChannelTraceService,
	InMemoryChannelRuntimeStore,
	PostgresChannelRuntimeStore,
} from '@contractspec/integration.runtime/channel';

export interface ControlPlaneRuntimeContext {
	store: ChannelRuntimeStore;
	approvalService: ChannelApprovalService;
	traceService: ChannelTraceService;
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
		return {
			store,
			approvalService: new ChannelApprovalService(store),
			traceService: new ChannelTraceService(store),
			dispose: async () => {},
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
	await store.initializeSchema();

	return {
		store,
		approvalService: new ChannelApprovalService(store),
		traceService: new ChannelTraceService(store),
		dispose: async () => {
			await pool.end();
		},
	};
}
