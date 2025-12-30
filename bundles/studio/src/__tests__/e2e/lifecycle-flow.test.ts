/* eslint-disable @typescript-eslint/no-explicit-any -- Pragmatic use of any for test mocks */

import { describe, expect, it, beforeEach, vi } from 'bun:test';
import { registerLifecycleSchema } from '../../infrastructure/graphql/modules/lifecycle';
import { BuilderStub, createTestContext } from '../mocks/builder-stub';
import { prismaMock } from '../mocks/prisma';

const runAssessmentMock = vi.fn();
const getStagePlaybookMock = vi.fn(() => ({
  recommendation: {
    stage: 'EXPLORATION',
    actions: [],
    upcomingMilestones: [],
  },
}));

vi.mock('@contractspec/bundle.lifecycle-managed', () => ({
  LifecycleAssessmentService: class {
    runAssessment = runAssessmentMock;
    getStagePlaybook = getStagePlaybookMock;
  },
}));

const builder = new BuilderStub();

registerLifecycleSchema(builder as any);

const ctx = createTestContext({
  user: {
    id: 'user-e2e',
    email: 'e2e@test.com',
    name: 'E2E User',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    image: null,
    locale: 'en',
    onboardingCompleted: false,
    banned: false,
  },
});

describe('Lifecycle flow e2e', () => {
  beforeEach(() => {
    runAssessmentMock.mockReset();
    getStagePlaybookMock.mockClear();
  });

  it('runs assessment, reads recommendations, and tracks milestones', async () => {
    prismaMock.organizationLifecycleProfile.findUnique.mockResolvedValue({
      id: 'profile-1',
      organizationId: 'org-e2e',
      currentStage: 'EXPLORATION',
      focusAreas: [],
      lastAssessmentAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    runAssessmentMock.mockResolvedValue({
      assessment: {
        stage: 'EXPLORATION',
        confidence: 0.8,
        focusAreas: [],
        signals: [],
      },
    });
    prismaMock.lifecycleAssessment.create.mockResolvedValue({
      id: 'assessment-1',
      organizationId: 'org-e2e',
      stage: 'EXPLORATION',
      confidence: 0.8,
      focusAreas: [],
      signals: {},
      recommendations: {},
      createdAt: new Date(),
    });
    prismaMock.lifecycleMilestoneProgress.findFirst.mockResolvedValue(null);
    prismaMock.lifecycleMilestoneProgress.create.mockResolvedValue({
      id: 'milestone-1',
      organizationId: 'org-e2e',
      milestoneId: 'ms-1',
      category: 'product',
      status: 'IN_PROGRESS',
      completedAt: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const profileResolver = builder.queryFieldsMap.lifecycleProfile.resolve;
    const assessmentResolver =
      builder.mutationFieldsMap.runLifecycleAssessment.resolve;
    const milestoneResolver =
      builder.mutationFieldsMap.trackLifecycleMilestone.resolve;

    const profile = await profileResolver({}, {}, ctx);
    expect((profile as { id: string }).id).toBe('profile-1');

    const assessment = await assessmentResolver({}, { input: {} }, ctx);
    expect((assessment as { id: string }).id).toBe('assessment-1');

    const progress = await milestoneResolver(
      {},
      {
        milestoneId: 'ms-1',
        category: 'product',
        status: 'IN_PROGRESS',
      },
      ctx
    );
    expect((progress as { status: string }).status).toBe('IN_PROGRESS');
  });
});
