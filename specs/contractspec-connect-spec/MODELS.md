# Models and Artifacts

## 1. `.contractsrc.json > connect`

Connect configuration is part of workspace config.

### Required capabilities

- adapter enablement
- local artifact storage paths
- protected, immutable, and generated paths
- review thresholds
- command allow, review, and deny policy
- Bun-first smoke checks
- canon pack refs
- optional Studio bridge config, including endpoint and queue selection

### Not for this section

- canonical contract definitions
- runtime trace records
- ad hoc per-task overrides stored as source of truth

## 2. `context-pack.json`

Task-scoped projection of trusted context.

### Required fields

- repo id and branch
- actor id, type, session id, and trace id when available
- knowledge entries with category and trust level
- impacted contract refs
- affected surfaces
- policy bindings
- config refs back to authoritative sources
- acceptance checks

## 3. `plan-packet.json`

Structured plan projection.

### Required fields

- objective and steps
- touched paths and command candidates
- impacted contract refs
- required checks
- required approvals
- risk score
- verification status
- optional runtime-linked control-plane decision id and trace id when available
- explicit refs to:
  - `controlPlane.intent.submit`
  - `controlPlane.plan.compile`
  - `controlPlane.plan.verify`

## 4. `patch-verdict.json`

Adapter-facing result for one mutation candidate.

### Required fields

- decision id
- action type and underlying ACP tool ref
- impacted files, contracts, surfaces, and policies
- check results
- Connect verdict
- mapped control-plane verdict
- approval requirement
- optional runtime-linked decision id and approval status
- replay refs

## 5. `review-packet.json`

Escalation artifact for local or later Studio review.

### Required fields

- source decision id
- objective and review reason
- summary of paths, impacted contracts, and checks
- immutable evidence refs under `.contractspec/connect/decisions/<decisionId>/`
- required approvals
- trace and policy explanation refs plus optional runtime-linked decision id
- optional Studio queue metadata when review-bridge transport is enabled

## 6. `audit.ndjson`

Append-only local evidence stream.

### Required fields

- timestamp
- event type
- decision id when applicable
- actor
- adapter
- repo id
- refs to related artifacts

## Verdict mapping table

| Connect verdict | Underlying runtime state |
| --- | --- |
| `permit` | non-blocked path, usually autonomous or already-approved |
| `rewrite` | current proposal unsafe, but bounded remediation may still proceed |
| `require_review` | assist-mode or explicit approval-backed continuation required |
| `deny` | blocked or policy-denied path |

## Example TypeScript interfaces

```ts
export type ConnectVerdict = 'permit' | 'rewrite' | 'require_review' | 'deny';

export interface ConnectActorRef {
  id: string;
  type: 'human' | 'agent' | 'service' | 'tool';
  sessionId?: string;
  traceId?: string;
}

export interface ConnectContractRef {
  key: string;
  version: string;
  kind?: 'command' | 'query' | 'event' | 'policy' | 'capability';
}

export interface ContextPack {
  id: string;
  taskId: string;
  repoId: string;
  branch: string;
  actor: ConnectActorRef;
  knowledge: Array<{
    spaceKey: string;
    category: 'canonical' | 'operational' | 'external' | 'ephemeral';
    trustLevel: 'high' | 'medium' | 'low';
    source: string;
    digest?: string;
  }>;
  impactedContracts: ConnectContractRef[];
  affectedSurfaces: Array<'agent' | 'audit' | 'cli' | 'contract' | 'harness' | 'knowledge' | 'mcp' | 'runtime'>;
  policyBindings: Array<{
    key: string;
    version: string;
    source: 'contract' | 'canon-pack' | 'workspace-config';
    authority: 'canonical' | 'operational';
  }>;
  configRefs: Array<{
    kind: 'contractsrc' | 'artifact' | 'canon-pack';
    ref: string;
  }>;
  acceptanceChecks: string[];
}

export interface PlanPacket {
  id: string;
  taskId: string;
  repoId: string;
  branch: string;
  actor: ConnectActorRef;
  objective: string;
  steps: Array<{
    id: string;
    summary: string;
    paths?: string[];
    commands?: string[];
    contractRefs?: string[];
  }>;
  impactedContracts: ConnectContractRef[];
  affectedSurfaces: string[];
  requiredChecks: string[];
  requiredApprovals: Array<{ capability: string; reason: string }>;
  riskScore: number;
  verificationStatus: 'approved' | 'revise' | 'review' | 'denied';
  controlPlane: {
    intentSubmit: ConnectContractRef;
    planCompile: ConnectContractRef;
    planVerify: ConnectContractRef;
    decisionId?: string;
    traceId?: string;
  };
  acpActions?: Array<'acp.fs.access' | 'acp.terminal.exec' | 'acp.tool.calls'>;
}

export interface PatchVerdict {
  decisionId: string;
  summary?: string;
  action: {
    actionType: 'write_file' | 'edit_file' | 'run_command';
    tool: 'acp.fs.access' | 'acp.terminal.exec' | 'acp.tool.calls';
    target?: string;
    cwd?: string;
  };
  impacted: Array<{
    file: string;
    contracts: ConnectContractRef[];
    surfaces: string[];
    policies: ConnectContractRef[];
  }>;
  checks: Array<{ id: string; status: 'pass' | 'fail' | 'warn'; detail: string }>;
  verdict: ConnectVerdict;
  controlPlane: {
    verdict: 'autonomous' | 'assist' | 'blocked';
    requiresApproval: boolean;
    policyRef?: ConnectContractRef;
    decisionId?: string;
    approvalStatus?: 'not_required' | 'pending' | 'approved' | 'rejected' | 'expired';
    traceId?: string;
  };
  approvalOperationRefs?: string[];
  remediation?: string[];
  reviewPacketRef?: string;
  retryBudget?: number;
  replay: {
    traceQuery: ConnectContractRef;
    policyExplain?: ConnectContractRef;
  };
}
```
