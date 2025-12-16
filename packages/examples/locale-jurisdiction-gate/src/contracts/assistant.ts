import { defineCommand } from '@lssm/lib.contracts';
import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';

import {
  AssistantAnswerIRModel,
  LLMCallEnvelopeModel,
} from '../entities/models';

const AssistantQuestionInput = defineSchemaModel({
  name: 'AssistantQuestionInput',
  description: 'Input for assistant calls with mandatory envelope.',
  fields: {
    envelope: { type: LLMCallEnvelopeModel, isOptional: false },
    question: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const AssistantConceptInput = defineSchemaModel({
  name: 'AssistantConceptInput',
  description: 'Input for explaining a concept with mandatory envelope.',
  fields: {
    envelope: { type: LLMCallEnvelopeModel, isOptional: false },
    conceptKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const AssistantAnswerContract = defineCommand({
  meta: {
    name: 'assistant.answer',
    version: 1,
    stability: 'experimental',
    owners: ['examples'],
    tags: ['assistant', 'policy', 'locale', 'jurisdiction', 'knowledge'],
    description:
      'Answer a user question using a KB snapshot with strict locale/jurisdiction gating.',
    goal: 'Provide policy-safe answers that cite a KB snapshot or refuse.',
    context:
      'Called by UI or workflows; must fail-closed if envelope is invalid or citations are missing.',
  },
  io: {
    input: AssistantQuestionInput,
    output: AssistantAnswerIRModel,
    errors: {
      LOCALE_REQUIRED: {
        description: 'Locale is required and must be supported',
        http: 400,
        gqlCode: 'LOCALE_REQUIRED',
        when: 'locale is missing or unsupported',
      },
      JURISDICTION_REQUIRED: {
        description: 'Jurisdiction is required',
        http: 400,
        gqlCode: 'JURISDICTION_REQUIRED',
        when: 'jurisdiction is missing',
      },
      KB_SNAPSHOT_REQUIRED: {
        description: 'KB snapshot id is required',
        http: 400,
        gqlCode: 'KB_SNAPSHOT_REQUIRED',
        when: 'kbSnapshotId is missing',
      },
      CITATIONS_REQUIRED: {
        description: 'Answers must include citations to a KB snapshot',
        http: 422,
        gqlCode: 'CITATIONS_REQUIRED',
        when: 'answer has no citations',
      },
      SCOPE_VIOLATION: {
        description:
          'Answer violates allowed scope and must be refused/escalated',
        http: 403,
        gqlCode: 'SCOPE_VIOLATION',
        when: 'output includes forbidden content under the given allowedScope',
      },
    },
  },
  policy: { auth: 'user' },
});

export const AssistantExplainConceptContract = defineCommand({
  meta: {
    name: 'assistant.explainConcept',
    version: 1,
    stability: 'experimental',
    owners: ['examples'],
    tags: ['assistant', 'policy', 'knowledge', 'concepts'],
    description:
      'Explain a concept using a KB snapshot with strict locale/jurisdiction gating.',
    goal: 'Explain concepts with citations or refuse.',
    context: 'Same constraints as assistant.answer.',
  },
  io: {
    input: AssistantConceptInput,
    output: AssistantAnswerIRModel,
    errors: AssistantAnswerContract.io.errors,
  },
  policy: { auth: 'user' },
});


