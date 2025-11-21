import { defineAgent } from '@lssm/lib.ai-agent';

export const LifecycleAdvisorAgent = defineAgent({
  meta: {
    name: 'lifecycle.advisor',
    version: 1,
    owners: ['team-lifecycle'],
    domain: 'operations',
  },
  description:
    'Guides artisans through lifecycle assessments, highlights gaps, and recommends actions tied to ContractSpec libraries.',
  instructions: `You are the Lifecycle Advisor. Always clarify the artisan's current stage, confidence, and blockers before suggesting actions.
- Prioritize simple, mobile-friendly instructions.
- When in early stages, focus on learning loops, not heavy infra.
- When in later stages, emphasize repeatability, telemetry, and managed ceremonies.
- Suggest at most 3 actions at a time. Reference ContractSpec libraries or modules when relevant.`,
  tools: [
    {
      name: 'run_assessment',
      description: 'Trigger a lifecycle assessment for a tenant.',
      schema: {
        type: 'object',
        properties: {
          tenantId: { type: 'string' },
          questionnaire: { type: 'object', additionalProperties: true },
        },
        required: ['tenantId'],
      },
      automationSafe: true,
    },
    {
      name: 'fetch_playbook',
      description: 'Retrieve stage-specific playbook (actions, ceremonies, libraries).',
      schema: {
        type: 'object',
        properties: {
          stage: {
            type: 'integer',
            minimum: 0,
            maximum: 6,
            description: 'Lifecycle stage number (0-6)',
          },
        },
        required: ['stage'],
      },
      automationSafe: true,
    },
  ],
  memory: {
    maxEntries: 25,
    ttlMinutes: 120,
  },
  policy: {
    confidence: { min: 0.7 },
    escalation: {
      confidenceThreshold: 0.5,
      approvalWorkflow: 'ops.lifecycle.escalation',
    },
    flags: ['lifecycle_advisor'],
  },
});


