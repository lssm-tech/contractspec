import { randomUUID } from 'node:crypto';
import { Logger } from '@contractspec/lib.logger';
import type { DeploymentConfig, DeploymentTarget } from './types';

export interface SharedDeployerOptions {
  logger?: Logger;
  image?: string;
}

export class SharedDeployer {
  private readonly logger?: Logger;
  private readonly runtimeImage: string;

  constructor(options: SharedDeployerOptions = {}) {
    this.logger = options.logger;
    this.runtimeImage = options.image ?? 'ghcr.io/lssm/studio-runtime:latest';
  }

  async deploy(config: DeploymentConfig): Promise<DeploymentTarget> {
    this.logger?.info?.('shared-deployer.start', {
      projectId: config.project.id,
      environment: config.environment,
    });

    const namespace = await this.provisionNamespace(config.project.id);
    const env = await this.buildEnvironment(config, namespace);
    await this.applyMigrations(config.project.id, namespace);
    await this.runHealthChecks(namespace);

    const target: DeploymentTarget = {
      image: this.runtimeImage,
      version:
        config.targetVersion ??
        `studio-${config.environment.toLowerCase()}-${Date.now()}`,
      env,
    };

    this.logger?.info?.('shared-deployer.complete', {
      projectId: config.project.id,
      namespace,
    });
    return target;
  }

  private async provisionNamespace(projectId: string): Promise<string> {
    const namespace = `studio-${projectId}-${randomUUID().slice(0, 6)}`;
    this.logger?.info?.('shared-deployer.namespace', { projectId, namespace });
    return namespace;
  }

  private async buildEnvironment(
    config: DeploymentConfig,
    namespace: string
  ): Promise<Record<string, string>> {
    const env: Record<string, string> = {
      NODE_ENV: config.environment.toLowerCase(),
      STUDIO_PROJECT_ID: config.project.id,
      STUDIO_ORGANIZATION_ID: config.project.organizationId,
      STUDIO_NAMESPACE: namespace,
      APP_URL: `https://${namespace}.studio.contractspec.dev`,
    };
    if (config.project.byokEnabled) {
      env.STUDIO_BYOK_ENABLED = 'true';
    }
    if (config.metadata) {
      Object.entries(config.metadata).forEach(([key, value]) => {
        if (typeof value === 'string') {
          env[key.toUpperCase()] = value;
        }
      });
    }
    return env;
  }

  private async applyMigrations(projectId: string, namespace: string) {
    this.logger?.info?.('shared-deployer.migrate', { projectId, namespace });
  }

  private async runHealthChecks(namespace: string) {
    this.logger?.info?.('shared-deployer.health', { namespace });
  }
}
