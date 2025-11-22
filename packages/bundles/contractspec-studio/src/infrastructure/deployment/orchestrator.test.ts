import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { DeploymentConfig } from './types';
import { prismaMock } from '../../__tests__/mocks/prisma';

const sharedDeployMock = vi.fn<
  [DeploymentConfig],
  Promise<{ env: Record<string, string> }>
>();

vi.mock('./shared-deployer', () => ({
  SharedDeployer: class {
    deploy = sharedDeployMock;
  },
}));

import { DeploymentOrchestrator } from './orchestrator';

describe('DeploymentOrchestrator', () => {
  const orchestrator = new DeploymentOrchestrator();

  beforeEach(() => {
    sharedDeployMock.mockReset();
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
    sharedDeployMock.mockResolvedValue({
      env: { APP_URL: 'https://shared.example.dev' },
    });

    const result = await orchestrator.deployProject(
      {
        id: 'project-1',
        deploymentMode: 'SHARED',
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
    sharedDeployMock.mockResolvedValue({
      env: { APP_URL: 'https://dedicated.example.com' },
    });

    await orchestrator.deployProject(
      {
        id: 'project-2',
        deploymentMode: 'DEDICATED',
      } as any,
      'PRODUCTION' as any
    );

    expect(sharedDeployMock).toHaveBeenCalled();
    const targetEnv = prismaMock.studioDeployment.update.mock.calls[0]?.[0]
      ?.data?.url;
    expect(targetEnv).toBe('https://dedicated.example.com');
  });

  it('marks deployment as failed when deployer throws', async () => {
    prismaMock.studioDeployment.create.mockResolvedValue({
      id: 'deployment-3',
      projectId: 'project-3',
    } as any);
    prismaMock.studioDeployment.findFirst.mockResolvedValue({
      id: 'deployment-3',
    } as any);
    sharedDeployMock.mockRejectedValue(new Error('infra error'));

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




