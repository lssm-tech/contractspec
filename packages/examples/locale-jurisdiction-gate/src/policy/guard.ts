import type { GateError, GateResult } from './types';

interface EnvelopeLike {
  locale?: string;
  kbSnapshotId?: string;
  allowedScope?: 'education_only' | 'generic_info' | 'escalation_required';
  regulatoryContext?: { jurisdiction?: string };
}

interface AnswerLike {
  citations?: unknown[];
  sections?: { heading: string; body: string }[];
  refused?: boolean;
  refusalReason?: string;
  allowedScope?: 'education_only' | 'generic_info' | 'escalation_required';
}

const SUPPORTED_LOCALES = new Set<string>(['en-US', 'en-GB', 'fr-FR']);

function err(code: GateError['code'], message: string): GateError {
  return { code, message };
}

export function validateEnvelope(
  envelope: EnvelopeLike
): GateResult<Required<EnvelopeLike>> {
  if (!envelope.locale || !SUPPORTED_LOCALES.has(envelope.locale)) {
    return {
      ok: false,
      error: err('LOCALE_REQUIRED', 'locale is required and must be supported'),
    };
  }
  if (!envelope.regulatoryContext?.jurisdiction) {
    return {
      ok: false,
      error: err('JURISDICTION_REQUIRED', 'jurisdiction is required'),
    };
  }
  if (!envelope.kbSnapshotId) {
    return {
      ok: false,
      error: err('KB_SNAPSHOT_REQUIRED', 'kbSnapshotId is required'),
    };
  }
  if (!envelope.allowedScope) {
    return {
      ok: false,
      error: err('SCOPE_VIOLATION', 'allowedScope is required'),
    };
  }
  return { ok: true, value: envelope as Required<EnvelopeLike> };
}

export function enforceCitations(answer: AnswerLike): GateResult<AnswerLike> {
  const citations = answer.citations ?? [];
  if (!Array.isArray(citations) || citations.length === 0) {
    return {
      ok: false,
      error: err(
        'CITATIONS_REQUIRED',
        'answers must include at least one citation'
      ),
    };
  }
  return { ok: true, value: answer };
}

const EDUCATION_ONLY_FORBIDDEN_PATTERNS: RegExp[] = [
  /\b(buy|sell)\b/i,
  /\b(should\s+buy|should\s+sell)\b/i,
  /\b(guarantee(d)?|promise(d)?)\b/i,
];

export function enforceAllowedScope(
  allowedScope: EnvelopeLike['allowedScope'],
  answer: AnswerLike
): GateResult<AnswerLike> {
  if (!allowedScope) {
    return {
      ok: false,
      error: err('SCOPE_VIOLATION', 'allowedScope is required'),
    };
  }
  if (allowedScope !== 'education_only') {
    return { ok: true, value: answer };
  }

  const bodies = (answer.sections ?? []).map((s) => s.body).join('\n');
  const violations = EDUCATION_ONLY_FORBIDDEN_PATTERNS.some((re) =>
    re.test(bodies)
  );
  if (violations) {
    return {
      ok: false,
      error: err(
        'SCOPE_VIOLATION',
        'answer violates education_only scope (contains actionable or promotional language)'
      ),
    };
  }
  return { ok: true, value: answer };
}

