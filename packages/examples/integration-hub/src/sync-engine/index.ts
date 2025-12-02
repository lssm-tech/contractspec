/**
 * Sync Engine
 *
 * Core sync logic for the Integration Hub.
 */

// ============ Types ============

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  mappingType: 'DIRECT' | 'TRANSFORM' | 'LOOKUP' | 'CONSTANT' | 'COMPUTED';
  transformExpression?: string;
  lookupConfig?: LookupConfig;
  constantValue?: unknown;
  isRequired: boolean;
  defaultValue?: unknown;
}

export interface LookupConfig {
  sourceObject: string;
  lookupField: string;
  returnField: string;
}

export interface SyncConfig {
  id: string;
  direction: 'INBOUND' | 'OUTBOUND' | 'BIDIRECTIONAL';
  sourceObject: string;
  targetObject: string;
  fieldMappings: FieldMapping[];
  createNew: boolean;
  updateExisting: boolean;
  deleteRemoved: boolean;
  sourceFilter?: Record<string, unknown>;
}

export interface SyncContext {
  runId: string;
  config: SyncConfig;
  connection: {
    id: string;
    authType: string;
    credentials?: Record<string, unknown>;
  };
}

export interface SyncResult {
  success: boolean;
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsDeleted: number;
  recordsFailed: number;
  recordsSkipped: number;
  errors: SyncError[];
}

export interface SyncError {
  recordId?: string;
  field?: string;
  message: string;
  code: string;
}

export interface SourceRecord {
  id: string;
  data: Record<string, unknown>;
  checksum?: string;
}

export interface TargetRecord {
  id: string;
  data: Record<string, unknown>;
  checksum?: string;
}

// ============ Sync Engine Interface ============

export interface ISyncEngine {
  /**
   * Execute a sync operation.
   */
  sync(context: SyncContext): Promise<SyncResult>;

  /**
   * Transform a source record to target format.
   */
  transformRecord(
    sourceRecord: SourceRecord,
    mappings: FieldMapping[],
    context: SyncContext
  ): TargetRecord;

  /**
   * Validate a transformed record.
   */
  validateRecord(
    record: TargetRecord,
    mappings: FieldMapping[]
  ): { valid: boolean; errors: SyncError[] };
}

// ============ Field Transformer ============

export interface IFieldTransformer {
  transform(value: unknown, expression: string): unknown;
}

export class BasicFieldTransformer implements IFieldTransformer {
  transform(value: unknown, expression: string): unknown {
    // Simple expression evaluation
    // In production, use a proper expression language
    try {
      if (expression.startsWith('uppercase')) {
        return typeof value === 'string' ? value.toUpperCase() : value;
      }
      if (expression.startsWith('lowercase')) {
        return typeof value === 'string' ? value.toLowerCase() : value;
      }
      if (expression.startsWith('trim')) {
        return typeof value === 'string' ? value.trim() : value;
      }
      if (expression.startsWith('default:')) {
        const defaultVal = expression.replace('default:', '');
        return value ?? JSON.parse(defaultVal);
      }
      if (expression.startsWith('concat:')) {
        const separator = expression.replace('concat:', '') || ' ';
        if (Array.isArray(value)) {
          return value.join(separator);
        }
        return value;
      }
      if (expression.startsWith('split:')) {
        const separator = expression.replace('split:', '') || ',';
        if (typeof value === 'string') {
          return value.split(separator);
        }
        return value;
      }
      if (expression.startsWith('number')) {
        return Number(value);
      }
      if (expression.startsWith('boolean')) {
        return Boolean(value);
      }
      if (expression.startsWith('string')) {
        return String(value);
      }

      // Return as-is if no transformation matches
      return value;
    } catch {
      return value;
    }
  }
}

// ============ Basic Sync Engine ============

export class BasicSyncEngine implements ISyncEngine {
  private transformer: IFieldTransformer;

  constructor(transformer?: IFieldTransformer) {
    this.transformer = transformer ?? new BasicFieldTransformer();
  }

  async sync(context: SyncContext): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      recordsDeleted: 0,
      recordsFailed: 0,
      recordsSkipped: 0,
      errors: [],
    };

    // In a real implementation, this would:
    // 1. Fetch records from source
    // 2. Transform each record
    // 3. Validate each record
    // 4. Upsert to target
    // 5. Track sync records for deduplication

    return result;
  }

  transformRecord(
    sourceRecord: SourceRecord,
    mappings: FieldMapping[],
    _context: SyncContext
  ): TargetRecord {
    const targetData: Record<string, unknown> = {};

    for (const mapping of mappings) {
      let value: unknown;

      switch (mapping.mappingType) {
        case 'DIRECT':
          value = this.getNestedValue(sourceRecord.data, mapping.sourceField);
          break;

        case 'TRANSFORM':
          const sourceValue = this.getNestedValue(
            sourceRecord.data,
            mapping.sourceField
          );
          value = mapping.transformExpression
            ? this.transformer.transform(
                sourceValue,
                mapping.transformExpression
              )
            : sourceValue;
          break;

        case 'CONSTANT':
          value = mapping.constantValue;
          break;

        case 'LOOKUP':
          // In production, this would fetch from a lookup table
          value = this.getNestedValue(sourceRecord.data, mapping.sourceField);
          break;

        case 'COMPUTED':
          // In production, this would evaluate a computed expression
          value = mapping.transformExpression
            ? this.evaluateComputed(
                sourceRecord.data,
                mapping.transformExpression
              )
            : null;
          break;

        default:
          value = this.getNestedValue(sourceRecord.data, mapping.sourceField);
      }

      // Apply default value if needed
      if (value === undefined || value === null) {
        value = mapping.defaultValue;
      }

      // Set the target field
      this.setNestedValue(targetData, mapping.targetField, value);
    }

    return {
      id: sourceRecord.id,
      data: targetData,
    };
  }

  validateRecord(
    record: TargetRecord,
    mappings: FieldMapping[]
  ): { valid: boolean; errors: SyncError[] } {
    const errors: SyncError[] = [];

    for (const mapping of mappings) {
      if (mapping.isRequired) {
        const value = this.getNestedValue(record.data, mapping.targetField);
        if (value === undefined || value === null) {
          errors.push({
            recordId: record.id,
            field: mapping.targetField,
            message: `Required field ${mapping.targetField} is missing`,
            code: 'REQUIRED_FIELD_MISSING',
          });
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    const parts = path.split('.');
    let current: unknown = obj;

    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = (current as Record<string, unknown>)[part];
    }

    return current;
  }

  private setNestedValue(
    obj: Record<string, unknown>,
    path: string,
    value: unknown
  ): void {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (part === undefined) continue;
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }

    const lastPart = parts[parts.length - 1];
    if (lastPart !== undefined) {
      current[lastPart] = value;
    }
  }

  private evaluateComputed(
    data: Record<string, unknown>,
    expression: string
  ): unknown {
    // Simple computed field evaluation
    // In production, use a proper expression evaluator
    try {
      // Support simple field references like ${field.path}
      const result = expression.replace(/\$\{([^}]+)\}/g, (_, path) => {
        const value = this.getNestedValue(data, path);
        return String(value ?? '');
      });
      return result;
    } catch {
      return null;
    }
  }
}

// ============ Factory ============

export function createSyncEngine(transformer?: IFieldTransformer): ISyncEngine {
  return new BasicSyncEngine(transformer);
}

// ============ Checksum Utilities ============

export function computeChecksum(data: Record<string, unknown>): string {
  // Simple checksum based on JSON serialization
  // In production, use a proper hash function
  const str = JSON.stringify(data, Object.keys(data).sort());
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

export function hasChanges(
  sourceChecksum: string | undefined,
  targetChecksum: string | undefined
): boolean {
  if (!sourceChecksum || !targetChecksum) {
    return true;
  }
  return sourceChecksum !== targetChecksum;
}
