/**
 * Impact detection service.
 *
 * Orchestrates contract snapshot generation, diff computation,
 * and impact classification for CI/CD pipelines.
 */
import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';

// Note: Using internal imports from the bundle which re-exports from module
import {
	type ContractSnapshot,
	classifyImpact,
	computeIoDiff,
	generateSnapshot,
	type SpecSnapshot,
} from '@contractspec/module.workspace';
import type { FsAdapter } from '../../ports/fs';
import type { GitAdapter } from '../../ports/git';
import type { LoggerAdapter } from '../../ports/logger';
import type { ImpactDetectionOptions, ImpactDetectionResult } from './types';

export const ImpactDetectionRulesDocBlock = {
	id: 'feature.impact-detection.rules',
	title: 'Breaking Change Classification Rules',
	kind: 'reference',
	visibility: 'public',
	route: '/docs/features/impact-detection/rules',
	body: `
# Breaking Change Classification Rules

## 🔴 Breaking Changes (10 rules)

1. **endpoint-removed**: Endpoint/operation was removed
2. **method-changed**: HTTP method was changed
3. **path-changed**: HTTP path was changed
4. **field-removed**: Response field was removed
5. **field-type-changed**: Field type was changed
6. **field-made-required**: Optional field became required
7. **enum-value-removed**: Enum value was removed
8. **nullable-removed**: Field is no longer nullable
9. **required-field-added-to-input**: Required field was added to input
10. **event-payload-field-removed**: Event payload field was removed

## 🟡 Non-Breaking Changes (4 rules)

1. **optional-field-added**: Optional field was added
2. **endpoint-added**: New endpoint/operation was added
3. **enum-value-added**: Enum value was added
4. **field-made-optional**: Required field became optional

## 🔵 Info-Level Changes (4 rules)

1. **stability-changed**: Stability level was changed
2. **description-changed**: Description was changed
3. **owners-changed**: Owners were changed
4. **tags-changed**: Tags were changed

## Rule Evaluation

Rules are evaluated in order (breaking → non-breaking → info). The first matching rule determines the severity.
  `,
	tags: ['impact-detection', 'breaking-changes', 'rules'],
} satisfies DocBlock;

/**
 * Detect the impact of contract changes between baseline and current state.
 *
 * @param adapters - Required adapters (fs, git, logger)
 * @param options - Detection options
 * @returns Impact detection result
 */
export async function detectImpact(
	adapters: { fs: FsAdapter; git: GitAdapter; logger: LoggerAdapter },
	options: ImpactDetectionOptions = {}
): Promise<ImpactDetectionResult> {
	const { fs, git, logger } = adapters;
	const workspaceRoot = options.workspaceRoot ?? process.cwd();

	logger.info('Starting impact detection...', { baseline: options.baseline });

	// Discover spec files
	const files = await fs.glob({
		pattern: options.pattern ?? '**/*.{operation,event}.ts',
		cwd: workspaceRoot,
	});

	const specFiles = files.filter(
		(f) =>
			!f.includes('.test.') &&
			!f.includes('.spec.') &&
			!f.includes('node_modules')
	);

	logger.debug(`Found ${specFiles.length} spec files`);

	// Load current (head) specs
	const headSpecs = await loadSpecs(fs, specFiles, workspaceRoot);
	const headSnapshot = generateSnapshot(headSpecs);

	// Load baseline specs if specified
	let baseSnapshot: ContractSnapshot;
	if (options.baseline) {
		const baseSpecs = await loadBaselineSpecs(
			fs,
			git,
			specFiles,
			options.baseline,
			workspaceRoot
		);
		baseSnapshot = generateSnapshot(baseSpecs);
	} else {
		// No baseline means all specs are "new"
		baseSnapshot = { version: '1.0.0', generatedAt: '', specs: [], hash: '' };
	}

	// Compute diffs between snapshots
	const diffs = computeSnapshotDiffs(baseSnapshot.specs, headSnapshot.specs);

	// Classify the impact
	const impactResult = classifyImpact(
		baseSnapshot.specs,
		headSnapshot.specs,
		diffs
	);

	logger.info('Impact detection complete', {
		status: impactResult.status,
		breaking: impactResult.summary.breaking,
		nonBreaking: impactResult.summary.nonBreaking,
	});

	return {
		...impactResult,
		workspaceRoot,
		specsAnalyzed: specFiles.length,
		baseRef: options.baseline,
	};
}

/**
 * Load specs from current filesystem.
 */
async function loadSpecs(
	fs: FsAdapter,
	files: string[],
	_workspaceRoot: string
): Promise<{ path: string; content: string }[]> {
	const specs: { path: string; content: string }[] = [];

	for (const file of files) {
		const content = await fs.readFile(file);
		specs.push({ path: file, content });
	}

	return specs;
}

/**
 * Load specs from git baseline.
 */
async function loadBaselineSpecs(
	_fs: FsAdapter,
	git: GitAdapter,
	files: string[],
	baseline: string,
	_workspaceRoot: string
): Promise<{ path: string; content: string }[]> {
	const specs: { path: string; content: string }[] = [];

	for (const file of files) {
		try {
			const content = await git.showFile(baseline, file);
			specs.push({ path: file, content });
		} catch {
			// File doesn't exist in baseline - skip (it's new)
		}
	}

	return specs;
}

/**
 * Compute diffs between two sets of spec snapshots.
 */
function computeSnapshotDiffs(
	baseSpecs: SpecSnapshot[],
	headSpecs: SpecSnapshot[]
): ReturnType<typeof computeIoDiff> {
	const diffs: ReturnType<typeof computeIoDiff> = [];

	const baseMap = new Map(baseSpecs.map((s) => [`${s.key}@${s.version}`, s]));
	const headMap = new Map(headSpecs.map((s) => [`${s.key}@${s.version}`, s]));

	// Compare specs that exist in both
	for (const [key, headSpec] of headMap) {
		const baseSpec = baseMap.get(key);
		if (
			baseSpec &&
			headSpec.type === 'operation' &&
			baseSpec.type === 'operation'
		) {
			const ioDiffs = computeIoDiff(baseSpec.io, headSpec.io);
			diffs.push(...ioDiffs);
		}
	}

	return diffs;
}
