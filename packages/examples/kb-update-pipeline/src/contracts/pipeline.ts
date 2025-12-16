import { defineCommand } from '@lssm/lib.contracts';
import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';

import {
  ChangeCandidateModel,
  ReviewDecisionEnum,
  ReviewTaskModel,
} from '../entities/models';

const RunWatchInput = defineSchemaModel({
  name: 'KbPipelineRunWatchInput',
  description: 'Trigger a watch cycle for KB sources (demo).',
  fields: {
    jurisdiction: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const RunWatchOutput = defineSchemaModel({
  name: 'KbPipelineRunWatchOutput',
  description: 'Output containing detected changes.',
  fields: {
    candidates: {
      type: ChangeCandidateModel,
      isArray: true,
      isOptional: false,
    },
  },
});

const CreateReviewTaskInput = defineSchemaModel({
  name: 'KbPipelineCreateReviewTaskInput',
  description: 'Create a review task for a change candidate.',
  fields: {
    changeCandidateId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
  },
});

const SubmitDecisionInput = defineSchemaModel({
  name: 'KbPipelineSubmitDecisionInput',
  description: 'Submit a decision for a review task.',
  fields: {
    reviewTaskId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    decision: { type: ReviewDecisionEnum, isOptional: false },
    decidedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    decidedByRole: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
  },
});

const PublishIfReadyInput = defineSchemaModel({
  name: 'KbPipelinePublishIfReadyInput',
  description:
    'Publish snapshot if approvals are satisfied for a jurisdiction.',
  fields: {
    jurisdiction: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const PublishIfReadyOutput = defineSchemaModel({
  name: 'KbPipelinePublishIfReadyOutput',
  description: 'Output for publish-if-ready operation.',
  fields: {
    published: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const KbPipelineRunWatchContract = defineCommand({
  meta: {
    name: 'kbPipeline.runWatch',
    version: 1,
    stability: 'experimental',
    owners: ['examples'],
    tags: ['knowledge', 'pipeline', 'jobs'],
    description: 'Detect source changes and create change candidates.',
    goal: 'Automate discovery of updates needing review.',
    context: 'Scheduled job or manual trigger in demos.',
  },
  io: { input: RunWatchInput, output: RunWatchOutput },
  policy: { auth: 'user' },
});

export const KbPipelineCreateReviewTaskContract = defineCommand({
  meta: {
    name: 'kbPipeline.createReviewTask',
    version: 1,
    stability: 'experimental',
    owners: ['examples'],
    tags: ['knowledge', 'pipeline', 'hitl'],
    description: 'Create a review task for a detected change.',
    goal: 'Route work to human verifiers.',
    context: 'Called after change detection or manual selection.',
  },
  io: { input: CreateReviewTaskInput, output: ReviewTaskModel },
  policy: { auth: 'user' },
});

export const KbPipelineSubmitDecisionContract = defineCommand({
  meta: {
    name: 'kbPipeline.submitDecision',
    version: 1,
    stability: 'experimental',
    owners: ['examples'],
    tags: ['knowledge', 'pipeline', 'hitl', 'rbac'],
    description: 'Submit approve/reject decision for a review task.',
    goal: 'Ensure humans verify before publishing.',
    context: 'Curator/expert reviews and decides.',
  },
  io: {
    input: SubmitDecisionInput,
    output: ReviewTaskModel,
    errors: {
      FORBIDDEN_ROLE: {
        description: 'Role not allowed to approve the given risk level',
        http: 403,
        gqlCode: 'FORBIDDEN_ROLE',
        when: 'curator attempts to approve a high-risk change',
      },
      REVIEW_TASK_NOT_FOUND: {
        description: 'Review task not found',
        http: 404,
        gqlCode: 'REVIEW_TASK_NOT_FOUND',
        when: 'reviewTaskId is invalid',
      },
    },
  },
  policy: { auth: 'user' },
});

export const KbPipelinePublishIfReadyContract = defineCommand({
  meta: {
    name: 'kbPipeline.publishIfReady',
    version: 1,
    stability: 'experimental',
    owners: ['examples'],
    tags: ['knowledge', 'pipeline', 'publishing'],
    description: 'Publish snapshot if ready (all approvals satisfied).',
    goal: 'Prevent publishing until all required approvals exist.',
    context: 'Called by job or UI to attempt publish.',
  },
  io: {
    input: PublishIfReadyInput,
    output: PublishIfReadyOutput,
    errors: {
      NOT_READY: {
        description: 'Publishing is blocked because approvals are incomplete',
        http: 409,
        gqlCode: 'NOT_READY',
        when: 'there are open review tasks or unapproved rule versions',
      },
    },
  },
  policy: { auth: 'user' },
});


