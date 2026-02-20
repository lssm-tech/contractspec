/**
 * English (en) translation catalog for @contractspec/lib.knowledge.
 *
 * This is the primary / reference locale. All message keys must be present here.
 *
 * @module i18n/catalogs/en
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const enMessages = defineTranslation({
  meta: {
    key: 'knowledge.messages',
    version: '1.0.0',
    domain: 'knowledge',
    description:
      'All user-facing and LLM-facing strings for the knowledge package',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'en',
  fallback: 'en',
  messages: {
    // ═════════════════════════════════════════════════════════════════════════
    // Access Guard
    // ═════════════════════════════════════════════════════════════════════════

    'access.notBound': {
      value:
        'Knowledge space "{spaceKey}" is not bound in the resolved app config.',
      description: 'Denial reason when a knowledge space is not bound',
      placeholders: [{ name: 'spaceKey', type: 'string' }],
    },
    'access.readOnly': {
      value:
        'Knowledge space "{spaceKey}" is category "{category}" and is read-only.',
      description: 'Denial reason when write is attempted on a read-only space',
      placeholders: [
        { name: 'spaceKey', type: 'string' },
        { name: 'category', type: 'string' },
      ],
    },
    'access.workflowUnauthorized': {
      value:
        'Workflow "{workflowName}" is not authorized to access knowledge space "{spaceKey}".',
      description: 'Denial reason when a workflow lacks space access',
      placeholders: [
        { name: 'workflowName', type: 'string' },
        { name: 'spaceKey', type: 'string' },
      ],
    },
    'access.agentUnauthorized': {
      value:
        'Agent "{agentName}" is not authorized to access knowledge space "{spaceKey}".',
      description: 'Denial reason when an agent lacks space access',
      placeholders: [
        { name: 'agentName', type: 'string' },
        { name: 'spaceKey', type: 'string' },
      ],
    },
    'access.ephemeralWarning': {
      value:
        'Knowledge space "{spaceKey}" is ephemeral; results may be transient.',
      description: 'Warning for ephemeral knowledge spaces',
      placeholders: [{ name: 'spaceKey', type: 'string' }],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Query Service
    // ═════════════════════════════════════════════════════════════════════════

    'query.systemPrompt': {
      value:
        'You are a knowledge assistant that answers questions using the provided context. Cite relevant sources if possible.',
      description: 'Default LLM system prompt for knowledge queries',
    },
    'query.userMessage': {
      value: 'Question:\n{question}\n\nContext:\n{context}',
      description: 'User message template combining question and context',
      placeholders: [
        { name: 'question', type: 'string' },
        { name: 'context', type: 'string' },
      ],
    },
    'query.noResults': {
      value: 'No relevant documents found.',
      description: 'Displayed when vector search returns zero results',
    },
    'query.sourceLabel': {
      value: 'Source {index} (score: {score}):',
      description: 'Label prefix for each source in the context block',
      placeholders: [
        { name: 'index', type: 'number' },
        { name: 'score', type: 'string' },
      ],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Ingestion / Gmail
    // ═════════════════════════════════════════════════════════════════════════

    'ingestion.gmail.subject': {
      value: 'Subject: {subject}',
      description: 'Gmail thread subject label',
      placeholders: [{ name: 'subject', type: 'string' }],
    },
    'ingestion.gmail.snippet': {
      value: 'Snippet: {snippet}',
      description: 'Gmail thread snippet label',
      placeholders: [{ name: 'snippet', type: 'string' }],
    },
    'ingestion.gmail.from': {
      value: 'From: {from}',
      description: 'Gmail message sender label',
      placeholders: [{ name: 'from', type: 'string' }],
    },
    'ingestion.gmail.to': {
      value: 'To: {to}',
      description: 'Gmail message recipients label',
      placeholders: [{ name: 'to', type: 'string' }],
    },
    'ingestion.gmail.date': {
      value: 'Date: {date}',
      description: 'Gmail message date label',
      placeholders: [{ name: 'date', type: 'string' }],
    },
  },
});
