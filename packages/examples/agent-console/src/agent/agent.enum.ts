import { defineEnum } from '@lssm/lib.schema';

/**
 * Agent status enum.
 */
export const AgentStatusEnum = defineEnum('AgentStatus', [
  'DRAFT',
  'ACTIVE',
  'PAUSED',
  'ARCHIVED',
]);

/**
 * Model provider enum.
 */
export const ModelProviderEnum = defineEnum('ModelProvider', [
  'OPENAI',
  'ANTHROPIC',
  'GOOGLE',
  'MISTRAL',
  'CUSTOM',
]);

/**
 * Tool choice mode enum.
 */
export const ToolChoiceEnum = defineEnum('ToolChoice', [
  'auto',
  'required',
  'none',
]);
