/**
 * Spec structure validation utilities.
 * Extracted from cli-contractspec/src/commands/validate/spec-checker.ts
 */

import type { ValidationResult } from '../../types/analysis-types';

export type { ValidationResult };

/**
 * Rule severity level for lint rules.
 */
export type RuleSeverity = 'off' | 'warn' | 'error';

/**
 * Spec kind for rule overrides mapping.
 */
export type SpecKind =
  | 'operation'
  | 'event'
  | 'presentation'
  | 'feature'
  | 'workflow'
  | 'data-view'
  | 'migration'
  | 'telemetry'
  | 'experiment'
  | 'app-config';

/**
 * Interface for resolving rule severity.
 */
export interface RulesConfig {
  /**
   * Get the severity for a rule, considering spec kind overrides.
   * Returns 'warn' by default if not configured.
   */
  getRule(ruleName: string, specKind: SpecKind): RuleSeverity;
}

/**
 * Default rules config that returns 'warn' for all rules.
 */
const DEFAULT_RULES_CONFIG: RulesConfig = {
  getRule: () => 'warn',
};

/**
 * Validate spec structure based on source code and filename.
 */
export function validateSpecStructure(
  code: string,
  fileName: string,
  rulesConfig: RulesConfig = DEFAULT_RULES_CONFIG
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for required exports (any export is sufficient for validity check)
  const hasExport = /export\s/.test(code);
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
    validateOperationSpec(code, errors, warnings, rulesConfig);
  }

  // Validate event specs
  if (fileName.includes('.event.')) {
    validateEventSpec(code, errors, warnings, rulesConfig);
  }

  // Validate presentation specs
  if (fileName.includes('.presentation.')) {
    validatePresentationSpec(code, errors, warnings);
  }

  if (fileName.includes('.workflow.')) {
    validateWorkflowSpec(code, errors, warnings, rulesConfig);
  }

  if (fileName.includes('.data-view.')) {
    validateDataViewSpec(code, errors, warnings, rulesConfig);
  }

  if (fileName.includes('.migration.')) {
    validateMigrationSpec(code, errors, warnings, rulesConfig);
  }

  if (fileName.includes('.telemetry.')) {
    validateTelemetrySpec(code, errors, warnings, rulesConfig);
  }

  if (fileName.includes('.experiment.')) {
    validateExperimentSpec(code, errors, warnings, rulesConfig);
  }

  if (fileName.includes('.app-config.')) {
    validateAppConfigSpec(code, errors, warnings, rulesConfig);
  }

  // Common validations
  validateCommonFields(code, fileName, errors, warnings, rulesConfig);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Helper to emit a message based on rule severity.
 */
function emitRule(
  ruleName: string,
  specKind: SpecKind,
  message: string,
  errors: string[],
  warnings: string[],
  rulesConfig: RulesConfig
): void {
  const severity = rulesConfig.getRule(ruleName, specKind);
  if (severity === 'off') return;
  if (severity === 'error') {
    errors.push(message);
  } else {
    warnings.push(message);
  }
}

/**
 * Validate operation spec
 */
function validateOperationSpec(
  code: string,
  errors: string[],
  warnings: string[],
  rulesConfig: RulesConfig
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

  // Configurable warnings
  if (!code.includes('acceptance:')) {
    emitRule(
      'require-acceptance',
      'operation',
      'No acceptance scenarios defined',
      errors,
      warnings,
      rulesConfig
    );
  }

  if (!code.includes('examples:')) {
    emitRule(
      'require-examples',
      'operation',
      'No examples provided',
      errors,
      warnings,
      rulesConfig
    );
  }

  if (code.includes('TODO')) {
    emitRule(
      'no-todo',
      'operation',
      'Contains TODO items that need completion',
      errors,
      warnings,
      rulesConfig
    );
  }
}

function validateTelemetrySpec(
  code: string,
  errors: string[],
  warnings: string[],
  rulesConfig: RulesConfig
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
    emitRule(
      'telemetry-privacy',
      'telemetry',
      'No explicit privacy classification found',
      errors,
      warnings,
      rulesConfig
    );
  }
}

function validateExperimentSpec(
  code: string,
  errors: string[],
  warnings: string[],
  rulesConfig: RulesConfig
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
    emitRule(
      'experiment-allocation',
      'experiment',
      'ExperimentSpec missing allocation configuration',
      errors,
      warnings,
      rulesConfig
    );
  }
}

function validateAppConfigSpec(
  code: string,
  errors: string[],
  warnings: string[],
  rulesConfig: RulesConfig
) {
  if (!code.match(/:\s*AppBlueprintSpec\s*=/)) {
    errors.push('Missing AppBlueprintSpec type annotation');
  }
  if (!code.includes('meta:')) {
    errors.push('AppBlueprintSpec must define meta');
  }
  if (!code.includes('appId')) {
    emitRule(
      'app-config-appid',
      'app-config',
      'AppBlueprint meta missing appId assignment',
      errors,
      warnings,
      rulesConfig
    );
  }
  if (!code.includes('capabilities')) {
    emitRule(
      'app-config-capabilities',
      'app-config',
      'App blueprint spec does not declare capabilities',
      errors,
      warnings,
      rulesConfig
    );
  }
}

/**
 * Validate event spec
 */
function validateEventSpec(
  code: string,
  errors: string[],
  warnings: string[],
  rulesConfig: RulesConfig
) {
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
      emitRule(
        'event-past-tense',
        'event',
        'Event name should use past tense (e.g., "created", "updated")',
        errors,
        warnings,
        rulesConfig
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
  warnings: string[],
  rulesConfig: RulesConfig
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
    emitRule(
      'workflow-transitions',
      'workflow',
      'No transitions declared; workflow will complete after first step.',
      errors,
      warnings,
      rulesConfig
    );
  }

  if (!code.match(/title:\s*['"][^'"]+['"]/)) {
    warnings.push('Missing workflow title');
  }

  if (!code.match(/domain:\s*['"][^'"]+['"]/)) {
    warnings.push('Missing domain field');
  }

  if (code.includes('TODO')) {
    emitRule(
      'no-todo',
      'workflow',
      'Contains TODO items that need completion',
      errors,
      warnings,
      rulesConfig
    );
  }
}

function validateMigrationSpec(
  code: string,
  errors: string[],
  warnings: string[],
  rulesConfig: RulesConfig
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
    emitRule(
      'no-todo',
      'migration',
      'Contains TODO items that need completion',
      errors,
      warnings,
      rulesConfig
    );
  }
}

/**
 * Validate common fields across all spec types
 */
function validateCommonFields(
  code: string,
  fileName: string,
  errors: string[],
  warnings: string[],
  rulesConfig: RulesConfig
) {
  // Skip import checks for internal library files that define the types
  const isInternalLib =
    fileName.includes('/libs/contracts/') ||
    fileName.includes('/libs/contracts-transformers/') ||
    fileName.includes('/libs/schema/');

  // Check for SchemaModel import (skip for internal schema lib)
  if (
    code.includes('SchemaModel') &&
    !/from\s+['"]@lssm\/lib\.schema(\/[^'"]+)?['"]/.test(code) &&
    !isInternalLib
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

  if (
    usesSpecTypes &&
    !/from\s+['"]@lssm\/lib\.contracts(\/[^'"]+)?['"]/.test(code) &&
    !isInternalLib
  ) {
    errors.push('Missing import from @lssm/lib.contracts');
  }

  // Check owners format
  const ownersMatch = code.match(/owners:\s*\[(.*?)\]/s);
  if (ownersMatch?.[1]) {
    const ownersContent = ownersMatch[1];
    // Allow @ mentions, OwnersEnum usage, or other constants (CAPS/PascalCase)
    if (
      !ownersContent.includes('@') &&
      !ownersContent.includes('Enum') &&
      !ownersContent.match(/[A-Z][a-zA-Z0-9_]+/)
    ) {
      emitRule(
        'require-owners-format',
        'operation',
        'Owners should start with @ or use an Enum/Constant',
        errors,
        warnings,
        rulesConfig
      );
    }
  }

  // Check for stability
  // Allow standard string literals, Enum usage (e.g. StabilityEnum.Beta), or Constants
  if (
    !code.match(
      /stability:\s*(?:['"](?:experimental|beta|stable|deprecated)['"]|[A-Z][a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)?)/
    )
  ) {
    emitRule(
      'require-stability',
      'operation',
      'Missing or invalid stability field',
      errors,
      warnings,
      rulesConfig
    );
  }
}

function validateDataViewSpec(
  code: string,
  errors: string[],
  warnings: string[],
  rulesConfig: RulesConfig
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
    emitRule(
      'data-view-fields',
      'data-view',
      'No fields defined for data view',
      errors,
      warnings,
      rulesConfig
    );
  }
}
