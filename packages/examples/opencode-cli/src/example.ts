import { defineExample } from "@contractspec/lib.contracts-spec";

const example = defineExample({
  meta: {
    key: "opencode-cli",
    version: "1.0.0",
    title: "OpenCode CLI",
    description:
      "CLI-oriented example showing how to validate ContractSpec flows against the OpenCode agent mode.",
    kind: "script",
    visibility: "public",
    stability: "experimental",
    owners: ["@contractspec/examples"],
    tags: ["opencode", "cli", "agent-mode", "example"],
    summary: "Agent-mode CLI example for OpenCode-backed build and validate runs.",
  },
  docs: {
    rootDocId: "docs.examples.opencode-cli",
    usageDocId: "docs.examples.opencode-cli.usage",
  },
  entrypoints: {
    packageName: "@contractspec/example.opencode-cli",
    feature: "./opencode-cli.feature",
    contracts: "./contracts/opencode",
    docs: "./docs",
  },
  surfaces: {
    templates: false,
    sandbox: { enabled: false, modes: [] },
    studio: { enabled: false, installable: false },
    mcp: { enabled: false },
  },
});

export default example;
