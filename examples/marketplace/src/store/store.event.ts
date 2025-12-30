import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '@contractspec/lib.contracts';

const StoreCreatedPayload = defineSchemaModel({
  name: 'StoreCreatedEventPayload',
  fields: {
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const StoreStatusChangedPayload = defineSchemaModel({
  name: 'StoreStatusChangedEventPayload',
  fields: {
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    previousStatus: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    newStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const StoreCreatedEvent = defineEvent({
  meta: {
    key: 'marketplace.store.created',
    version: '1.0.0',
    description: 'A new seller store has been created.',
    stability: 'experimental',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'store'],
  },
  payload: StoreCreatedPayload,
});

export const StoreStatusChangedEvent = defineEvent({
  meta: {
    key: 'marketplace.store.statusChanged',
    version: '1.0.0',
    description: 'A store status has changed.',
    stability: 'experimental',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'store'],
  },
  payload: StoreStatusChangedPayload,
});
