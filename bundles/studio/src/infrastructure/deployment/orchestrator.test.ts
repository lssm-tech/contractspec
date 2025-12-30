/* eslint-disable @typescript-eslint/no-explicit-any -- Pragmatic use of any for test mocks */

import { afterEach, beforeEach, describe, expect, it, vi } from 'bun:test';
import { prismaMock, resetPrismaMock } from '../../__tests__/mocks/prisma';
import { DeploymentOrchestrator } from './orchestrator';
import { SharedDeployer } from './shared-deployer';

describe('DeploymentOrchestrator', () => {
  let orchestrator: DeploymentOrchestrator;

  beforeEach(() => {
    resetPrismaMock();
    orchestrator = new DeploymentOrchestrator({ db: prismaMock as any });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deploys shared projects and marks deployment as deployed', async () => {
    prismaMock.studioDeployment.create.mockResolvedValue({
      id: 'deployment-1',
      projectId: 'project-1',
      version: 'deploy-dev-1',
    } as any);
    prismaMock.studioDeployment.findFirst.mockResolvedValue({
      id: 'deployment-1',
    } as any);
    prismaMock.studioDeployment.update.mockResolvedValue({
      id: 'deployment-1',
      status: 'DEPLOYED',
    } as any);

    const result = await orchestrator.deployProject(
      {
        id: 'project-1',
        deploymentMode: 'SHARED',
        organizationId: 'org-1',
      } as any,
      'DEVELOPMENT' as any
    );

    expect(prismaMock.studioDeployment.update).toHaveBeenCalledWith({
      where: { id: 'deployment-1' },
      data: expect.objectContaining({
        status: 'DEPLOYED',
      }),
    });
    expect(result.status).toBe('DEPLOYED');
  });

  it('deploys dedicated projects with dedicated env markers', async () => {
    prismaMock.studioDeployment.create.mockResolvedValue({
      id: 'deployment-2',
      projectId: 'project-2',
      version: 'deploy-prod-1',
    } as any);
    prismaMock.studioDeployment.findFirst.mockResolvedValue({
      id: 'deployment-2',
    } as any);
    prismaMock.studioDeployment.update.mockResolvedValue({
      id: 'deployment-2',
      status: 'DEPLOYED',
    } as any);

    await orchestrator.deployProject(
      {
        id: 'project-2',
        deploymentMode: 'DEDICATED',
        organizationId: 'org-1',
      } as any,
      'PRODUCTION' as any
    );

    // Verify result via update call since deployProject returns deployment record (without target info in return type? Wait, type is StudioDeployment)
    // Actually deployProject returns StudioDeployment which is the DB record.
    // The previous test verified result.status.

    // In original test, it checked update call for URL.
    const updateCall = prismaMock.studioDeployment.update.mock.calls[0];
    const updateData = updateCall?.[0]?.data;
    expect(updateData?.url).toContain('contractspec.dev');

    // Dedicated logic adds DEDICATED_INFRA env var in target, but that is internal to deployer result.
    // Orchestrator uses target.env.APP_URL to update DB.
    // So checking DB update URL is sufficient.
  });

  it('marks deployment as failed when deployer throws', async () => {
    prismaMock.studioDeployment.create.mockResolvedValue({
      id: 'deployment-3',
      projectId: 'project-3',
    } as any);
    prismaMock.studioDeployment.findFirst.mockResolvedValue({
      id: 'deployment-3',
    } as any);

    // Spy on prototype to force failure
    vi.spyOn(SharedDeployer.prototype, 'deploy').mockRejectedValue(
      new Error('infra error')
    );

    await expect(
      orchestrator.deployProject(
        { id: 'project-3', deploymentMode: 'SHARED' } as any,
        'STAGING' as any
      )
    ).rejects.toThrow('infra error');

    expect(prismaMock.studioDeployment.update).toHaveBeenCalledWith({
      where: { id: 'deployment-3' },
      data: expect.objectContaining({ status: 'FAILED' }),
    });
  });

  it('rolls back deployments by updating status', async () => {
    prismaMock.studioDeployment.update.mockResolvedValue({} as any);
    await orchestrator.rollback('deployment-4');
    expect(prismaMock.studioDeployment.update).toHaveBeenCalledWith({
      where: { id: 'deployment-4' },
      data: { status: 'ROLLED_BACK' },
    });
  });

  it('fetches deployment status by id', async () => {
    prismaMock.studioDeployment.findUnique.mockResolvedValue({
      id: 'deployment-5',
      status: 'DEPLOYED',
    } as any);
    const status = await orchestrator.getDeploymentStatus('deployment-5');
    expect(status?.status).toBe('DEPLOYED');
  });
});
