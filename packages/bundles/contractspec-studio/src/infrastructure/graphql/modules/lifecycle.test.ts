import { describe, expect, it, beforeEach, vi } from 'bun:test';
import { registerLifecycleSchema } from './lifecycle';
import type { Context } from '../types';
import { prismaMock } from '../../../__tests__/mocks/prisma';

const runAssessmentMock = vi.fn();
const getStagePlaybookMock = vi.fn(() => ({
  recommendation: { stage: 'EXPLORATION', actions: [], upcomingMilestones: [] },
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
    return {
      implement: () => ({}),
    };
  }

  inputType(
    _name: string,
    config: { fields: (t: any) => Record<string, unknown> }
  ) {
    const fieldBuilder = {
      field: () => ({}),
      string: () => ({}),
      float: () => ({}),
      boolean: () => ({}),
      int: () => ({}),
    };
    config.fields(fieldBuilder);
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

const baseCtx: Context = {
  user: { organizationId: 'org-1' } as any,
  session: undefined,
  logger: console as any,
  headers: {} as Headers,
  featureFlags: {},
};

describe('lifecycle GraphQL module', () => {
  beforeEach(() => {
    runAssessmentMock.mockReset();
    getStagePlaybookMock.mockClear();
  });

  it('returns lifecycle profile for the organization', async () => {
    prismaMock.organizationLifecycleProfile.findUnique.mockResolvedValue({
      id: 'profile-1',
      organizationId: 'org-1',
      currentStage: 'EXPLORATION',
      detectedStage: 'EXPLORATION',
      confidence: 0.5,
    } as any);

    const resolver = builder.queryFieldsMap.lifecycleProfile.resolve;
    const profile = await resolver({}, {}, baseCtx);

    expect(
      prismaMock.organizationLifecycleProfile.findUnique
    ).toHaveBeenCalled();
    expect(profile.id).toBe('profile-1');
  });

  it('runs lifecycle assessment and creates records', async () => {
    prismaMock.organizationLifecycleProfile.findUnique.mockResolvedValue({
      id: 'profile-1',
      organizationId: 'org-1',
      currentStage: 'EXPLORATION',
    } as any);
    runAssessmentMock.mockResolvedValue({
      assessment: {
        stage: 'EXPLORATION',
        confidence: 0.7,
        focusAreas: [],
        signals: [],
      },
    });
    prismaMock.lifecycleAssessment.create.mockResolvedValue({
      id: 'assessment-1',
    } as any);

    const resolver = builder.mutationFieldsMap.runLifecycleAssessment.resolve;
    const assessment = await resolver({}, { input: {} }, baseCtx);

    expect(runAssessmentMock).toHaveBeenCalled();
    expect(prismaMock.lifecycleAssessment.create).toHaveBeenCalled();
    expect(assessment.id).toBe('assessment-1');
  });

  it('tracks lifecycle milestones by creating new progress entries', async () => {
    prismaMock.organizationLifecycleProfile.findUnique.mockResolvedValue({
      id: 'profile-1',
      organizationId: 'org-1',
      currentStage: 'EXPLORATION',
    } as any);
    prismaMock.lifecycleMilestoneProgress.findFirst.mockResolvedValue(null);
    prismaMock.lifecycleMilestoneProgress.create.mockResolvedValue({
      id: 'milestone-1',
      status: 'IN_PROGRESS',
    } as any);

    const resolver = builder.mutationFieldsMap.trackLifecycleMilestone.resolve;
    const progress = await resolver(
      {},
      {
        milestoneId: 'ms-1',
        category: 'product',
        status: 'IN_PROGRESS',
      },
      baseCtx
    );

    expect(prismaMock.lifecycleMilestoneProgress.create).toHaveBeenCalled();
    expect(progress.id).toBe('milestone-1');
  });
});


