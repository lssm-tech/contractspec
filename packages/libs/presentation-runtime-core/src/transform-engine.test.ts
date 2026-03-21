import { describe, expect, it } from "bun:test";
import type { PresentationSpec } from "@contractspec/lib.contracts-spec/presentations";
import {
  createDefaultTransformEngine,
  registerBasicValidation,
} from "./transform-engine";

const createPresentation = (
  overrides: Partial<PresentationSpec> = {}
): PresentationSpec => ({
  meta: {
    key: "x.test",
    version: "1.0.0",
    description: "desc",
    domain: "domain",
    stability: "stable",
    owners: ["platform.content"],
    tags: [],
    title: "Test Presentation",
    goal: "Test Goal",
    context: "Test Context",
  },
  source: { type: "blocknotejs", docJson: { type: "doc" } },
  targets: ["markdown", "application/json", "application/xml"],
  ...overrides,
});

describe("TransformEngine", () => {
  it("renders markdown/json/xml with PII redaction", async () => {
    const engine = registerBasicValidation(createDefaultTransformEngine());
    const desc = createPresentation({ policy: { pii: ["meta.key"] } });

    const markdown = await engine.render<{ mimeType: "text/markdown"; body: string }>(
      "markdown",
      desc
    );
    expect(markdown.mimeType).toBe("text/markdown");

    const json = await engine.render<{ mimeType: "application/json"; body: string }>(
      "application/json",
      desc
    );
    expect(json.body).toContain("[REDACTED]");

    const xml = await engine.render<{ mimeType: "application/xml"; body: string }>(
      "application/xml",
      desc
    );
    expect(xml.body).toContain("%5BREDACTED%5D");
  });

  it("validates meta.description presence", async () => {
    const engine = registerBasicValidation(createDefaultTransformEngine());
    const bad = createPresentation({
      meta: { key: "a", version: "1.0.0", description: "" } as PresentationSpec["meta"],
    });

    await expect(engine.render("application/json", bad)).rejects.toThrow();
  });

  it("does not throw on circular metadata", async () => {
    const engine = createDefaultTransformEngine();
    const desc = createPresentation({ policy: { pii: ["meta.key"] } });
    (desc.meta as unknown as Record<string, unknown>).self = desc;

    const result = await engine.render<{ mimeType: "application/json"; body: string }>(
      "application/json",
      desc
    );
    expect(result.mimeType).toBe("application/json");
    expect(result.body).toContain("[non-serializable]");
  });
});
