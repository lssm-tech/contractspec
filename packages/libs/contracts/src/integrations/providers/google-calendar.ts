import { StabilityEnum } from '../../ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';

export const googleCalendarIntegrationSpec = defineIntegration({
  meta: {
    key: 'calendar.google',
    version: '1.0.0',
    category: 'calendar',
    title: 'Google Calendar API',
    description:
      'Google Calendar integration for event creation, updates, and scheduling automations.',
    domain: 'productivity',
    owners: ['platform.messaging'],
    tags: ['calendar', 'google'],
    stability: StabilityEnum.Beta,
  },
  supportedModes: ['managed', 'byok'],
  capabilities: {
    provides: [{ key: 'calendar.events', version: '1.0.0' }],
  },
  configSchema: {
    schema: {
      type: 'object',
      properties: {
        calendarId: {
          type: 'string',
          description: 'Default calendar identifier (defaults to primary).',
        },
      },
    },
    example: {
      calendarId: 'primary',
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['clientEmail', 'privateKey'],
      properties: {
        clientEmail: {
          type: 'string',
          description: 'Service account client email.',
        },
        privateKey: {
          type: 'string',
          description: 'Service account private key.',
        },
        projectId: {
          type: 'string',
          description: 'Google Cloud project ID.',
        },
      },
    },
    example: {
      clientEmail: 'svc-calendar@example.iam.gserviceaccount.com',
      privateKey: '-----BEGIN PRIVATE KEY-----...',
      projectId: 'calendar-project',
    },
  },
  healthCheck: {
    method: 'custom',
    timeoutMs: 4000,
  },
  docsUrl: 'https://developers.google.com/calendar/api',
  constraints: {},
  byokSetup: {
    setupInstructions:
      'Create a Google service account with Calendar access and share the target calendars with the service account email.',
  },
});

export function registerGoogleCalendarIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(googleCalendarIntegrationSpec);
}
