import type {
  DeploymentMode,
  Environment,
  StudioDeployment,
  StudioProject,
} from '@lssm/lib.database-contractspec-studio';

export interface DeploymentConfig {
  project: StudioProject;
  environment: Environment;
  targetVersion?: string;
  metadata?: Record<string, unknown>;
}

export interface DeploymentTarget {
  image: string;
  version: string;
  env: Record<string, string>;
  secrets?: Record<string, string>;
}

export interface DeploymentResult {
  deployment: StudioDeployment;
  target: DeploymentTarget;
  logs?: string[];
}

export interface DeploymentError extends Error {
  step: DeploymentStep;
  details?: Record<string, unknown>;
}

export type DeploymentStep =
  | 'build'
  | 'plan'
  | 'provision'
  | 'deploy'
  | 'verify'
  | 'cleanup';

export interface DeploymentStrategy {
  mode: DeploymentMode;
  environment: Environment;
  orchestratedAt: Date;
  requestedBy: string;
}







