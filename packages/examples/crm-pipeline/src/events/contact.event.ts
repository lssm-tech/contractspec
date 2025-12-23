import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineEvent } from '@lssm/lib.contracts';

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
  name: 'contact.created',
  version: 1,
  description: 'A new contact has been created.',
  payload: ContactCreatedPayload,
});
