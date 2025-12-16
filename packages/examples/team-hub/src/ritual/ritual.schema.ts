import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';

/**
 * Recurring ritual.
 */
export const RitualModel = defineSchemaModel({
  name: 'Ritual',
  description: 'Recurring ritual',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    spaceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    cadence: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    dayOfWeek: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    time: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

/**
 * Input for scheduling a ritual.
 */
export const ScheduleRitualInputModel = defineSchemaModel({
  name: 'ScheduleRitualInput',
  description: 'Create a ritual',
  fields: {
    spaceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    cadence: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    dayOfWeek: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    time: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    facilitatorId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

/**
 * Input for logging ritual occurrence.
 */
export const LogRitualOccurrenceInputModel = defineSchemaModel({
  name: 'LogRitualOccurrenceInput',
  description: 'Record ritual occurrence results',
  fields: {
    ritualId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    scheduledFor: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    summary: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});



