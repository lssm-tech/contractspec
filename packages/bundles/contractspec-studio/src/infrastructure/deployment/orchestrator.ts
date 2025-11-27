import {
  prisma as studioDb,
  DeploymentMode,
  DeploymentStatus,
  Environment,
  type StudioDeployment,
  type StudioProject,
} from '@lssm/lib.database-contractspec-studio';
import { SharedDeployer, type SharedDeployerOptions } from './shared-deployer';
import type { DeploymentConfig, DeploymentResult } from './types';

export interface DeploymentOrchestratorOptions extends SharedDeployerOptions {}

export class DeploymentOrchestrator {
  private readonly sharedDeployer: SharedDeployer;

  constructor(options: DeploymentOrchestratorOptions = {}) {
    this.sharedDeployer = new SharedDeployer(options);
  }

  async deployProject(
    project: StudioProject,
    environment: Environment
  ): Promise<StudioDeployment> {
    const pending = await studioDb.studioDeployment.create({
      data: {
        projectId: project.id,
        environment,
        status: DeploymentStatus.DEPLOYING,
        version: `deploy-${environment.toLowerCase()}-${Date.now()}`,
      },
    });

    const config: DeploymentConfig = {
      project,
      environment,
      targetVersion: pending.version ?? undefined,
    };

    try {
      const result =
        project.deploymentMode === DeploymentMode.SHARED
          ? await this.deployToShared(config)
          : await this.deployToDedicated(config);

      return studioDb.studioDeployment.update({
        where: { id: pending.id },
        data: {
          status: DeploymentStatus.DEPLOYED,
          deployedAt: new Date(),
          url: result.target.env.APP_URL ?? pending.url,
        },
      });
    } catch (error) {
      await studioDb.studioDeployment.update({
        where: { id: pending.id },
        data: {
          status: DeploymentStatus.FAILED,
        },
      });
      throw error;
    }
  }

  async rollback(deploymentId: string) {
    await studioDb.studioDeployment.update({
      where: { id: deploymentId },
      data: {
        status: DeploymentStatus.ROLLED_BACK,
      },
    });
  }

  getDeploymentStatus(deploymentId: string) {
    return studioDb.studioDeployment.findUnique({
      where: { id: deploymentId },
    });
  }

  private async deployToShared(
    config: DeploymentConfig
  ): Promise<DeploymentResult> {
    const target = await this.sharedDeployer.deploy(config);
    return {
      deployment: await this.latestDeployment(config.project.id),
      target,
    };
  }

  private async deployToDedicated(
    config: DeploymentConfig
  ): Promise<DeploymentResult> {
    const target = await this.sharedDeployer.deploy(config);
    return {
      deployment: await this.latestDeployment(config.project.id),
      target: {
        ...target,
        env: {
          ...target.env,
          DEDICATED_INFRA: 'true',
        },
      },
    };
  }

  private async latestDeployment(projectId: string) {
    const record = await studioDb.studioDeployment.findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
    if (!record) {
      throw new Error('Deployment record not found');
    }
    return record;
  }
}
