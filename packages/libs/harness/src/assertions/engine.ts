import { deepStrictEqual } from "node:assert";
import type {
  HarnessAssertionResult,
  HarnessScenarioSpec,
} from "@contractspec/lib.contracts-spec";
import type { HarnessRecordedStep, HarnessStoredArtifact } from "../types";

function countMatches(
  assertion: HarnessScenarioSpec["assertions"][number],
  steps: HarnessRecordedStep[],
  artifacts: HarnessStoredArtifact[],
) {
  if (assertion.source == null) return artifacts.length;
  return (
    artifacts.filter((artifact) => artifact.kind === assertion.source).length ||
    steps.filter((step) => step.stepKey === assertion.source).length
  );
}

function matchText(
  assertion: HarnessScenarioSpec["assertions"][number],
  steps: HarnessRecordedStep[],
  artifacts: HarnessStoredArtifact[],
) {
  const needle = String(assertion.match ?? "");
  const candidates = [
    ...steps
      .filter((step) => assertion.source == null || step.stepKey === assertion.source)
      .map((step) => step.summary ?? ""),
    ...artifacts
      .filter(
        (artifact) => assertion.source == null || artifact.kind === assertion.source,
      )
      .map((artifact) => artifact.summary ?? ""),
  ];
  return candidates.some((value) => value.includes(needle));
}

function matchJson(
  assertion: HarnessScenarioSpec["assertions"][number],
  steps: HarnessRecordedStep[],
) {
  const target = steps.find((step) => step.stepKey === assertion.source);
  try {
    deepStrictEqual(target?.metadata?.output, assertion.match);
    return true;
  } catch {
    return false;
  }
}

export function evaluateHarnessAssertions(input: {
  scenario: HarnessScenarioSpec;
  steps: HarnessRecordedStep[];
  artifacts: HarnessStoredArtifact[];
}): HarnessAssertionResult[] {
  return input.scenario.assertions.map((assertion) => {
    switch (assertion.type) {
      case "artifact": {
        const artifacts = input.artifacts.filter(
          (artifact) =>
            assertion.source == null || artifact.kind === assertion.source,
        );
        return {
          assertionKey: assertion.key,
          status: artifacts.length > 0 ? "passed" : "failed",
          message:
            artifacts.length > 0 ? undefined : "No matching artifact was captured.",
          evidenceArtifactIds: artifacts.map((artifact) => artifact.artifactId),
        };
      }
      case "step-status": {
        const step = input.steps.find((candidate) => candidate.stepKey === assertion.source);
        const passed = step?.status === assertion.match;
        return {
          assertionKey: assertion.key,
          status: passed ? "passed" : "failed",
          message: passed
            ? undefined
            : `Step status ${step?.status ?? "missing"} did not match ${String(assertion.match)}.`,
        };
      }
      case "text-match": {
        const passed = matchText(assertion, input.steps, input.artifacts);
        return {
          assertionKey: assertion.key,
          status: passed ? "passed" : "failed",
          message: passed ? undefined : "Expected text was not found in step or artifact summaries.",
        };
      }
      case "json-match": {
        const passed = matchJson(assertion, input.steps);
        return {
          assertionKey: assertion.key,
          status: passed ? "passed" : "failed",
          message: passed ? undefined : "Structured output did not match the assertion payload.",
        };
      }
      case "count": {
        const count = countMatches(assertion, input.steps, input.artifacts);
        const passed =
          (assertion.min == null || count >= assertion.min) &&
          (assertion.max == null || count <= assertion.max) &&
          (typeof assertion.match !== "number" || count === assertion.match);
        return {
          assertionKey: assertion.key,
          status: passed ? "passed" : "failed",
          message: passed ? undefined : `Observed count ${count} did not satisfy the assertion.`,
        };
      }
      default:
        return {
          assertionKey: assertion.key,
          status: "failed",
          message: `Unsupported assertion type ${assertion.type}.`,
        };
    }
  });
}
