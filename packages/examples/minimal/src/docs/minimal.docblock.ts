import type { DocBlock } from "@contractspec/lib.contracts-spec/docs";
import { registerDocBlocks } from "@contractspec/lib.contracts-spec/docs";

const blocks: DocBlock[] = [
  {
    id: "docs.examples.minimal",
    title: "Minimal Example",
    summary:
      "Smallest possible ContractSpec package with one operation and one feature.",
    kind: "reference",
    visibility: "public",
    route: "/docs/examples/minimal",
    tags: ["minimal", "example", "quickstart"],
    body: `## Included assets
- A single \`user.create\` command.
- One feature linking the command.
- Minimal build and validate scripts.

## Why it exists
Use this example to verify the basic ContractSpec authoring loop before moving to larger templates.`,
  },
  {
    id: "docs.examples.minimal.usage",
    title: "Minimal Example Usage",
    summary: "Run the minimal example through build and validation.",
    kind: "usage",
    visibility: "public",
    route: "/docs/examples/minimal/usage",
    tags: ["minimal", "usage"],
    body: `## Usage
1. Run \`bun run build\` to generate implementation artifacts from the spec.
2. Run \`bun run validate\` to confirm the spec remains valid.
3. Use the feature and example manifest as a baseline for new starter packages.`,
  },
];

registerDocBlocks(blocks);
