// Entity definitions for schema generation

// Re-export bus audit types for convenience
export type {
	AuditQueryOptions,
	AuditRecord,
	AuditStorage,
} from '@contractspec/lib.bus';
// Feature module specification
export * from './audit-trail.feature';
// Contract specifications
export * from './contracts';
export * from './entities';
// Storage adapters
export * from './storage';
