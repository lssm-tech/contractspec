/**
 * Spanish (es) translation catalog for @contractspec/lib.support-bot.
 *
 * @module i18n/catalogs/es
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const esMessages = defineTranslation({
  meta: {
    key: 'support-bot.messages',
    version: '1.0.0',
    domain: 'support-bot',
    description: 'Spanish translations for the support-bot package',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'es',
  fallback: 'en',
  messages: {
    // ═════════════════════════════════════════════════════════════════════════
    // LLM System Prompts
    // ═════════════════════════════════════════════════════════════════════════

    'prompt.classifier.system': {
      value: 'Clasifica el ticket de soporte.',
      description: 'Classifier LLM system prompt',
    },
    'prompt.autoResponder.system': {
      value:
        'Redacta respuestas de soporte emp\u00e1ticas y precisas citando fuentes cuando sea relevante.',
      description: 'Auto-responder LLM system prompt',
    },
    'prompt.autoResponder.user': {
      value:
        'Ticket #{ticketId} ({category}, {priority}, {sentiment})\nAsunto: {subject}\n\n{body}\n\nConocimientos:\n{knowledge}\n\nResponde al cliente.',
      description: 'Auto-responder user prompt template',
      placeholders: [
        { name: 'ticketId', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'priority', type: 'string' },
        { name: 'sentiment', type: 'string' },
        { name: 'subject', type: 'string' },
        { name: 'body', type: 'string' },
        { name: 'knowledge', type: 'string' },
      ],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Responder Strings
    // ═════════════════════════════════════════════════════════════════════════

    'responder.closing.friendly': {
      value: 'Quedamos a su disposici\u00f3n si necesita cualquier otra cosa.',
      description: 'Friendly closing line for support responses',
    },
    'responder.closing.formal': {
      value: 'No dude en contactarnos si requiere asistencia adicional.',
      description: 'Formal closing line for support responses',
    },
    'responder.greeting.named': {
      value: 'Hola {name},',
      description: 'Greeting with customer name',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'responder.greeting.anonymous': {
      value: 'Hola,',
      description: 'Greeting without customer name',
    },
    'responder.intro.thanks': {
      value: 'Gracias por contactarnos sobre \u00ab{subject}\u00bb.',
      description: 'Thank-you intro referencing the ticket subject',
      placeholders: [{ name: 'subject', type: 'string' }],
    },
    'responder.signature': {
      value: '\u2014 Soporte ContractSpec',
      description: 'Email / response signature',
    },
    'responder.references.header': {
      value: 'Referencias:',
      description: 'Header for the references section',
    },
    'responder.references.sourceLabel': {
      value: 'Fuente {index}',
      description: 'Label for a numbered source reference',
      placeholders: [{ name: 'index', type: 'number' }],
    },
    'responder.category.billing': {
      value:
        'Entiendo que los problemas de facturaci\u00f3n pueden ser estresantes, permítame aclarar la situaci\u00f3n.',
      description: 'Category intro for billing tickets',
    },
    'responder.category.technical': {
      value:
        'Veo que encontr\u00f3 un problema t\u00e9cnico. Esto es lo que sucedi\u00f3 y c\u00f3mo solucionarlo.',
      description: 'Category intro for technical tickets',
    },
    'responder.category.product': {
      value:
        'Gracias por compartir sus comentarios sobre el producto. Estos son los pr\u00f3ximos pasos.',
      description: 'Category intro for product tickets',
    },
    'responder.category.account': {
      value:
        'El acceso a la cuenta es fundamental, permítame guiarle hacia la resoluci\u00f3n.',
      description: 'Category intro for account tickets',
    },
    'responder.category.compliance': {
      value:
        'Las preguntas de cumplimiento requieren precisi\u00f3n. Consulte la respuesta alineada con las pol\u00edticas a continuaci\u00f3n.',
      description: 'Category intro for compliance tickets',
    },
    'responder.category.other': {
      value: 'Esto es lo que encontramos tras revisar su solicitud.',
      description: 'Category intro for uncategorized tickets',
    },
    'responder.subject.replyPrefix': {
      value: 'Re: {subject}',
      description: 'Reply subject line prefix',
      placeholders: [{ name: 'subject', type: 'string' }],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Resolver Strings
    // ═════════════════════════════════════════════════════════════════════════

    'resolver.question.subjectLabel': {
      value: 'Asunto: {subject}',
      description: 'Subject label in resolver question context',
      placeholders: [{ name: 'subject', type: 'string' }],
    },
    'resolver.question.channelLabel': {
      value: 'Canal: {channel}',
      description: 'Channel label in resolver question context',
      placeholders: [{ name: 'channel', type: 'string' }],
    },
    'resolver.question.customerLabel': {
      value: 'Cliente: {name}',
      description: 'Customer label in resolver question context',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'resolver.action.escalate': {
      value: 'Escalar para revisi\u00f3n humana',
      description: 'Action label for escalation',
    },
    'resolver.action.respond': {
      value: 'Enviar respuesta autom\u00e1tica',
      description: 'Action label for automated response',
    },
    'resolver.escalation.insufficientConfidence': {
      value: 'Confianza insuficiente o referencias de conocimiento faltantes',
      description: 'Escalation reason when confidence is too low',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Tool Registration Strings
    // ═════════════════════════════════════════════════════════════════════════

    'tool.classify.title': {
      value: 'support_classify_ticket',
      description: 'MCP tool title for ticket classification',
    },
    'tool.classify.description': {
      value: 'Clasificar un ticket por prioridad, sentimiento y categor\u00eda',
      description: 'MCP tool description for ticket classification',
    },
    'tool.resolve.title': {
      value: 'support_resolve_ticket',
      description: 'MCP tool title for ticket resolution',
    },
    'tool.resolve.description': {
      value:
        'Generar una resoluci\u00f3n basada en conocimientos para un ticket',
      description: 'MCP tool description for ticket resolution',
    },
    'tool.draft.title': {
      value: 'support_draft_response',
      description: 'MCP tool title for response drafting',
    },
    'tool.draft.description': {
      value:
        'Redactar una respuesta al cliente basada en la resoluci\u00f3n y la clasificaci\u00f3n',
      description: 'MCP tool description for response drafting',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Error Strings
    // ═════════════════════════════════════════════════════════════════════════

    'error.inputMustIncludeTicket': {
      value: 'La entrada debe incluir un ticket',
      description: 'Error when input payload is missing the ticket field',
    },
    'error.ticketMissingId': {
      value: 'El ticket no tiene identificador',
      description: 'Error when ticket object lacks an id',
    },
    'error.resolutionClassificationRequired': {
      value: 'la resoluci\u00f3n y la clasificaci\u00f3n son obligatorias',
      description:
        'Error when draft endpoint is called without resolution and classification',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Feedback Strings
    // ═════════════════════════════════════════════════════════════════════════

    'feedback.noRecords': {
      value: 'No hay comentarios registrados a\u00fan.',
      description: 'Placeholder when no feedback entries exist',
    },
    'feedback.status.escalated': {
      value: 'Escalado',
      description: 'Status label for escalated tickets',
    },
    'feedback.status.autoResolved': {
      value: 'Resuelto autom\u00e1ticamente',
      description: 'Status label for auto-resolved tickets',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Spec Strings
    // ═════════════════════════════════════════════════════════════════════════

    'spec.instructionsAppendix': {
      value:
        'Cite siempre las fuentes de conocimiento de soporte y se\u00f1ale los problemas de cumplimiento/facturaci\u00f3n para revisi\u00f3n humana en caso de duda.',
      description: 'Instructions appendix appended to agent spec',
    },
  },
});
