export * from './analytics';
export * from './calendar';
export * from './database';
export * from './email';
export * from './embedding';
export * from './health';
export * from './impls';
export * from './integration';
export * from './llm';
export * from './meeting-recorder';
export * from './messaging';
// Provider interface shims (re-exported from @contractspec/lib.contracts-integrations) so the impls
// can keep their existing relative imports (e.g. ../openbanking).
export * from './openbanking';
export * from './payments';
export * from './project-management';
export * from './sms';
export * from './storage';
export * from './vector-store';
export * from './voice';
