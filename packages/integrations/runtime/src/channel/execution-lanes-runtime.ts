import {
	createInProcessTeamBackend,
	type LaneRuntimeStore,
	type TeamBackendAdapter,
} from '@contractspec/lib.execution-lanes';
import type { Pool } from 'pg';
import { InMemoryExecutionLaneRuntimeStore } from './execution-lanes-memory-store';
import { PostgresExecutionLaneRuntimeStore } from './execution-lanes-postgres-store';
import {
	ExecutionLaneOperatorService,
	type ExecutionLaneOperatorServiceOptions,
} from './execution-lanes-service';

export interface ExecutionLaneOperatorRuntime {
	store: LaneRuntimeStore;
	service: ExecutionLaneOperatorService;
	initialize(): Promise<void>;
	dispose(): Promise<void>;
}

export interface CreateExecutionLaneOperatorRuntimeOptions
	extends Omit<ExecutionLaneOperatorServiceOptions, 'teamBackends'> {
	storageMode?: 'memory' | 'postgres';
	databaseUrl?: string;
	store?: LaneRuntimeStore;
	pool?: Pool;
	createPool?(databaseUrl: string): Pool | Promise<Pool>;
	teamBackends?: Record<string, TeamBackendAdapter>;
}

export async function createExecutionLaneOperatorRuntime(
	options: CreateExecutionLaneOperatorRuntimeOptions = {}
): Promise<ExecutionLaneOperatorRuntime> {
	const resolvedTeamBackends = {
		'in-process': createInProcessTeamBackend(),
		...(options.teamBackends ?? {}),
	};
	const resolvedStore = options.store
		? {
				store: options.store,
				initialize: async () => {},
				dispose: async () => {},
			}
		: await createExecutionLaneRuntimeStore(options);
	const service = new ExecutionLaneOperatorService(resolvedStore.store, {
		hooks: options.hooks,
		now: options.now,
		resolveTeamBackend: options.resolveTeamBackend,
		teamBackends: resolvedTeamBackends,
	});

	return {
		store: resolvedStore.store,
		service,
		initialize: resolvedStore.initialize,
		dispose: resolvedStore.dispose,
	};
}

async function createExecutionLaneRuntimeStore(
	options: CreateExecutionLaneOperatorRuntimeOptions
): Promise<{
	store: LaneRuntimeStore;
	initialize(): Promise<void>;
	dispose(): Promise<void>;
}> {
	if (options.storageMode === 'postgres') {
		const pool = options.pool ?? (await createPool(options));
		const store = new PostgresExecutionLaneRuntimeStore(pool);
		return {
			store,
			initialize() {
				return store.initializeSchema();
			},
			dispose: options.pool ? async () => {} : async () => pool.end(),
		};
	}

	return {
		store: new InMemoryExecutionLaneRuntimeStore(),
		initialize: async () => {},
		dispose: async () => {},
	};
}

async function createPool(
	options: CreateExecutionLaneOperatorRuntimeOptions
): Promise<Pool> {
	if (!options.databaseUrl) {
		throw new Error('Execution lane postgres runtime requires a databaseUrl.');
	}
	if (options.createPool) {
		return options.createPool(options.databaseUrl);
	}
	const { Pool: PgPool } = await import('pg');
	return new PgPool({ connectionString: options.databaseUrl });
}
