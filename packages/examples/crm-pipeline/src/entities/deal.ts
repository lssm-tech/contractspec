import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';

/**
 * Deal status enum.
 */
export const DealStatusEnum = defineEntityEnum({
  name: 'DealStatus',
  values: ['OPEN', 'WON', 'LOST', 'STALE'] as const,
  schema: 'crm',
  description: 'Status of a deal.',
});

/**
 * Pipeline entity - sales pipeline definition.
 */
export const PipelineEntity = defineEntity({
  name: 'Pipeline',
  description: 'A sales pipeline with stages.',
  schema: 'crm',
  map: 'pipeline',
  fields: {
    id: field.id(),
    name: field.string({ description: 'Pipeline name' }),
    description: field.string({ isOptional: true }),
    
    // Ownership
    organizationId: field.foreignKey(),
    
    // Settings
    isDefault: field.boolean({ default: false }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    stages: field.hasMany('Stage'),
    deals: field.hasMany('Deal'),
  },
});

/**
 * Stage entity - pipeline stage.
 */
export const StageEntity = defineEntity({
  name: 'Stage',
  description: 'A stage within a sales pipeline.',
  schema: 'crm',
  map: 'stage',
  fields: {
    id: field.id(),
    name: field.string({ description: 'Stage name' }),
    pipelineId: field.foreignKey(),
    
    // Position
    position: field.int({ description: 'Order in pipeline' }),
    
    // Probability
    probability: field.int({ default: 0, description: 'Win probability (0-100)' }),
    
    // Type
    isWonStage: field.boolean({ default: false }),
    isLostStage: field.boolean({ default: false }),
    
    // Settings
    color: field.string({ isOptional: true, description: 'Stage color for UI' }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    pipeline: field.belongsTo('Pipeline', ['pipelineId'], ['id'], { onDelete: 'Cascade' }),
    deals: field.hasMany('Deal'),
  },
  indexes: [
    index.on(['pipelineId', 'position']),
  ],
});

/**
 * Deal entity - sales opportunity.
 */
export const DealEntity = defineEntity({
  name: 'Deal',
  description: 'A sales opportunity/deal.',
  schema: 'crm',
  map: 'deal',
  fields: {
    id: field.id({ description: 'Unique deal ID' }),
    name: field.string({ description: 'Deal name' }),
    
    // Value
    value: field.decimal({ description: 'Deal value' }),
    currency: field.string({ default: '"USD"' }),
    
    // Pipeline
    pipelineId: field.foreignKey(),
    stageId: field.foreignKey(),
    
    // Status
    status: field.enum('DealStatus', { default: 'OPEN' }),
    
    // Associations
    contactId: field.string({ isOptional: true }),
    companyId: field.string({ isOptional: true }),
    
    // Ownership
    organizationId: field.foreignKey(),
    ownerId: field.foreignKey({ description: 'Deal owner' }),
    
    // Timeline
    expectedCloseDate: field.dateTime({ isOptional: true }),
    closedAt: field.dateTime({ isOptional: true }),
    
    // Tracking
    lostReason: field.string({ isOptional: true }),
    wonSource: field.string({ isOptional: true }),
    
    // Notes
    notes: field.string({ isOptional: true }),
    tags: field.string({ isArray: true }),
    
    // Custom fields
    customFields: field.json({ isOptional: true }),
    
    // Position in stage (for Kanban)
    stagePosition: field.int({ default: 0 }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    pipeline: field.belongsTo('Pipeline', ['pipelineId'], ['id']),
    stage: field.belongsTo('Stage', ['stageId'], ['id']),
    contact: field.belongsTo('Contact', ['contactId'], ['id']),
    company: field.belongsTo('Company', ['companyId'], ['id']),
    tasks: field.hasMany('Task'),
    activities: field.hasMany('Activity'),
  },
  indexes: [
    index.on(['organizationId', 'status']),
    index.on(['pipelineId', 'stageId', 'stagePosition']),
    index.on(['ownerId', 'status']),
    index.on(['expectedCloseDate']),
  ],
  enums: [DealStatusEnum],
});

