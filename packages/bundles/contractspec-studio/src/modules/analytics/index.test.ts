import { describe, expect, it, vi, beforeEach } from 'bun:test';
import { StudioAnalyticsModule } from './index';
import { prismaMock } from '../../__tests__/mocks/prisma';

const pipelineMock = {
  recordAssessment: vi.fn(),
};

describe('StudioAnalyticsModule', () => {
  beforeEach(() => {
    pipelineMock.recordAssessment.mockReset();
  });

  it('tracks lifecycle assessments and persists profile state', async () => {
    const module = new StudioAnalyticsModule({ pipeline: pipelineMock as any });
    prismaMock.organizationLifecycleProfile.upsert.mockResolvedValue({
      id: 'profile-1',
    });

    await module.trackEvent({
      type: 'lifecycle.assessment',
      projectId: 'project-1',
      organizationId: 'org-1',
      payload: {
        assessment: {
          id: 'assessment-1',
          stage: 'EXPLORATION',
          confidence: 0.8,
          signals: [],
          focusAreas: [],
        } as any,
      },
    });

    expect(pipelineMock.recordAssessment).toHaveBeenCalledTimes(1);
    expect(pipelineMock.recordAssessment).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'assessment-1' }),
      'org-1'
    );
    expect(
      prismaMock.organizationLifecycleProfile.upsert
    ).toHaveBeenCalledTimes(1);
  });

  it('creates deployment records when deployment events are tracked', async () => {
    const module = new StudioAnalyticsModule({ pipeline: pipelineMock as any });
    prismaMock.studioDeployment.create.mockResolvedValue({ id: 'deploy-1' });

    await module.trackEvent({
      type: 'deployment.triggered',
      projectId: 'project-2',
      organizationId: 'org-1',
      environment: 'production',
    });

    expect(prismaMock.studioDeployment.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        projectId: 'project-2',
        status: 'PENDING',
      }),
    });
  });

  it('aggregates project metrics with cached state', async () => {
    const module = new StudioAnalyticsModule({ pipeline: pipelineMock as any });
    prismaMock.studioSpec.count.mockResolvedValue(5);
    prismaMock.studioOverlay.count.mockResolvedValue(2);
    prismaMock.studioIntegration.count.mockResolvedValue(3);
    prismaMock.studioDeployment.aggregate.mockResolvedValue({
      _count: { _all: 4 },
      _max: { deployedAt: new Date('2024-01-02T00:00:00Z') },
    });

    await module.trackEvent({
      type: 'spec.updated',
      projectId: 'project-3',
      organizationId: 'org-1',
    });

    const metrics = await module.getProjectMetrics('project-3');
    expect(metrics).toMatchObject({
      projectId: 'project-3',
      specCount: 5,
      overlayCount: 2,
      integrationCount: 3,
      deploymentCount: 4,
    });
    expect(metrics.lastEventAt).toBeInstanceOf(Date);
  });
});










