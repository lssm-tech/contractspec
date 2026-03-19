import type { DocBlock } from "@contractspec/lib.contracts-spec/docs";
import { registerDocBlocks } from "@contractspec/lib.contracts-spec/docs";

const blocks: DocBlock[] = [
  {
    id: "docs.examples.opencode-cli",
    title: "OpenCode CLI Example",
    summary:
      "Example package for running ContractSpec build and validate flows in OpenCode agent mode.",
    kind: "reference",
    visibility: "public",
    route: "/docs/examples/opencode-cli",
    tags: ["opencode", "cli", "example"],
    body: `## Included assets
- One \`opencode.example.echo\` command.
- A feature describing the CLI example surface.
- Build and validate scripts that target the OpenCode agent mode.

## When to use it
Use this package when you want a minimal example of ContractSpec's agent-mode integration without a larger app shell.`,
  },
  {
    id: "docs.examples.opencode-cli.usage",
    title: "OpenCode CLI Usage",
    summary: "Build and validate the OpenCode CLI example.",
    kind: "usage",
    visibility: "public",
    route: "/docs/examples/opencode-cli/usage",
    tags: ["opencode", "usage"],
    body: `## Usage
1. Ensure the OpenCode server is reachable.
2. Run \`bun run build\` to build the example using \`--agent-mode opencode\`.
3. Run \`bun run validate\` to validate the contract and implementation path.`,
  },
];

registerDocBlocks(blocks);
