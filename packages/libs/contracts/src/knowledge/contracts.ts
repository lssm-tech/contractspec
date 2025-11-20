import {
  ScalarTypeEnum,
  SchemaModel,
} from '@lssm/lib.schema';
import {
  defineCommand,
  defineQuery,
  type ContractSpec,
} from '../spec';
import type { SpecRegistry } from '../registry';

const KnowledgeSyncSchedule = new SchemaModel({
  name: 'KnowledgeSyncSchedule',
  fields: {
    enabled: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    cron: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    intervalMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const KnowledgeSourceRecord = new SchemaModel({
  name: 'KnowledgeSourceRecord',
  fields: {
    id: { type: ScalarTypeEnum.ID(), isOptional: false },
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    spaceKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    spaceVersion: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    label: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    sourceType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    syncSchedule: { type: KnowledgeSyncSchedule, isOptional: true },
    lastSyncStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    lastSyncAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    itemsProcessed: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

const CreateKnowledgeSourceInput = new SchemaModel({
  name: 'CreateKnowledgeSourceInput',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    spaceKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    spaceVersion: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    label: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    sourceType: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    config: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
    syncSchedule: { type: KnowledgeSyncSchedule, isOptional: true },
  },
});

const UpdateKnowledgeSourceInput = new SchemaModel({
  name: 'UpdateKnowledgeSourceInput',
  fields: {
    sourceId: { type: ScalarTypeEnum.ID(), isOptional: false },
    label: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    config: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    syncSchedule: { type: KnowledgeSyncSchedule, isOptional: true },
  },
});

const DeleteKnowledgeSourceInput = new SchemaModel({
  name: 'DeleteKnowledgeSourceInput',
  fields: {
    sourceId: { type: ScalarTypeEnum.ID(), isOptional: false },
  },
});

const DeleteKnowledgeSourceOutput = new SchemaModel({
  name: 'DeleteKnowledgeSourceOutput',
  fields: {
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

const ListKnowledgeSourcesInput = new SchemaModel({
  name: 'ListKnowledgeSourcesInput',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    spaceKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: true },
  },
});

const ListKnowledgeSourcesOutput = new SchemaModel({
  name: 'ListKnowledgeSourcesOutput',
  fields: {
    sources: {
      type: KnowledgeSourceRecord,
      isOptional: false,
      isArray: true,
    },
  },
});

const TriggerKnowledgeSyncInput = new SchemaModel({
  name: 'TriggerKnowledgeSyncInput',
  fields: {
    sourceId: { type: ScalarTypeEnum.ID(), isOptional: false },
  },
});

const TriggerKnowledgeSyncOutput = new SchemaModel({
  name: 'TriggerKnowledgeSyncOutput',
  fields: {
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    itemsProcessed: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    error: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const CreateKnowledgeSource = defineCommand({
  meta: {
    name: 'knowledge.source.create',
    version: 1,
    description: 'Create a knowledge source binding for a tenant.',
    goal: 'Onboard a new knowledge ingestion source such as Notion or uploads.',
    context:
      'Used by Ops and App Studio to configure knowledge ingestion per tenant and space.',
    owners: ['platform.knowledge'],
    tags: ['knowledge', 'sources'],
    stability: 'experimental',
  },
  io: {
    input: CreateKnowledgeSourceInput,
    output: KnowledgeSourceRecord,
  },
  policy: {
    auth: 'admin',
    policies: [{ name: 'platform.knowledge.manage', version: 1 }],
  },
});

export const UpdateKnowledgeSource = defineCommand({
  meta: {
    name: 'knowledge.source.update',
    version: 1,
    description: 'Update metadata or configuration for a knowledge source.',
    goal: 'Allow rotation of credentials, sync schedules, and labels.',
    context:
      'Supports editing how a tenant ingests knowledge (e.g., toggling sync cadence).',
    owners: ['platform.knowledge'],
    tags: ['knowledge', 'sources'],
    stability: 'experimental',
  },
  io: {
    input: UpdateKnowledgeSourceInput,
    output: KnowledgeSourceRecord,
  },
  policy: {
    auth: 'admin',
    policies: [{ name: 'platform.knowledge.manage', version: 1 }],
  },
});

export const DeleteKnowledgeSource = defineCommand({
  meta: {
    name: 'knowledge.source.delete',
    version: 1,
    description: 'Delete a knowledge source binding for a tenant.',
    goal: 'Remove obsolete or compromised knowledge ingestion paths.',
    context:
      'Ensures ephemeral or external sources can be removed cleanly without leaving residual bindings.',
    owners: ['platform.knowledge'],
    tags: ['knowledge', 'sources'],
    stability: 'experimental',
  },
  io: {
    input: DeleteKnowledgeSourceInput,
    output: DeleteKnowledgeSourceOutput,
  },
  policy: {
    auth: 'admin',
    policies: [{ name: 'platform.knowledge.manage', version: 1 }],
  },
});

export const ListKnowledgeSources = defineQuery({
  meta: {
    name: 'knowledge.source.list',
    version: 1,
    description: 'List knowledge sources configured for a tenant.',
    goal: 'Provide visibility into knowledge ingest configuration and schedules.',
    context:
      'Used by App Studio and Ops flows to surface knowledge sources and their health.',
    owners: ['platform.knowledge'],
    tags: ['knowledge', 'sources'],
    stability: 'experimental',
  },
  io: {
    input: ListKnowledgeSourcesInput,
    output: ListKnowledgeSourcesOutput,
  },
  policy: {
    auth: 'admin',
    policies: [{ name: 'platform.knowledge.read', version: 1 }],
  },
});

export const TriggerKnowledgeSourceSync = defineCommand({
  meta: {
    name: 'knowledge.source.triggerSync',
    version: 1,
    description: 'Trigger an immediate sync for a knowledge source.',
    goal: 'Support manual or automated sync retries for knowledge ingestion.',
    context:
      'Invoked by Ops tooling or monitors when knowledge content must be refreshed or reprocessed.',
    owners: ['platform.knowledge'],
    tags: ['knowledge', 'sources'],
    stability: 'experimental',
  },
  io: {
    input: TriggerKnowledgeSyncInput,
    output: TriggerKnowledgeSyncOutput,
  },
  policy: {
    auth: 'admin',
    policies: [{ name: 'platform.knowledge.manage', version: 1 }],
  },
});

export const knowledgeContracts: Record<string, ContractSpec<any, any>> = {
  CreateKnowledgeSource,
  UpdateKnowledgeSource,
  DeleteKnowledgeSource,
  ListKnowledgeSources,
  TriggerKnowledgeSourceSync,
};

export function registerKnowledgeContracts(registry: SpecRegistry) {
  return registry
    .register(CreateKnowledgeSource)
    .register(UpdateKnowledgeSource)
    .register(DeleteKnowledgeSource)
    .register(ListKnowledgeSources)
    .register(TriggerKnowledgeSourceSync);
}







