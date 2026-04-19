import type { FolderConventions } from '@contractspec/lib.contracts-spec';
import {
	AUTHORING_TARGET_DEFINITIONS,
	type AuthoringTargetDefinition,
	type AuthoringTargetId,
	type ConfigurableFolderConventionKey,
} from '../types/authoring-targets';

const DEFINITION_BY_ID = new Map(
	AUTHORING_TARGET_DEFINITIONS.map((definition) => [definition.id, definition])
);

export interface AuthoringTargetPathOptions {
	operationKind?: 'command' | 'query';
	translationLocale?: string;
}

export function getAuthoringTargetDefinitions(): readonly AuthoringTargetDefinition[] {
	return AUTHORING_TARGET_DEFINITIONS;
}

export function getAuthoringTargetDefinition(
	id: AuthoringTargetId
): AuthoringTargetDefinition {
	const definition = DEFINITION_BY_ID.get(id);
	if (!definition) {
		throw new Error(`Unknown authoring target: ${id}`);
	}
	return definition;
}

export function findAuthoringTargetDefinition(
	id: string
): AuthoringTargetDefinition | undefined {
	return DEFINITION_BY_ID.get(id as AuthoringTargetId);
}

export function getAuthoringTargetDefaultExtension(
	id: AuthoringTargetId
): string {
	return getAuthoringTargetDefinition(id).defaultExtension;
}

export function getAuthoringTargetDefaultSubdirectory(
	id: AuthoringTargetId,
	conventions?: Partial<FolderConventions>,
	options: AuthoringTargetPathOptions = {}
): string {
	const definition = getAuthoringTargetDefinition(id);

	if (definition.posture === 'package') {
		return definition.defaultBaseDir ?? '';
	}

	if (definition.folderConventionKey) {
		return getConventionValue(
			definition.folderConventionKey,
			conventions,
			options
		);
	}

	return definition.defaultSubdirectory ?? '';
}

export function getAuthoringTargetDefaultFileName(
	id: AuthoringTargetId,
	key: string,
	options: AuthoringTargetPathOptions = {}
): string {
	if (id === 'example') {
		return 'example.ts';
	}

	if (id === 'translation') {
		const localeSuffix = options.translationLocale
			? `.${options.translationLocale}`
			: '';
		return `${toKebabCase(key)}${localeSuffix}${getAuthoringTargetDefaultExtension(id)}`;
	}

	return `${toKebabCase(key)}${getAuthoringTargetDefaultExtension(id)}`;
}

function getConventionValue(
	key: ConfigurableFolderConventionKey,
	conventions?: Partial<FolderConventions>,
	options: AuthoringTargetPathOptions = {}
): string {
	switch (key) {
		case 'operations': {
			const raw = conventions?.operations ?? 'operations/commands|queries';
			const [commandsDir, queriesDir] = raw.split('|');
			return options.operationKind === 'query'
				? (queriesDir ?? 'queries')
				: (commandsDir ?? 'operations/commands');
		}
		case 'events':
			return conventions?.events ?? 'events';
		case 'presentations':
			return conventions?.presentations ?? 'presentations';
		case 'forms':
			return conventions?.forms ?? 'forms';
		case 'capabilities':
			return conventions?.capabilities ?? 'capabilities';
		case 'policies':
			return conventions?.policies ?? 'policies';
		case 'tests':
			return conventions?.tests ?? 'tests';
		case 'translations':
			return conventions?.translations ?? 'translations';
	}
}

function toKebabCase(value: string): string {
	return value
		.replace(/\./g, '-')
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.toLowerCase();
}

export function detectAuthoringTargetFromCodeBlock(
	code: string
): AuthoringTargetId | 'unknown' {
	if (code.includes('defineModuleBundle')) {
		return 'module-bundle';
	}
	if (
		code.includes('@contractspec/lib.builder-spec') &&
		/export\s+const\s+\w+\s*:\s*(?:BuilderWorkspace|BuilderPlan|BuilderBlueprint)/.test(
			code
		)
	) {
		return 'builder-spec';
	}
	if (
		code.includes('@contractspec/lib.provider-spec') &&
		/export\s+const\s+\w+\s*:\s*(?:ProviderCapabilityProfile|ExternalExecutionProvider)/.test(
			code
		)
	) {
		return 'provider-spec';
	}
	if (code.includes('defineCommand') || code.includes('defineQuery')) {
		return 'operation';
	}
	if (code.includes('defineEvent')) {
		return 'event';
	}
	if (code.includes('definePresentation') || /PresentationSpec/.test(code)) {
		return 'presentation';
	}
	if (code.includes('defineFeature')) {
		return 'feature';
	}
	if (code.includes('defineCapability') || /CapabilitySpec/.test(code)) {
		return 'capability';
	}
	if (code.includes('defineDataView') || /DataViewSpec/.test(code)) {
		return 'data-view';
	}
	if (code.includes('defineVisualization') || /VisualizationSpec/.test(code)) {
		return 'visualization';
	}
	if (
		code.includes('defineFormSpec') ||
		code.includes('defineForm') ||
		/FormSpec/.test(code)
	) {
		return 'form';
	}
	if (code.includes('defineAgent') || /AgentSpec/.test(code)) {
		return 'agent';
	}
	if (code.includes('defineMigration') || /MigrationSpec/.test(code)) {
		return 'migration';
	}
	if (code.includes('defineWorkflow') || /WorkflowSpec/.test(code)) {
		return 'workflow';
	}
	if (code.includes('defineExperiment') || /ExperimentSpec/.test(code)) {
		return 'experiment';
	}
	if (code.includes('defineIntegration') || /IntegrationSpec/.test(code)) {
		return 'integration';
	}
	if (code.includes('defineTheme') || /ThemeSpec/.test(code)) {
		return 'theme';
	}
	if (
		code.includes('defineKnowledgeSpace') ||
		/Knowledge(?:Space)?Spec/.test(code)
	) {
		return 'knowledge';
	}
	if (code.includes('defineTelemetry') || /TelemetrySpec/.test(code)) {
		return 'telemetry';
	}
	if (code.includes('defineExample') || /ExampleSpec/.test(code)) {
		return 'example';
	}
	if (
		(code.includes('defineAppConfig') &&
			!code.includes('export const defineAppConfig')) ||
		/AppBlueprintSpec/.test(code)
	) {
		return 'app-config';
	}
	if (
		code.includes('defineProductIntentSpec') ||
		/ProductIntentSpec/.test(code)
	) {
		return 'product-intent';
	}
	if (code.includes('definePolicy') || /PolicySpec/.test(code)) {
		return 'policy';
	}
	if (code.includes('defineTestSpec') || /\bTestSpec\b/.test(code)) {
		return 'test-spec';
	}
	if (
		code.includes('defineHarnessScenario') ||
		/HarnessScenarioSpec/.test(code)
	) {
		return 'harness-scenario';
	}
	if (code.includes('defineHarnessSuite') || /HarnessSuiteSpec/.test(code)) {
		return 'harness-suite';
	}
	if (code.includes('defineJob') || /\bJobSpec\b/.test(code)) {
		return 'job';
	}
	if (code.includes('defineTranslation') || /TranslationSpec/.test(code)) {
		return 'translation';
	}
	return 'unknown';
}

export function inferAuthoringTargetFromFilePath(
	filePath: string
): AuthoringTargetId | 'unknown' {
	if (filePath.includes('.bundle.') || /\/bundles?\//.test(filePath)) {
		return 'module-bundle';
	}
	if (
		filePath.includes('.builder-spec.') ||
		/\/builder-spec\//.test(filePath)
	) {
		return 'builder-spec';
	}
	if (
		filePath.includes('.provider-spec.') ||
		/\/provider-spec\//.test(filePath)
	) {
		return 'provider-spec';
	}
	if (filePath.includes('.contracts.') || /\/operations?\//.test(filePath)) {
		return 'operation';
	}
	if (filePath.includes('.event.') || /\/events?\//.test(filePath)) {
		return 'event';
	}
	if (
		filePath.includes('.presentation.') ||
		/\/presentations?\//.test(filePath)
	) {
		return 'presentation';
	}
	if (filePath.includes('.feature.') || /\/features?\//.test(filePath)) {
		return 'feature';
	}
	if (filePath.includes('.capability.')) {
		return 'capability';
	}
	if (filePath.includes('.data-view.') || /\/data-views?\//.test(filePath)) {
		return 'data-view';
	}
	if (filePath.includes('.visualization.')) {
		return 'visualization';
	}
	if (filePath.includes('.form.') || /\/forms?\//.test(filePath)) {
		return 'form';
	}
	if (filePath.includes('.agent.')) {
		return 'agent';
	}
	if (filePath.includes('.migration.') || /\/migrations?\//.test(filePath)) {
		return 'migration';
	}
	if (filePath.includes('.workflow.') || /\/workflows?\//.test(filePath)) {
		return 'workflow';
	}
	if (filePath.includes('.experiment.') || /\/experiments?\//.test(filePath)) {
		return 'experiment';
	}
	if (
		filePath.includes('.integration.') ||
		/\/integrations?\//.test(filePath)
	) {
		return 'integration';
	}
	if (filePath.includes('.theme.') || /\/themes?\//.test(filePath)) {
		return 'theme';
	}
	if (
		filePath.includes('.knowledge.') ||
		filePath.includes('.knowledge-space.')
	) {
		return 'knowledge';
	}
	if (filePath.includes('.telemetry.') || /\/telemetry\//.test(filePath)) {
		return 'telemetry';
	}
	if (/\/example\.ts$/.test(filePath) || filePath.includes('.example.')) {
		return 'example';
	}
	if (filePath.includes('.app-config.')) {
		return 'app-config';
	}
	if (filePath.includes('.product-intent.')) {
		return 'product-intent';
	}
	if (filePath.includes('.policy.')) {
		return 'policy';
	}
	if (filePath.includes('.test-spec.')) {
		return 'test-spec';
	}
	if (filePath.includes('.harness-scenario.')) {
		return 'harness-scenario';
	}
	if (filePath.includes('.harness-suite.')) {
		return 'harness-suite';
	}
	if (filePath.includes('.job.')) {
		return 'job';
	}
	if (filePath.includes('.translation.')) {
		return 'translation';
	}
	return 'unknown';
}

export function detectAuthoringTarget(
	code: string,
	filePath: string
): AuthoringTargetId | 'unknown' {
	const fromCode = detectAuthoringTargetFromCodeBlock(code);
	if (fromCode !== 'unknown') {
		return fromCode;
	}
	return inferAuthoringTargetFromFilePath(filePath);
}
