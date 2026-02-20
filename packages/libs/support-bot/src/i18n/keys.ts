/**
 * Typed message keys for the support-bot i18n system.
 *
 * All translatable strings in the package are referenced by these keys.
 * Organized by domain: prompt, responder, resolver, tool, error, feedback, spec.
 *
 * @module i18n/keys
 */

// ─────────────────────────────────────────────────────────────────────────────
// LLM System Prompts
// ─────────────────────────────────────────────────────────────────────────────

export const PROMPT_KEYS = {
  /** Classifier system prompt */
  'prompt.classifier.system': 'prompt.classifier.system',
  /** Auto-responder system prompt */
  'prompt.autoResponder.system': 'prompt.autoResponder.system',
  /** Auto-responder user prompt template */
  'prompt.autoResponder.user': 'prompt.autoResponder.user',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Responder Strings
// ─────────────────────────────────────────────────────────────────────────────

export const RESPONDER_KEYS = {
  /** "We remain available if you need anything else." */
  'responder.closing.friendly': 'responder.closing.friendly',
  /** "Please let us know if you require additional assistance." */
  'responder.closing.formal': 'responder.closing.formal',
  /** "Hi {name}," */
  'responder.greeting.named': 'responder.greeting.named',
  /** "Hi there," */
  'responder.greeting.anonymous': 'responder.greeting.anonymous',
  /** 'Thanks for contacting us about "{subject}".' */
  'responder.intro.thanks': 'responder.intro.thanks',
  /** "\u2014 ContractSpec Support" */
  'responder.signature': 'responder.signature',
  /** "References:" */
  'responder.references.header': 'responder.references.header',
  /** "Source {index}" */
  'responder.references.sourceLabel': 'responder.references.sourceLabel',
  /** Category intro: billing */
  'responder.category.billing': 'responder.category.billing',
  /** Category intro: technical */
  'responder.category.technical': 'responder.category.technical',
  /** Category intro: product */
  'responder.category.product': 'responder.category.product',
  /** Category intro: account */
  'responder.category.account': 'responder.category.account',
  /** Category intro: compliance */
  'responder.category.compliance': 'responder.category.compliance',
  /** Category intro: other */
  'responder.category.other': 'responder.category.other',
  /** "Re: {subject}" */
  'responder.subject.replyPrefix': 'responder.subject.replyPrefix',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Resolver Strings
// ─────────────────────────────────────────────────────────────────────────────

export const RESOLVER_KEYS = {
  /** "Subject: {subject}" */
  'resolver.question.subjectLabel': 'resolver.question.subjectLabel',
  /** "Channel: {channel}" */
  'resolver.question.channelLabel': 'resolver.question.channelLabel',
  /** "Customer: {name}" */
  'resolver.question.customerLabel': 'resolver.question.customerLabel',
  /** "Escalate for human review" */
  'resolver.action.escalate': 'resolver.action.escalate',
  /** "Send automated response" */
  'resolver.action.respond': 'resolver.action.respond',
  /** "Insufficient confidence or missing knowledge references" */
  'resolver.escalation.insufficientConfidence':
    'resolver.escalation.insufficientConfidence',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Tool Registration Strings
// ─────────────────────────────────────────────────────────────────────────────

export const TOOL_KEYS = {
  /** "support_classify_ticket" */
  'tool.classify.title': 'tool.classify.title',
  /** "Classify a ticket for priority, sentiment, and category" */
  'tool.classify.description': 'tool.classify.description',
  /** "support_resolve_ticket" */
  'tool.resolve.title': 'tool.resolve.title',
  /** "Generate a knowledge-grounded resolution for a ticket" */
  'tool.resolve.description': 'tool.resolve.description',
  /** "support_draft_response" */
  'tool.draft.title': 'tool.draft.title',
  /** "Draft a user-facing reply based on resolution + classification" */
  'tool.draft.description': 'tool.draft.description',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Error Strings
// ─────────────────────────────────────────────────────────────────────────────

export const ERROR_KEYS = {
  /** "Input must include ticket" */
  'error.inputMustIncludeTicket': 'error.inputMustIncludeTicket',
  /** "Ticket is missing id" */
  'error.ticketMissingId': 'error.ticketMissingId',
  /** "resolution and classification are required" */
  'error.resolutionClassificationRequired':
    'error.resolutionClassificationRequired',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Feedback Strings
// ─────────────────────────────────────────────────────────────────────────────

export const FEEDBACK_KEYS = {
  /** "No feedback recorded yet." */
  'feedback.noRecords': 'feedback.noRecords',
  /** "Escalated" */
  'feedback.status.escalated': 'feedback.status.escalated',
  /** "Auto-resolved" */
  'feedback.status.autoResolved': 'feedback.status.autoResolved',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Spec Strings
// ─────────────────────────────────────────────────────────────────────────────

export const SPEC_KEYS = {
  /** Instructions appendix for support-bot spec */
  'spec.instructionsAppendix': 'spec.instructionsAppendix',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Combined Keys
// ─────────────────────────────────────────────────────────────────────────────

export const I18N_KEYS = {
  ...PROMPT_KEYS,
  ...RESPONDER_KEYS,
  ...RESOLVER_KEYS,
  ...TOOL_KEYS,
  ...ERROR_KEYS,
  ...FEEDBACK_KEYS,
  ...SPEC_KEYS,
} as const;

/** Union type of all valid support-bot i18n keys */
export type SupportBotMessageKey = keyof typeof I18N_KEYS;
