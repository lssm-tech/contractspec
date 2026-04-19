import type { FolderConventions } from '@contractspec/lib.contracts-spec';
import {
	type AuthoringContractSpecType,
	type AuthoringTargetPathOptions,
	getAuthoringTargetDefaultSubdirectory,
} from '@contractspec/module.workspace';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, isAbsolute, join } from 'path';

/**
 * Ensure directory exists, creating it if necessary
 */
export async function ensureDir(path: string): Promise<void> {
	if (!existsSync(path)) {
		await mkdir(path, { recursive: true });
	}
}

/**
 * Write file, creating parent directories if needed
 */
export async function writeFileSafe(
	filePath: string,
	content: string
): Promise<void> {
	const dir = dirname(filePath);
	await ensureDir(dir);
	await writeFile(filePath, content, 'utf-8');
}

/**
 * Resolve output path based on config and spec type
 */
export function resolveOutputPath(
	basePath: string,
	specType: AuthoringContractSpecType,
	conventions: Partial<FolderConventions>,
	fileName: string,
	options: AuthoringTargetPathOptions = {}
): string {
	const subPath = getAuthoringTargetDefaultSubdirectory(
		specType,
		conventions,
		options
	);

	return join(basePath, subPath, fileName);
}

/**
 * Generate unique filename to avoid conflicts
 */
export function generateFileName(baseName: string, extension = '.ts'): string {
	// Convert camelCase or dot notation to kebab-case
	const kebab = baseName
		.replace(/\./g, '-')
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.toLowerCase();

	return `${kebab}${extension}`;
}

export function resolvePathFromCwd(targetPath: string): string {
	return isAbsolute(targetPath) ? targetPath : join(process.cwd(), targetPath);
}
