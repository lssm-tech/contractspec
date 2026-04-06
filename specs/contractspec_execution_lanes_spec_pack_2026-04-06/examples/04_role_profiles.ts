import type { RoleProfile } from "../package-skeleton/src/types";

export const PlannerRole: RoleProfile = {
  key: "planner",
  description: "Task decomposition, execution planning, risk flags",
  routingRole: "leader",
  posture: "orchestrator",
  allowedTools: ["read", "analyze", "review"],
  writeScope: "artifacts-only",
  laneCompatibility: ["clarify", "plan.consensus"],
  evidenceObligations: ["plan-pack", "acceptance-criteria", "tradeoff-record"],
  escalationTriggers: ["scope-conflict", "missing-context", "policy-uncertainty"],
  modelProfileHint: "balanced"
};

export const ArchitectRole: RoleProfile = {
  key: "architect",
  description: "System design, interfaces, tradeoffs, antithesis",
  routingRole: "reviewer",
  posture: "critic",
  allowedTools: ["read", "analyze", "review"],
  writeScope: "none",
  laneCompatibility: ["plan.consensus", "complete.persistent"],
  evidenceObligations: ["architecture-review", "tradeoff-analysis"],
  escalationTriggers: ["unsafe-boundary", "unresolved-risk"],
  modelProfileHint: "quality"
};

export const ExecutorRole: RoleProfile = {
  key: "executor",
  description: "Implementation and bounded remediation",
  routingRole: "executor",
  posture: "builder",
  allowedTools: ["read", "analyze", "execute"],
  writeScope: "workspace",
  laneCompatibility: ["complete.persistent", "team.coordinated"],
  evidenceObligations: ["implementation-diff", "run-output"],
  escalationTriggers: ["tool-failure", "policy-blocked", "approval-needed"],
  modelProfileHint: "balanced"
};

export const VerifierRole: RoleProfile = {
  key: "verifier",
  description: "Completion evidence gate and claim validation",
  routingRole: "reviewer",
  posture: "verifier",
  allowedTools: ["read", "analyze", "review"],
  writeScope: "artifacts-only",
  laneCompatibility: ["complete.persistent", "team.coordinated"],
  evidenceObligations: ["verification-verdict", "evidence-bundle-ref"],
  escalationTriggers: ["missing-evidence", "failing-evidence", "approval-denied"],
  modelProfileHint: "quality"
};
