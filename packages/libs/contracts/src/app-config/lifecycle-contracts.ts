import { ScalarTypeEnum, SchemaModel } from '@lssm/lib.schema';
import type { OperationSpec } from '../operation';
import { defineCommand, defineQuery } from '../operation';
import { OwnersEnum, StabilityEnum, TagsEnum } from '../ownership';
import type { OperationSpecRegistry } from '../registry';
import {
  ConfigDraftCreatedEvent,
  ConfigPromotedToPreviewEvent,
  ConfigPublishedEvent,
  ConfigRolledBackEvent,
} from './events';

const LifecyclePolicy = {
  auth: 'admin' as const,
  policies: [{ name: 'platform.app-config.manage', version: 1 }],
};

const LifecycleReadPolicy = {
  auth: 'admin' as const,
  policies: [{ name: 'platform.app-config.read', version: 1 }],
};

const ConfigVersionRecord = new SchemaModel({
  name: 'ConfigVersionRecord',
  fields: {
    meta: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
    config: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
  },
});

const ConfigTransitionRecord = new SchemaModel({
  name: 'ConfigTransitionRecord',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    appId: { type: ScalarTypeEnum.ID(), isOptional: false },
    fromStatus: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    toStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    actor: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const CreateDraftInput = new SchemaModel({
  name: 'CreateTenantConfigDraftInput',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    appId: { type: ScalarTypeEnum.ID(), isOptional: false },
    blueprintName: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    blueprintVersion: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
    },
    environment: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    fromVersion: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    createdBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const CreateDraftOutput = new SchemaModel({
  name: 'CreateTenantConfigDraftOutput',
  fields: {
    version: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const CreateTenantConfigDraftCommand = defineCommand({
  meta: {
    name: 'appConfig.lifecycle.createDraft',
    version: 1,
    description: 'Creates a new draft tenant config version.',
    owners: [OwnersEnum.PlatformSigil],
    tags: [TagsEnum.Hygiene, 'app-config'],
    stability: StabilityEnum.Experimental,
    goal: 'Allow operators to start editing a new tenant config version.',
    context:
      'Invoked by the Studio or automation when starting a new configuration run.',
  },
  io: {
    input: CreateDraftInput,
    output: CreateDraftOutput,
  },
  policy: LifecyclePolicy,
  sideEffects: {
    emits: [
      {
        ref: ConfigDraftCreatedEvent,
        when: 'after successful draft creation',
      },
    ],
  },
});

const PromotePreviewInput = new SchemaModel({
  name: 'PromoteTenantConfigPreviewInput',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    appId: { type: ScalarTypeEnum.ID(), isOptional: false },
    version: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    promotedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const PromotePreviewOutput = new SchemaModel({
  name: 'PromoteTenantConfigPreviewOutput',
  fields: {
    version: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    warnings: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
  },
});

export const PromoteTenantConfigToPreviewCommand = defineCommand({
  meta: {
    name: 'appConfig.lifecycle.promoteToPreview',
    version: 1,
    description: 'Promotes a draft tenant config to preview/testing state.',
    owners: [OwnersEnum.PlatformSigil],
    tags: [TagsEnum.Hygiene, 'app-config'],
    stability: StabilityEnum.Experimental,
    goal: 'Enable validation and testing of draft configurations.',
    context:
      'Called when a draft passes initial checks and should be exposed to preview environments.',
  },
  io: {
    input: PromotePreviewInput,
    output: PromotePreviewOutput,
  },
  policy: LifecyclePolicy,
  sideEffects: {
    emits: [
      {
        ref: ConfigPromotedToPreviewEvent,
        when: 'after promotion to preview',
      },
    ],
  },
});

const PublishConfigInput = new SchemaModel({
  name: 'PublishTenantConfigInput',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    appId: { type: ScalarTypeEnum.ID(), isOptional: false },
    version: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    environment: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    publishedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    changeSummary: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
  },
});

const PublishConfigOutput = new SchemaModel({
  name: 'PublishTenantConfigOutput',
  fields: {
    version: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    previousVersion: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    publishedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const PublishTenantConfigCommand = defineCommand({
  meta: {
    name: 'appConfig.lifecycle.publish',
    version: 1,
    description: 'Publishes a preview tenant config to production.',
    owners: [OwnersEnum.PlatformSigil],
    tags: [TagsEnum.Hygiene, 'app-config'],
    stability: StabilityEnum.Experimental,
    goal: 'Promote tested configurations to production safely.',
    context:
      'Triggered after validation passes and change management approvals are complete.',
  },
  io: {
    input: PublishConfigInput,
    output: PublishConfigOutput,
  },
  policy: LifecyclePolicy,
  sideEffects: {
    emits: [
      {
        ref: ConfigPublishedEvent,
        when: 'after publish succeeds',
      },
    ],
  },
});

const RollbackConfigInput = new SchemaModel({
  name: 'RollbackTenantConfigInput',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    appId: { type: ScalarTypeEnum.ID(), isOptional: false },
    toVersion: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    environment: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    rolledBackBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const RollbackConfigOutput = new SchemaModel({
  name: 'RollbackTenantConfigOutput',
  fields: {
    newVersion: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    rolledBackFrom: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

export const RollbackTenantConfigCommand = defineCommand({
  meta: {
    name: 'appConfig.lifecycle.rollback',
    version: 1,
    description: 'Rolls back to a previously published tenant config version.',
    owners: [OwnersEnum.PlatformSigil],
    tags: [TagsEnum.Hygiene, 'app-config'],
    stability: StabilityEnum.Experimental,
    goal: 'Provide rapid recovery when new configs regress production.',
    context:
      'Called manually or automatically when monitoring detects regression and a rollback is required.',
  },
  io: {
    input: RollbackConfigInput,
    output: RollbackConfigOutput,
  },
  policy: LifecyclePolicy,
  sideEffects: {
    emits: [
      {
        ref: ConfigRolledBackEvent,
        when: 'after rollback completes',
      },
    ],
  },
});

const ListVersionsInput = new SchemaModel({
  name: 'ListTenantConfigVersionsInput',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    appId: { type: ScalarTypeEnum.ID(), isOptional: false },
  },
});

const ListVersionsOutput = new SchemaModel({
  name: 'ListTenantConfigVersionsOutput',
  fields: {
    versions: { type: ConfigVersionRecord, isOptional: false, isArray: true },
    transitions: {
      type: ConfigTransitionRecord,
      isOptional: true,
      isArray: true,
    },
  },
});

export const ListTenantConfigVersionsQuery = defineQuery({
  meta: {
    name: 'appConfig.lifecycle.listVersions',
    version: 1,
    description: 'Lists all versions of a tenant configuration.',
    owners: [OwnersEnum.PlatformSigil],
    tags: ['app-config', TagsEnum.Hygiene],
    stability: StabilityEnum.Experimental,
    goal: 'Support lifecycle views and change audit tooling.',
    context:
      'Used by the Studio to render history timelines and by automation for change tracking.',
  },
  io: {
    input: ListVersionsInput,
    output: ListVersionsOutput,
  },
  policy: LifecycleReadPolicy,
});

const GetVersionInput = new SchemaModel({
  name: 'GetTenantConfigVersionInput',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    appId: { type: ScalarTypeEnum.ID(), isOptional: false },
    version: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

const GetVersionOutput = new SchemaModel({
  name: 'GetTenantConfigVersionOutput',
  fields: {
    version: { type: ConfigVersionRecord, isOptional: false },
  },
});

export const GetTenantConfigVersionQuery = defineQuery({
  meta: {
    name: 'appConfig.lifecycle.getVersion',
    version: 1,
    description: 'Fetches a single tenant config version by id.',
    owners: [OwnersEnum.PlatformSigil],
    tags: ['app-config', TagsEnum.Hygiene],
    stability: StabilityEnum.Experimental,
    goal: 'Allow detail drill-down for lifecycle entries.',
    context:
      'Used by automation to fetch config payloads for comparison or export.',
  },
  io: {
    input: GetVersionInput,
    output: GetVersionOutput,
  },
  policy: LifecycleReadPolicy,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lifecycleContracts: Record<string, OperationSpec<any, any>> = {
  CreateTenantConfigDraftCommand,
  PromoteTenantConfigToPreviewCommand,
  PublishTenantConfigCommand,
  RollbackTenantConfigCommand,
  ListTenantConfigVersionsQuery,
  GetTenantConfigVersionQuery,
};

export function registerAppConfigLifecycleContracts(
  registry: OperationSpecRegistry
) {
  return registry
    .register(CreateTenantConfigDraftCommand)
    .register(PromoteTenantConfigToPreviewCommand)
    .register(PublishTenantConfigCommand)
    .register(RollbackTenantConfigCommand)
    .register(ListTenantConfigVersionsQuery)
    .register(GetTenantConfigVersionQuery);
}
