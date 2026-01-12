import { defineWorkflow } from '@contractspec/lib.contracts';
import {
  OwnersEnum,
  StabilityEnum,
  TagsEnum,
} from '@contractspec/lib.contracts';

export const generateFinancialSummaryWorkflow = defineWorkflow({
  meta: {
    key: 'pfo.workflow.generate-financial-summary',
    version: '1.0.0',
    title: 'Generate Financial Summary',
    description:
      'Retrieves the latest financial signals, generates an AI summary, and optionally distributes it by voice or email.',
    domain: 'finance',
    owners: [OwnersEnum.PlatformFinance],
    tags: ['summary', 'ai', TagsEnum.Automation],
    stability: StabilityEnum.Beta,
  },
  definition: {
    entryStepId: 'summarise',
    steps: [
      {
        id: 'summarise',
        type: 'automation',
        label: 'Generate Summary',
        description:
          'Run retrieval augmented generation over the knowledge base to produce a household summary.',
        action: {
          operation: { key: 'pfo.summary.generate', version: '1.0.0' },
        },
        requiredIntegrations: ['primaryLLM', 'primaryVectorDb'],
        retry: {
          maxAttempts: 3,
          backoff: 'exponential',
          delayMs: 750,
        },
      },
      {
        id: 'distribute',
        type: 'automation',
        label: 'Distribute Summary',
        description:
          'Send the generated summary via email and optionally synthesise a voice note.',
        action: {
          operation: { key: 'pfo.summary.dispatch', version: '1.0.0' },
        },
        requiredIntegrations: ['emailOutbound'],
        retry: {
          maxAttempts: 2,
          backoff: 'linear',
          delayMs: 500,
        },
      },
    ],
    transitions: [{ from: 'summarise', to: 'distribute' }],
  },
});
