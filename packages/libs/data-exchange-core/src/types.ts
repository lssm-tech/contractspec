import type { AnySchemaModel } from '@contractspec/lib.schema';

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
	| JsonPrimitive
	| JsonValue[]
	| { [key: string]: JsonValue | undefined };

export type InterchangeFormat = 'csv' | 'json' | 'xml';
export type InterchangeLocationKind =
	| 'memory'
	| 'file'
	| 'http'
	| 'sql'
	| 'storage';
export type InterchangeValue = JsonValue | Date | undefined;
export type InterchangeRecord = Record<string, InterchangeValue>;
export type InterchangeColumnType =
	| 'string'
	| 'number'
	| 'boolean'
	| 'date'
	| 'json'
	| 'null'
	| 'unknown';

export interface InterchangeColumn {
	key: string;
	label: string;
	sourcePath: string;
	detectedType: InterchangeColumnType;
	nullable: boolean;
	sampleValues: string[];
}

export interface RecordBatch {
	name?: string;
	format?: InterchangeFormat;
	columns: InterchangeColumn[];
	records: InterchangeRecord[];
	metadata?: Record<string, JsonValue | undefined>;
}

interface InterchangeEndpointBase {
	kind: InterchangeLocationKind;
	name?: string;
	format?: InterchangeFormat;
	metadata?: Record<string, JsonValue | undefined>;
}

export interface MemoryInterchangeSource extends InterchangeEndpointBase {
	kind: 'memory';
	batch: RecordBatch;
}

export interface FileInterchangeSource extends InterchangeEndpointBase {
	kind: 'file';
	path: string;
	encoding?: 'utf-8';
}

export interface HttpInterchangeSource extends InterchangeEndpointBase {
	kind: 'http';
	url: string;
	method?: 'GET' | 'POST';
	headers?: Record<string, string>;
	body?: JsonValue;
}

export interface SqlInterchangeSource extends InterchangeEndpointBase {
	kind: 'sql';
	connection: string;
	query: string;
	dialect?: 'sqlite' | 'postgresql' | 'mysql';
}

export interface StorageInterchangeSource extends InterchangeEndpointBase {
	kind: 'storage';
	bucket: string;
	objectKey: string;
	provider?: 's3' | 'gcs' | 'local';
}

export type InterchangeSource =
	| MemoryInterchangeSource
	| FileInterchangeSource
	| HttpInterchangeSource
	| SqlInterchangeSource
	| StorageInterchangeSource;

export interface MemoryInterchangeTarget extends InterchangeEndpointBase {
	kind: 'memory';
}

export interface FileInterchangeTarget extends InterchangeEndpointBase {
	kind: 'file';
	path: string;
}

export interface HttpInterchangeTarget extends InterchangeEndpointBase {
	kind: 'http';
	url: string;
	method?: 'POST' | 'PUT' | 'PATCH';
	headers?: Record<string, string>;
}

export interface SqlInterchangeTarget extends InterchangeEndpointBase {
	kind: 'sql';
	connection: string;
	table: string;
	dialect?: 'sqlite' | 'postgresql' | 'mysql';
}

export interface StorageInterchangeTarget extends InterchangeEndpointBase {
	kind: 'storage';
	bucket: string;
	objectKey: string;
	provider?: 's3' | 'gcs' | 'local';
}

export type InterchangeTarget =
	| MemoryInterchangeTarget
	| FileInterchangeTarget
	| HttpInterchangeTarget
	| SqlInterchangeTarget
	| StorageInterchangeTarget;

export type MappingRule =
	| { kind: 'trim' }
	| { kind: 'uppercase' }
	| { kind: 'lowercase' }
	| { kind: 'json-parse' }
	| { kind: 'json-stringify' }
	| { kind: 'number' }
	| { kind: 'boolean' }
	| { kind: 'date' }
	| { kind: 'string' }
	| { kind: 'constant'; value: JsonValue }
	| { kind: 'default'; value: JsonValue }
	| { kind: 'split'; delimiter: string }
	| { kind: 'join'; delimiter: string };

export interface FieldMapping {
	sourceField: string;
	targetField: string;
	required?: boolean;
	confidence?: number;
	rules?: MappingRule[];
	notes?: string[];
}

export interface ValidationIssue {
	severity: 'error' | 'warning' | 'info';
	code: string;
	message: string;
	fieldPath?: string;
	recordIndex?: number;
	actualValue?: unknown;
	expectedType?: string;
}

export interface PreviewChange {
	recordIndex: number;
	fieldPath: string;
	before: unknown;
	after: unknown;
	changeType: 'added' | 'removed' | 'modified';
}

export interface PreviewResult {
	plan: ImportPlan | ExportPlan;
	sampleRecords: InterchangeRecord[];
	normalizedRecords: InterchangeRecord[];
	issues: ValidationIssue[];
	changes: PreviewChange[];
}

export interface ExecutionAuditEntry {
	step: string;
	status: 'success' | 'warning' | 'error';
	message: string;
	recordIndex?: number;
	metadata?: Record<string, JsonValue | undefined>;
}

export interface ExecutionResult {
	success: boolean;
	processed: number;
	succeeded: number;
	failed: number;
	skipped: number;
	issues: ValidationIssue[];
	auditTrail: ExecutionAuditEntry[];
	batch?: RecordBatch;
}

export interface ReconciliationPolicy {
	keyFields: string[];
	onMissing: 'create' | 'skip' | 'error';
	onMatch: 'update' | 'skip' | 'merge';
	onExtra: 'ignore' | 'delete' | 'archive';
}

interface BasePlan {
	schema: AnySchemaModel;
	mappings: FieldMapping[];
	reconciliationPolicy: ReconciliationPolicy;
	issues: ValidationIssue[];
	sampleSize: number;
}

export interface ImportPlan extends BasePlan {
	direction: 'import';
	source: InterchangeSource;
	target: InterchangeTarget;
	sourceBatch: RecordBatch;
}

export interface ExportPlan extends BasePlan {
	direction: 'export';
	source: InterchangeSource;
	target: InterchangeTarget;
	sourceBatch: RecordBatch;
}
