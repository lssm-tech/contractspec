import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineEvent } from '@lssm/lib.contracts';

const AssetEventPayload = defineSchemaModel({
  name: 'AssetEventPayload',
  description: 'Payload for asset events',
  fields: {
    assetId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    category: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    value: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const LiabilityEventPayload = defineSchemaModel({
  name: 'LiabilityEventPayload',
  description: 'Payload for liability events',
  fields: {
    liabilityId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    category: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    balance: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const GoalEventPayload = defineSchemaModel({
  name: 'GoalEventPayload',
  description: 'Payload for goal events',
  fields: {
    goalId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    currentAmount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    targetAmount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const AssetAddedEvent = defineEvent({
  name: 'wealth.asset.added',
  version: 1,
  description: 'An asset was added or updated.',
  payload: AssetEventPayload,
});

export const LiabilityAddedEvent = defineEvent({
  name: 'wealth.liability.added',
  version: 1,
  description: 'A liability was added or updated.',
  payload: LiabilityEventPayload,
});

export const GoalUpdatedEvent = defineEvent({
  name: 'wealth.goal.updated',
  version: 1,
  description: 'A goal was updated.',
  payload: GoalEventPayload,
});

export const NetWorthSnapshotCreatedEvent = defineEvent({
  name: 'wealth.networth.snapshot_created',
  version: 1,
  description: 'A net worth snapshot was generated.',
  payload: defineSchemaModel({
    name: 'NetWorthSnapshotEventPayload',
    description: 'Net worth snapshot payload',
    fields: {
      netWorth: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
      totalAssets: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
      totalLiabilities: {
        type: ScalarTypeEnum.Float_unsecure(),
        isOptional: false,
      },
      currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      asOf: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    },
  }),
});

export const WealthSnapshotEvents = {
  AssetAddedEvent,
  LiabilityAddedEvent,
  GoalUpdatedEvent,
  NetWorthSnapshotCreatedEvent,
};
