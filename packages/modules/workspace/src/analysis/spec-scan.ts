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
		/export\s+const\s+(\w+)\s*=\s*define(Command|Query|Event|Presentation|Capability|Policy|Example|AppConfig|Integration|Workflow|TestSpec|Feature|FormSpec|DataView|Migration|Telemetry|Experiment|KnowledgeSpace|Visualization|Agent|HarnessScenario|HarnessSuite|Job|Translation|ProductIntentSpec|PwaAppManifest|Theme|ModuleBundle)\s*\(/g;
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
	if (authoringTarget !== 'unknown') {
		return mapAuthoringTargetToInference(authoringTarget, fileSourceCode);
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
	return 'unknown';
}

function mapAuthoringTargetToInference(
	authoringTarget: Exclude<ReturnType<typeof detectAuthoringTarget>, 'unknown'>,
	fileSourceCode: string
): {
	specType: AnalyzedSpecType;
	kind: AnalyzedOperationKind;
} {
	switch (authoringTarget) {
		case 'module-bundle':
			return {
				specType: 'module-bundle',
				kind: 'module-bundle',
			};
		case 'builder-spec':
			return {
				specType: 'builder-spec',
				kind: 'builder-spec',
			};
		case 'provider-spec':
			return {
				specType: 'provider-spec',
				kind: 'provider-spec',
			};
		case 'operation':
			return {
				specType: 'operation',
				kind: fileSourceCode.includes('defineQuery') ? 'query' : 'command',
			};
		case 'knowledge':
			return {
				specType: 'knowledge',
				kind: 'knowledge-space',
			};
		default:
			return {
				specType: authoringTarget,
				kind: authoringTarget,
			};
	}
}
