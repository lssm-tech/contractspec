import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import {
  ToolCategoryEnum,
  ToolStatusEnum,
  ImplementationTypeEnum,
} from './tool.enum';

/**
 * AI tool definition.
 */
export const ToolModel = defineSchemaModel({
  name: 'Tool',
  description: 'AI tool definition',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    category: { type: ToolCategoryEnum, isOptional: false },
    status: { type: ToolStatusEnum, isOptional: false },
    parametersSchema: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
    outputSchema: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    implementationType: { type: ImplementationTypeEnum, isOptional: false },
    implementationConfig: {
      type: ScalarTypeEnum.JSONObject(),
      isOptional: false,
    },
    maxInvocationsPerMinute: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
    },
    timeoutMs: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
      defaultValue: 30000,
    },
    version: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    tags: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Summary of a tool for list views.
 */
export const ToolSummaryModel = defineSchemaModel({
  name: 'ToolSummary',
  description: 'Summary of a tool for list views',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    category: { type: ToolCategoryEnum, isOptional: false },
    status: { type: ToolStatusEnum, isOptional: false },
    version: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Input for creating a tool.
 */
export const CreateToolInputModel = defineSchemaModel({
  name: 'CreateToolInput',
  description: 'Input for creating a tool',
  fields: {
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    category: { type: ToolCategoryEnum, isOptional: true },
    parametersSchema: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
    outputSchema: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    implementationType: { type: ImplementationTypeEnum, isOptional: false },
    implementationConfig: {
      type: ScalarTypeEnum.JSONObject(),
      isOptional: false,
    },
    maxInvocationsPerMinute: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
    },
    timeoutMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    tags: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
  },
});

/**
 * Input for updating a tool.
 */
export const UpdateToolInputModel = defineSchemaModel({
  name: 'UpdateToolInput',
  description: 'Input for updating a tool',
  fields: {
    toolId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: true },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ToolStatusEnum, isOptional: true },
    parametersSchema: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    outputSchema: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    implementationConfig: {
      type: ScalarTypeEnum.JSONObject(),
      isOptional: true,
    },
    maxInvocationsPerMinute: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
    },
    timeoutMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    tags: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
  },
});

