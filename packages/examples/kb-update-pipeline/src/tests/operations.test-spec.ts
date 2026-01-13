import { defineTestSpec } from '@contractspec/lib.contracts';

export const RunWatchTest = defineTestSpec({
  meta: {
    key: 'kbPipeline.runWatch.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.kb-update-pipeline'],
    description: 'Test for run watch operation',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'kbPipeline.runWatch', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'kbPipeline.runWatch' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'kbPipeline.runWatch' } },
      then: [{ type: 'expectError' }],
    },
  ],
});

export const CreateReviewTaskTest = defineTestSpec({
  meta: {
    key: 'kbPipeline.createReviewTask.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.kb-update-pipeline'],
    description: 'Test for creating review task',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'kbPipeline.createReviewTask', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'kbPipeline.createReviewTask' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'kbPipeline.createReviewTask' } },
      then: [{ type: 'expectError' }],
    },
  ],
});

export const SubmitDecisionTest = defineTestSpec({
  meta: {
    key: 'kbPipeline.submitDecision.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.kb-update-pipeline'],
    description: 'Test for submitting decision',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'kbPipeline.submitDecision', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'kbPipeline.submitDecision' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'kbPipeline.submitDecision' } },
      then: [{ type: 'expectError' }],
    },
  ],
});
