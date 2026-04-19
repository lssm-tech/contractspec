/**
 * Spec scanning utilities.
 *
 * Scans source code to extract spec definitions and metadata without execution.
 */

import type {
	AnalyzedOperationKind,
	AnalyzedSpecType,
	SpecScanResult,
} from '../types/analysis-types';
import {
	detectAuthoringTarget,
	inferAuthoringTargetFromFilePath,
} from './authoring-targets';
import {
	extractRefList,
	extractTestCoverage,
	extractTestRefs,
	extractTestTarget,
	parsePolicy,
} from './spec-parsing-utils';

import {
	findMatchingDelimiter,
	isStability,
	matchStringArrayField,
	matchStringField,
	matchVersionField,
} from './utils/matchers';
import {
	extractArrayConstants,
	resolveVariablesInBlock,
} from './utils/variables';

export { extractTestCoverage, extractTestTarget } from './spec-parsing-utils';

interface SpecDiscoveryMetadata {
	exportName?: string;
	declarationLine?: number;
}

function getDeclarationLine(code: string, index: number): number {
	let line = 1;
	for (let cursor = 0; cursor < index; cursor++) {
		if (code[cursor] === '\n') {
			line += 1;
		}
	}
	return line;
}

function buildDiscoveryId(
	filePath: string,
	metadata: SpecDiscoveryMetadata,
	key: string
): string {
	const identity =
		metadata.exportName ??
		(metadata.declarationLine ? `line-${metadata.declarationLine}` : key);
	return `${filePath}#${identity}`;
}

function extractImportStatements(code: string): string[] {
	return Array.from(code.matchAll(/^\s*import[\s\S]*?;/gm)).map((match) =>
		match[0].trim()
	);
}

/**
 * Scan all specs from a single source file.
 */
export function scanAllSpecsFromSource(
	code: string,
	filePath: string
): SpecScanResult[] {
	const results: SpecScanResult[] = [];

	// Pre-scan for variables available in file scope
	const variables = extractArrayConstants(code);
	const imports = extractImportStatements(code);

	// Match export definitions: export const X = defineXXX calls
	const definitionRegex =
		/export\s+const\s+(\w+)\s*=\s*define(Command|Query|Event|Presentation|Capability|Policy|Type|Example|AppConfig|Integration|Workflow|TestSpec|Feature|Form|DataView|Migration|Telemetry|Experiment|KnowledgeSpace|ModuleBundle)\s*\(/g;
	let match;

	while ((match = definitionRegex.exec(code)) !== null) {
		const exportName = match[1];
		const start = match.index;
		const openParenIndex = start + match[0].length - 1;
		const end = findMatchingDelimiter(code, openParenIndex, '(', ')');
		if (end === -1) continue;

		// Optional: include trailing semicolon
		let finalEnd = end;
		if (code[finalEnd + 1] === ';') {
			finalEnd++;
		}

		const block = code.substring(start, finalEnd + 1);

		// Resolve variables in the block
		const resolvedBlock = resolveVariablesInBlock(block, variables);
		const metadata = {
			exportName,
			declarationLine: getDeclarationLine(code, start),
		};

		const result = scanSpecSource(resolvedBlock, filePath, metadata);
		if (result) {
			results.push({
				...result,
				sourceBlock:
					imports.length > 0
						? `${imports.join('\n')}\n\n${resolvedBlock}`
						: resolvedBlock,
			});
		}
	}

	// Fallback: legacy file scan if no explicit exports found
	if (results.length === 0 && filePath.includes('.spec.')) {
		const result = scanSpecSource(code, filePath);
		if (result.key !== 'unknown') {
			// Try to resolve globally even for fallback (though scope is harder)
			const resolvedBlock = resolveVariablesInBlock(code, variables);
			const result = scanSpecSource(resolvedBlock, filePath);
			results.push(result);
		}
	}

	return results;
}

export function inferSpecTypeFromCodeBlock(fileSourceCode: string): {
	specType: AnalyzedSpecType;
	kind: AnalyzedOperationKind;
} {
	const authoringTarget = detectAuthoringTarget(fileSourceCode, '');
	if (authoringTarget === 'module-bundle') {
		return {
			specType: 'module-bundle',
			kind: 'module-bundle',
		};
	}
	if (authoringTarget === 'builder-spec') {
		return {
			specType: 'builder-spec',
			kind: 'builder-spec',
		};
	}
	if (authoringTarget === 'provider-spec') {
		return {
			specType: 'provider-spec',
			kind: 'provider-spec',
		};
	}
	if (fileSourceCode.includes('defineCommand')) {
		return {
			specType: 'operation',
			kind: 'command',
		};
	}
	if (fileSourceCode.includes('defineQuery')) {
		return {
			specType: 'operation',
			kind: 'query',
		};
	}
	if (fileSourceCode.includes('defineEvent')) {
		return {
			specType: 'event',
			kind: 'event',
		};
	}
	if (fileSourceCode.includes('definePresentation')) {
		return {
			specType: 'presentation',
			kind: 'presentation',
		};
	}
	if (fileSourceCode.includes('defineForm')) {
		return {
			specType: 'form',
			kind: 'form',
		};
	}
	if (fileSourceCode.includes('definePolicy')) {
		return {
			specType: 'policy',
			kind: 'policy',
		};
	}
	if (fileSourceCode.includes('defineCapability')) {
		return {
			specType: 'capability',
			kind: 'capability',
		};
	}
	if (fileSourceCode.includes('defineExample')) {
		return {
			specType: 'example',
			kind: 'example',
		};
	}
	if (
		fileSourceCode.includes('defineAppConfig') &&
		!fileSourceCode.includes('export const defineAppConfig')
	) {
		return {
			specType: 'app-config',
			kind: 'app-config',
		};
	}
	if (fileSourceCode.includes('defineIntegration')) {
		return {
			specType: 'integration',
			kind: 'integration',
		};
	}
	if (fileSourceCode.includes('defineWorkflow')) {
		return {
			specType: 'workflow',
			kind: 'workflow',
		};
	}
	if (fileSourceCode.includes('defineDataView')) {
		return {
			specType: 'data-view',
			kind: 'data-view',
		};
	}
	if (fileSourceCode.includes('defineMigration')) {
		return {
			specType: 'migration',
			kind: 'migration',
		};
	}
	if (fileSourceCode.includes('defineTelemetry')) {
		return {
			specType: 'telemetry',
			kind: 'telemetry',
		};
	}
	if (fileSourceCode.includes('defineExperiment')) {
		return {
			specType: 'experiment',
			kind: 'experiment',
		};
	}
	if (fileSourceCode.includes('defineKnowledgeSpace')) {
		return {
			specType: 'knowledge',
			kind: 'knowledge-space',
		};
	}
	if (fileSourceCode.includes('defineTestSpec')) {
		return {
			specType: 'test-spec',
			kind: 'test-spec',
		};
	}

	if (fileSourceCode.includes('defineFeature')) {
		return {
			specType: 'feature',
			kind: 'feature',
		};
	}
	if (
		fileSourceCode.includes('defineTheme') ||
		/ThemeSpec/.test(fileSourceCode)
	) {
		return {
			specType: 'theme',
			kind: 'theme',
		};
	}

	return {
		specType: 'unknown',
		kind: 'unknown',
	};
}

/**
 * Scan a single spec source string.
 */
export function scanSpecSource(code: string, filePath: string): SpecScanResult;
export function scanSpecSource(
	code: string,
	filePath: string,
	metadata: SpecDiscoveryMetadata
): SpecScanResult;
export function scanSpecSource(
	code: string,
	filePath: string,
	metadata: SpecDiscoveryMetadata = {}
): SpecScanResult {
	const keyMatch =
		code.match(/key\s*:\s*['"]([^'"]+)['"]/) ??
		(metadata.exportName ? [undefined, metadata.exportName] : undefined) ??
		code.match(/export\s+const\s+(\w+)\s*=/);
	const key = keyMatch?.[1] ?? 'unknown';

	const version = matchVersionField(code, 'version');
	const description = matchStringField(code, 'description') ?? undefined;
	const goal = matchStringField(code, 'goal') ?? undefined;
	const context = matchStringField(code, 'context') ?? undefined;
	const stabilityRaw = matchStringField(code, 'stability');
	const stability = isStability(stabilityRaw) ? stabilityRaw : undefined;
	const owners = matchStringArrayField(code, 'owners');
	const tags = matchStringArrayField(code, 'tags');

	// Determine type
	const inferredSpecType = inferSpecTypeFromCodeBlock(code);

	// Check feature flags/sections
	const hasMeta = /meta\s*:\s*\{/.test(code);
	const hasIo = /io\s*:\s*\{/.test(code);
	const hasPolicy = /policy\s*:\s*\{/.test(code);
	const hasPayload = /payload\s*:\s*\{/.test(code);
	const hasContent = /content\s*:\s*\{/.test(code);
	const hasDefinition = /definition\s*:\s*\{/.test(code);

	// References
	const emittedEvents =
		extractRefList(code, 'emits') ?? extractRefList(code, 'emittedEvents');
	const testRefs = extractTestRefs(code);

	const policyRefs = hasPolicy ? parsePolicy(code) : undefined;

	return {
		filePath,
		key,
		version,
		exportName: metadata.exportName,
		declarationLine: metadata.declarationLine,
		discoveryId: buildDiscoveryId(filePath, metadata, key),
		specType: inferredSpecType.specType,
		kind: inferredSpecType.kind,
		description,
		goal,
		context,
		stability,
		owners,
		tags,
		hasMeta,
		hasIo,
		hasPolicy,
		hasPayload,
		hasContent,
		hasDefinition,
		emittedEvents,
		policyRefs,
		testRefs,
		testTarget: extractTestTarget(code),
		testCoverage: extractTestCoverage(code),
		sourceBlock: code,
	};
}

/**
 * Infer spec type from file path convention.
 */
export function inferSpecTypeFromFilePath(
	filePath: string
): SpecScanResult['specType'] | 'feature' | 'unknown' {
	const authoringTarget = inferAuthoringTargetFromFilePath(filePath);
	if (authoringTarget !== 'unknown') {
		return authoringTarget;
	}
	if (filePath.includes('.policy.') || /\/policies?\//.test(filePath)) {
		return 'policy';
	}
	if (filePath.includes('.type.') || /\/types?\//.test(filePath)) {
		return 'type';
	}
	if (filePath.includes('.example.') || /\/examples?\//.test(filePath)) {
		return 'example';
	}
	return 'unknown';
}
