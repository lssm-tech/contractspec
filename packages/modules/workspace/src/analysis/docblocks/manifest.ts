import fs from 'node:fs';
import type {
	DocBlockManifestEntry,
	PackageDocManifest,
} from '@contractspec/lib.contracts-spec/docs';
import {
	type DocBlockDiagnostic,
	formatDocBlockDiagnostics,
	isAllowedDocOwnerModule,
} from './diagnostics';
import { extractModuleDocData } from './evaluator';
import { listSourceFiles, toSourceModule } from './list-source-files';

interface ModuleDocRecord {
	entries: DocBlockManifestEntry[];
	docRefExports: Array<{ exportName: string; refs: string[] }>;
	filePath: string;
	sourceModule: string;
}

export interface PackageDocAnalysisResult {
	manifest: PackageDocManifest;
	diagnostics: DocBlockDiagnostic[];
}

function createDiagnostic(
	ruleId: string,
	message: string,
	file: string,
	context?: Record<string, unknown>
): DocBlockDiagnostic {
	return {
		ruleId,
		message,
		severity: 'error',
		file,
		context,
	};
}

export function analyzePackageDocBlocks(options: {
	packageName: string;
	srcRoot: string;
}): PackageDocAnalysisResult {
	const { packageName, srcRoot } = options;
	const diagnostics: DocBlockDiagnostic[] = [];
	const entries: PackageDocManifest['blocks'] = [];
	const seenIds = new Map<string, string>();
	const seenRoutes = new Map<string, string>();
	const moduleRecords = new Map<string, ModuleDocRecord>();

	for (const filePath of listSourceFiles(srcRoot)) {
		if (filePath.endsWith('.docblock.ts')) {
			diagnostics.push(
				createDiagnostic(
					'docblock-standalone-source',
					'Standalone DocBlock sources are not allowed.',
					filePath
				)
			);
		}

		if (
			filePath.includes('/docs/tech/') ||
			filePath.includes('\\docs\\tech\\')
		) {
			diagnostics.push(
				createDiagnostic(
					'docblock-tech-folder',
					'docs/tech source files are not allowed.',
					filePath
				)
			);
		}

		const sourceModule = toSourceModule(srcRoot, filePath);

		try {
			const moduleData = extractModuleDocData(
				fs.readFileSync(filePath, 'utf8'),
				filePath,
				sourceModule
			);

			moduleRecords.set(sourceModule, {
				entries: moduleData.entries,
				docRefExports: moduleData.docRefExports,
				filePath,
				sourceModule,
			});

			if (
				moduleData.entries.length > 0 &&
				!isAllowedDocOwnerModule(filePath, sourceModule)
			) {
				diagnostics.push(
					createDiagnostic(
						'docblock-orphan-owner',
						'DocBlocks must be exported from the owner module, not a docs-only helper file.',
						filePath,
						{ sourceModule }
					)
				);
			}

			for (const entry of moduleData.entries) {
				const sourceRef = `${entry.sourceModule}:${entry.exportName}`;
				const priorId = seenIds.get(entry.id);
				if (priorId) {
					diagnostics.push(
						createDiagnostic(
							'docblock-duplicate-id',
							`Duplicate DocBlock id ${entry.id} in ${sourceRef} and ${priorId}.`,
							filePath,
							{ docId: entry.id, prior: priorId, sourceRef }
						)
					);
				} else {
					seenIds.set(entry.id, sourceRef);
				}

				if (entry.block.route) {
					const priorRoute = seenRoutes.get(entry.block.route);
					if (priorRoute) {
						diagnostics.push(
							createDiagnostic(
								'docblock-duplicate-route',
								`Duplicate DocBlock route ${entry.block.route} in ${sourceRef} and ${priorRoute}.`,
								filePath,
								{ route: entry.block.route, prior: priorRoute, sourceRef }
							)
						);
					} else {
						seenRoutes.set(entry.block.route, sourceRef);
					}
				}

				entries.push(entry);
			}
		} catch (error) {
			diagnostics.push(
				createDiagnostic(
					'docblock-non-static-source',
					error instanceof Error
						? error.message
						: `Non-static DocBlock source in ${filePath}.`,
					filePath
				)
			);
		}
	}

	for (const record of moduleRecords.values()) {
		const localIds = new Set(record.entries.map((entry) => entry.id));
		for (const docRefExport of record.docRefExports) {
			for (const ref of docRefExport.refs) {
				if (localIds.has(ref)) {
					continue;
				}
				if (seenIds.has(ref)) {
					diagnostics.push(
						createDiagnostic(
							'docblock-cross-file-reference',
							`${docRefExport.exportName} references DocBlock ${ref}, but the DocBlock is not exported from the same module.`,
							record.filePath,
							{ docId: ref, exportName: docRefExport.exportName }
						)
					);
					continue;
				}
				diagnostics.push(
					createDiagnostic(
						'docblock-missing-ref',
						`${docRefExport.exportName} references missing DocBlock ${ref}.`,
						record.filePath,
						{ docId: ref, exportName: docRefExport.exportName }
					)
				);
			}
		}
	}

	entries.sort((left, right) => left.id.localeCompare(right.id));

	return {
		manifest: {
			packageName,
			generatedAt: new Date().toISOString(),
			blocks: entries,
		},
		diagnostics,
	};
}

export function buildPackageDocManifest(options: {
	packageName: string;
	srcRoot: string;
}): PackageDocManifest {
	const analysis = analyzePackageDocBlocks(options);
	const failures = analysis.diagnostics.filter(
		(diagnostic) => diagnostic.severity === 'error'
	);

	if (failures.length > 0) {
		throw new Error(formatDocBlockDiagnostics(failures));
	}

	return analysis.manifest;
}
