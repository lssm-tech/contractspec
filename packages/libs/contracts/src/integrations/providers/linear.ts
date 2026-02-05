import { StabilityEnum } from '../../ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';

export const linearIntegrationSpec = defineIntegration({
  meta: {
    key: 'project-management.linear',
    version: '1.0.0',
    category: 'project-management',
    title: 'Linear',
    description:
      'Linear integration for issue tracking and project management workflows.',
    domain: 'productivity',
    owners: ['@platform.integrations'],
    tags: ['project-management', 'linear'],
    stability: StabilityEnum.Beta,
  },
  supportedModes: ['managed', 'byok'],
  capabilities: {
    provides: [{ key: 'project-management.work-items', version: '1.0.0' }],
  },
  configSchema: {
    schema: {
      type: 'object',
      required: ['teamId'],
      properties: {
        teamId: {
          type: 'string',
          description: 'Linear team ID that owns created issues.',
        },
        projectId: {
          type: 'string',
          description: 'Optional default project ID for new issues.',
        },
        stateId: {
          type: 'string',
          description: 'Optional default workflow state ID.',
        },
        assigneeId: {
          type: 'string',
          description: 'Optional default assignee ID.',
        },
        labelIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional label IDs applied to each issue.',
        },
        tagLabelMap: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description:
            'Optional mapping of tags to Linear label IDs (tag -> labelId).',
        },
      },
    },
    example: {
      teamId: 'team_123',
      projectId: 'proj_456',
      labelIds: ['label_1', 'label_2'],
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['apiKey'],
      properties: {
        apiKey: {
          type: 'string',
          description: 'Linear API key (personal or service token).',
        },
      },
    },
    example: {
      apiKey: 'lin_api_key',
    },
  },
  healthCheck: {
    method: 'custom',
    timeoutMs: 4000,
  },
  docsUrl: 'https://developers.linear.app',
  constraints: {},
  byokSetup: {
    setupInstructions:
      'Create a Linear API key with issue:write permission and store it as a secret.',
  },
});

export function registerLinearIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(linearIntegrationSpec);
}
