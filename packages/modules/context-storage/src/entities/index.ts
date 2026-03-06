import { defineEntity, field, index } from '@contractspec/lib.schema';
import type { ModuleSchemaContribution } from '@contractspec/lib.schema';

export const ContextPackEntity = defineEntity({
  name: 'ContextPack',
  description: 'Context pack definition for snapshots.',
  schema: 'lssm_context',
  map: 'context_pack',
  fields: {
    id: field.id({ description: 'Context pack record ID' }),
    packKey: field.string({ description: 'Context pack key' }),
    version: field.string({ description: 'Context pack version' }),
    title: field.string({ description: 'Pack title' }),
    description: field.string({ isOptional: true }),
    owners: field.json({ isOptional: true }),
    tags: field.json({ isOptional: true }),
    sources: field.json({ isOptional: true }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
  },
  indexes: [index.unique(['packKey', 'version'])],
});

export const ContextSnapshotEntity = defineEntity({
  name: 'ContextSnapshot',
  description: 'Immutable snapshot created from a context pack.',
  schema: 'lssm_context',
  map: 'context_snapshot',
  fields: {
    id: field.id({ description: 'Snapshot ID' }),
    packKey: field.string({ description: 'Context pack key' }),
    packVersion: field.string({ description: 'Context pack version' }),
    hash: field.string({ description: 'Snapshot hash' }),
    itemCount: field.int({ isOptional: true }),
    createdBy: field.string({ isOptional: true }),
    metadata: field.json({ isOptional: true }),
    createdAt: field.createdAt(),
  },
  indexes: [index.on(['packKey', 'packVersion']), index.on(['createdAt'])],
});

export const ContextSnapshotItemEntity = defineEntity({
  name: 'ContextSnapshotItem',
  description: 'Item belonging to a context snapshot.',
  schema: 'lssm_context',
  map: 'context_snapshot_item',
  fields: {
    id: field.id({ description: 'Snapshot item ID' }),
    snapshotId: field.string({ description: 'Context snapshot ID' }),
    kind: field.string({ description: 'Item kind' }),
    sourceKey: field.string({ description: 'Source key' }),
    sourceVersion: field.string({ isOptional: true }),
    content: field.json({ description: 'Structured content' }),
    textContent: field.string({ isOptional: true }),
    metadata: field.json({ isOptional: true }),
    createdAt: field.createdAt(),
  },
  indexes: [index.on(['snapshotId']), index.on(['kind'])],
});

export const contextStorageEntities = [
  ContextPackEntity,
  ContextSnapshotEntity,
  ContextSnapshotItemEntity,
];

export const contextStorageSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@contractspec/module.context-storage',
  entities: contextStorageEntities,
};
