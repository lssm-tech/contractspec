import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';

/**
 * Contact status enum.
 */
export const ContactStatusEnum = defineEntityEnum({
  name: 'ContactStatus',
  values: ['LEAD', 'PROSPECT', 'CUSTOMER', 'CHURNED', 'ARCHIVED'] as const,
  schema: 'crm',
  description: 'Status of a contact in the sales funnel.',
});

/**
 * Contact entity - individual person.
 */
export const ContactEntity = defineEntity({
  name: 'Contact',
  description: 'An individual person in the CRM.',
  schema: 'crm',
  map: 'contact',
  fields: {
    id: field.id({ description: 'Unique contact ID' }),
    
    // Basic info
    firstName: field.string({ description: 'First name' }),
    lastName: field.string({ description: 'Last name' }),
    email: field.email({ isOptional: true, isUnique: true }),
    phone: field.string({ isOptional: true }),
    
    // Company
    companyId: field.string({ isOptional: true, description: 'Associated company' }),
    jobTitle: field.string({ isOptional: true }),
    
    // Status
    status: field.enum('ContactStatus', { default: 'LEAD' }),
    
    // Ownership
    organizationId: field.foreignKey(),
    ownerId: field.foreignKey({ description: 'Sales rep who owns this contact' }),
    
    // Source
    source: field.string({ isOptional: true, description: 'Lead source' }),
    
    // Social
    linkedInUrl: field.url({ isOptional: true }),
    twitterHandle: field.string({ isOptional: true }),
    
    // Address
    address: field.string({ isOptional: true }),
    city: field.string({ isOptional: true }),
    state: field.string({ isOptional: true }),
    country: field.string({ isOptional: true }),
    postalCode: field.string({ isOptional: true }),
    
    // Notes
    notes: field.string({ isOptional: true }),
    tags: field.string({ isArray: true }),
    
    // Custom fields
    customFields: field.json({ isOptional: true }),
    
    // Engagement
    lastContactedAt: field.dateTime({ isOptional: true }),
    nextFollowUpAt: field.dateTime({ isOptional: true }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    company: field.belongsTo('Company', ['companyId'], ['id']),
    deals: field.hasMany('Deal'),
    tasks: field.hasMany('Task'),
    activities: field.hasMany('Activity'),
  },
  indexes: [
    index.on(['organizationId', 'status']),
    index.on(['organizationId', 'ownerId']),
    index.on(['organizationId', 'companyId']),
    index.on(['email']),
  ],
  enums: [ContactStatusEnum],
});

