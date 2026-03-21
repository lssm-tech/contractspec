import { describe, expect, it } from "bun:test";
import type { PresentationSpec } from "@contractspec/lib.contracts-spec/presentations";
import {
  createDefaultTransformEngine,
  registerBasicValidation,
} from "@contractspec/lib.presentation-runtime-core/transform-engine";
import React from "react";
import {
  registerDefaultReactRenderer,
  registerReactToMarkdownRenderer,
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
  source: {
    type: "component",
    framework: "react",
    componentKey: "ExampleComponent",
  },
  targets: ["react", "markdown"],
  ...overrides,
});

describe("contracts-runtime-client-react transform engine", () => {
  it("registerDefaultReactRenderer returns a serializable descriptor", async () => {
    const engine = registerDefaultReactRenderer(createDefaultTransformEngine());
    const desc = createPresentation();
    const result = await engine.render<{
      kind: "react_component";
      componentKey: string;
      props?: Record<string, unknown>;
    }>("react", desc);

    expect(result.kind).toBe("react_component");
    expect(result.componentKey).toBe("ExampleComponent");
  });

  it("registerReactToMarkdownRenderer renders React components to markdown", async () => {
    const engine = registerReactToMarkdownRenderer(
      registerDefaultReactRenderer(
        registerBasicValidation(createDefaultTransformEngine())
      ),
      {
        ExampleComponent: () =>
          React.createElement(
            "section",
            {},
            React.createElement("a", { href: "https://example.com" }, "Example"),
            React.createElement("strong", {}, "Bold")
          ),
      }
    );

    const result = await engine.render<{ mimeType: "text/markdown"; body: string }>(
      "markdown",
      createPresentation()
    );

    expect(result.mimeType).toBe("text/markdown");
    expect(result.body).toContain("[Example]");
    expect(result.body).toContain("**Bold**");
  });
});
