import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineQuery } from '../../operations';
import '../ensure-docblocks';
import { docId } from '../registry';
import {
  DOCS_DOMAIN,
  DOCS_OWNERS,
  DOCS_STABILITY,
  DOCS_TAGS,
} from '../constants';

export const ContractReferenceInput = new SchemaModel({
  name: 'ContractReferenceInput',
  fields: {
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    format: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    includeSchema: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

export const ContractReferenceModel = new SchemaModel({
  name: 'ContractReference',
  fields: {
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    markdown: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    route: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    schema: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    policy: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    tags: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
    owners: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
    stability: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const ContractReferenceOutput = new SchemaModel({
  name: 'ContractReferenceOutput',
  fields: {
    reference: { type: ContractReferenceModel, isOptional: false },
  },
});

export const ContractReferenceQuery = defineQuery({
  meta: {
    key: 'docs.contract.reference',
    title: 'Contract Reference',
    version: '1.0.0',
    description: 'Resolve a contract into a documentation-ready reference.',
    goal: 'Expose a canonical reference view for any ContractSpec surface.',
    context:
      'Used by docs generators and UI to render consistent reference pages.',
    domain: DOCS_DOMAIN,
    owners: DOCS_OWNERS,
    tags: [...DOCS_TAGS, 'reference'],
    stability: DOCS_STABILITY,
    docId: [docId('docs.tech.docs-reference')],
  },
  capability: {
    key: 'docs.system',
    version: '1.0.0',
  },
  io: {
    input: ContractReferenceInput,
    output: ContractReferenceOutput,
  },
  policy: {
    auth: 'anonymous',
    pii: [],
  },
});
