import type { WorkflowSpec } from '@lssm/lib.contracts/workflow/spec';
import {
  OwnersEnum,
  StabilityEnum,
  TagsEnum,
} from '@lssm/lib.contracts/ownership';

export const processUploadedDocumentWorkflow: WorkflowSpec = {
  meta: {
    key: 'pfo.workflow.process-uploaded-document',
    version: 1,
    title: 'Process Uploaded Document',
    description:
      'Stores an uploaded invoice/contract, queues ingestion, and records any follow-up reminders.',
    domain: 'finance',
    owners: [OwnersEnum.PlatformFinance],
    tags: ['documents', 'ingestion', TagsEnum.Automation],
    stability: StabilityEnum.Experimental,
  },
  definition: {
    entryStepId: 'store',
    steps: [
      {
        id: 'store',
        type: 'automation',
        label: 'Store and Queue Ingestion',
        description:
          'Persist the document to storage and enqueue the knowledge ingestion pipeline.',
        action: {
          operation: { key: 'pfo.documents.upload', version: 1 },
        },
        requiredIntegrations: ['primaryStorage', 'primaryVectorDb'],
        retry: {
          maxAttempts: 3,
          backoff: 'exponential',
          delayMs: 500,
        },
      },
      {
        id: 'review',
        type: 'human',
        label: 'Optional Human Classification',
        description:
          'Finance lead can categorise the document while ingestion completes.',
      },
    ],
    transitions: [
      {
        from: 'store',
        to: 'review',
      },
    ],
  },
};
