// Entity definitions for schema generation
export * from './entities';

// Contract specifications
export * from './contracts';

// Storage adapters
export * from './storage';

// Feature module specification
export * from './audit-trail.feature';

// Re-export bus audit types for convenience
export type {
  AuditRecord,
  AuditStorage,
  AuditQueryOptions,
} from '@contractspec/lib.bus';
