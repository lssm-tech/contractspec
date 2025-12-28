export * from './impls';

// Provider interface shims (re-exported from @contractspec/lib.contracts) so the impls
// can keep their existing relative imports (e.g. ../openbanking).
export * from './openbanking';
export * from './llm';
export * from './embedding';
export * from './vector-store';
export * from './storage';
export * from './email';
export * from './calendar';
export * from './sms';
export * from './payments';
export * from './voice';
