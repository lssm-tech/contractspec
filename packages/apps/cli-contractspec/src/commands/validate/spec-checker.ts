/**
 * Validate contract spec structure and content
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate spec structure
 */
export function validateSpecStructure(
  code: string,
  fileName: string
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for required exports (including re-exports)
  const hasExport =
    /export\s+(const|let)\s+\w+/.test(code) ||
    /export\s*\*\s*from/.test(code) ||
    /export\s*\{/.test(code);
  if (!hasExport) {
    errors.push('No exported spec found');
  }

  // Validate operation specs
  if (fileName.includes('.operation.') || fileName.includes('.contracts.')) {
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
  validateCommonFields(code, fileName, errors, warnings);

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

  // Check for key
  if (!code.match(/key:\s*['"][^'"]+['"]/)) {
    errors.push('Missing or invalid key field');
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

  if (!code.match(/(?:key|name):\s*['"][^'"]+['"]/)) {
    errors.push('Missing or invalid name/key field');
  }

  if (!code.match(/version:\s*\d+/)) {
    errors.push('Missing or invalid version field');
  }

  if (!code.includes('payload:')) {
    errors.push('Missing payload field');
  }

  // Check for past tense naming convention on event keys/names
  const keyMatches = code.matchAll(/(?:key|name):\s*['"]([^'"]+)['"]/g);
  for (const match of keyMatches) {
    const keyValue = match[1];
    if (!keyValue) continue;

    // Get the last segment of the key (e.g., 'created' from 'agent.created')
    const segments = keyValue.split('.');
    const lastSegment = segments[segments.length - 1] ?? '';

    // Allow common past tense patterns (including some irregular past tense)
    const isPastTense =
      /(?:ed|created|updated|deleted|completed|assigned|removed|triggered|synced|failed|processed|started|stopped|cancelled|finished|submitted|approved|rejected|confirmed|expired|activated|deactivated|verified|revoked|initialized|published|moved|sent|won|lost|run|begun|done|gone|seen|taken|made|paid|held|read|bought|sold|found|left|met|heard|known|thrown|shown|drawn|grown|flown|written|driven|chosen|spoken|broken|forgotten|hidden|bitten|eaten|given|risen|struck|shaken)$/i.test(
        lastSegment
      );

    if (!isPastTense) {
      warnings.push(
        'Event name should use past tense (e.g., "created", "updated")'
      );
      break; // Only warn once per file
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
  fileName: string,
  errors: string[],
  warnings: string[]
) {
  // Skip import checks for internal library files that define the types
  const isInternalLib =
    fileName.includes('/libs/contracts/') ||
    fileName.includes('/libs/contracts-transformers/') ||
    fileName.includes('/libs/schema/');

  // Check for SchemaModel import (skip for internal schema lib)
  if (
    code.includes('SchemaModel') &&
    !/from\s+['"]@(?:lssm|contractspec)\/lib\.schema(\/[^'"]+)?['"]/.test(code) &&
    !isInternalLib
  ) {
    errors.push('Missing import for SchemaModel from @contractspec/lib.schema');
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
    code.includes(': FeatureModuleSpec') ||
    code.includes('defineCommand(') ||
    code.includes('defineQuery(') ||
    code.includes('defineEvent(');

  if (
    usesSpecTypes &&
    !/from\s+['"]@(?:lssm|contractspec)\/lib\.contracts(\/[^'"]+)?['"]/.test(code) &&
    !isInternalLib
  ) {
    errors.push('Missing import from @contractspec/lib.contracts');
  }

  // Only validate owners and stability for files that actually define specs
  if (!usesSpecTypes) {
    return;
  }

  // Skip pure re-export files (only contain export statements)
  const isPureReExport =
    /^[\s\n]*(export\s*\*\s*from|export\s*\{\s*[^}]*\s*\}\s*from)/m.test(
      code
    ) && !code.includes('= {');
  if (isPureReExport) {
    return;
  }

  // Skip internal library files that define the types, registries, and helpers
  // These are in /libs/contracts/src/ or /libs/identity-rbac/src/contracts/
  // and contain interface/class/function definitions rather than spec instances
  const isInternalLibFile =
    isInternalLib &&
    // Files that define interfaces/types
    (/export\s+interface\s+(EventSpec|OperationSpec|PresentationSpec|FeatureSpec|FeatureModuleSpec)/.test(
      code
    ) ||
      // Files that define registries
      /export\s+class\s+\w*Registry/.test(code) ||
      // Files that define helper functions (arrow functions)
      /export\s+const\s+define(Command|Query|Event)\s*=\s*</.test(code) ||
      // Files that export from other modules (index files in contracts)
      /export\s+\*\s+from\s+['"]\.\/(operations|events|presentations|features)['"]/.test(
        code
      ));
  if (isInternalLibFile) {
    return;
  }

  // Check owners format
  const ownersMatch = code.match(/owners:\s*\[(.*?)\]/s);
  if (ownersMatch) {
    const ownersContent = ownersMatch[1];
    if (ownersContent && !ownersContent.includes('@')) {
      warnings.push('Owners should start with @ or use an Enum/Constant');
    }
  }

  // Check for stability - look for both string literal and enum usage
  const hasStabilityString =
    /stability:\s*['"](?:experimental|beta|stable|deprecated)['"]/.test(code);
  const hasStabilityEnum = /stability:\s*StabilityEnum\./.test(code);
  if (!hasStabilityString && !hasStabilityEnum) {
    warnings.push('Missing or invalid stability field');
  }
}

function validateDataViewSpec(
  code: string,
  errors: string[],
  warnings: string[]
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
    warnings.push('No fields defined for data view');
  }
}
