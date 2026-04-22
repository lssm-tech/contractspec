import { afterEach, describe, expect, test } from 'bun:test';
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const tempDirs: string[] = [];
const bunExecutable = process.execPath;
const packageRoot = path.resolve(import.meta.dir, '..');

async function createTempDir() {
	const tempDir = await mkdtemp(
		path.join(os.tmpdir(), 'contractspec-bun-types-')
	);
	tempDirs.push(tempDir);
	return tempDir;
}

afterEach(async () => {
	await Promise.all(
		tempDirs
			.splice(0, tempDirs.length)
			.map((tempDir) => rm(tempDir, { recursive: true, force: true }))
	);
});

describe('public package types', () => {
	test('typecheck customer config imports through package exports', async () => {
		const cwd = await createTempDir();
		await mkdir(path.join(cwd, 'node_modules', '@contractspec'), {
			recursive: true,
		});
		await symlink(
			packageRoot,
			path.join(cwd, 'node_modules', '@contractspec', 'tool.bun'),
			'dir'
		);
		await writeFile(
			path.join(cwd, 'package.json'),
			JSON.stringify({ type: 'module' }, null, 2)
		);
		await writeFile(
			path.join(cwd, 'tsconfig.json'),
			JSON.stringify(
				{
					compilerOptions: {
						strict: true,
						noEmit: true,
						module: 'esnext',
						moduleResolution: 'bundler',
						target: 'esnext',
						skipLibCheck: false,
					},
					include: ['config.ts'],
				},
				null,
				2
			)
		);
		await writeFile(
			path.join(cwd, 'config.ts'),
			[
				'import defaultConfig, {',
				'  backendBoth,',
				'  backendBun,',
				'  backendNode,',
				'  defineConfig,',
				'  frontendReact,',
				'  moduleLibrary,',
				'  nodeDatabaseLib,',
				'  nodeLib,',
				'  reactLibrary,',
				'  shared,',
				'  withDevExports,',
				'  type BuildConfig,',
				'} from "@contractspec/tool.bun";',
				'',
				'const presets: BuildConfig[] = [',
				'  defaultConfig,',
				'  backendBoth,',
				'  backendBun,',
				'  backendNode,',
				'  frontendReact,',
				'  moduleLibrary,',
				'  nodeDatabaseLib,',
				'  nodeLib,',
				'  reactLibrary,',
				'  shared,',
				'  withDevExports,',
				'];',
				'',
				'export const typedConfig = defineConfig(() => ({',
				'  ...moduleLibrary,',
				'  external: ["react", /^node:/.source],',
				'  exports: { all: true, rewrite: true, devExports: false },',
				'  noBundle: true,',
				'  styleEntry: false,',
				'  styleMode: "copy",',
				'  styles: { entry: ["styles/**/*.css"], mode: "copy" },',
				'  targets: { node: true, browser: true },',
				'  tsconfigTypes: "tsconfig.build.json",',
				'}));',
				'',
				'export const objectConfig = defineConfig({',
				'  kind: "backend-node",',
				'  platform: "node",',
				'  entry: ["src/index.ts"],',
				'  targets: { node: true, browser: false },',
				'});',
				'',
				'defineConfig({',
				'  ...shared,',
				'  // @ts-expect-error invalid style mode is rejected',
				'  styleMode: "inline",',
				'});',
				'',
				'defineConfig({',
				'  // @ts-expect-error invalid build kind is rejected',
				'  kind: "unknown",',
				'});',
				'',
				'void presets;',
				'',
			].join('\n')
		);

		const subprocess = Bun.spawnSync({
			cmd: [bunExecutable, 'x', 'tsc', '--project', 'tsconfig.json'],
			cwd,
			stdout: 'pipe',
			stderr: 'pipe',
		});

		const stdout = await new Response(subprocess.stdout).text();
		const stderr = await new Response(subprocess.stderr).text();
		expect({ stdout, stderr, exitCode: subprocess.exitCode }).toEqual({
			stdout: '',
			stderr: '',
			exitCode: 0,
		});
	});
});
