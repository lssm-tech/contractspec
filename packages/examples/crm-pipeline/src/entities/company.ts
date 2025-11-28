import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';

/**
 * Company size enum.
 */
export const CompanySizeEnum = defineEntityEnum({
  name: 'CompanySize',
  values: ['STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE'] as const,
  schema: 'crm',
  description: 'Size category of a company.',
});

/**
 * Company entity - organization/account.
 */
export const CompanyEntity = defineEntity({
  name: 'Company',
  description: 'A company/organization in the CRM.',
  schema: 'crm',
  map: 'company',
  fields: {
    id: field.id({ description: 'Unique company ID' }),
    
    // Basic info
    name: field.string({ description: 'Company name' }),
    domain: field.string({ isOptional: true, description: 'Website domain' }),
    website: field.url({ isOptional: true }),
    
    // Industry
    industry: field.string({ isOptional: true }),
    
    // Size
    size: field.enum('CompanySize', { isOptional: true }),
    employeeCount: field.int({ isOptional: true }),
    annualRevenue: field.decimal({ isOptional: true }),
    
    // Ownership
    organizationId: field.foreignKey(),
    ownerId: field.foreignKey({ description: 'Account owner' }),
    
    // Contact info
    phone: field.string({ isOptional: true }),
    email: field.email({ isOptional: true }),
    
    // Address
    address: field.string({ isOptional: true }),
    city: field.string({ isOptional: true }),
    state: field.string({ isOptional: true }),
    country: field.string({ isOptional: true }),
    postalCode: field.string({ isOptional: true }),
    
    // Social
    linkedInUrl: field.url({ isOptional: true }),
    
    // Notes
    description: field.string({ isOptional: true }),
    tags: field.string({ isArray: true }),
    
    // Custom fields
    customFields: field.json({ isOptional: true }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    contacts: field.hasMany('Contact'),
    deals: field.hasMany('Deal'),
  },
  indexes: [
    index.on(['organizationId', 'ownerId']),
    index.on(['domain']),
  ],
  enums: [CompanySizeEnum],
});

