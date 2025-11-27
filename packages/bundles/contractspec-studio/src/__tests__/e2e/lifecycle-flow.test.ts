import { describe, expect, it, beforeEach, vi } from 'bun:test';
import { registerLifecycleSchema } from '../../infrastructure/graphql/modules/lifecycle';
import type { Context } from '../../infrastructure/graphql/types';
import { prismaMock } from '../mocks/prisma';

const runAssessmentMock = vi.fn();
const getStagePlaybookMock = vi.fn(() => ({
  recommendation: {
    stage: 'EXPLORATION',
    actions: [],
    upcomingMilestones: [],
  },
}));

vi.mock('@lssm/bundle.lifecycle-managed', () => ({
  LifecycleAssessmentService: class {
    runAssessment = runAssessmentMock;
    getStagePlaybook = getStagePlaybookMock;
  },
}));

class BuilderStub {
  queryFieldsMap: Record<string, any> = {};
  mutationFieldsMap: Record<string, any> = {};

  enumType() {
    return {};
  }

  objectRef() {
    return { implement: () => ({}) };
  }

  inputType() {
    return {};
  }

  queryFields(cb: (t: { field: (config: any) => any }) => Record<string, any>) {
    const fields = cb({ field: (config) => config });
    Object.assign(this.queryFieldsMap, fields);
  }

  mutationFields(
    cb: (t: { field: (config: any) => any }) => Record<string, any>
  ) {
    const fields = cb({ field: (config) => config });
    Object.assign(this.mutationFieldsMap, fields);
  }
}

const builder = new BuilderStub();
registerLifecycleSchema(builder as any);

const ctx: Context = {
  user: { organizationId: 'org-e2e' } as any,
  session: undefined,
  logger: console as any,
  headers: {} as Headers,
  featureFlags: {},
};

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
    } as any);
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
    } as any);
    prismaMock.lifecycleMilestoneProgress.findFirst.mockResolvedValue(null);
    prismaMock.lifecycleMilestoneProgress.create.mockResolvedValue({
      id: 'milestone-1',
      status: 'IN_PROGRESS',
    } as any);

    const profileResolver = builder.queryFieldsMap.lifecycleProfile.resolve;
    const assessmentResolver =
      builder.mutationFieldsMap.runLifecycleAssessment.resolve;
    const milestoneResolver =
      builder.mutationFieldsMap.trackLifecycleMilestone.resolve;

    const profile = await profileResolver({}, {}, ctx);
    expect(profile.id).toBe('profile-1');

    const assessment = await assessmentResolver({}, { input: {} }, ctx);
    expect(assessment.id).toBe('assessment-1');

    const progress = await milestoneResolver(
      {},
      {
        milestoneId: 'ms-1',
        category: 'product',
        status: 'IN_PROGRESS',
      },
      ctx
    );
    expect(progress.status).toBe('IN_PROGRESS');
  });
});
