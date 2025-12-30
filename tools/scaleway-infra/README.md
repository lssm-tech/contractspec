# Scaleway Infrastructure as Code

Infrastructure-as-code tool for managing Scaleway resources following the specifications in `packages/contractspec/docs/INFRATRUCTURE.MD`.

## Overview

This tool provides both CLI and programmatic interfaces for managing Scaleway infrastructure resources including:

- Networking (VPC, Private Networks, Public Gateways, Security Groups)
- Compute (Instances)
- Managed Services (PostgreSQL, Redis)
- Storage (Object Storage buckets)
- Queues (SQS-compatible)
- Load Balancers
- DNS zones and records

## Prerequisites

- Bun runtime
- Scaleway account with API credentials
- Environment variables configured (see Configuration)

## Installation

```bash
cd packages/tools/scaleway-infra
bun install
bun run build
```

## Configuration

### Environment Variables

Required environment variables:

```bash
SCALEWAY_ACCESS_KEY=your_access_key
SCALEWAY_SECRET_KEY=your_secret_key
SCALEWAY_PROJECT_ID=your_project_id
```

Optional:

```bash
INFRA_ENV=prd  # or 'stg' (defaults to 'prd')
VERCEL_TOKEN=your_vercel_token  # For Vercel integration
VERCEL_TEAM_ID=your_team_id  # Optional, if using team account
```

### GitHub Secrets

For CI/CD, configure these secrets in GitHub:

- `SCALEWAY_ACCESS_KEY`
- `SCALEWAY_SECRET_KEY`
- `SCALEWAY_PROJECT_ID`
- `SCALEWAY_SSH_PRIVATE_KEY` (for service deployment)
- `SCALEWAY_HOST` (backend instance hostname/IP)
- `SCALEWAY_USER` (SSH user, typically 'root' or 'lssm')

## Usage

### CLI Commands

#### Plan (Dry-run)

Show what changes would be made without applying them:

```bash
bun run plan [--env prd]
```

#### Apply

Apply infrastructure changes:

```bash
bun run apply [--env prd] [--auto-approve]
```

#### Destroy

Destroy infrastructure (requires `--auto-approve`):

```bash
bun run destroy [--env prd] [--auto-approve]
```

#### Status

Show current infrastructure status:

```bash
bun run status [--env prd]
```

### Programmatic Usage

```typescript
import { plan, apply, status } from '@contractspec/tool.scaleway-infra';

// Plan changes
const planResult = await plan('prd');
console.log(planResult);

// Apply changes
const applyResult = await apply('prd', true);
console.log(applyResult);

// Check status
const statusResult = await status('prd');
console.log(statusResult);
```

## Infrastructure Resources

### Networking

- **VPC**: `vpc-lssm-{env}`
- **Private Network**: `pn-lssm-{env}-core`
- **Public Gateway**: `pgw-lssm-{env}-core`
- **Security Groups**:
  - `sg-lssm-{env}-backend` (allows port 3000)
  - `sg-lssm-{env}-db` (allows port 5432 from backend)
  - `sg-lssm-{env}-redis` (allows port 6379 from backend)

### Compute

- **Instances**: `lssm-{env}-core-{index}` (DEV1-M, Debian 12)
- User data script configures:
  - Hostname
  - Bun installation
  - Systemd services (`lssm-api`, `lssm-worker`)

### Database

- **PostgreSQL Instance**: `pg-lssm-{env}`
- **Databases**: `contractspec_engine`, `equitya`, `artisanos`
- Tier: PICO (configurable)

### Cache

- **Redis Instance**: `redis-lssm-{env}`
- Node type: DEV1-M (2 vCPU / 2 GB)

### Storage

- **Buckets**:
  - `lssm-{env}-core`
  - `equitya-{env}-files`
  - `artisanos-{env}-files`

### Queues

- **Queues**:
  - `lssm-{env}-jobs`
  - `equitya-{env}-jobs`
  - `artisanos-{env}-jobs`
- Dead letter queues: `{queue-name}-dlq`

### Load Balancer

- **Load Balancer**: `lb-lssm-{env}`
- Frontends: HTTP (80), HTTPS (443)
- Backend: Port 3000
- Health check: `/healthz` (15s interval, 3 failures)
- Sticky sessions: Enabled

### DNS

- **Zones**: `lssm.tech`, `lssm.world`, `lssm.community`, `lssm.cash`
- **Records**: `api.lssm.tech` → Load Balancer IP

## CI/CD Integration

### Infrastructure Updates

The `.github/workflows/infra-scaleway.yml` workflow:

- Triggers on changes to infrastructure code
- Runs `plan` to show changes
- Runs `apply` on main branch or manual trigger

### Service Deployment

The `.github/workflows/deploy-services.yml` workflow:

- Triggers on changes to application code
- Builds the backend
- Deploys to Scaleway instance via SSH
- Runs migrations
- Restarts systemd services

## Development

### Project Structure

```
scaleway-infra/
├── bin/
│   └── deploy.ts          # CLI entry point
├── src/
│   ├── config/            # Configuration and types
│   ├── clients/           # Scaleway client initialization
│   ├── commands/          # CLI commands (plan, apply, destroy, status)
│   ├── stacks/            # Infrastructure stacks
│   └── utils/             # Utilities (naming, tags)
└── .github/workflows/     # CI/CD workflows
```

### Adding New Resources

1. Create a new stack in `src/stacks/`
2. Implement `plan()` and `apply()` methods
3. Add to main orchestration in `commands/apply.ts`
4. Update `commands/plan.ts` and `commands/status.ts`

## Troubleshooting

### Authentication Errors

Ensure environment variables are set correctly:

```bash
echo $SCALEWAY_ACCESS_KEY
echo $SCALEWAY_SECRET_KEY
echo $SCALEWAY_PROJECT_ID
```

### Resource Not Found

Some resources may need to be created in order. Check the plan output to see dependencies.

### API Rate Limits

Scaleway API has rate limits. If you encounter rate limit errors, wait a few minutes and retry.

### SDK API Adjustments

The Scaleway SDK API structure may differ from what's implemented. The actual SDK method names and parameters may need adjustment based on the official `@scaleway/sdk` documentation. When testing, verify:

- Client initialization method
- API method names (e.g., `listVPCs` vs `listVpcs`)
- Request/response parameter structures
- Error handling patterns

Refer to the [Scaleway JS SDK documentation](https://www.scaleway.com/en/docs/scaleway-sdk/js-sdk/) for the latest API reference.

## References

- [Scaleway SDK Documentation](https://github.com/scaleway/scaleway-sdk-js)
- [Infrastructure Documentation](../../../docs/INFRATRUCTURE.MD)

