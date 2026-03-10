/**
 * AI Chat Assistant operation contracts.
 */
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { defineQuery } from '@contractspec/lib.contracts-spec/operations';

const AssistantSearchInputModel = defineSchemaModel({
  name: 'AssistantSearchInput',
  fields: {
    query: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const AssistantSearchResultModel = defineSchemaModel({
  name: 'AssistantSearchResult',
  fields: {
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    snippet: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    url: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const AssistantSearchOutputModel = defineSchemaModel({
  name: 'AssistantSearchOutput',
  fields: {
    results: {
      type: AssistantSearchResultModel,
      isArray: true,
      isOptional: false,
    },
  },
});

/**
 * Search operation for the AI chat assistant.
 * Returns mock results for demo; apps can bind a real search handler.
 */
export const AssistantSearchContract = defineQuery({
  meta: {
    key: 'assistant.search',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.ai-chat-assistant'],
    tags: ['assistant', 'search', 'chat'],
    description: 'Search for content within the assistant context.',
    goal: 'Allow the AI assistant to search and retrieve relevant information.',
    context: 'Used by chat flows when the user asks for information lookup.',
  },
  io: { input: AssistantSearchInputModel, output: AssistantSearchOutputModel },
  policy: { auth: 'anonymous' },
});
