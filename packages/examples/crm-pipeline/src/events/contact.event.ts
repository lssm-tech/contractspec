import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '@contractspec/lib.contracts';

// ============ Contact Event Payloads ============

const ContactCreatedPayload = defineSchemaModel({
  name: 'ContactCreatedPayload',
  description: 'Payload when a contact is created',
  fields: {
    contactId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    email: { type: ScalarTypeEnum.EmailAddress(), isOptional: true },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ContactCreatedEvent = defineEvent({
  meta: {
    key: 'contact.created',
    version: '1.0.0',
    description: 'A new contact has been created.',
    stability: 'stable',
    owners: ['@crm-team'],
    tags: ['contact', 'created'],
  },
  payload: ContactCreatedPayload,
});
