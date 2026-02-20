/**
 * English (en) translation catalog for @contractspec/lib.support-bot.
 *
 * This is the primary / reference locale. All message keys must be present here.
 *
 * @module i18n/catalogs/en
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const enMessages = defineTranslation({
  meta: {
    key: 'support-bot.messages',
    version: '1.0.0',
    domain: 'support-bot',
    description:
      'All user-facing, LLM-facing, and developer-facing strings for the support-bot package',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'en',
  fallback: 'en',
  messages: {
    // ═════════════════════════════════════════════════════════════════════════
    // LLM System Prompts
    // ═════════════════════════════════════════════════════════════════════════

    'prompt.classifier.system': {
      value: 'Classify the support ticket.',
      description: 'Classifier LLM system prompt',
    },
    'prompt.autoResponder.system': {
      value:
        'Write empathetic, accurate support replies that cite sources when relevant.',
      description: 'Auto-responder LLM system prompt',
    },
    'prompt.autoResponder.user': {
      value:
        'Ticket #{ticketId} ({category}, {priority}, {sentiment})\nSubject: {subject}\n\n{body}\n\nKnowledge:\n{knowledge}\n\nRespond to the customer.',
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
      value: 'We remain available if you need anything else.',
      description: 'Friendly closing line for support responses',
    },
    'responder.closing.formal': {
      value: 'Please let us know if you require additional assistance.',
      description: 'Formal closing line for support responses',
    },
    'responder.greeting.named': {
      value: 'Hi {name},',
      description: 'Greeting with customer name',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'responder.greeting.anonymous': {
      value: 'Hi there,',
      description: 'Greeting without customer name',
    },
    'responder.intro.thanks': {
      value: 'Thanks for contacting us about "{subject}".',
      description: 'Thank-you intro referencing the ticket subject',
      placeholders: [{ name: 'subject', type: 'string' }],
    },
    'responder.signature': {
      value: '\u2014 ContractSpec Support',
      description: 'Email / response signature',
    },
    'responder.references.header': {
      value: 'References:',
      description: 'Header for the references section',
    },
    'responder.references.sourceLabel': {
      value: 'Source {index}',
      description: 'Label for a numbered source reference',
      placeholders: [{ name: 'index', type: 'number' }],
    },
    'responder.category.billing': {
      value:
        'I understand billing issues can be stressful, so let me clarify the situation.',
      description: 'Category intro for billing tickets',
    },
    'responder.category.technical': {
      value:
        'I see you encountered a technical issue. Here is what happened and how to fix it.',
      description: 'Category intro for technical tickets',
    },
    'responder.category.product': {
      value:
        'Thanks for sharing feedback about the product. Here are the next steps.',
      description: 'Category intro for product tickets',
    },
    'responder.category.account': {
      value:
        'Account access is critical, so let me walk you through the resolution.',
      description: 'Category intro for account tickets',
    },
    'responder.category.compliance': {
      value:
        'Compliance questions require precision. See the policy-aligned answer below.',
      description: 'Category intro for compliance tickets',
    },
    'responder.category.other': {
      value: 'Here is what we found after reviewing your request.',
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
      value: 'Subject: {subject}',
      description: 'Subject label in resolver question context',
      placeholders: [{ name: 'subject', type: 'string' }],
    },
    'resolver.question.channelLabel': {
      value: 'Channel: {channel}',
      description: 'Channel label in resolver question context',
      placeholders: [{ name: 'channel', type: 'string' }],
    },
    'resolver.question.customerLabel': {
      value: 'Customer: {name}',
      description: 'Customer label in resolver question context',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'resolver.action.escalate': {
      value: 'Escalate for human review',
      description: 'Action label for escalation',
    },
    'resolver.action.respond': {
      value: 'Send automated response',
      description: 'Action label for automated response',
    },
    'resolver.escalation.insufficientConfidence': {
      value: 'Insufficient confidence or missing knowledge references',
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
      value: 'Classify a ticket for priority, sentiment, and category',
      description: 'MCP tool description for ticket classification',
    },
    'tool.resolve.title': {
      value: 'support_resolve_ticket',
      description: 'MCP tool title for ticket resolution',
    },
    'tool.resolve.description': {
      value: 'Generate a knowledge-grounded resolution for a ticket',
      description: 'MCP tool description for ticket resolution',
    },
    'tool.draft.title': {
      value: 'support_draft_response',
      description: 'MCP tool title for response drafting',
    },
    'tool.draft.description': {
      value: 'Draft a user-facing reply based on resolution + classification',
      description: 'MCP tool description for response drafting',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Error Strings
    // ═════════════════════════════════════════════════════════════════════════

    'error.inputMustIncludeTicket': {
      value: 'Input must include ticket',
      description: 'Error when input payload is missing the ticket field',
    },
    'error.ticketMissingId': {
      value: 'Ticket is missing id',
      description: 'Error when ticket object lacks an id',
    },
    'error.resolutionClassificationRequired': {
      value: 'resolution and classification are required',
      description:
        'Error when draft endpoint is called without resolution and classification',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Feedback Strings
    // ═════════════════════════════════════════════════════════════════════════

    'feedback.noRecords': {
      value: 'No feedback recorded yet.',
      description: 'Placeholder when no feedback entries exist',
    },
    'feedback.status.escalated': {
      value: 'Escalated',
      description: 'Status label for escalated tickets',
    },
    'feedback.status.autoResolved': {
      value: 'Auto-resolved',
      description: 'Status label for auto-resolved tickets',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Spec Strings
    // ═════════════════════════════════════════════════════════════════════════

    'spec.instructionsAppendix': {
      value:
        'Always cite support knowledge sources and flag compliance/billing issues for human review when unsure.',
      description: 'Instructions appendix appended to agent spec',
    },
  },
});
