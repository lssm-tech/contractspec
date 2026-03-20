/**
 * Delete spec service.
 *
 * Removes a spec file and optionally cleans up generated artifacts
 * (handlers, tests, components) that reference it.
 */

import {
	type SpecScanResult,
	scanSpecSource,
} from '@contractspec/module.workspace';
import type { FsAdapter } from '../ports/fs';
import type { LoggerAdapter } from '../ports/logger';
import { discoverImplementationsForSpec } from './implementation/discovery';

function unknownSpecResult(filePath: string): SpecScanResult {
	return {
		specType: 'unknown',
		filePath,
		hasMeta: false,
		hasIo: false,
		hasPolicy: false,
		hasPayload: false,
		hasContent: false,
		hasDefinition: false,
	};
}

export interface DeleteSpecOptions {
	/** Also remove generated artifacts that reference this spec. */
	clean?: boolean;
	/** Skip the existence check (caller already confirmed). */
	force?: boolean;
}

export interface DeleteSpecResult {
	specPath: string;
	specInfo: SpecScanResult;
	deleted: boolean;
	cleanedFiles: string[];
	errors: string[];
}

/**
 * Delete a spec file and optionally its generated artifacts.
 */
export async function deleteSpec(
	specPath: string,
	adapters: { fs: FsAdapter; logger: LoggerAdapter },
	options: DeleteSpecOptions = {}
): Promise<DeleteSpecResult> {
	const { fs, logger } = adapters;

	const exists = await fs.exists(specPath);
	if (!exists && !options.force) {
		return {
			specPath,
			specInfo: unknownSpecResult(specPath),
			deleted: false,
			cleanedFiles: [],
			errors: [`Spec file not found: ${specPath}`],
		};
	}

	let specInfo: SpecScanResult = unknownSpecResult(specPath);
	let specKey: string | undefined;

	if (exists) {
		try {
			const code = await fs.readFile(specPath);
			specInfo = scanSpecSource(code, specPath);
			specKey = specInfo.key;
		} catch {
			// proceed with deletion even if scan fails
		}
	}

	const cleanedFiles: string[] = [];

	if (options.clean && specKey) {
		try {
			const implementations = await discoverImplementationsForSpec(specKey, {
				fs,
			});

			for (const impl of implementations) {
				try {
					await fs.remove(impl.filePath);
					cleanedFiles.push(impl.filePath);
					logger.info(`Removed artifact: ${impl.filePath}`);
				} catch {
					logger.warn(`Could not remove artifact: ${impl.filePath}`);
				}
			}
		} catch {
			logger.warn('Could not discover implementations for cleanup');
		}
	}

	if (exists) {
		await fs.remove(specPath);
		logger.info(`Deleted spec: ${specPath}`);
	}

	return {
		specPath,
		specInfo,
		deleted: true,
		cleanedFiles,
		errors: [],
	};
}
