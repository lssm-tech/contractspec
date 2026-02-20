/**
 * French (fr) translation catalog for @contractspec/lib.support-bot.
 *
 * @module i18n/catalogs/fr
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const frMessages = defineTranslation({
  meta: {
    key: 'support-bot.messages',
    version: '1.0.0',
    domain: 'support-bot',
    description: 'French translations for the support-bot package',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'fr',
  fallback: 'en',
  messages: {
    // ═════════════════════════════════════════════════════════════════════════
    // LLM System Prompts
    // ═════════════════════════════════════════════════════════════════════════

    'prompt.classifier.system': {
      value: 'Classifiez le ticket de support.',
      description: 'Classifier LLM system prompt',
    },
    'prompt.autoResponder.system': {
      value:
        'R\u00e9digez des r\u00e9ponses de support empathiques et pr\u00e9cises en citant les sources lorsque c\u2019est pertinent.',
      description: 'Auto-responder LLM system prompt',
    },
    'prompt.autoResponder.user': {
      value:
        'Ticket #{ticketId} ({category}, {priority}, {sentiment})\nSujet\u00a0: {subject}\n\n{body}\n\nConnaissances\u00a0:\n{knowledge}\n\nR\u00e9pondez au client.',
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
      value:
        'Nous restons \u00e0 votre disposition si vous avez besoin de quoi que ce soit.',
      description: 'Friendly closing line for support responses',
    },
    'responder.closing.formal': {
      value:
        'Veuillez nous contacter si vous avez besoin d\u2019une assistance suppl\u00e9mentaire.',
      description: 'Formal closing line for support responses',
    },
    'responder.greeting.named': {
      value: 'Bonjour {name},',
      description: 'Greeting with customer name',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'responder.greeting.anonymous': {
      value: 'Bonjour,',
      description: 'Greeting without customer name',
    },
    'responder.intro.thanks': {
      value:
        'Merci de nous avoir contact\u00e9s au sujet de \u00ab\u00a0{subject}\u00a0\u00bb.',
      description: 'Thank-you intro referencing the ticket subject',
      placeholders: [{ name: 'subject', type: 'string' }],
    },
    'responder.signature': {
      value: '\u2014 Support ContractSpec',
      description: 'Email / response signature',
    },
    'responder.references.header': {
      value: 'R\u00e9f\u00e9rences\u00a0:',
      description: 'Header for the references section',
    },
    'responder.references.sourceLabel': {
      value: 'Source {index}',
      description: 'Label for a numbered source reference',
      placeholders: [{ name: 'index', type: 'number' }],
    },
    'responder.category.billing': {
      value:
        'Je comprends que les probl\u00e8mes de facturation peuvent \u00eatre stressants, laissez-moi clarifier la situation.',
      description: 'Category intro for billing tickets',
    },
    'responder.category.technical': {
      value:
        'Je vois que vous avez rencontr\u00e9 un probl\u00e8me technique. Voici ce qui s\u2019est pass\u00e9 et comment le r\u00e9soudre.',
      description: 'Category intro for technical tickets',
    },
    'responder.category.product': {
      value:
        'Merci d\u2019avoir partag\u00e9 vos retours sur le produit. Voici les prochaines \u00e9tapes.',
      description: 'Category intro for product tickets',
    },
    'responder.category.account': {
      value:
        'L\u2019acc\u00e8s au compte est essentiel, laissez-moi vous guider vers la r\u00e9solution.',
      description: 'Category intro for account tickets',
    },
    'responder.category.compliance': {
      value:
        'Les questions de conformit\u00e9 exigent de la pr\u00e9cision. Consultez la r\u00e9ponse conforme aux politiques ci-dessous.',
      description: 'Category intro for compliance tickets',
    },
    'responder.category.other': {
      value:
        'Voici ce que nous avons trouv\u00e9 apr\u00e8s examen de votre demande.',
      description: 'Category intro for uncategorized tickets',
    },
    'responder.subject.replyPrefix': {
      value: 'Re\u00a0: {subject}',
      description: 'Reply subject line prefix',
      placeholders: [{ name: 'subject', type: 'string' }],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Resolver Strings
    // ═════════════════════════════════════════════════════════════════════════

    'resolver.question.subjectLabel': {
      value: 'Sujet\u00a0: {subject}',
      description: 'Subject label in resolver question context',
      placeholders: [{ name: 'subject', type: 'string' }],
    },
    'resolver.question.channelLabel': {
      value: 'Canal\u00a0: {channel}',
      description: 'Channel label in resolver question context',
      placeholders: [{ name: 'channel', type: 'string' }],
    },
    'resolver.question.customerLabel': {
      value: 'Client\u00a0: {name}',
      description: 'Customer label in resolver question context',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'resolver.action.escalate': {
      value: 'Escalader pour r\u00e9vision humaine',
      description: 'Action label for escalation',
    },
    'resolver.action.respond': {
      value: 'Envoyer une r\u00e9ponse automatique',
      description: 'Action label for automated response',
    },
    'resolver.escalation.insufficientConfidence': {
      value:
        'Confiance insuffisante ou r\u00e9f\u00e9rences de connaissances manquantes',
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
      value:
        'Classifier un ticket par priorit\u00e9, sentiment et cat\u00e9gorie',
      description: 'MCP tool description for ticket classification',
    },
    'tool.resolve.title': {
      value: 'support_resolve_ticket',
      description: 'MCP tool title for ticket resolution',
    },
    'tool.resolve.description': {
      value:
        'G\u00e9n\u00e9rer une r\u00e9solution fond\u00e9e sur la base de connaissances pour un ticket',
      description: 'MCP tool description for ticket resolution',
    },
    'tool.draft.title': {
      value: 'support_draft_response',
      description: 'MCP tool title for response drafting',
    },
    'tool.draft.description': {
      value:
        'R\u00e9diger une r\u00e9ponse client bas\u00e9e sur la r\u00e9solution et la classification',
      description: 'MCP tool description for response drafting',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Error Strings
    // ═════════════════════════════════════════════════════════════════════════

    'error.inputMustIncludeTicket': {
      value: 'L\u2019entr\u00e9e doit inclure un ticket',
      description: 'Error when input payload is missing the ticket field',
    },
    'error.ticketMissingId': {
      value: 'Le ticket n\u2019a pas d\u2019identifiant',
      description: 'Error when ticket object lacks an id',
    },
    'error.resolutionClassificationRequired': {
      value: 'la r\u00e9solution et la classification sont requises',
      description:
        'Error when draft endpoint is called without resolution and classification',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Feedback Strings
    // ═════════════════════════════════════════════════════════════════════════

    'feedback.noRecords': {
      value: 'Aucun retour enregistr\u00e9 pour le moment.',
      description: 'Placeholder when no feedback entries exist',
    },
    'feedback.status.escalated': {
      value: 'Escalad\u00e9',
      description: 'Status label for escalated tickets',
    },
    'feedback.status.autoResolved': {
      value: 'R\u00e9solu automatiquement',
      description: 'Status label for auto-resolved tickets',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Spec Strings
    // ═════════════════════════════════════════════════════════════════════════

    'spec.instructionsAppendix': {
      value:
        'Citez toujours les sources de connaissances du support et signalez les probl\u00e8mes de conformit\u00e9/facturation pour r\u00e9vision humaine en cas de doute.',
      description: 'Instructions appendix appended to agent spec',
    },
  },
});
