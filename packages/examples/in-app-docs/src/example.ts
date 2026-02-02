import { defineExample } from '@contractspec/lib.contracts';

/**
 * Example specification for the in-app documentation example.
 *
 * This example demonstrates how to use DocBlock to build public documentation
 * aimed at end users directly within the application UI.
 */
const example = defineExample({
  meta: {
    key: 'in-app-docs',
    version: '1.0.0',
    title: 'In‑App Documentation Example',
    description:
      "Demonstrates using DocBlock to create user‑facing guides that live inside your application's frontend. It shows how to structure a public, non‑technical user guide using ContractSpec.",
    kind: 'ui',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@docs-team'],
    tags: ['documentation', 'guide', 'ui'],
  },
  docs: {
    // Root documentation page; clicking on the example in the docs navigation
    // will display this page.
    rootDocId: 'docs.examples.in-app-docs',
    // Explicitly set usage documentation id for quickstart/guide sections.
    usageDocId: 'docs.examples.in-app-docs.usage',
    // Provide a goal document describing the purpose of this example.
    goalDocId: 'docs.examples.in-app-docs',
  },
  entrypoints: {
    // Package name used for the example's compiled output.
    packageName: '@contractspec/example.in-app-docs',
    // Documentation entrypoint folder; compiled docs will be published under this path.
    docs: './docs',
    // UI entrypoint exposes the in-app documentation viewer component.
    ui: './ui',
  },
  surfaces: {
    // This example is not a template for new projects.
    templates: false,
    // Enable sandbox with only the markdown mode so users can view the docblocks.
    sandbox: {
      enabled: true,
      modes: ['markdown'],
    },
    // Studio/MCP not required for this simple documentation example.
    studio: { enabled: false, installable: false },
    mcp: { enabled: false },
  },
});

export default example;
