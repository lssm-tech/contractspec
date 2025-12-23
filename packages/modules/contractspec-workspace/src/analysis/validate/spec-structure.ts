/**
 * Spec structure validation utilities.
 * Extracted from cli-contractspec/src/commands/validate/spec-checker.ts
 */

import type { ValidationResult } from '../../types/analysis-types';

export type { ValidationResult };

/**
 * Validate spec structure based on source code and filename.
 */
export function validateSpecStructure(
  code: string,
  fileName: string
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for required exports
  const hasExport = /export\s+(const|let)\s+\w+/.test(code);
  if (!hasExport) {
    errors.push('No exported spec found');
  }

  // Validate operation specs
  if (
    fileName.includes('.contracts.') ||
    fileName.includes('.contract.') ||
    fileName.includes('.operations.') ||
    fileName.includes('.operation.')
  ) {
    validateOperationSpec(code, errors, warnings);
  }

  // Validate event specs
  if (fileName.includes('.event.')) {
    validateEventSpec(code, errors, warnings);
  }

  // Validate presentation specs
  if (fileName.includes('.presentation.')) {
    validatePresentationSpec(code, errors, warnings);
  }

  if (fileName.includes('.workflow.')) {
    validateWorkflowSpec(code, errors, warnings);
  }

  if (fileName.includes('.data-view.')) {
    validateDataViewSpec(code, errors, warnings);
  }

  if (fileName.includes('.migration.')) {
    validateMigrationSpec(code, errors, warnings);
  }

  if (fileName.includes('.telemetry.')) {
    validateTelemetrySpec(code, errors, warnings);
  }

  if (fileName.includes('.experiment.')) {
    validateExperimentSpec(code, errors, warnings);
  }

  if (fileName.includes('.app-config.')) {
    validateAppConfigSpec(code, errors, warnings);
  }

  // Common validations
  validateCommonFields(code, errors, warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate operation spec
 */
function validateOperationSpec(
  code: string,
  errors: string[],
  warnings: string[]
) {
  // Check for defineCommand or defineQuery
  const hasDefine = /define(Command|Query)/.test(code);
  if (!hasDefine) {
    errors.push('Missing defineCommand or defineQuery call');
  }

  // Check for required meta fields
  if (!code.includes('meta:')) {
    errors.push('Missing meta section');
  }

  if (!code.includes('io:')) {
    errors.push('Missing io section');
  }

  if (!code.includes('policy:')) {
    errors.push('Missing policy section');
  }

  // Check for name
  if (!code.match(/name:\s*['"][^'"]+['"]/)) {
    errors.push('Missing or invalid name field');
  }

  // Check for version
  if (!code.match(/version:\s*\d+/)) {
    errors.push('Missing or invalid version field');
  }

  // Check for kind (defineCommand/defineQuery set it automatically, or explicit kind field)
  const hasDefineCommand = /defineCommand\s*\(/.test(code);
  const hasDefineQuery = /defineQuery\s*\(/.test(code);
  const hasExplicitKind = /kind:\s*['"](?:command|query)['"]/.test(code);
  if (!hasDefineCommand && !hasDefineQuery && !hasExplicitKind) {
    errors.push(
      'Missing kind: use defineCommand(), defineQuery(), or explicit kind field'
    );
  }

  // Warnings
  if (!code.includes('acceptance:')) {
    warnings.push('No acceptance scenarios defined');
  }

  if (!code.includes('examples:')) {
    warnings.push('No examples provided');
  }

  if (code.includes('TODO')) {
    warnings.push('Contains TODO items that need completion');
  }
}

function validateTelemetrySpec(
  code: string,
  errors: string[],
  warnings: string[]
) {
  if (!code.match(/:\s*TelemetrySpec\s*=/)) {
    errors.push('Missing TelemetrySpec type annotation');
  }

  if (!code.match(/meta:\s*{[\s\S]*name:/)) {
    errors.push('TelemetrySpec.meta is required');
  }

  if (!code.includes('events:')) {
    errors.push('TelemetrySpec must declare events');
  }

  if (!code.match(/privacy:\s*'(public|internal|pii|sensitive)'/)) {
    warnings.push('No explicit privacy classification found');
  }
}

function validateExperimentSpec(
  code: string,
  errors: string[],
  warnings: string[]
) {
  if (!code.match(/:\s*ExperimentSpec\s*=/)) {
    errors.push('Missing ExperimentSpec type annotation');
  }
  if (!code.includes('controlVariant')) {
    errors.push('ExperimentSpec must declare controlVariant');
  }
  if (!code.includes('variants:')) {
    errors.push('ExperimentSpec must declare variants');
  }
  if (!code.match(/allocation:\s*{/)) {
    warnings.push('ExperimentSpec missing allocation configuration');
  }
}

function validateAppConfigSpec(
  code: string,
  errors: string[],
  warnings: string[]
) {
  if (!code.match(/:\s*AppBlueprintSpec\s*=/)) {
    errors.push('Missing AppBlueprintSpec type annotation');
  }
  if (!code.includes('meta:')) {
    errors.push('AppBlueprintSpec must define meta');
  }
  if (!code.includes('appId')) {
    warnings.push('AppBlueprint meta missing appId assignment');
  }
  if (!code.includes('capabilities')) {
    warnings.push('App blueprint spec does not declare capabilities');
  }
}

/**
 * Validate event spec
 */
function validateEventSpec(code: string, errors: string[], warnings: string[]) {
  if (!code.includes('defineEvent')) {
    errors.push('Missing defineEvent call');
  }

  if (!code.match(/name:\s*['"][^'"]+['"]/)) {
    errors.push('Missing or invalid name field');
  }

  if (!code.match(/version:\s*\d+/)) {
    errors.push('Missing or invalid version field');
  }

  if (!code.includes('payload:')) {
    errors.push('Missing payload field');
  }

  // Check for past tense naming convention
  const nameMatch = code.match(/name:\s*['"]([^'"]+)['"]/);
  if (nameMatch?.[1]) {
    const eventName = nameMatch[1].split('.').pop() ?? '';
    if (!eventName.match(/(ed|created|updated|deleted|completed)$/i)) {
      warnings.push(
        'Event name should use past tense (e.g., "created", "updated")'
      );
    }
  }
}

/**
 * Validate presentation spec (V2 format)
 */
function validatePresentationSpec(
  code: string,
  errors: string[],
  _warnings: string[]
) {
  if (!code.match(/:\s*PresentationSpec\s*=/)) {
    errors.push('Missing PresentationSpec type annotation');
  }

  if (!code.includes('meta:')) {
    errors.push('Missing meta section');
  }

  if (!code.includes('source:')) {
    errors.push('Missing source section');
  }

  if (!code.match(/type:\s*['"](?:component|blocknotejs)['"]/)) {
    errors.push('Missing or invalid source.type field');
  }

  if (!code.includes('targets:')) {
    errors.push('Missing targets section');
  }
}

function validateWorkflowSpec(
  code: string,
  errors: string[],
  warnings: string[]
) {
  if (!code.match(/:\s*WorkflowSpec\s*=/)) {
    errors.push('Missing WorkflowSpec type annotation');
  }

  if (!code.includes('definition:')) {
    errors.push('Missing definition section');
  }

  if (!code.includes('steps:')) {
    errors.push('Workflow must declare steps');
  }

  if (!code.includes('transitions:')) {
    warnings.push(
      'No transitions declared; workflow will complete after first step.'
    );
  }

  if (!code.match(/title:\s*['"][^'"]+['"]/)) {
    warnings.push('Missing workflow title');
  }

  if (!code.match(/domain:\s*['"][^'"]+['"]/)) {
    warnings.push('Missing domain field');
  }

  if (code.includes('TODO')) {
    warnings.push('Contains TODO items that need completion');
  }
}

function validateMigrationSpec(
  code: string,
  errors: string[],
  warnings: string[]
) {
  if (!code.match(/:\s*MigrationSpec\s*=/)) {
    errors.push('Missing MigrationSpec type annotation');
  }

  if (!code.includes('plan:')) {
    errors.push('Missing plan section');
  } else {
    if (!code.includes('up:')) {
      errors.push('Migration must define at least one up step');
    }
  }

  if (!code.match(/name:\s*['"][^'"]+['"]/)) {
    errors.push('Missing or invalid migration name');
  }

  if (!code.match(/version:\s*\d+/)) {
    errors.push('Missing or invalid migration version');
  }

  if (code.includes('TODO')) {
    warnings.push('Contains TODO items that need completion');
  }
}

/**
 * Validate common fields across all spec types
 */
function validateCommonFields(
  code: string,
  errors: string[],
  warnings: string[]
) {
  // Check for SchemaModel import
  if (
    code.includes('SchemaModel') &&
    !code.includes("from '@lssm/lib.schema'")
  ) {
    errors.push('Missing import for SchemaModel from @lssm/lib.schema');
  }

  // Check for contracts import only if spec types are used
  // Skip for files that define the types themselves (inside lib.contracts)
  const usesSpecTypes =
    code.includes(': OperationSpec') ||
    code.includes(': PresentationSpec') ||
    code.includes(': EventSpec') ||
    code.includes(': FeatureSpec') ||
    code.includes(': WorkflowSpec') ||
    code.includes(': DataViewSpec') ||
    code.includes(': MigrationSpec') ||
    code.includes(': TelemetrySpec') ||
    code.includes(': ExperimentSpec') ||
    code.includes(': AppBlueprintSpec') ||
    code.includes('defineCommand(') ||
    code.includes('defineQuery(') ||
    code.includes('defineEvent(');

  if (usesSpecTypes && !code.includes("from '@lssm/lib.contracts'")) {
    errors.push('Missing import from @lssm/lib.contracts');
  }

  // Check owners format
  const ownersMatch = code.match(/owners:\s*\[(.*?)\]/s);
  if (ownersMatch?.[1]) {
    const ownersContent = ownersMatch[1];
    if (!ownersContent.includes('@')) {
      warnings.push('Owners should start with @ (e.g., "@team")');
    }
  }

  // Check for stability
  if (
    !code.match(/stability:\s*['"](?:experimental|beta|stable|deprecated)['"]/)
  ) {
    warnings.push('Missing or invalid stability field');
  }
}

function validateDataViewSpec(
  code: string,
  errors: string[],
  _warnings: string[]
) {
  if (!code.match(/:\s*DataViewSpec\s*=/)) {
    errors.push('Missing DataViewSpec type annotation');
  }
  if (!code.includes('meta:')) {
    errors.push('Missing meta section');
  }
  if (!code.includes('source:')) {
    errors.push('Missing source section');
  }
  if (!code.includes('view:')) {
    errors.push('Missing view section');
  }
  if (!code.match(/kind:\s*['"](list|table|detail|grid)['"]/)) {
    errors.push('Missing or invalid view.kind (list/table/detail/grid)');
  }
  if (!code.match(/fields:\s*\[/)) {
    // Note: _warnings unused in this case, but kept for consistency with other validators
    errors.push('No fields defined for data view');
  }
}
