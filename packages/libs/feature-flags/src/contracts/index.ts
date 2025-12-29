import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';
import { defineCommand, defineQuery } from '@contractspec/lib.contracts';

const OWNERS = ['platform.feature-flags'] as const;

// ============ Schema Models ============

export const FeatureFlagModel = defineSchemaModel({
  name: 'FeatureFlag',
  description: 'Represents a feature flag',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    defaultValue: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    variants: { type: ScalarTypeEnum.JSON(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    tags: { type: ScalarTypeEnum.JSON(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const TargetingRuleModel = defineSchemaModel({
  name: 'TargetingRule',
  description: 'Represents a targeting rule',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    flagId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    priority: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    enabled: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    attribute: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    operator: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    value: { type: ScalarTypeEnum.JSON(), isOptional: false },
    rolloutPercentage: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
    },
    serveValue: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    serveVariant: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const ExperimentModel = defineSchemaModel({
  name: 'Experiment',
  description: 'Represents an experiment',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    hypothesis: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    flagId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    variants: { type: ScalarTypeEnum.JSON(), isOptional: false },
    metrics: { type: ScalarTypeEnum.JSON(), isOptional: true },
    audiencePercentage: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
    },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    endedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    winningVariant: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    results: { type: ScalarTypeEnum.JSON(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const EvaluationResultModel = defineSchemaModel({
  name: 'EvaluationResult',
  description: 'Result of flag evaluation',
  fields: {
    enabled: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    variant: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ruleId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    experimentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

// ============ Input/Output Models ============

const CreateFlagInput = defineSchemaModel({
  name: 'CreateFlagInput',
  description: 'Input for creating a feature flag',
  fields: {
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    defaultValue: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    variants: { type: ScalarTypeEnum.JSON(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    tags: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

const UpdateFlagInput = defineSchemaModel({
  name: 'UpdateFlagInput',
  description: 'Input for updating a feature flag',
  fields: {
    flagId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    defaultValue: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    variants: { type: ScalarTypeEnum.JSON(), isOptional: true },
    tags: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

const DeleteFlagInput = defineSchemaModel({
  name: 'DeleteFlagInput',
  description: 'Input for deleting a feature flag',
  fields: {
    flagId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const ToggleFlagInput = defineSchemaModel({
  name: 'ToggleFlagInput',
  description: 'Input for toggling a feature flag',
  fields: {
    flagId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const GetFlagInput = defineSchemaModel({
  name: 'GetFlagInput',
  description: 'Input for getting a feature flag',
  fields: {
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const ListFlagsInput = defineSchemaModel({
  name: 'ListFlagsInput',
  description: 'Input for listing feature flags',
  fields: {
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    tags: { type: ScalarTypeEnum.JSON(), isOptional: true },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const ListFlagsOutput = defineSchemaModel({
  name: 'ListFlagsOutput',
  description: 'Output for listing feature flags',
  fields: {
    flags: { type: FeatureFlagModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

const EvaluateFlagInput = defineSchemaModel({
  name: 'EvaluateFlagInput',
  description: 'Input for evaluating a feature flag',
  fields: {
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    context: { type: ScalarTypeEnum.JSON(), isOptional: false },
  },
});

const CreateRuleInput = defineSchemaModel({
  name: 'CreateRuleInput',
  description: 'Input for creating a targeting rule',
  fields: {
    flagId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    priority: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    attribute: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    operator: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    value: { type: ScalarTypeEnum.JSON(), isOptional: false },
    rolloutPercentage: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
    },
    serveValue: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    serveVariant: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const DeleteRuleInput = defineSchemaModel({
  name: 'DeleteRuleInput',
  description: 'Input for deleting a targeting rule',
  fields: {
    ruleId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const CreateExperimentInput = defineSchemaModel({
  name: 'CreateExperimentInput',
  description: 'Input for creating an experiment',
  fields: {
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    hypothesis: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    flagId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    variants: { type: ScalarTypeEnum.JSON(), isOptional: false },
    metrics: { type: ScalarTypeEnum.JSON(), isOptional: true },
    audiencePercentage: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
    },
    scheduledStartAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    scheduledEndAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const StartExperimentInput = defineSchemaModel({
  name: 'StartExperimentInput',
  description: 'Input for starting an experiment',
  fields: {
    experimentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const StopExperimentInput = defineSchemaModel({
  name: 'StopExperimentInput',
  description: 'Input for stopping an experiment',
  fields: {
    experimentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    winningVariant: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
  },
});

const GetExperimentInput = defineSchemaModel({
  name: 'GetExperimentInput',
  description: 'Input for getting an experiment',
  fields: {
    experimentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const SuccessOutput = defineSchemaModel({
  name: 'SuccessOutput',
  description: 'Generic success output',
  fields: {
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

// ============ Contracts ============

/**
 * Create a feature flag.
 */
export const CreateFlagContract = defineCommand({
  meta: {
    key: 'flag.create',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['feature-flags', 'create'],
    description: 'Create a new feature flag.',
    goal: 'Define a new feature flag for toggling features.',
    context: 'Called when setting up a new feature flag.',
  },
  io: {
    input: CreateFlagInput,
    output: FeatureFlagModel,
    errors: {
      KEY_ALREADY_EXISTS: {
        description: 'Flag key already exists',
        http: 409,
        gqlCode: 'FLAG_KEY_EXISTS',
        when: 'A flag with this key already exists',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Update a feature flag.
 */
export const UpdateFlagContract = defineCommand({
  meta: {
    key: 'flag.update',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['feature-flags', 'update'],
    description: 'Update an existing feature flag.',
    goal: 'Modify flag configuration.',
    context: 'Called when adjusting flag settings.',
  },
  io: {
    input: UpdateFlagInput,
    output: FeatureFlagModel,
    errors: {
      FLAG_NOT_FOUND: {
        description: 'Flag does not exist',
        http: 404,
        gqlCode: 'FLAG_NOT_FOUND',
        when: 'Flag ID is invalid',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Delete a feature flag.
 */
export const DeleteFlagContract = defineCommand({
  meta: {
    key: 'flag.delete',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['feature-flags', 'delete'],
    description: 'Delete a feature flag.',
    goal: 'Remove a feature flag and all its rules.',
    context: 'Called when a flag is no longer needed.',
  },
  io: {
    input: DeleteFlagInput,
    output: SuccessOutput,
    errors: {
      FLAG_NOT_FOUND: {
        description: 'Flag does not exist',
        http: 404,
        gqlCode: 'FLAG_NOT_FOUND',
        when: 'Flag ID is invalid',
      },
      FLAG_HAS_ACTIVE_EXPERIMENT: {
        description: 'Flag has an active experiment',
        http: 409,
        gqlCode: 'FLAG_HAS_ACTIVE_EXPERIMENT',
        when: 'Cannot delete flag with running experiment',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Toggle a feature flag status.
 */
export const ToggleFlagContract = defineCommand({
  meta: {
    key: 'flag.toggle',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['feature-flags', 'toggle'],
    description: 'Toggle a feature flag status.',
    goal: 'Quickly enable or disable a feature.',
    context: 'Called when turning a feature on or off.',
  },
  io: {
    input: ToggleFlagInput,
    output: FeatureFlagModel,
    errors: {
      FLAG_NOT_FOUND: {
        description: 'Flag does not exist',
        http: 404,
        gqlCode: 'FLAG_NOT_FOUND',
        when: 'Flag ID is invalid',
      },
      INVALID_STATUS: {
        description: 'Invalid status value',
        http: 400,
        gqlCode: 'INVALID_STATUS',
        when: 'Status must be OFF, ON, or GRADUAL',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Get a feature flag by key.
 */
export const GetFlagContract = defineQuery({
  meta: {
    key: 'flag.get',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['feature-flags', 'get'],
    description: 'Get a feature flag by key.',
    goal: 'Retrieve flag configuration.',
    context: 'Called to inspect flag details.',
  },
  io: {
    input: GetFlagInput,
    output: FeatureFlagModel,
    errors: {
      FLAG_NOT_FOUND: {
        description: 'Flag does not exist',
        http: 404,
        gqlCode: 'FLAG_NOT_FOUND',
        when: 'Flag key is invalid',
      },
    },
  },
  policy: {
    auth: 'user',
  },
});

/**
 * List feature flags.
 */
export const ListFlagsContract = defineQuery({
  meta: {
    key: 'flag.list',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['feature-flags', 'list'],
    description: 'List all feature flags.',
    goal: 'View all configured flags.',
    context: 'Admin dashboard.',
  },
  io: {
    input: ListFlagsInput,
    output: ListFlagsOutput,
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Evaluate a feature flag.
 */
export const EvaluateFlagContract = defineQuery({
  meta: {
    key: 'flag.evaluate',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['feature-flags', 'evaluate'],
    description: 'Evaluate a feature flag for a given context.',
    goal: 'Determine if a feature should be enabled.',
    context: 'Called at runtime to check feature availability.',
  },
  io: {
    input: EvaluateFlagInput,
    output: EvaluationResultModel,
    errors: {
      FLAG_NOT_FOUND: {
        description: 'Flag does not exist',
        http: 404,
        gqlCode: 'FLAG_NOT_FOUND',
        when: 'Flag key is invalid',
      },
    },
  },
  policy: {
    auth: 'anonymous',
  },
});

/**
 * Create a targeting rule.
 */
export const CreateRuleContract = defineCommand({
  meta: {
    key: 'flag.rule.create',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['feature-flags', 'rule', 'create'],
    description: 'Create a targeting rule for a flag.',
    goal: 'Add conditional targeting to a flag.',
    context: 'Called when setting up targeting.',
  },
  io: {
    input: CreateRuleInput,
    output: TargetingRuleModel,
    errors: {
      FLAG_NOT_FOUND: {
        description: 'Flag does not exist',
        http: 404,
        gqlCode: 'FLAG_NOT_FOUND',
        when: 'Flag ID is invalid',
      },
      INVALID_OPERATOR: {
        description: 'Invalid operator',
        http: 400,
        gqlCode: 'INVALID_OPERATOR',
        when: 'Operator is not supported',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Delete a targeting rule.
 */
export const DeleteRuleContract = defineCommand({
  meta: {
    key: 'flag.rule.delete',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['feature-flags', 'rule', 'delete'],
    description: 'Delete a targeting rule.',
    goal: 'Remove a targeting rule from a flag.',
    context: 'Called when removing targeting conditions.',
  },
  io: {
    input: DeleteRuleInput,
    output: SuccessOutput,
    errors: {
      RULE_NOT_FOUND: {
        description: 'Rule does not exist',
        http: 404,
        gqlCode: 'RULE_NOT_FOUND',
        when: 'Rule ID is invalid',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Create an experiment.
 */
export const CreateExperimentContract = defineCommand({
  meta: {
    key: 'experiment.create',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['feature-flags', 'experiment', 'create'],
    description: 'Create an A/B test experiment.',
    goal: 'Set up an experiment with variants.',
    context: 'Called when setting up A/B testing.',
  },
  io: {
    input: CreateExperimentInput,
    output: ExperimentModel,
    errors: {
      FLAG_NOT_FOUND: {
        description: 'Flag does not exist',
        http: 404,
        gqlCode: 'FLAG_NOT_FOUND',
        when: 'Flag ID is invalid',
      },
      EXPERIMENT_KEY_EXISTS: {
        description: 'Experiment key already exists',
        http: 409,
        gqlCode: 'EXPERIMENT_KEY_EXISTS',
        when: 'An experiment with this key already exists',
      },
      INVALID_VARIANTS: {
        description: 'Invalid variant configuration',
        http: 400,
        gqlCode: 'INVALID_VARIANTS',
        when: 'Variant percentages must sum to 100',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Start an experiment.
 */
export const StartExperimentContract = defineCommand({
  meta: {
    key: 'experiment.start',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['feature-flags', 'experiment', 'start'],
    description: 'Start an experiment.',
    goal: 'Begin collecting data for an experiment.',
    context: 'Called when ready to run an A/B test.',
  },
  io: {
    input: StartExperimentInput,
    output: ExperimentModel,
    errors: {
      EXPERIMENT_NOT_FOUND: {
        description: 'Experiment does not exist',
        http: 404,
        gqlCode: 'EXPERIMENT_NOT_FOUND',
        when: 'Experiment ID is invalid',
      },
      EXPERIMENT_ALREADY_RUNNING: {
        description: 'Experiment is already running',
        http: 409,
        gqlCode: 'EXPERIMENT_ALREADY_RUNNING',
        when: 'Cannot start an experiment that is already running',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Stop an experiment.
 */
export const StopExperimentContract = defineCommand({
  meta: {
    key: 'experiment.stop',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['feature-flags', 'experiment', 'stop'],
    description: 'Stop an experiment.',
    goal: 'End an experiment and optionally declare a winner.',
    context: 'Called when concluding an A/B test.',
  },
  io: {
    input: StopExperimentInput,
    output: ExperimentModel,
    errors: {
      EXPERIMENT_NOT_FOUND: {
        description: 'Experiment does not exist',
        http: 404,
        gqlCode: 'EXPERIMENT_NOT_FOUND',
        when: 'Experiment ID is invalid',
      },
      EXPERIMENT_NOT_RUNNING: {
        description: 'Experiment is not running',
        http: 409,
        gqlCode: 'EXPERIMENT_NOT_RUNNING',
        when: 'Cannot stop an experiment that is not running',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Get an experiment.
 */
export const GetExperimentContract = defineQuery({
  meta: {
    key: 'experiment.get',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['feature-flags', 'experiment', 'get'],
    description: 'Get experiment details.',
    goal: 'View experiment configuration and results.',
    context: 'Called to inspect experiment status.',
  },
  io: {
    input: GetExperimentInput,
    output: ExperimentModel,
    errors: {
      EXPERIMENT_NOT_FOUND: {
        description: 'Experiment does not exist',
        http: 404,
        gqlCode: 'EXPERIMENT_NOT_FOUND',
        when: 'Experiment ID is invalid',
      },
    },
  },
  policy: {
    auth: 'user',
  },
});
