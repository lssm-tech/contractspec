import type { DocBlock } from '@lssm/lib.contracts/docs';

export const opsRunbookDocsB: DocBlock[] = [
  {
    id: 'docs.ops.profile-settings.goal',
    title: 'Profile settings goal',
    summary: 'Keep identity/profile flows reliable and debuggable.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/ops/profile-settings/goal',
    tags: ['ops', 'auth'],
    body: 'Ensure profile linking/unlinking stays stable across FC+ and SMS flows, with clear monitoring and quick recovery steps.',
  },
  {
    id: 'docs.ops.profile-settings.usage',
    title: 'Profile settings usage guide',
    summary: 'Quick checklist for profile settings operations.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/ops/profile-settings/usage',
    tags: ['ops', 'auth'],
    body: `- Verify Better Auth config in \`src/lib/auth.ts\`; JWKS for FC+.
- Monitor Sentry spans \`profile.*\`; PostHog events connection_linked/unlinked.
- On unlink failures: check \`/api/auth/connections/unlink\` logs.
- FC+ issues: validate discovery URL and partner redirects.
- OTP throttling: confirm SMS service rate limiter is active.`,
  },
  {
    id: 'docs.ops.profile-settings.how',
    title: 'Profile settings runbook',
    summary: 'Detailed runbook for profile/settings operations.',
    kind: 'how',
    visibility: 'public',
    route: '/docs/ops/profile-settings/how',
    tags: ['ops', 'auth'],
    body: `## Runbook – Profile Settings

### Feature flags / Env

- Better Auth configured in \`src/lib/auth.ts\`
- FC+ envs and JWKS exposed (see specs_france_connect_plus.md)

### Monitoring

- Sentry spans: profile.* ops
- PostHog events: connection_linked / connection_unlinked

### Troubleshooting

- Unlink failures → check \`/api/auth/connections/unlink\` logs
- FC+ link issues → verify discovery URL and partner console redirects
- Phone OTP rate limit → server-side limiter in SMS service`,
  },
  {
    id: 'docs.ops.progressive-delivery.goal',
    title: 'Progressive delivery goal',
    summary: 'Roll out safely with fast rollback and clear guardrails.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/ops/progressive-delivery/goal',
    tags: ['ops', 'delivery'],
    body: 'Use canary/blue-green with metrics guardrails so deployments can be halted or rolled back before customer impact.',
  },
  {
    id: 'docs.ops.progressive-delivery.usage',
    title: 'Progressive delivery usage guide',
    summary: 'Quick checklist for canary/blue-green runs.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/ops/progressive-delivery/usage',
    tags: ['ops', 'delivery'],
    body: `- Register \`DeploymentStrategy\`; wire telemetry via observability middleware.
- Define rollback actions (flag toggle/spec revert/infrastructure swap) in \`RollbackManager\`.
- Use canary thresholds (err 1%, P99 500ms) or stricter per domain.
- Pipe stage events to Ops Slack + Ops Console timeline.
- For blue-green, run smoke tests before swap; freeze old env 24h post-swap.`,
  },
  {
    id: 'docs.ops.progressive-delivery.how',
    title: 'Progressive delivery runbook',
    summary: 'Step-by-step for canary and blue-green rollouts.',
    kind: 'how',
    visibility: 'public',
    route: '/docs/ops/progressive-delivery/how',
    tags: ['ops', 'delivery'],
    body: `# Progressive Delivery Runbook

**Scope**: Contracts runtime deployments running on ContractSpec infrastructure.

## 1. Prerequisites
- Register a \`DeploymentStrategy\` via \`@lssm/lib.progressive-delivery\`.
- Ensure adapters emit telemetry through \`@lssm/lib.observability\` (HTTP middleware + custom metrics).
- Define rollback actions (feature flag toggle, spec revert, infrastructure switch) and wire them to \`RollbackManager\`.

## 2. Standard Canary
\`\`\`ts
const strategy: DeploymentStrategy = {
  target: { name: 'billing.createInvoice', version: 7 },
  mode: 'canary',
  thresholds: {
    errorRate: 0.01,
    latencyP99: 500,
    latencyP95: 250,
  },
};
\`\`\`

1. Run \`DeploymentCoordinator.run()\` from CLI or CI job.
2. Watch emitted events (\`stage_started\`, \`stage_passed\`, \`stage_failed\`). Pipe them to Ops Slack and the Ops Console timeline.
3. On failure the coordinator triggers \`RollbackManager.execute\` automatically; the runbook owner only validates post-rollback metrics.

## 3. Blue-Green Swap
- Use mode \`blue-green\` with two stages: \`0%\` warmup and \`100%\` swap.
- Attach smoke tests to \`stage_started\` events before sending any traffic.
- After \`blue_green_swapped\`, freeze the old environment for 24h before decommissioning.

## 4. Guardrails
- Default thresholds: error rate 1%, P99 500ms, throughput drop 40%.
- Add custom evaluator for domain-specific metrics:
\`\`\`ts
thresholds: {
  errorRate: 0.005,
  customEvaluator: (metrics) => metrics.throughput > 200,
}
\`\`\`

## 5. Incident Hooks
- \`Deployment\`, \`DeploymentStage\`, and \`RollbackEvent\` tables store the full history.
- Tag rollbacks with incident ID to keep Ops Console synchronized.
- Auto-resolve the incident once \`status === 'completed'\` and SLO burn rate returns < 2x.`,
  },
];






