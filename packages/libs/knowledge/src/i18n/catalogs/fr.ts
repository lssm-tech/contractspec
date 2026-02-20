/**
 * French (fr) translation catalog for @contractspec/lib.knowledge.
 *
 * @module i18n/catalogs/fr
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const frMessages = defineTranslation({
  meta: {
    key: 'knowledge.messages',
    version: '1.0.0',
    domain: 'knowledge',
    description:
      'All user-facing and LLM-facing strings for the knowledge package (French)',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'fr',
  fallback: 'en',
  messages: {
    // ═════════════════════════════════════════════════════════════════════════
    // Access Guard
    // ═════════════════════════════════════════════════════════════════════════

    'access.notBound': {
      value:
        "L'espace de connaissances \"{spaceKey}\" n'est pas li\u00e9 dans la configuration de l'application.",
      description: 'Denial reason when a knowledge space is not bound',
    },
    'access.readOnly': {
      value:
        'L\'espace de connaissances "{spaceKey}" est de cat\u00e9gorie "{category}" et est en lecture seule.',
      description: 'Denial reason when write is attempted on a read-only space',
    },
    'access.workflowUnauthorized': {
      value:
        'Le workflow "{workflowName}" n\'est pas autoris\u00e9 \u00e0 acc\u00e9der \u00e0 l\'espace de connaissances "{spaceKey}".',
      description: 'Denial reason when a workflow lacks space access',
    },
    'access.agentUnauthorized': {
      value:
        'L\'agent "{agentName}" n\'est pas autoris\u00e9 \u00e0 acc\u00e9der \u00e0 l\'espace de connaissances "{spaceKey}".',
      description: 'Denial reason when an agent lacks space access',
    },
    'access.ephemeralWarning': {
      value:
        'L\'espace de connaissances "{spaceKey}" est \u00e9ph\u00e9m\u00e8re ; les r\u00e9sultats peuvent \u00eatre transitoires.',
      description: 'Warning for ephemeral knowledge spaces',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Query Service
    // ═════════════════════════════════════════════════════════════════════════

    'query.systemPrompt': {
      value:
        'Vous \u00eates un assistant de connaissances qui r\u00e9pond aux questions en utilisant le contexte fourni. Citez les sources pertinentes si possible.',
      description: 'Default LLM system prompt for knowledge queries',
    },
    'query.userMessage': {
      value: 'Question :\n{question}\n\nContexte :\n{context}',
      description: 'User message template combining question and context',
    },
    'query.noResults': {
      value: 'Aucun document pertinent trouv\u00e9.',
      description: 'Displayed when vector search returns zero results',
    },
    'query.sourceLabel': {
      value: 'Source {index} (score : {score}) :',
      description: 'Label prefix for each source in the context block',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Ingestion / Gmail
    // ═════════════════════════════════════════════════════════════════════════

    'ingestion.gmail.subject': {
      value: 'Objet : {subject}',
      description: 'Gmail thread subject label',
    },
    'ingestion.gmail.snippet': {
      value: 'Extrait : {snippet}',
      description: 'Gmail thread snippet label',
    },
    'ingestion.gmail.from': {
      value: 'De : {from}',
      description: 'Gmail message sender label',
    },
    'ingestion.gmail.to': {
      value: '\u00c0 : {to}',
      description: 'Gmail message recipients label',
    },
    'ingestion.gmail.date': {
      value: 'Date : {date}',
      description: 'Gmail message date label',
    },
  },
});
