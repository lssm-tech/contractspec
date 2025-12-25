import { defineCommand } from '@lssm/lib.contracts';
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
    version: 1,
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
});

/**
 * Log ritual occurrence.
 */
export const LogRitualOccurrenceContract = defineCommand({
  meta: {
    key: 'team.ritual.logOccurrence',
    version: 1,
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
});
