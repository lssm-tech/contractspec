import type {
  HarnessAssertionResult,
  HarnessRunRecord,
} from "@contractspec/lib.contracts-spec";
import type { HarnessStoredArtifact } from "../types";

export interface HarnessReplayBundle {
  version: "1";
  createdAt: string;
  run: HarnessRunRecord;
  assertions: HarnessAssertionResult[];
  artifacts: Array<Omit<HarnessStoredArtifact, "body">>;
}

export function createHarnessReplayBundle(input: {
  run: HarnessRunRecord;
  assertions: HarnessAssertionResult[];
  artifacts: HarnessStoredArtifact[];
  now?: () => Date;
}): HarnessReplayBundle {
  return {
    version: "1",
    createdAt: (input.now?.() ?? new Date()).toISOString(),
    run: input.run,
    assertions: input.assertions,
    artifacts: input.artifacts.map(({ body: _body, ...artifact }) => artifact),
  };
}

export function summarizeHarnessReplayBundle(bundle: HarnessReplayBundle) {
  return {
    runId: bundle.run.runId,
    status: bundle.run.status,
    stepCount: bundle.run.steps.length,
    artifactCount: bundle.artifacts.length,
    failedAssertions: bundle.assertions.filter(
      (assertion) => assertion.status === "failed",
    ).length,
  };
}
