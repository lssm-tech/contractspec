export type SpecType =
  | 'operation'
  | 'event'
  | 'presentation'
  | 'form'
  | 'feature'
  | 'workflow'
  | 'data-view'
  | 'migration'
  | 'telemetry'
  | 'experiment'
  | 'app-config';

export type OpKind = 'command' | 'query';

export type PresentationKind = 'web_component' | 'markdown' | 'data';

export type Stability = 'experimental' | 'beta' | 'stable' | 'deprecated';

export type StepType = 'human' | 'automation' | 'decision';

export interface BaseSpecData {
  name: string;
  version: number;
  description: string;
  owners: string[];
  tags: string[];
  stability: Stability;
}

export interface OperationSpecData extends BaseSpecData {
  kind: OpKind;
  goal: string;
  context: string;
  hasInput: boolean;
  hasOutput: boolean;
  auth: 'anonymous' | 'user' | 'admin';
  flags: string[];
  emitsEvents: boolean;
}

export interface EventSpecData extends BaseSpecData {
  piiFields: string[];
}

export interface PresentationSpecData extends BaseSpecData {
  presentationKind: PresentationKind;
}

export interface FormSpecData extends BaseSpecData {
  // Form-specific data
}

export interface FeatureSpecData extends BaseSpecData {
  key: string;
  operations: Array<{ name: string; version: number }>;
  events: Array<{ name: string; version: number }>;
  presentations: Array<{ name: string; version: number }>;
}

export interface WorkflowStepData {
  id: string;
  label: string;
  type: StepType;
  description?: string;
  operation?: { name: string; version: number };
  form?: { key: string; version: number };
}

export interface WorkflowTransitionData {
  from: string;
  to: string;
  condition?: string;
}

export interface WorkflowSpecData extends BaseSpecData {
  title: string;
  domain: string;
  entryStepId?: string;
  steps: WorkflowStepData[];
  transitions: WorkflowTransitionData[];
  policyFlags: string[];
}

export type DataViewKind = 'list' | 'detail' | 'table' | 'grid';

export interface DataViewFieldData {
  key: string;
  label: string;
  dataPath: string;
  format?: string;
  sortable?: boolean;
  filterable?: boolean;
}

export interface DataViewSpecData extends BaseSpecData {
  title: string;
  domain: string;
  entity: string;
  kind: DataViewKind;
  primaryOperation: { name: string; version: number };
  itemOperation?: { name: string; version: number };
  fields: DataViewFieldData[];
  primaryField?: string;
  secondaryFields?: string[];
}

export type TelemetryPrivacy = 'public' | 'internal' | 'pii' | 'sensitive';

export interface TelemetryPropertyData {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'timestamp' | 'json';
  required?: boolean;
  pii?: boolean;
  redact?: boolean;
  description?: string;
}

export interface TelemetryAnomalyRuleData {
  metric: string;
  min?: number;
  max?: number;
}

export interface TelemetryEventData {
  name: string;
  version: number;
  what: string;
  who?: string;
  why?: string;
  privacy: TelemetryPrivacy;
  properties: TelemetryPropertyData[];
  retentionDays?: number;
  retentionPolicy?: 'archive' | 'delete';
  samplingRate?: number;
  samplingConditions?: string;
  anomalyEnabled?: boolean;
  anomalyMinimumSample?: number;
  anomalyRules?: TelemetryAnomalyRuleData[];
  anomalyActions?: ('alert' | 'log' | 'trigger_regen')[];
  tags?: string[];
}

export interface TelemetryProviderData {
  type: 'posthog' | 'segment' | 'opentelemetry' | 'internal';
  config: string;
}

export interface TelemetrySpecData extends BaseSpecData {
  domain: string;
  defaultRetentionDays?: number;
  defaultSamplingRate?: number;
  providers?: TelemetryProviderData[];
  anomalyEnabled?: boolean;
  anomalyCheckIntervalMs?: number;
  events: TelemetryEventData[];
}

export interface ExperimentVariantOverrideData {
  type: 'dataView' | 'workflow' | 'theme' | 'policy' | 'presentation';
  target: string;
  version?: number;
}

export interface ExperimentVariantData {
  id: string;
  name: string;
  description?: string;
  weight?: number;
  overrides?: ExperimentVariantOverrideData[];
}

export interface TargetingRuleData {
  variantId: string;
  percentage?: number;
  policy?: { name: string; version?: number };
  expression?: string;
}

export interface RandomAllocationData {
  type: 'random';
  salt?: string;
}

export interface StickyAllocationData {
  type: 'sticky';
  attribute: 'userId' | 'organizationId' | 'sessionId';
  salt?: string;
}

export interface TargetedAllocationData {
  type: 'targeted';
  fallback?: 'control' | 'random';
  rules: TargetingRuleData[];
}

export type ExperimentAllocationData =
  | RandomAllocationData
  | StickyAllocationData
  | TargetedAllocationData;

export interface ExperimentMetricData {
  name: string;
  eventName: string;
  eventVersion: number;
  aggregation: 'count' | 'avg' | 'p75' | 'p90' | 'p95' | 'p99';
  target?: number;
}

export interface ExperimentSpecData extends BaseSpecData {
  domain: string;
  controlVariant: string;
  variants: ExperimentVariantData[];
  allocation: ExperimentAllocationData;
  successMetrics?: ExperimentMetricData[];
}

export interface AppConfigMappingData {
  slot: string;
  name: string;
  version?: number;
}

export interface AppConfigFeatureFlagData {
  key: string;
  enabled: boolean;
  variant?: string;
  description?: string;
}

export interface AppRouteConfigData {
  path: string;
  label?: string;
  dataView?: string;
  workflow?: string;
  guardName?: string;
  guardVersion?: number;
  featureFlag?: string;
  experimentName?: string;
  experimentVersion?: number;
}

export interface AppBlueprintSpecData extends BaseSpecData {
  title: string;
  domain: string;
  appId: string;
  capabilitiesEnabled: string[];
  capabilitiesDisabled: string[];
  featureIncludes: string[];
  featureExcludes: string[];
  dataViews: AppConfigMappingData[];
  workflows: AppConfigMappingData[];
  policyRefs: { name: string; version?: number }[];
  theme?: { name: string; version: number };
  themeFallbacks: { name: string; version: number }[];
  telemetry?: { name: string; version?: number };
  activeExperiments: { name: string; version?: number }[];
  pausedExperiments: { name: string; version?: number }[];
  featureFlags: AppConfigFeatureFlagData[];
  routes: AppRouteConfigData[];
  notes?: string;
}

export type MigrationStepKind = 'schema' | 'data' | 'validation';

export interface MigrationStepData {
  kind: MigrationStepKind;
  description?: string;
  sql?: string;
  script?: string;
  assertion?: string;
  timeoutMs?: number;
  retries?: number;
  preChecks?: Array<{ description: string; expression: string }>;
  postChecks?: Array<{ description: string; expression: string }>;
}

export interface MigrationSpecData extends BaseSpecData {
  title: string;
  domain: string;
  dependencies: string[];
  up: MigrationStepData[];
  down?: MigrationStepData[];
}

export interface AIGenerationOptions {
  provider: 'claude' | 'openai' | 'ollama' | 'custom';
  model?: string;
  endpoint?: string;
  stream?: boolean;
}

export interface GenerationResult {
  code: string;
  filePath: string;
  specType: SpecType;
}

