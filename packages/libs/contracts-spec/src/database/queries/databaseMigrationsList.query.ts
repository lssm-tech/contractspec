import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineQuery } from '../../operations';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import {
  DATABASE_DOMAIN,
  DATABASE_OWNERS,
  DATABASE_STABILITY,
  DATABASE_TAGS,
} from '../constants';

const DatabaseMigrationsListInput = new SchemaModel({
  name: 'DatabaseMigrationsListInput',
  fields: {
    databaseKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const DatabaseMigrationSummary = new SchemaModel({
  name: 'DatabaseMigrationSummary',
  fields: {
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    appliedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

const DatabaseMigrationsListOutput = new SchemaModel({
  name: 'DatabaseMigrationsListOutput',
  fields: {
    migrations: {
      type: DatabaseMigrationSummary,
      isOptional: false,
      isArray: true,
    },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    nextOffset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

export const DatabaseMigrationsListQuery = defineQuery({
  meta: {
    key: 'database.migrations.list',
    title: 'List Database Migrations',
    version: '1.0.0',
    description: 'List registered database migrations and statuses.',
    goal: 'Provide migration context and auditability for schema changes.',
    context: 'Used by Studio, ops, and agents before data migrations.',
    domain: DATABASE_DOMAIN,
    owners: DATABASE_OWNERS,
    tags: [...DATABASE_TAGS, 'migrations'],
    stability: DATABASE_STABILITY,
    docId: [docId('docs.tech.database.migrations.list')],
  },
  capability: {
    key: 'database.context',
    version: '1.0.0',
  },
  io: {
    input: DatabaseMigrationsListInput,
    output: DatabaseMigrationsListOutput,
  },
  policy: {
    auth: 'admin',
    pii: [],
  },
});
