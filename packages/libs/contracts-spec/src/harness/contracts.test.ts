import { describe, expect, it } from "bun:test";
import { CapabilityRegistry } from "../capabilities";
import { EventRegistry } from "../events";
import { OperationSpecRegistry } from "../operations/registry";
import {
  HarnessEvaluationCapability,
  HarnessEvidenceCapturedEvent,
  HarnessRunStartCommand,
  HarnessTargetResolveQuery,
  HarnessTargetingCapability,
  registerHarnessCapabilities,
  registerHarnessEvents,
  registerHarnessOperations,
} from "./index";

describe("harness contracts", () => {
  it("registers operations for targeting, runs, evidence, and evaluation", () => {
    const registry = registerHarnessOperations(new OperationSpecRegistry());

    expect(registry.get("harness.target.resolve", "1.0.0")).toBe(
      HarnessTargetResolveQuery,
    );
    expect(registry.get("harness.run.start", "1.0.0")).toBe(
      HarnessRunStartCommand,
    );
    expect(registry.get("harness.evaluation.get", "1.0.0")).toBeDefined();
  });

  it("registers harness lifecycle and evidence events", () => {
    const registry = registerHarnessEvents(new EventRegistry());

    expect(registry.get("harness.run.started", "1.0.0")).toBeDefined();
    expect(registry.get("harness.evidence.captured", "1.0.0")).toBe(
      HarnessEvidenceCapturedEvent,
    );
  });

  it("registers harness capabilities with expected surfaces", () => {
    const registry = registerHarnessCapabilities(new CapabilityRegistry());

    expect(registry.get("harness.targeting", "1.0.0")).toBe(
      HarnessTargetingCapability,
    );
    expect(registry.get("harness.evaluation", "1.0.0")).toBe(
      HarnessEvaluationCapability,
    );
    expect(
      registry.getOperationsFor("harness.evaluation", "1.0.0"),
    ).toContain("harness.evaluation.run");
  });
});
