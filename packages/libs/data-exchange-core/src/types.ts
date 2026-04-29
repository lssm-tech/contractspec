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

export interface CsvCodecOptions {
	delimiter?: string;
	quote?: string;
	headerRow?: number;
	skipRows?: number;
	columns?: string[];
}

export interface JsonCodecOptions {
	pretty?: boolean;
	recordsKey?: string;
	metadataKey?: string;
}

export interface XmlCodecOptions {
	rootTag?: string;
	recordTag?: string;
	attributeFields?: string[];
	metadataTag?: string;
	includeMetadata?: boolean;
}

export interface InterchangeCodecOptions {
	csv?: CsvCodecOptions;
	json?: JsonCodecOptions;
	xml?: XmlCodecOptions;
}

interface InterchangeEndpointBase {
	kind: InterchangeLocationKind;
	name?: string;
	format?: InterchangeFormat;
	codecOptions?: InterchangeCodecOptions;
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

export type ColumnValueFormatKind =
	| 'text'
	| 'number'
	| 'boolean'
	| 'date'
	| 'datetime'
	| 'json'
	| 'split'
	| 'join'
	| 'currency'
	| 'percentage';

export interface ColumnValueFormat {
	kind: ColumnValueFormatKind;
	trim?: boolean;
	case?: 'uppercase' | 'lowercase';
	decimalSeparator?: string;
	thousandsSeparator?: string;
	trueValues?: string[];
	falseValues?: string[];
	inputFormats?: string[];
	emptyAsNull?: boolean;
	defaultValue?: JsonValue;
	delimiter?: string;
	currencySymbol?: string;
	percentScale?: 'fraction' | 'whole';
}

export interface FormatProfile {
	key?: string;
	locale?: string;
	defaultFormat?: ColumnValueFormat;
	columns?: Record<string, ColumnValueFormat | undefined>;
}

export interface FieldMapping {
	sourceField: string;
	targetField: string;
	required?: boolean;
	confidence?: number;
	rules?: MappingRule[];
	sourceAliases?: string[];
	format?: ColumnValueFormat;
	templateColumnKey?: string;
	status?: 'matched' | 'inferred' | 'manual' | 'unmatched';
	notes?: string[];
}

export interface ImportTemplateColumn {
	key: string;
	targetField: string;
	label: string;
	required?: boolean;
	sourceAliases?: string[];
	format?: ColumnValueFormat;
	description?: string;
}

export interface ImportTemplate {
	key: string;
	version: string;
	title?: string;
	description?: string;
	columns: ImportTemplateColumn[];
	formatProfile?: FormatProfile;
	metadata?: Record<string, JsonValue | undefined>;
}

export type DataExchangeTemplate = ImportTemplate;
export type ExportTemplate = DataExchangeTemplate;

export interface TemplateColumnMatch {
	templateColumnKey: string;
	targetField: string;
	sourceField: string;
	confidence: number;
	strategy: 'exact' | 'alias' | 'normalized' | 'schema';
}

export interface TemplateMappingResult {
	mappings: FieldMapping[];
	issues: ValidationIssue[];
	matchedColumns: TemplateColumnMatch[];
	unmatchedTemplateColumns: ImportTemplateColumn[];
	unmatchedSourceColumns: InterchangeColumn[];
	source: 'explicit' | 'template' | 'inferred';
}

export type MappingResolutionSource = TemplateMappingResult['source'];

export interface ResolveImportTemplateMappingsArgs {
	batch: RecordBatch;
	schema: AnySchemaModel;
	template?: ImportTemplate;
	formatProfile?: FormatProfile;
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
	mappingSource?: MappingResolutionSource;
	template?: DataExchangeTemplate;
	formatProfile?: FormatProfile;
	templateMapping?: TemplateMappingResult;
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
