import {
  defineEntity,
  defineEntityEnum,
  field,
  index,
} from '@contractspec/lib.schema';

/**
 * Workflow status enum - the lifecycle state of a workflow definition.
 */
export const WorkflowStatusEnum = defineEntityEnum({
  name: 'WorkflowStatus',
  values: ['DRAFT', 'ACTIVE', 'DEPRECATED', 'ARCHIVED'] as const,
  schema: 'workflow',
  description: 'Status of a workflow definition.',
});

/**
 * Workflow trigger type enum - what initiates a workflow.
 */
export const WorkflowTriggerTypeEnum = defineEntityEnum({
  name: 'WorkflowTriggerType',
  values: ['MANUAL', 'EVENT', 'SCHEDULED', 'API'] as const,
  schema: 'workflow',
  description: 'What triggers workflow instantiation.',
});

/**
 * WorkflowDefinition entity - defines a workflow blueprint.
 *
 * A workflow definition specifies the structure, steps, and rules
 * for a business process. Instances are created from definitions.
 */
export const WorkflowDefinitionEntity = defineEntity({
  name: 'WorkflowDefinition',
  description: 'A workflow blueprint that defines the process structure.',
  schema: 'workflow',
  map: 'workflow_definition',
  fields: {
    id: field.id({ description: 'Unique workflow definition ID' }),

    // Identity
    name: field.string({ description: 'Human-readable workflow name' }),
    key: field.string({
      description: 'Unique key for referencing (e.g., "purchase_approval")',
    }),
    description: field.string({
      isOptional: true,
      description: 'Detailed description',
    }),
    version: field.int({
      default: 1,
      description: 'Version number for versioning definitions',
    }),

    // Status
    status: field.enum('WorkflowStatus', { default: 'DRAFT' }),

    // Trigger
    triggerType: field.enum('WorkflowTriggerType', { default: 'MANUAL' }),
    triggerConfig: field.json({
      isOptional: true,
      description: 'Trigger-specific configuration',
    }),

    // Initial step
    initialStepId: field.string({
      isOptional: true,
      description: 'First step when workflow starts',
    }),

    // Feature flag integration
    featureFlagKey: field.string({
      isOptional: true,
      description: 'Feature flag to control availability',
    }),

    // Configuration
    settings: field.json({
      isOptional: true,
      description: 'Workflow-wide settings',
    }),
    metadata: field.json({ isOptional: true, description: 'Custom metadata' }),

    // Ownership
    organizationId: field.foreignKey({ description: 'Owning organization' }),
    createdBy: field.foreignKey({
      description: 'User who created this workflow',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    publishedAt: field.dateTime({
      isOptional: true,
      description: 'When workflow was activated',
    }),

    // Relations
    steps: field.hasMany('WorkflowStep'),
    instances: field.hasMany('WorkflowInstance'),
  },
  indexes: [
    index.unique(['organizationId', 'key', 'version']),
    index.on(['organizationId', 'status']),
    index.on(['key', 'version']),
  ],
  enums: [WorkflowStatusEnum, WorkflowTriggerTypeEnum],
});
