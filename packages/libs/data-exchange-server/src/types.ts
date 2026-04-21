import type {
	FileInterchangeSource,
	FileInterchangeTarget,
	HttpInterchangeSource,
	HttpInterchangeTarget,
	InterchangeRecord,
	ReconciliationPolicy,
	RecordBatch,
	SqlInterchangeSource,
	SqlInterchangeTarget,
	StorageInterchangeSource,
	StorageInterchangeTarget,
	ValidationIssue,
} from '@contractspec/lib.data-exchange-core';

export interface SqlWriteResult {
	written: number;
	failed?: number;
	issues?: ValidationIssue[];
}

export interface SqlClient {
	query(source: SqlInterchangeSource): Promise<InterchangeRecord[]>;
	write(args: {
		target: SqlInterchangeTarget;
		batch: RecordBatch;
		reconciliationPolicy: ReconciliationPolicy;
	}): Promise<SqlWriteResult>;
}

export interface StorageClient {
	getObject(source: StorageInterchangeSource): Promise<string>;
	putObject(args: {
		target: StorageInterchangeTarget;
		body: string;
		contentType: string;
	}): Promise<void>;
}

export interface AdapterRegistry {
	fetch?: typeof fetch;
	sqlClients?: Record<string, SqlClient>;
	storageClients?: Record<string, StorageClient>;
}

export interface FileWriteResult {
	path: string;
	written: number;
}

export interface HttpWriteResult {
	status: number;
	body: string;
	written: number;
}

export interface TargetWriteResult {
	written: number;
	failed: number;
	batch?: RecordBatch;
	metadata?: Record<string, unknown>;
}

export interface ExecuteRunArgs {
	source:
		| FileInterchangeSource
		| HttpInterchangeSource
		| SqlInterchangeSource
		| StorageInterchangeSource
		| { kind: 'memory'; batch: RecordBatch; format?: 'csv' | 'json' | 'xml' };
	target:
		| FileInterchangeTarget
		| HttpInterchangeTarget
		| SqlInterchangeTarget
		| StorageInterchangeTarget
		| { kind: 'memory'; format?: 'csv' | 'json' | 'xml' };
}

export interface RetryDecision {
	retryable: boolean;
	reason: string;
	nextDelayMs?: number;
}
