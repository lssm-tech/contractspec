import {
	AUTHORING_TARGET_DEFINITIONS,
	type AuthoringTargetDefinition,
	type AuthoringTargetId,
} from '../types/authoring-targets';

const DEFINITION_BY_ID = new Map(
	AUTHORING_TARGET_DEFINITIONS.map((definition) => [definition.id, definition])
);

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
	if (code.includes('defineForm') || /FormSpec/.test(code)) {
		return 'form';
	}
	if (code.includes('defineFeature')) {
		return 'feature';
	}
	if (code.includes('defineWorkflow') || /WorkflowSpec/.test(code)) {
		return 'workflow';
	}
	if (code.includes('defineDataView') || /DataViewSpec/.test(code)) {
		return 'data-view';
	}
	if (code.includes('defineMigration') || /MigrationSpec/.test(code)) {
		return 'migration';
	}
	if (code.includes('defineTelemetry') || /TelemetrySpec/.test(code)) {
		return 'telemetry';
	}
	if (code.includes('defineExperiment') || /ExperimentSpec/.test(code)) {
		return 'experiment';
	}
	if (
		(code.includes('defineAppConfig') &&
			!code.includes('export const defineAppConfig')) ||
		/AppBlueprintSpec/.test(code)
	) {
		return 'app-config';
	}
	if (code.includes('defineIntegration') || /IntegrationSpec/.test(code)) {
		return 'integration';
	}
	if (
		code.includes('defineKnowledgeSpace') ||
		/Knowledge(?:Space)?Spec/.test(code)
	) {
		return 'knowledge';
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
	if (filePath.includes('.form.') || /\/forms?\//.test(filePath)) {
		return 'form';
	}
	if (filePath.includes('.feature.') || /\/features?\//.test(filePath)) {
		return 'feature';
	}
	if (filePath.includes('.workflow.') || /\/workflows?\//.test(filePath)) {
		return 'workflow';
	}
	if (filePath.includes('.data-view.') || /\/data-views?\//.test(filePath)) {
		return 'data-view';
	}
	if (filePath.includes('.migration.') || /\/migrations?\//.test(filePath)) {
		return 'migration';
	}
	if (filePath.includes('.telemetry.') || /\/telemetry\//.test(filePath)) {
		return 'telemetry';
	}
	if (filePath.includes('.experiment.') || /\/experiments?\//.test(filePath)) {
		return 'experiment';
	}
	if (filePath.includes('.app-config.')) {
		return 'app-config';
	}
	if (
		filePath.includes('.integration.') ||
		/\/integrations?\//.test(filePath)
	) {
		return 'integration';
	}
	if (
		filePath.includes('.knowledge.') ||
		filePath.includes('.knowledge-space.') ||
		/\/knowledge\//.test(filePath)
	) {
		return 'knowledge';
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
