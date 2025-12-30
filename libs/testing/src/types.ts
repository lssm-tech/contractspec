import type {
  OperationSpec,
  ResourceRefDescriptor,
} from '@contractspec/lib.contracts';
import type { AnySchemaModel } from '@contractspec/lib.schema';

export interface TrafficSnapshot {
  id: string;
  operation: { name: string; version: string };
  input: unknown;
  output?: unknown;
  error?: {
    name?: string;
    message?: string;
    stack?: string;
    code?: string;
  };
  success: boolean;
  timestamp: Date;
  durationMs?: number;
  tenantId?: string;
  userId?: string;
  channel?: string;
  metadata?: Record<string, unknown>;
}

export interface GoldenTestCase {
  id: string;
  name: string;
  input: unknown;
  expectedOutput?: unknown;
  expectedError?: {
    name?: string;
    message?: string;
    code?: string;
  };
  success: boolean;
  metadata?: Record<string, unknown>;
}

export type RuntimeContract = OperationSpec<
  AnySchemaModel,
  AnySchemaModel | ResourceRefDescriptor<boolean>
>;
