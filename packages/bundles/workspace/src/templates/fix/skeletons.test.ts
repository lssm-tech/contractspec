import { expect, test, describe } from "bun:test";
import { generateSkeletonCapability } from "./skeleton-capability";
import { generateSkeletonPresentation } from "./skeleton-presentation";
import { generateSkeletonOperation } from "./skeleton-operation";
import { generateSkeletonEvent } from "./skeleton-event";
import type { SpecGenerationContext } from "../../services/fix/types";

describe("Skeleton Templates", () => {
  const ctx: SpecGenerationContext = {
    key: "test.spec",
    version: "1.0.0",
    specType: "capability",
    stability: "experimental",
    featureKey: "test-feature",
    enrichment: {
      owners: ["@team"],
      tags: ["test"],
      goal: "Some goal",
      context: "Some context",
    },
    description: "Test description",
  };

  test("generateSkeletonCapability should include default kind and NOT goal", () => {
    const code = generateSkeletonCapability(ctx);
    expect(code).toContain("kind: 'api'");
    expect(code).not.toContain("goal:");
    expect(code).toContain("owners: ['@team']");
  });

  test("generateSkeletonPresentation should have correct targets", () => {
    const code = generateSkeletonPresentation({
      ...ctx,
      specType: "presentation",
      key: "test.summary-doc",
    });
    // Should imply markdown kind
    expect(code).toContain("kind: 'markdown'");
    expect(code).toContain("targets: ['react', 'markdown']");
  });

  test("generateSkeletonOperation should include goal and context in meta", () => {
    const code = generateSkeletonOperation({
      ...ctx,
      specType: "operation",
      key: "test.op",
    });
    expect(code).toContain("goal: 'Some goal'");
    expect(code).toContain("context: 'Some context'");
  });

  test("generateSkeletonEvent should generate valid meta", () => {
    const code = generateSkeletonEvent({
      ...ctx,
      specType: "event",
      key: "test.event",
    });
    expect(code).toContain("owners: ['@team']");
  });
});
