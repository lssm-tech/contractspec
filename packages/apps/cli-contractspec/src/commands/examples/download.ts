import { spawn } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import {
	type ExampleSource,
	getExample,
	getExampleSource,
} from '@contractspec/module.examples/catalog';

export interface DownloadExampleOptions {
	key: string;
	outDir?: string;
	cwd?: string;
	runCommand?: RunCommand;
}

export interface DownloadExampleResult {
	key: string;
	outDir: string;
	source: ExampleSource;
}

export type RunCommand = (
	command: string,
	args: readonly string[],
	options: { cwd: string }
) => Promise<void>;

export async function downloadExampleSource({
	key,
	outDir,
	cwd = process.cwd(),
	runCommand = runCommandWithSpawn,
}: DownloadExampleOptions): Promise<DownloadExampleResult> {
	const example = getExample(key);
	const source = getExampleSource(key);

	if (!example || !source) {
		throw new Error(`Example not found: ${key}`);
	}
	validateSourceDirectory(source.directory);

	const targetDir = outDir
		? path.resolve(cwd, outDir)
		: path.resolve(
				cwd,
				'.contractspec',
				'examples',
				example.meta.key,
				'source'
			);
	await assertWritableTarget(targetDir);

	const tempRoot = await fs.mkdtemp(
		path.join(os.tmpdir(), 'contractspec-example-')
	);

	try {
		await runCommand(
			'git',
			[
				'clone',
				'--depth',
				'1',
				'--filter=blob:none',
				'--sparse',
				'--branch',
				source.defaultRef,
				source.repositoryUrl,
				tempRoot,
			],
			{ cwd }
		);
		await runCommand(
			'git',
			['-C', tempRoot, 'sparse-checkout', 'set', source.directory],
			{ cwd }
		);

		await fs.mkdir(path.dirname(targetDir), { recursive: true });
		await fs.cp(path.join(tempRoot, source.directory), targetDir, {
			recursive: true,
		});
	} finally {
		await fs.rm(tempRoot, { force: true, recursive: true });
	}

	return { key: example.meta.key, outDir: targetDir, source };
}

async function assertWritableTarget(targetDir: string): Promise<void> {
	const entries = await fs.readdir(targetDir).catch((error: unknown) => {
		if (isNodeError(error) && error.code === 'ENOENT') {
			return null;
		}
		throw error;
	});
	if (entries && entries.length > 0) {
		throw new Error(`Output directory is not empty: ${targetDir}`);
	}
}

function validateSourceDirectory(directory: string): void {
	if (
		!directory.startsWith('packages/examples/') ||
		directory.includes('..') ||
		path.isAbsolute(directory)
	) {
		throw new Error(`Invalid example source directory: ${directory}`);
	}
}

function runCommandWithSpawn(
	command: string,
	args: readonly string[],
	options: { cwd: string }
): Promise<void> {
	return new Promise((resolve, reject) => {
		const child = spawn(command, [...args], {
			cwd: options.cwd,
			stdio: 'inherit',
		});

		child.on('error', (error) => {
			if (isNodeError(error) && error.code === 'ENOENT') {
				reject(new Error(`${command} executable not found`));
				return;
			}
			reject(error);
		});
		child.on('close', (code) => {
			if (code === 0) {
				resolve();
				return;
			}
			reject(new Error(`${command} exited with code ${code ?? 'unknown'}`));
		});
	});
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
	return error instanceof Error && 'code' in error;
}
