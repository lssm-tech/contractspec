import { defineCommand } from '@contractspec/lib.contracts-spec';
import {
  LogRitualOccurrenceInputModel,
  RitualModel,
  ScheduleRitualInputModel,
} from './ritual.schema';

const OWNERS = ['@examples.team-hub'] as const;

/**
 * Schedule a ritual.
 */
export const ScheduleRitualContract = defineCommand({
  meta: {
    key: 'team.ritual.schedule',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['team-hub', 'ritual', 'schedule'],
    description: 'Schedule a recurring ritual.',
    goal: 'Team ceremonies.',
    context: 'Ritual management.',
  },
  io: {
    input: ScheduleRitualInputModel,
    output: RitualModel,
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'schedule-ritual-happy-path',
        given: ['Space exists'],
        when: ['User schedules ritual'],
        then: ['Ritual is scheduled'],
      },
    ],
    examples: [
      {
        key: 'schedule-standup',
        input: {
          spaceId: 'space-123',
          name: 'Daily Standup',
          interval: 'daily',
          time: '10:00',
        },
        output: { id: 'rit-123', status: 'active' },
      },
    ],
  },
});

/**
 * Log ritual occurrence.
 */
export const LogRitualOccurrenceContract = defineCommand({
  meta: {
    key: 'team.ritual.logOccurrence',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['team-hub', 'ritual', 'log'],
    description: 'Log a ritual occurrence.',
    goal: 'Record ritual history.',
    context: 'Ritual management.',
  },
  io: {
    input: LogRitualOccurrenceInputModel,
    output: RitualModel,
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'log-occurrence-happy-path',
        given: ['Ritual is scheduled'],
        when: ['User logs occurrence'],
        then: ['Occurrence is recorded'],
      },
    ],
    examples: [
      {
        key: 'log-standup',
        input: {
          ritualId: 'rit-123',
          date: '2025-01-20',
          attendees: ['user-1', 'user-2'],
        },
        output: { id: 'rit-123', lastOccurrence: '2025-01-20' },
      },
    ],
  },
});
