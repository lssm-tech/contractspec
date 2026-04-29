import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { execFileSync } from 'node:child_process';
import {
	mkdir,
	mkdtemp,
	readdir,
	readFile,
	rm,
	writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const inputQueue: string[] = [];
const confirmQueue: boolean[] = [];
const selectQueue: string[] = [];

mock.module('@inquirer/prompts', () => ({
	input: mock(async () => inputQueue.shift() ?? ''),
	confirm: mock(async () => confirmQueue.shift() ?? false),
	select: mock(async () => selectQueue.shift() ?? 'patch'),
}));

const { createReleaseCommand } = await import('./index');

function queueReleaseCreateInputs() {
	selectQueue.push('patch');
	inputQueue.push(
		'@contractspec/lib.knowledge',
		'Persist canonical payload text in indexed knowledge payloads.',
		'knowledge-indexed-payload-hardening',
		'Maintainers now get canonical payload text in the vector store path.',
		'Customers can remove the old payload-text workaround.',
		'Integrators should upgrade @contractspec/lib.knowledge and review the validation notes.',
		'contractspec impact --baseline main --format markdown',
		'contractspec version analyze --baseline main',
		'Validated retrieval output now includes canonical payload text.'
	);
	confirmQueue.push(false, false, false, false, false, true, false);
}

function queueReleaseEditInputs(summary: string) {
	selectQueue.push('patch');
	inputQueue.push(
		'@contractspec/lib.knowledge',
		summary,
		'knowledge-indexed-payload-hardening',
		'Maintainer summary',
		'Customer summary',
		'Integrator summary',
		'contractspec release check --strict',
		'Captured release validation evidence.'
	);
	confirmQueue.push(false, false, false, false, false, false);
}

function queueReleaseRerunInputs() {
	selectQueue.push('patch');
	inputQueue.push(
		'@contractspec/lib.knowledge',
		'Persist canonical payload text in indexed knowledge payloads.',
		'knowledge-indexed-payload-hardening',
		'Maintainer summary',
		'Customer summary',
		'Integrator summary',
		'contractspec impact --baseline main --format markdown',
		'contractspec version analyze --baseline main',
		'Captured release validation evidence.'
	);
	confirmQueue.push(false, false, false, false, false, false, false);
}

async function seedWorkspace(tempDir: string) {
	await mkdir(join(tempDir, '.changeset'), { recursive: true });
	await mkdir(join(tempDir, 'packages', 'libs', 'knowledge'), {
		recursive: true,
	});
	await writeFile(
		join(tempDir, 'package.json'),
		JSON.stringify({ name: 'release-cli-fixture', private: true }, null, 2)
	);
	await writeFile(
		join(tempDir, 'packages', 'libs', 'knowledge', 'package.json'),
		JSON.stringify(
			{ name: '@contractspec/lib.knowledge', version: '2.3.4' },
			null,
			2
		)
	);
	execFileSync('git', ['init'], { cwd: tempDir, stdio: 'ignore' });
	execFileSync('git', ['config', 'user.name', 'Test User'], {
		cwd: tempDir,
		stdio: 'ignore',
	});
	execFileSync('git', ['config', 'user.email', 'test@example.com'], {
		cwd: tempDir,
		stdio: 'ignore',
	});
	execFileSync('git', ['add', '.'], { cwd: tempDir, stdio: 'ignore' });
	execFileSync('git', ['commit', '-m', 'seed workspace'], {
		cwd: tempDir,
		stdio: 'ignore',
	});
	execFileSync('git', ['branch', '-M', 'main'], {
		cwd: tempDir,
		stdio: 'ignore',
	});
}

describe('release command', () => {
	const originalCwd = process.cwd();
	const originalConsoleLog = console.log;
	const originalConsoleError = console.error;
	const originalExit = process.exit;
	let tempDir = '';

	beforeEach(async () => {
		tempDir = await mkdtemp(join(tmpdir(), 'contractspec-release-cli-'));
		await seedWorkspace(tempDir);
		console.log = (() => {}) as typeof console.log;
		console.error = (() => {}) as typeof console.error;
		process.chdir(tempDir);
		inputQueue.splice(0);
		confirmQueue.splice(0);
		selectQueue.splice(0);
	});

	afterEach(async () => {
		process.chdir(originalCwd);
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
		process.exit = originalExit;
		if (tempDir) {
			await rm(tempDir, { recursive: true, force: true });
		}
	});

	it(
		'prepares a canonical release pair and generated artifacts',
		async () => {
			queueReleaseCreateInputs();

			await createReleaseCommand().parseAsync(
				['prepare', '--patch', '--baseline', 'HEAD'],
				{
					from: 'user',
				}
			);

			expect(
				await readFile(
					join(tempDir, '.changeset', 'knowledge-indexed-payload-hardening.md'),
					'utf8'
				)
			).toContain('"@contractspec/lib.knowledge": patch');
			expect(
				await readFile(
					join(tempDir, 'generated', 'releases', 'manifest.json'),
					'utf8'
				)
			).toContain('knowledge-indexed-payload-hardening');
		},
		{ timeout: 30_000 }
	);

	it(
		'edits an existing release slug through the guided flow',
		async () => {
			await writeFile(
				join(tempDir, '.changeset', 'knowledge-indexed-payload-hardening.md'),
				`---
"@contractspec/lib.knowledge": patch
---

Old summary
`
			);
			await writeFile(
				join(
					tempDir,
					'.changeset',
					'knowledge-indexed-payload-hardening.release.yaml'
				),
				`schemaVersion: "1"
slug: knowledge-indexed-payload-hardening
summary: Old summary
isBreaking: false
packages:
  - name: "@contractspec/lib.knowledge"
    releaseType: patch
audiences:
  - kind: maintainer
    summary: Old maintainer summary
validation:
  commands:
    - contractspec release check --strict
  evidence:
    - Existing evidence
`
			);
			queueReleaseEditInputs('New edited summary');

			await createReleaseCommand().parseAsync(
				['edit', 'knowledge-indexed-payload-hardening', '--baseline', 'HEAD'],
				{ from: 'user' }
			);

			expect(
				await readFile(
					join(
						tempDir,
						'.changeset',
						'knowledge-indexed-payload-hardening.release.yaml'
					),
					'utf8'
				)
			).toContain('New edited summary');
		},
		{ timeout: 30_000 }
	);

	it(
		'reuses the single existing pending release entry on rerun instead of creating duplicates',
		async () => {
			queueReleaseCreateInputs();
			await createReleaseCommand().parseAsync(
				['prepare', '--patch', '--baseline', 'HEAD'],
				{
					from: 'user',
				}
			);

			queueReleaseRerunInputs();
			await createReleaseCommand().parseAsync(
				['prepare', '--baseline', 'HEAD'],
				{
					from: 'user',
				}
			);

			const changesetFiles = (
				await readdir(join(tempDir, '.changeset'))
			).filter((file) => file !== 'README.md');
			expect(changesetFiles.sort()).toEqual([
				'knowledge-indexed-payload-hardening.md',
				'knowledge-indexed-payload-hardening.release.yaml',
			]);
		},
		{ timeout: 30_000 }
	);

	it('prints actionable failure messaging when a capsule is invalid', async () => {
		await writeFile(
			join(tempDir, '.changeset', 'broken-release.release.yaml'),
			`schemaVersion: "1"
slug: broken-release
summary: Broken release
isBreaking: false
packages:
  - name: "@contractspec/lib.knowledge"
    releaseType: patch
validation:
  commands:
    - contractspec release check --strict
  evidence:
    - \`Broken markdown-like content\`
    - second bullet
`
		);
		process.exit = ((code?: number) => {
			throw new Error(`exit:${code}`);
		}) as typeof process.exit;
		const consoleError = mock(() => {});
		console.error = consoleError as typeof console.error;

		await expect(
			createReleaseCommand().parseAsync(['brief'], { from: 'user' })
		).rejects.toThrow('exit:1');
		expect(consoleError).toHaveBeenCalledWith(
			expect.stringContaining('❌ Release command failed:'),
			expect.stringContaining('contractspec release edit broken-release')
		);
	});
});
