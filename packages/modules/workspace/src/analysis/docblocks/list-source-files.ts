import fs from 'node:fs';
import path from 'node:path';

function shouldIgnoreSourceFile(filePath: string): boolean {
	return (
		!/\.[cm]?[jt]sx?$/.test(filePath) ||
		filePath.endsWith('.d.ts') ||
		filePath.endsWith('.test.ts') ||
		filePath.endsWith('.generated.ts') ||
		filePath.includes(`${path.sep}dist${path.sep}`)
	);
}

export function listSourceFiles(srcRoot: string): string[] {
	return fs
		.readdirSync(srcRoot, { withFileTypes: true })
		.flatMap((entry) => {
			const absolutePath = path.join(srcRoot, entry.name);
			if (entry.isDirectory()) {
				return listSourceFiles(absolutePath);
			}
			return shouldIgnoreSourceFile(absolutePath) ? [] : [absolutePath];
		})
		.sort((left, right) => left.localeCompare(right));
}

export function toSourceModule(srcRoot: string, filePath: string): string {
	return path
		.relative(srcRoot, filePath)
		.replace(/\\/g, '/')
		.replace(/\.[cm]?[jt]sx?$/, '');
}
