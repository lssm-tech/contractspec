import type { WorkflowSpec } from '@contractspec/lib.contracts/workflow/spec';
import {
  OwnersEnum,
  StabilityEnum,
  TagsEnum,
} from '@contractspec/lib.contracts/ownership';

export const upcomingPaymentsReminderWorkflow: WorkflowSpec = {
  meta: {
    key: 'pfo.workflow.upcoming-payments-reminder',
    version: '1.0.0',
    title: 'Schedule Upcoming Payment Reminder',
    description:
      'Collects payment metadata and schedules multi-channel reminders for bills that are due soon.',
    domain: 'finance',
    owners: [OwnersEnum.PlatformFinance],
    tags: ['payments', 'reminders', TagsEnum.Automation],
    stability: StabilityEnum.Beta,
  },
  definition: {
    entryStepId: 'collect',
    steps: [
      {
        id: 'collect',
        type: 'human',
        label: 'Review Upcoming Bill',
        description:
          'Confirm amount, due date, and preferred delivery channels before scheduling reminder.',
      },
      {
        id: 'schedule',
        type: 'automation',
        label: 'Schedule Reminder',
        action: {
          operation: {
            key: 'pfo.reminders.schedule-payment',
            version: '1.0.0',
          },
        },
        requiredIntegrations: [
          'emailOutbound',
          'smsNotifications',
          'calendarScheduling',
        ],
        retry: {
          maxAttempts: 2,
          backoff: 'linear',
          delayMs: 1000,
        },
      },
    ],
    transitions: [
      {
        from: 'collect',
        to: 'schedule',
        condition: 'output?.confirmed === true',
        label: 'Reminder confirmed',
      },
    ],
  },
};
