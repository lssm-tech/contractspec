import type { BlockConfig, PresentationSpec } from "@contractspec/lib.contracts-spec/presentations";
import {
  htmlToMarkdown,
  type TransformEngine,
} from "@contractspec/lib.presentation-runtime-core/transform-engine";
import React from "react";

export * from "@contractspec/lib.presentation-runtime-core/transform-engine";

export type ReactRenderDescriptor =
  | {
      kind: "react_component";
      componentKey: string;
      props?: Record<string, unknown>;
    }
  | { kind: "blocknotejs"; docJson: unknown; blockConfig?: BlockConfig };

export type ComponentMap = Record<
  string,
  React.ComponentType<Record<string, unknown>>
>;

export function registerDefaultReactRenderer(
  engine: TransformEngine
): TransformEngine {
  engine.register<ReactRenderDescriptor>({
    target: "react",
    async render(desc: PresentationSpec) {
      if (desc.source.type === "component") {
        const props = desc.source.props
          ? desc.source.props.getZod().safeParse({}).success
            ? {}
            : undefined
          : undefined;
        return {
          kind: "react_component",
          componentKey: desc.source.componentKey,
          props,
        };
      }

      return {
        kind: "blocknotejs",
        docJson: desc.source.docJson,
        blockConfig: desc.source.blockConfig,
      };
    },
  });

  return engine;
}

export function registerReactToMarkdownRenderer(
  engine: TransformEngine,
  componentMap: ComponentMap
): TransformEngine {
  engine.prependRegister<{ mimeType: "text/markdown"; body: string }>({
    target: "markdown",
    async render(desc) {
      if (desc.source.type !== "component") {
        throw new Error(
          "React-to-markdown renderer only handles component presentations"
        );
      }

      const Component = componentMap[desc.source.componentKey];
      if (!Component) {
        throw new Error(
          `Component ${desc.source.componentKey} not found in componentMap`
        );
      }

      const { renderToStaticMarkup } = await import("react-dom/server");
      const element = React.createElement(
        Component,
        (desc.source.props ? {} : undefined) as Record<string, unknown> | undefined
      );
      const markdown = htmlToMarkdown(renderToStaticMarkup(element));

      return {
        mimeType: "text/markdown",
        body: desc.policy?.pii?.length ? markdown.replace(/\[REDACTED\]/g, "[REDACTED]") : markdown,
      };
    },
  });

  return engine;
}
