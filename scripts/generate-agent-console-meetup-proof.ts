#!/usr/bin/env bun

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { runAgentConsoleMeetupProof } from '../packages/examples/agent-console/src/proof/meetup-proof';
import { summarizeHarnessReplayBundle } from '../packages/libs/harness/src/replay/bundle';

const ROOT = join(import.meta.dirname, '..');
const OUTPUT_PATH = join(
	ROOT,
	'packages/examples/agent-console/proofs/agent-console-meetup.replay.json'
);
const LOCAL_BIOME_BIN = join(ROOT, 'node_modules/@biomejs/biome/bin/biome');

async function formatProofArtifact(filePath: string) {
	if (!existsSync(LOCAL_BIOME_BIN)) {
		throw new Error(
			`Local Biome binary not found at ${relative(ROOT, LOCAL_BIOME_BIN)}. Run bun install before generating the meetup proof.`
		);
	}

	await new Promise<void>((resolve, reject) => {
		const child = spawn(LOCAL_BIOME_BIN, ['format', '--write', filePath], {
			cwd: ROOT,
			stdio: 'inherit',
		});
		child.on('error', reject);
		child.on('exit', (code) => {
			if (code === 0) {
				resolve();
				return;
			}
			reject(new Error(`Biome exited with code ${code ?? 'unknown'}.`));
		});
	});
}

async function main() {
	const result = await runAgentConsoleMeetupProof({
		replaySink: {
			async save(bundle) {
				await mkdir(dirname(OUTPUT_PATH), { recursive: true });
				await writeFile(OUTPUT_PATH, JSON.stringify(bundle, null, '\t') + '\n');
				await formatProofArtifact(OUTPUT_PATH);
				return OUTPUT_PATH;
			},
		},
	});
	const summary = summarizeHarnessReplayBundle(result.replayBundle);

	console.log(`Wrote ${relative(ROOT, OUTPUT_PATH)}.`);
	console.log(
		`Replay summary: ${summary.stepCount} steps, ${summary.artifactCount} artifacts, ${summary.failedAssertions} failed assertions.`
	);
}

main().catch((error) => {
	console.error(
		'Failed to generate the agent-console meetup replay bundle:',
		error instanceof Error ? error.message : String(error)
	);
	process.exit(2);
});
