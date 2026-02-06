import { StabilityEnum } from '../../ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';

export const notionIntegrationSpec = defineIntegration({
  meta: {
    key: 'project-management.notion',
    version: '1.0.0',
    category: 'project-management',
    title: 'Notion',
    description:
      'Notion integration for creating shared project summaries and task entries.',
    domain: 'productivity',
    owners: ['@platform.integrations'],
    tags: ['project-management', 'notion'],
    stability: StabilityEnum.Beta,
  },
  supportedModes: ['managed', 'byok'],
  capabilities: {
    provides: [{ key: 'project-management.work-items', version: '1.0.0' }],
  },
  configSchema: {
    schema: {
      type: 'object',
      properties: {
        databaseId: {
          type: 'string',
          description: 'Optional Notion database ID to store tasks.',
        },
        summaryParentPageId: {
          type: 'string',
          description: 'Optional parent page ID for summary pages.',
        },
        titleProperty: {
          type: 'string',
          description: 'Database title property name (defaults to "Name").',
        },
        statusProperty: {
          type: 'string',
          description: 'Database status/select property name.',
        },
        priorityProperty: {
          type: 'string',
          description: 'Database priority/select property name.',
        },
        tagsProperty: {
          type: 'string',
          description: 'Database multi-select tags property name.',
        },
        dueDateProperty: {
          type: 'string',
          description: 'Database date property name for due dates.',
        },
        descriptionProperty: {
          type: 'string',
          description: 'Database rich-text property for descriptions.',
        },
      },
    },
    example: {
      databaseId: 'xxxxxxxxxxxxxxxx',
      summaryParentPageId: 'yyyyyyyyyyyyyyyy',
      titleProperty: 'Name',
      statusProperty: 'Status',
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['apiKey'],
      properties: {
        apiKey: {
          type: 'string',
          description: 'Notion integration secret token.',
        },
      },
    },
    example: {
      apiKey: 'secret_notion_token',
    },
  },
  healthCheck: {
    method: 'custom',
    timeoutMs: 4000,
  },
  docsUrl: 'https://developers.notion.com',
  constraints: {},
  byokSetup: {
    setupInstructions:
      'Create a Notion internal integration, share the target database/page with it, and store the secret token.',
  },
});

export function registerNotionIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(notionIntegrationSpec);
}
