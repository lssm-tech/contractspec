import type { TeamRunSpec } from "../package-skeleton/src/types";

export const OAuthTeamRun: TeamRunSpec = {
  id: "teamrun_oauth_001",
  sourcePlanPackId: "planpack_auth_migration_001",
  objective: "Ship org-scoped OAuth with evidence-backed rollback safety",
  workers: [
    { workerId: "lead_1", roleProfile: "planner", concurrencyClass: "single" },
    { workerId: "build_1", roleProfile: "executor", concurrencyClass: "parallel", worktreeMode: "isolated" },
    { workerId: "build_2", roleProfile: "executor", concurrencyClass: "parallel", worktreeMode: "isolated" },
    { workerId: "verify_1", roleProfile: "test-engineer", concurrencyClass: "single" },
    { workerId: "security_1", roleProfile: "security-reviewer", concurrencyClass: "single" }
  ],
  backlog: [
    {
      taskId: "task_map_boundaries",
      title: "Map auth boundaries",
      description: "Inspect current auth service, session issuance, and rollback points.",
      roleHint: "planner"
    },
    {
      taskId: "task_provider_flag",
      title: "Implement flagged provider path",
      description: "Add provider integration behind org-scoped feature flag.",
      roleHint: "executor",
      dependencies: ["task_map_boundaries"]
    },
    {
      taskId: "task_regression",
      title: "Add integration and rollback coverage",
      description: "Run integration, regression, and rollback checks.",
      roleHint: "test-engineer",
      dependencies: ["task_provider_flag"]
    }
  ],
  coordination: {
    mailbox: true,
    taskLeasing: true,
    heartbeats: true,
    rebalancing: true
  },
  verificationLane: {
    required: true,
    ownerRole: "verifier"
  },
  shutdownPolicy: {
    requireTerminalTasks: true,
    requireEvidenceGate: true
  }
};
