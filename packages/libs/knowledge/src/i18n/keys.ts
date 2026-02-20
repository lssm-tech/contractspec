/**
 * Typed message keys for the knowledge i18n system.
 *
 * All translatable strings in the package are referenced by these keys.
 * Organized by domain: access, query, ingestion.
 *
 * @module i18n/keys
 */

// ─────────────────────────────────────────────────────────────────────────────
// Access Guard Strings
// ─────────────────────────────────────────────────────────────────────────────

export const ACCESS_KEYS = {
  /** 'Knowledge space "{spaceKey}" is not bound in the resolved app config.' */
  'access.notBound': 'access.notBound',
  /** 'Knowledge space "{spaceKey}" is category "{category}" and is read-only.' */
  'access.readOnly': 'access.readOnly',
  /** 'Workflow "{workflowName}" is not authorized to access knowledge space "{spaceKey}".' */
  'access.workflowUnauthorized': 'access.workflowUnauthorized',
  /** 'Agent "{agentName}" is not authorized to access knowledge space "{spaceKey}".' */
  'access.agentUnauthorized': 'access.agentUnauthorized',
  /** 'Knowledge space "{spaceKey}" is ephemeral; results may be transient.' */
  'access.ephemeralWarning': 'access.ephemeralWarning',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Query Service Strings
// ─────────────────────────────────────────────────────────────────────────────

export const QUERY_KEYS = {
  /** Default system prompt for the knowledge assistant LLM */
  'query.systemPrompt': 'query.systemPrompt',
  /** Template for the user message: "Question:\n{question}\n\nContext:\n{context}" */
  'query.userMessage': 'query.userMessage',
  /** "No relevant documents found." */
  'query.noResults': 'query.noResults',
  /** "Source {index} (score: {score}):" */
  'query.sourceLabel': 'query.sourceLabel',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Ingestion / Gmail Formatting Strings
// ─────────────────────────────────────────────────────────────────────────────

export const INGESTION_KEYS = {
  /** "Subject: {subject}" */
  'ingestion.gmail.subject': 'ingestion.gmail.subject',
  /** "Snippet: {snippet}" */
  'ingestion.gmail.snippet': 'ingestion.gmail.snippet',
  /** "From: {from}" */
  'ingestion.gmail.from': 'ingestion.gmail.from',
  /** "To: {to}" */
  'ingestion.gmail.to': 'ingestion.gmail.to',
  /** "Date: {date}" */
  'ingestion.gmail.date': 'ingestion.gmail.date',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Combined Keys
// ─────────────────────────────────────────────────────────────────────────────

export const I18N_KEYS = {
  ...ACCESS_KEYS,
  ...QUERY_KEYS,
  ...INGESTION_KEYS,
} as const;

/** Union type of all valid knowledge i18n keys */
export type KnowledgeMessageKey = keyof typeof I18N_KEYS;
