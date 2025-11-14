import type { AppBlueprintSpec } from '@lssm/lib.contracts/app-config/spec';
import type { CapabilityRef } from '@lssm/lib.contracts/capabilities';
import {
  OwnersEnum,
  StabilityEnum,
  TagsEnum,
} from '@lssm/lib.contracts/ownership';
import type { AppBlueprintRegistry } from '@lssm/lib.contracts/app-config/spec';

const cap = (key: string, version: number): CapabilityRef => ({ key, version });

export const pocketFamilyOfficeBlueprint: AppBlueprintSpec = {
  meta: {
    name: 'pocket-family-office.app',
    version: 1,
    appId: 'pocket-family-office',
    title: 'Pocket Family Office',
    description:
      'Household finance automation: ingest documents, track bills, remind payments, and summarise cashflow.',
    domain: 'finance',
    owners: [OwnersEnum.PlatformFinance],
    tags: [TagsEnum.Guide, 'finance', 'automation'],
    stability: StabilityEnum.Experimental,
  },
  capabilities: {
    enabled: [
      cap('ai.chat', 1),
      cap('ai.embeddings', 1),
      cap('vector-db.search', 1),
      cap('vector-db.storage', 1),
      cap('storage.objects', 1),
      cap('email.inbound', 1),
      cap('email.transactional', 1),
      cap('calendar.events', 1),
      cap('sms.outbound', 1),
      cap('ai.voice.synthesis', 1),
      cap('payments.psp', 1),
    ],
  },
  integrationSlots: [
    {
      slotId: 'primaryLLM',
      requiredCategory: 'ai-llm',
      allowedModes: ['managed', 'byok'],
      requiredCapabilities: [cap('ai.chat', 1)],
      required: true,
      description:
        'Chat completion provider powering summarisation, explanations, and insights.',
    },
    {
      slotId: 'primaryVectorDb',
      requiredCategory: 'vector-db',
      allowedModes: ['managed', 'byok'],
      requiredCapabilities: [cap('vector-db.search', 1)],
      required: true,
      description:
        'Vector database storing embeddings for financial documents and email threads.',
    },
    {
      slotId: 'primaryStorage',
      requiredCategory: 'storage',
      allowedModes: ['managed', 'byok'],
      requiredCapabilities: [cap('storage.objects', 1)],
      required: true,
      description: 'Object storage used for raw uploads and normalised documents.',
    },
    {
      slotId: 'emailInbound',
      requiredCategory: 'email',
      allowedModes: ['managed', 'byok'],
      requiredCapabilities: [cap('email.inbound', 1)],
      required: true,
      description: 'Inbound email/thread sync (Gmail) feeding the knowledge corpus.',
    },
    {
      slotId: 'emailOutbound',
      requiredCategory: 'email',
      allowedModes: ['managed', 'byok'],
      requiredCapabilities: [cap('email.transactional', 1)],
      required: true,
      description: 'Transactional email delivery for reminders and summaries.',
    },
    {
      slotId: 'calendarScheduling',
      requiredCategory: 'calendar',
      allowedModes: ['managed', 'byok'],
      requiredCapabilities: [cap('calendar.events', 1)],
      required: true,
      description: 'Creates calendar holds for bill reviews and handoff meetings.',
    },
    {
      slotId: 'voicePlayback',
      requiredCategory: 'ai-voice',
      allowedModes: ['managed', 'byok'],
      requiredCapabilities: [cap('ai.voice.synthesis', 1)],
      required: false,
      description:
        'Optional voice synthesis for spoken summaries (ElevenLabs).',
    },
    {
      slotId: 'smsNotifications',
      requiredCategory: 'sms',
      allowedModes: ['managed', 'byok'],
      requiredCapabilities: [cap('sms.outbound', 1)],
      required: false,
      description: 'SMS provider used for urgent reminders.',
    },
    {
      slotId: 'paymentsProcessing',
      requiredCategory: 'payments',
      allowedModes: ['managed', 'byok'],
      requiredCapabilities: [cap('payments.psp', 1)],
      required: false,
      description: 'Optional payments processor enabling bill pay automations.',
    },
  ],
  workflows: {
    processUploadedDocument: {
      name: 'pfo.workflow.process-uploaded-document',
      version: 1,
    },
    upcomingPaymentsReminder: {
      name: 'pfo.workflow.upcoming-payments-reminder',
      version: 1,
    },
    generateFinancialSummary: {
      name: 'pfo.workflow.generate-financial-summary',
      version: 1,
    },
    ingestEmailThreads: {
      name: 'pfo.workflow.ingest-email-threads',
      version: 1,
    },
  },
  policies: [
    { name: 'pfo.policy.tenancy', version: 1 },
    { name: 'knowledge.access.financial-docs', version: 1 },
  ],
  telemetry: {
    spec: { name: 'pfo.telemetry', version: 1 },
  },
  featureFlags: [
    {
      key: 'voice-summaries',
      enabled: false,
      description:
        'Enable ElevenLabs spoken summaries in addition to email distribution.',
    },
  ],
  routes: [
    {
      path: '/dashboard',
      label: 'Overview',
      workflow: 'pfo.workflow.generate-financial-summary',
    },
    {
      path: '/documents/upload',
      label: 'Upload Document',
      workflow: 'pfo.workflow.process-uploaded-document',
    },
    {
      path: '/communications',
      label: 'Inbox',
      workflow: 'pfo.workflow.ingest-email-threads',
    },
  ],
  notes:
    'Pocket Family Office blueprint pulling together finance automations for the hackathon reference implementation.',
};

export function registerPocketFamilyOfficeBlueprint(
  registry: AppBlueprintRegistry
): AppBlueprintRegistry {
  return registry.register(pocketFamilyOfficeBlueprint);
}



