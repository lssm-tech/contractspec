export type AllowedScope =
  | 'education_only'
  | 'generic_info'
  | 'escalation_required';

export interface GateError {
  code:
    | 'LOCALE_REQUIRED'
    | 'JURISDICTION_REQUIRED'
    | 'KB_SNAPSHOT_REQUIRED'
    | 'CITATIONS_REQUIRED'
    | 'SCOPE_VIOLATION';
  message: string;
}

export type GateResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: GateError };


