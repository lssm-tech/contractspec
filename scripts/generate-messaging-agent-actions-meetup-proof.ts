import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import process from "node:process";

import { buildMessagingAgentActionsMeetupProof } from "../packages/examples/messaging-agent-actions/src/proof/meetup-proof";

const outputPath = resolve(
  import.meta.dir,
  "../packages/examples/messaging-agent-actions/proofs/messaging-agent-actions-meetup.replay.json",
);

async function formatJsonArtifact(filePath: string): Promise<void> {
  const proc = Bun.spawn(
    ["bunx", "--bun", "@biomejs/biome", "format", "--write", filePath],
    {
      cwd: resolve(import.meta.dir, ".."),
      stderr: "ignore",
      stdout: "ignore",
    },
  );

  await proc.exited;
}

async function main(): Promise<void> {
  const proof = buildMessagingAgentActionsMeetupProof();
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(proof, null, 2)}\n`, "utf8");

  try {
    await formatJsonArtifact(outputPath);
  } catch {
    // Formatting is best-effort so local proof generation still succeeds.
  }

  process.stdout.write(`${outputPath}\n`);
}

await main();
