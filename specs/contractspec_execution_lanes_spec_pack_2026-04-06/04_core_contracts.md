# 04 Core Contracts

## Goal

This file defines the canonical shapes the package should own.
The names are suggestions, not sacred scripture.

## Top-level concepts

### `ExecutionLaneSpec`
Describes one lane:
- purpose
- entry criteria
- exit criteria
- compatible roles
- allowed transitions
- required artifacts
- evidence policy
- backend capabilities

### `ExecutionPlanPack`
The structured handoff artifact produced by the planning lane.

### `CompletionLoopSpec`
The persistent single-owner loop for verified closure.

### `TeamRunSpec`
The durable coordinated multi-worker runtime spec.

### `RoleProfile`
The declared shape of a specialized agent role.

### `VerificationPolicy`
The evidence and approval requirements before success.

### `LaneRunState`
Persisted runtime state for any lane instance.

## Recommended TypeScript shapes

```ts
export type LaneKey =
  | "clarify"
  | "plan.consensus"
  | "complete.persistent"
  | "team.coordinated";

export interface ExecutionLaneSpec {
  key: LaneKey;
  description: string;
  entryCriteria: string[];
  exitCriteria: string[];
  allowedTransitions: LaneKey[];
  compatibleRoles: string[];
  requiredArtifacts: string[];
  verificationPolicy: VerificationPolicyRef;
  capabilities: {
    parallelism: "none" | "bounded" | "durable";
    persistence: "ephemeral" | "checkpointed" | "durable";
    approvals: boolean;
    mailbox: boolean;
    taskLeasing: boolean;
  };
}

export interface ExecutionPlanPack {
  meta: {
    id: string;
    createdAt: string;
    sourceRequest: string;
    scopeClass: "small" | "medium" | "large" | "high-risk";
  };
  objective: string;
  constraints: string[];
  assumptions: string[];
  nonGoals: string[];
  tradeoffs: Array<{
    topic: string;
    tension: string;
    chosenDirection: string;
    rejectedAlternatives: string[];
  }>;
  staffing: {
    availableRoleProfiles: string[];
    recommendedLanes: Array<{
      lane: LaneKey;
      why: string;
    }>;
    handoffRecommendation: {
      nextLane: LaneKey;
      launchHints: string[];
    };
  };
  planSteps: Array<{
    id: string;
    title: string;
    description: string;
    acceptanceCriteria: string[];
    dependencies?: string[];
  }>;
  verification: {
    requiredEvidence: string[];
    requiredApprovals: string[];
    blockingRisks: string[];
  };
  authorityContext: {
    policyRefs: string[];
    ruleContextRefs: string[];
  };
}

export interface RoleProfile {
  key: string;
  description: string;
  routingRole: "leader" | "specialist" | "executor" | "reviewer";
  posture: "orchestrator" | "critic" | "builder" | "verifier" | "researcher";
  allowedTools: Array<"read" | "analyze" | "execute" | "network" | "review">;
  writeScope: "none" | "artifacts-only" | "workspace" | "scoped-worktree";
  laneCompatibility: LaneKey[];
  evidenceObligations: string[];
  escalationTriggers: string[];
  modelProfileHint?: string;
}

export interface CompletionLoopSpec {
  id: string;
  ownerRole: string;
  sourcePlanPackId?: string;
  snapshotRef: string;
  iterationLimit?: number;
  delegateRoles: string[];
  progressLedgerRef: string;
  verificationPolicy: VerificationPolicyRef;
  signoff: {
    verifierRole: string;
    requireArchitectReview: boolean;
    requireHumanApproval?: boolean;
  };
  terminalConditions: Array<"done" | "blocked" | "failed" | "aborted">;
}

export interface TeamRunSpec {
  id: string;
  sourcePlanPackId?: string;
  objective: string;
  workers: Array<{
    workerId: string;
    roleProfile: string;
    concurrencyClass: "single" | "parallel";
    worktreeMode?: "shared" | "isolated";
  }>;
  backlog: Array<{
    taskId: string;
    title: string;
    description: string;
    roleHint?: string;
    dependencies?: string[];
  }>;
  coordination: {
    mailbox: boolean;
    taskLeasing: boolean;
    heartbeats: boolean;
    rebalancing: boolean;
  };
  verificationLane: {
    required: boolean;
    ownerRole: string;
  };
  shutdownPolicy: {
    requireTerminalTasks: boolean;
    requireEvidenceGate: boolean;
  };
}

export interface VerificationPolicy {
  key: string;
  requiredEvidence: string[];
  minimumApprovals: Array<{
    role: string;
    verdict: "approve" | "acknowledge";
  }>;
  failOnMissingEvidence: boolean;
  allowConditionalCompletion: boolean;
}
```

## Persistence model

Every lane run should persist:

- `laneRun.json`
- `state.json`
- `events.ndjson`
- `artifacts.json`
- `evidence.json`
- `approvals.json`

The storage backend can vary.
The shape should not.

## Important modeling choice

`ExecutionPlanPack` must be rich enough that either:
- a completion loop, or
- a team run

can start from it without guessing what the planner meant.

If the runtime must reconstruct the plan from markdown prose, the contract is too weak.
