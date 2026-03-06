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

const DatabaseDictionaryGetInput = new SchemaModel({
  name: 'DatabaseDictionaryGetInput',
  fields: {
    databaseKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    entryKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
  },
});

const DatabaseDictionaryEntry = new SchemaModel({
  name: 'DatabaseDictionaryEntry',
  fields: {
    entryKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    fieldPath: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    piiTags: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
    owner: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const DatabaseDictionaryGetOutput = new SchemaModel({
  name: 'DatabaseDictionaryGetOutput',
  fields: {
    entry: { type: DatabaseDictionaryEntry, isOptional: false },
  },
});

export const DatabaseDictionaryGetQuery = defineQuery({
  meta: {
    key: 'database.dictionary.get',
    title: 'Get Data Dictionary Entry',
    version: '1.0.0',
    description: 'Retrieve a data dictionary entry for a schema field.',
    goal: 'Provide semantic context for schema fields and PII handling.',
    context: 'Used by agents to interpret data before retrieval or export.',
    domain: DATABASE_DOMAIN,
    owners: DATABASE_OWNERS,
    tags: [...DATABASE_TAGS, 'dictionary'],
    stability: DATABASE_STABILITY,
    docId: [docId('docs.tech.database.dictionary.get')],
  },
  capability: {
    key: 'database.context',
    version: '1.0.0',
  },
  io: {
    input: DatabaseDictionaryGetInput,
    output: DatabaseDictionaryGetOutput,
  },
  policy: {
    auth: 'admin',
    pii: [],
  },
});
