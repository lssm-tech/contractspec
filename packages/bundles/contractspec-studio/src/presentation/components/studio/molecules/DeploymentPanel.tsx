import * as React from 'react';
import {
  Globe,
  RefreshCcw,
  RotateCcw,
  ShieldCheck,
  ShieldOff,
} from 'lucide-react';
import { useStudioFeatureFlag } from '../../../hooks/studio';
import { ContractSpecFeatureFlags } from '@lssm/lib.progressive-delivery/feature-flags';

export interface DeploymentHistoryItem {
  id: string;
  environment: 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';
  status: 'PENDING' | 'DEPLOYING' | 'DEPLOYED' | 'FAILED' | 'ROLLED_BACK';
  version?: string;
  url?: string | null;
  deployedAt?: string | null;
}

export interface DeploymentPanelProps {
  projectId: string;
  deployments: DeploymentHistoryItem[];
  onDeploy?: (
    environment: DeploymentHistoryItem['environment']
  ) => Promise<void> | void;
  onRollback?: (deploymentId: string) => Promise<void> | void;
  isDeploying?: boolean;
  selectedEnvironment?: DeploymentHistoryItem['environment'];
  onEnvironmentChange?: (
    environment: DeploymentHistoryItem['environment']
  ) => void;
}

const ENVIRONMENTS: DeploymentHistoryItem['environment'][] = [
  'DEVELOPMENT',
  'STAGING',
  'PRODUCTION',
];

const statusTone: Record<
  DeploymentHistoryItem['status'],
  'info' | 'success' | 'warning' | 'danger'
> = {
  PENDING: 'info',
  DEPLOYING: 'warning',
  DEPLOYED: 'success',
  FAILED: 'danger',
  ROLLED_BACK: 'warning',
};

export function DeploymentPanel({
  deployments,
  selectedEnvironment = 'DEVELOPMENT',
  onEnvironmentChange,
  onDeploy,
  onRollback,
  isDeploying,
}: DeploymentPanelProps) {
  const [env, setEnv] = React.useState(selectedEnvironment);
  const dedicatedDeploymentsEnabled = useStudioFeatureFlag(
    ContractSpecFeatureFlags.STUDIO_DEDICATED_DEPLOYMENT
  );
  const allowedEnvironments = React.useMemo(() => {
    if (dedicatedDeploymentsEnabled) {
      return ENVIRONMENTS;
    }
    return ENVIRONMENTS.filter((environment) => environment !== 'PRODUCTION');
  }, [dedicatedDeploymentsEnabled]);

  React.useEffect(() => {
    setEnv(selectedEnvironment);
  }, [selectedEnvironment]);

  React.useEffect(() => {
    if (!allowedEnvironments.includes(env)) {
      const fallback = allowedEnvironments[0] ?? 'DEVELOPMENT';
      setEnv(fallback);
      onEnvironmentChange?.(fallback);
    }
  }, [allowedEnvironments, env, onEnvironmentChange]);

  const handleDeploy = () => {
    onDeploy?.(env);
  };

  const filtered = deployments.filter(
    (deployment) => deployment.environment === env
  );

  const latest = filtered[0];

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-lg font-semibold">Deployments</p>
          <p className="text-muted-foreground text-sm">
            Track deployment status across shared and dedicated environments.
          </p>
        </div>
        <Globe className="text-muted-foreground h-5 w-5" />
      </header>
      <div className="flex flex-wrap items-center gap-2">
        <select
          className="border-border rounded-md border bg-background px-3 py-2 text-sm"
          value={env}
          onChange={(event) => {
            const nextEnv =
              event.target.value as DeploymentHistoryItem['environment'];
            setEnv(nextEnv);
            onEnvironmentChange?.(nextEnv);
          }}
        >
          {allowedEnvironments.map((environment) => (
            <option key={environment} value={environment}>
              {environment.charAt(0) + environment.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn-primary inline-flex items-center gap-2 text-sm"
          onClick={handleDeploy}
          disabled={isDeploying}
        >
          <RefreshCcw className="h-4 w-4" />
          Deploy to {env.toLowerCase()}
        </button>
      </div>
      {!dedicatedDeploymentsEnabled && (
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <ShieldOff className="h-3.5 w-3.5" />
          Dedicated production deploys unlock once STUDIO_DEDICATED_DEPLOYMENT
          is enabled for your org.
        </div>
      )}
      {latest ? (
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide">
                Latest status
              </p>
              <p className="text-muted-foreground text-xs">
                Version {latest.version ?? '—'}
              </p>
            </div>
            <StatusBadge status={latest.status} />
          </div>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">URL</dt>
              <dd className="font-medium">{latest.url ?? 'Pending'}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Updated</dt>
              <dd className="font-medium">
                {latest.deployedAt
                  ? new Date(latest.deployedAt).toLocaleString()
                  : '—'}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <div className="text-muted-foreground rounded-xl border border-dashed border-border p-6 text-center text-sm">
          No deployments yet for {env.toLowerCase()}.
        </div>
      )}
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide">
          Deployment history
        </p>
        <div className="divide-border divide-y rounded-xl border border-border bg-background">
          {filtered.slice(0, 5).map((deployment) => (
            <div
              key={deployment.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{deployment.version ?? 'Unknown'}</p>
                <p className="text-muted-foreground text-xs">
                  {deployment.deployedAt
                    ? new Date(deployment.deployedAt).toLocaleString()
                    : 'Pending'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={deployment.status} />
                {deployment.status === 'DEPLOYED' && (
                  <button
                    type="button"
                    className="btn-ghost inline-flex items-center gap-1 text-xs"
                    onClick={() => onRollback?.(deployment.id)}
                  >
                    <RotateCcw className="h-3 w-3" />
                    Rollback
                  </button>
                )}
              </div>
            </div>
          ))}
          {!filtered.length && (
            <div className="text-muted-foreground px-4 py-6 text-center text-sm">
              Deploy once to populate history.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: DeploymentHistoryItem['status'];
}) {
  const tone = statusTone[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
        tone === 'success'
          ? 'bg-emerald-500/10 text-emerald-500'
          : tone === 'danger'
          ? 'bg-red-500/10 text-red-500'
          : tone === 'warning'
          ? 'bg-amber-500/10 text-amber-500'
          : 'bg-blue-500/10 text-blue-500'
      }`}
    >
      <ShieldCheck className="h-3 w-3" />
      {status}
    </span>
  );
}

