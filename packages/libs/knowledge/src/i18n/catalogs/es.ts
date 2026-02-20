/**
 * Spanish (es) translation catalog for @contractspec/lib.knowledge.
 *
 * @module i18n/catalogs/es
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const esMessages = defineTranslation({
  meta: {
    key: 'knowledge.messages',
    version: '1.0.0',
    domain: 'knowledge',
    description:
      'All user-facing and LLM-facing strings for the knowledge package (Spanish)',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'es',
  fallback: 'en',
  messages: {
    // ═════════════════════════════════════════════════════════════════════════
    // Access Guard
    // ═════════════════════════════════════════════════════════════════════════

    'access.notBound': {
      value:
        'El espacio de conocimiento "{spaceKey}" no est\u00e1 vinculado en la configuraci\u00f3n de la aplicaci\u00f3n.',
      description: 'Denial reason when a knowledge space is not bound',
    },
    'access.readOnly': {
      value:
        'El espacio de conocimiento "{spaceKey}" es de categor\u00eda "{category}" y es de solo lectura.',
      description: 'Denial reason when write is attempted on a read-only space',
    },
    'access.workflowUnauthorized': {
      value:
        'El flujo de trabajo "{workflowName}" no est\u00e1 autorizado para acceder al espacio de conocimiento "{spaceKey}".',
      description: 'Denial reason when a workflow lacks space access',
    },
    'access.agentUnauthorized': {
      value:
        'El agente "{agentName}" no est\u00e1 autorizado para acceder al espacio de conocimiento "{spaceKey}".',
      description: 'Denial reason when an agent lacks space access',
    },
    'access.ephemeralWarning': {
      value:
        'El espacio de conocimiento "{spaceKey}" es ef\u00edmero; los resultados pueden ser transitorios.',
      description: 'Warning for ephemeral knowledge spaces',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Query Service
    // ═════════════════════════════════════════════════════════════════════════

    'query.systemPrompt': {
      value:
        'Eres un asistente de conocimiento que responde preguntas utilizando el contexto proporcionado. Cita las fuentes relevantes si es posible.',
      description: 'Default LLM system prompt for knowledge queries',
    },
    'query.userMessage': {
      value: 'Pregunta:\n{question}\n\nContexto:\n{context}',
      description: 'User message template combining question and context',
    },
    'query.noResults': {
      value: 'No se encontraron documentos relevantes.',
      description: 'Displayed when vector search returns zero results',
    },
    'query.sourceLabel': {
      value: 'Fuente {index} (puntuaci\u00f3n: {score}):',
      description: 'Label prefix for each source in the context block',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Ingestion / Gmail
    // ═════════════════════════════════════════════════════════════════════════

    'ingestion.gmail.subject': {
      value: 'Asunto: {subject}',
      description: 'Gmail thread subject label',
    },
    'ingestion.gmail.snippet': {
      value: 'Extracto: {snippet}',
      description: 'Gmail thread snippet label',
    },
    'ingestion.gmail.from': {
      value: 'De: {from}',
      description: 'Gmail message sender label',
    },
    'ingestion.gmail.to': {
      value: 'Para: {to}',
      description: 'Gmail message recipients label',
    },
    'ingestion.gmail.date': {
      value: 'Fecha: {date}',
      description: 'Gmail message date label',
    },
  },
});
