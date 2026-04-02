# Models and Artifacts

## 1. `connect.config.ts`

Core installation and runtime behavior.

### Suggested shape

- adapters
- repo id and branch rules
- local storage paths
- Studio endpoint config
- allowed and protected paths
- command policy
- review thresholds
- canon pack refs

## 2. `connect.overlay.ts`

Repo-local conventions that are below canonical policy but above ephemeral task hints.

### Suitable contents

- code style preferences
- allowed test shortcuts
- repo-specific generated directories
- path ownership hints
- preferred smoke test commands

### Unsuitable contents

- business invariants
- API compatibility rules
- customer policy
- access control truth

## 3. `impact-index.json`

Fast lookup map for path and contract impact.

### Fields

- repository id
- generation timestamp
- files
- contracts
- surfaces
- policy refs
- unknown path buckets

## 4. `context-pack.json`

Typed context for the agent or verifier.

### Fields

- id
- task id
- actor
- trust-scoped knowledge entries
- impacted contracts
- impacted surfaces
- policy bindings
- canon packs
- overlay refs
- acceptance checks

## 5. `plan-packet.json`

Plan proposal after compilation and verification.

### Fields

- id
- objective
- steps
- touched paths
- impacted contracts
- approvals
- risk score
- checks
- verification status

## 6. `patch-verdict.json`

Final result of a write, edit, or command.

### Fields

- decision id
- action type
- summary
- impacted scope
- checks
- evidence refs
- verdict
- remediation
- retry budget
- review packet ref if escalated

## 7. `audit.ndjson`

Append-only log. Each line is a structured event.

### Required fields

- timestamp
- event type
- decision id
- actor
- adapter
- repo id
- refs to related artifacts

## Example TypeScript interfaces

```ts
export type ConnectVerdict = 'permit' | 'rewrite' | 'require_review' | 'deny';

export interface ContextPackRef {
  id: string;
  trust: 'canonical' | 'operational' | 'external' | 'ephemeral';
  source: string;
  digest?: string;
}

export interface ImpactRef {
  file: string;
  contracts: string[];
  surfaces: Array<'rest' | 'graphql' | 'db' | 'ui' | 'events' | 'mcp' | 'client'>;
  policies: string[];
}

export interface PlanPacket {
  id: string;
  repoId: string;
  branch: string;
  actor: { id: string; type: 'human' | 'agent' | 'service' };
  objective: string;
  steps: Array<{ id: string; summary: string; paths?: string[]; commands?: string[] }>;
  impactedContracts: string[];
  affectedSurfaces: string[];
  requiredChecks: string[];
  requiredApprovals: string[];
  riskScore: number;
  verificationStatus: 'approved' | 'revise' | 'review' | 'denied';
}

export interface PatchVerdict {
  decisionId: string;
  actionType: 'write_file' | 'edit_file' | 'run_command';
  impacted: ImpactRef[];
  checks: Array<{ id: string; status: 'pass' | 'fail' | 'warn'; detail: string }>;
  verdict: ConnectVerdict;
  remediation?: string[];
  reviewPacketRef?: string;
  retryBudget?: number;
}
```
