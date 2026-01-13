/**
 * Spec structure validation utilities.
 * Extracted from cli-contractspec/src/commands/validate/spec-checker.ts
 */

import {
  Project,
  Node,
  SyntaxKind,
  SourceFile,
  ObjectLiteralExpression,
  InitializerExpressionGetableNode,
  PropertyAssignment,
} from 'ts-morph';
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

  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile(fileName, code);

  // Check for required exports (any export is sufficient for validity check)
  const hasExport =
    sourceFile.getExportAssignments().length > 0 ||
    sourceFile.getVariableStatements().some((s) => s.isExported()) ||
    sourceFile.getFunctions().some((f) => f.isExported()) ||
    sourceFile.getClasses().some((c) => c.isExported()) ||
    sourceFile.getExportDeclarations().length > 0;

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
    validateOperationSpec(sourceFile, errors, warnings, rulesConfig);
  }

  // Validate event specs
  if (fileName.includes('.event.')) {
    validateEventSpec(sourceFile, errors, warnings, rulesConfig);
  }

  // Validate presentation specs
  if (fileName.includes('.presentation.')) {
    validatePresentationSpec(sourceFile, errors, warnings);
  }

  if (fileName.includes('.workflow.')) {
    validateWorkflowSpec(sourceFile, errors, warnings, rulesConfig);
  }

  if (fileName.includes('.data-view.')) {
    validateDataViewSpec(sourceFile, errors, warnings, rulesConfig);
  }

  if (fileName.includes('.migration.')) {
    validateMigrationSpec(sourceFile, errors, warnings, rulesConfig);
  }

  if (fileName.includes('.telemetry.')) {
    validateTelemetrySpec(sourceFile, errors, warnings, rulesConfig);
  }

  if (fileName.includes('.experiment.')) {
    validateExperimentSpec(sourceFile, errors, warnings, rulesConfig);
  }

  if (fileName.includes('.app-config.')) {
    validateAppConfigSpec(sourceFile, errors, warnings, rulesConfig);
  }

  // Common validations
  validateCommonFields(sourceFile, fileName, errors, warnings, rulesConfig);

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
  sourceFile: SourceFile,
  errors: string[],
  warnings: string[],
  rulesConfig: RulesConfig
) {
  // Check for defineCommand or defineQuery calls
  const callExpressions = sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression
  );
  const hasDefine = callExpressions.some((call) => {
    const text = call.getExpression().getText();
    return text === 'defineCommand' || text === 'defineQuery';
  });

  if (!hasDefine) {
    errors.push('Missing defineCommand or defineQuery call');
  }

  // To check fields inside defineCommand/Query({ ... }), we find the object literal passed as argument
  let specObject: ObjectLiteralExpression | undefined;
  for (const call of callExpressions) {
    const text = call.getExpression().getText();
    if (text === 'defineCommand' || text === 'defineQuery') {
      const args = call.getArguments();
      if (args.length > 0 && Node.isObjectLiteralExpression(args[0])) {
        specObject = args[0];
        break;
      }
    }
  }

  if (specObject && Node.isObjectLiteralExpression(specObject)) {
    // Check for required meta fields
    if (!specObject.getProperty('meta')) {
      errors.push('Missing meta section');
    }

    if (!specObject.getProperty('io')) {
      errors.push('Missing io section');
    }

    if (!specObject.getProperty('policy')) {
      errors.push('Missing policy section');
    }

    const metaProp = specObject.getProperty('meta');
    let hasKey = false;
    let hasVersion = false;

    if (metaProp && Node.isPropertyAssignment(metaProp)) {
      const metaObj = metaProp.getInitializer();
      if (metaObj && Node.isObjectLiteralExpression(metaObj)) {
        if (metaObj.getProperty('key')) hasKey = true;
        if (metaObj.getProperty('version')) hasVersion = true;
      }
    }

    if (!hasKey) {
      // Double check if top level
      if (specObject.getProperty('key')) hasKey = true;
    }

    if (!hasKey) {
      errors.push('Missing or invalid key field');
    }

    if (!hasVersion) {
      if (specObject.getProperty('version')) hasVersion = true;
    }

    if (!hasVersion) {
      errors.push('Missing or invalid version field');
    }

    // Check for kind
    const hasExplicitKind = specObject.getProperty('kind');
    const callText = callExpressions
      .find((c) => {
        const t = c.getExpression().getText();
        return t === 'defineCommand' || t === 'defineQuery';
      })
      ?.getExpression()
      .getText();

    if (!callText && !hasExplicitKind) {
      errors.push(
        'Missing kind: use defineCommand(), defineQuery(), or explicit kind field'
      );
    }

    // Configurable warnings
    if (!specObject.getProperty('acceptance')) {
      emitRule(
        'require-acceptance',
        'operation',
        'No acceptance scenarios defined',
        errors,
        warnings,
        rulesConfig
      );
    }

    if (!specObject.getProperty('examples')) {
      emitRule(
        'require-examples',
        'operation',
        'No examples provided',
        errors,
        warnings,
        rulesConfig
      );
    }
  }

  // TODO check
  const fullText = sourceFile.getFullText();
  if (fullText.includes('TODO')) {
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
  sourceFile: SourceFile,
  errors: string[],
  warnings: string[],
  rulesConfig: RulesConfig
) {
  const specObject = getSpecObject(sourceFile, 'TelemetrySpec');

  if (!specObject) {
    errors.push('Missing TelemetrySpec type annotation');
    return;
  }

  if (specObject) {
    // Check meta.name
    const metaProp = specObject.getProperty('meta');
    let hasName = false;
    if (metaProp && Node.isPropertyAssignment(metaProp)) {
      const metaObj = metaProp.getInitializer();
      if (Node.isObjectLiteralExpression(metaObj)) {
        if (metaObj.getProperty('name')) hasName = true;
      }
    }
    if (!hasName) {
      errors.push('TelemetrySpec.meta is required');
    }

    if (!specObject.getProperty('events')) {
      errors.push('TelemetrySpec must declare events');
    }

    const privacyProp = specObject.getProperty('privacy');
    if (!privacyProp) {
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
}

function validateExperimentSpec(
  sourceFile: SourceFile,
  errors: string[],
  warnings: string[],
  rulesConfig: RulesConfig
) {
  const specObject = getSpecObject(sourceFile, 'ExperimentSpec');

  if (!specObject) {
    errors.push('Missing ExperimentSpec type annotation');
    return;
  }

  if (!specObject.getProperty('controlVariant')) {
    errors.push('ExperimentSpec must declare controlVariant');
  }
  if (!specObject.getProperty('variants')) {
    errors.push('ExperimentSpec must declare variants');
  }
  if (!specObject.getProperty('allocation')) {
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
  sourceFile: SourceFile,
  errors: string[],
  warnings: string[],
  rulesConfig: RulesConfig
) {
  // Check for defineAppConfig call first
  const callExpressions = sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression
  );
  const defineCall = callExpressions.find(
    (c) => c.getExpression().getText() === 'defineAppConfig'
  );

  let specObject: ObjectLiteralExpression | undefined;

  if (defineCall) {
    const args = defineCall.getArguments();
    if (args.length > 0 && Node.isObjectLiteralExpression(args[0])) {
      specObject = args[0];
    }
  } else {
    specObject = getSpecObject(sourceFile, 'AppBlueprintSpec');
  }

  if (!specObject) {
    errors.push(
      'Missing defineAppConfig call or AppBlueprintSpec type annotation'
    );
    return;
  }

  const metaProp = specObject.getProperty('meta');
  if (!metaProp) {
    errors.push('AppBlueprintSpec must define meta');
  } else if (Node.isPropertyAssignment(metaProp)) {
    const metaObj = metaProp.getInitializer();
    if (Node.isObjectLiteralExpression(metaObj)) {
      if (!metaObj.getProperty('appId')) {
        emitRule(
          'app-config-appid',
          'app-config',
          'AppBlueprint meta missing appId assignment',
          errors,
          warnings,
          rulesConfig
        );
      }
    }
  }

  if (!specObject.getProperty('capabilities')) {
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
  sourceFile: SourceFile,
  errors: string[],
  warnings: string[],
  rulesConfig: RulesConfig
) {
  const callExpressions = sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression
  );
  const defineEventCall = callExpressions.find(
    (c) => c.getExpression().getText() === 'defineEvent'
  );

  if (!defineEventCall) {
    errors.push('Missing defineEvent call');
    return;
  }

  let specObject: ObjectLiteralExpression | undefined;
  const args = defineEventCall.getArguments();
  if (args.length > 0 && Node.isObjectLiteralExpression(args[0])) {
    specObject = args[0];
  }

  if (specObject && Node.isObjectLiteralExpression(specObject)) {
    const metaProp = specObject.getProperty('meta');
    let hasKey = false;
    let hasVersion = false;

    if (metaProp && Node.isPropertyAssignment(metaProp)) {
      const metaObj = metaProp.getInitializer();
      if (Node.isObjectLiteralExpression(metaObj)) {
        const keyP = metaObj.getProperty('key');
        if (keyP && Node.isPropertyAssignment(keyP)) {
          const init = keyP.getInitializer();
          if (init && Node.isStringLiteral(init)) {
            hasKey = true;
          }
        }
        if (metaObj.getProperty('version')) hasVersion = true;
      }
    }

    if (!hasKey) {
      const kp = specObject.getProperty('key');
      if (kp && Node.isPropertyAssignment(kp)) {
        const init = kp.getInitializer();
        if (init && Node.isStringLiteral(init)) {
          hasKey = true;
        }
      }
    }
    if (!hasVersion && specObject.getProperty('version')) hasVersion = true;

    if (!hasKey) {
      errors.push('Missing or invalid key field');
    }

    if (!hasVersion) {
      errors.push('Missing or invalid version field');
    }

    if (!specObject.getProperty('payload')) {
      errors.push('Missing payload field');
    }

    let name = '';
    const getName = (
      obj: InitializerExpressionGetableNode & PropertyAssignment
    ) => {
      const init = obj.getInitializer();
      if (init && Node.isStringLiteral(init)) {
        return init.getLiteralText();
      }
      return '';
    };

    if (metaProp && Node.isPropertyAssignment(metaProp)) {
      const metaObj = metaProp.getInitializer();
      if (Node.isObjectLiteralExpression(metaObj)) {
        const nameP = metaObj.getProperty('name');
        if (nameP && Node.isPropertyAssignment(nameP)) {
          name = getName(nameP);
        }
      }
    }
    if (!name) {
      const nameP = specObject.getProperty('name');
      if (nameP && Node.isPropertyAssignment(nameP)) {
        name = getName(nameP);
      }
    }

    if (name) {
      const eventName = name.split('.').pop() ?? '';
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
}

/**
 * Validate presentation spec (V2 format)
 */
function validatePresentationSpec(
  sourceFile: SourceFile,
  errors: string[],
  _warnings: string[]
) {
  // Check for definePresentation call first
  const callExpressions = sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression
  );
  const defineCall = callExpressions.find(
    (c) => c.getExpression().getText() === 'definePresentation'
  );

  let specObject: ObjectLiteralExpression | undefined;

  if (defineCall) {
    const args = defineCall.getArguments();
    if (args.length > 0 && Node.isObjectLiteralExpression(args[0])) {
      specObject = args[0];
    }
  } else {
    specObject = getSpecObject(sourceFile, 'PresentationSpec');
  }

  if (!specObject) {
    errors.push(
      'Missing definePresentation call or PresentationSpec type annotation'
    );
    return;
  }

  if (!specObject.getProperty('meta')) {
    errors.push('Missing meta section');
  }

  const sourceProp = specObject.getProperty('source');
  if (!sourceProp) {
    errors.push('Missing source section');
  } else if (Node.isPropertyAssignment(sourceProp)) {
    const sourceObj = sourceProp.getInitializer();
    if (Node.isObjectLiteralExpression(sourceObj)) {
      const typeProp = sourceObj.getProperty('type');
      if (!typeProp) {
        errors.push('Missing or invalid source.type field');
      } else if (Node.isPropertyAssignment(typeProp)) {
        const init = typeProp.getInitializer();
        if (init && Node.isStringLiteral(init)) {
          const val = init.getLiteralText();
          if (val !== 'component' && val !== 'blocknotejs') {
            errors.push('Missing or invalid source.type field');
          }
        }
      }
    }
  }

  if (!specObject.getProperty('targets')) {
    errors.push('Missing targets section');
  }
}

function validateWorkflowSpec(
  sourceFile: SourceFile,
  errors: string[],
  warnings: string[],
  rulesConfig: RulesConfig
) {
  // Check for defineWorkflow call first
  const callExpressions = sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression
  );
  const defineCall = callExpressions.find(
    (c) => c.getExpression().getText() === 'defineWorkflow'
  );

  let specObject: ObjectLiteralExpression | undefined;

  if (defineCall) {
    const args = defineCall.getArguments();
    if (args.length > 0 && Node.isObjectLiteralExpression(args[0])) {
      specObject = args[0];
    }
  } else {
    specObject = getSpecObject(sourceFile, 'WorkflowSpec');
  }

  if (!specObject) {
    errors.push('Missing defineWorkflow call or WorkflowSpec type annotation');
    return;
  }

  if (!specObject.getProperty('definition')) {
    errors.push('Missing definition section');
  } else {
    const defProp = specObject.getProperty('definition');
    if (defProp && Node.isPropertyAssignment(defProp)) {
      const defObj = defProp.getInitializer();
      if (Node.isObjectLiteralExpression(defObj)) {
        if (!defObj.getProperty('steps')) {
          errors.push('Workflow must declare steps');
        }
        if (!defObj.getProperty('transitions')) {
          emitRule(
            'workflow-transitions',
            'workflow',
            'No transitions declared; workflow will complete after first step.',
            errors,
            warnings,
            rulesConfig
          );
        }
      }
    }
  }

  let titleFound = false;
  let domainFound = false;

  const metaProp = specObject.getProperty('meta');
  if (metaProp && Node.isPropertyAssignment(metaProp)) {
    const metaObj = metaProp.getInitializer();
    if (Node.isObjectLiteralExpression(metaObj)) {
      if (metaObj.getProperty('title')) titleFound = true;
      if (metaObj.getProperty('domain')) domainFound = true;
    }
  }

  if (!titleFound && specObject.getProperty('title')) titleFound = true;
  if (!domainFound && specObject.getProperty('domain')) domainFound = true;

  if (!titleFound) {
    warnings.push('Missing workflow title');
  }
  if (!domainFound) {
    warnings.push('Missing domain field');
  }

  if (sourceFile.getFullText().includes('TODO')) {
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
  sourceFile: SourceFile,
  errors: string[],
  warnings: string[],
  rulesConfig: RulesConfig
) {
  const specObject = getSpecObject(sourceFile, 'MigrationSpec');

  if (!specObject) {
    errors.push('Missing MigrationSpec type annotation');
    return;
  }

  const planProp = specObject.getProperty('plan');
  if (!planProp) {
    errors.push('Missing plan section');
  } else if (Node.isPropertyAssignment(planProp)) {
    const planObj = planProp.getInitializer();
    if (Node.isObjectLiteralExpression(planObj)) {
      if (!planObj.getProperty('up')) {
        errors.push('Migration must define at least one up step');
      }
    }
  }

  let nameFound = false;
  let versionFound = false;

  const metaProp = specObject.getProperty('meta');
  if (metaProp && Node.isPropertyAssignment(metaProp)) {
    const metaObj = metaProp.getInitializer();
    if (Node.isObjectLiteralExpression(metaObj)) {
      if (metaObj.getProperty('name')) nameFound = true;
      if (metaObj.getProperty('version')) versionFound = true;
    }
  }

  if (!nameFound && specObject.getProperty('name')) nameFound = true;
  if (!versionFound && specObject.getProperty('version')) versionFound = true;

  if (!nameFound) {
    errors.push('Missing or invalid migration name');
  }

  if (!versionFound) {
    errors.push('Missing or invalid migration version');
  }

  if (sourceFile.getFullText().includes('TODO')) {
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
  sourceFile: SourceFile,
  fileName: string,
  errors: string[],
  warnings: string[],
  rulesConfig: RulesConfig
) {
  const code = sourceFile.getFullText();

  // Skip import checks for internal library files that define the types
  const isInternalLib =
    fileName.includes('/libs/contracts/') ||
    fileName.includes('/libs/contracts-transformers/') ||
    fileName.includes('/libs/schema/');

  if (code.includes('SchemaModel') && !isInternalLib) {
    const imports = sourceFile.getImportDeclarations();
    const hasSchemaImport = imports.some((i) =>
      i.getModuleSpecifierValue().includes('@contractspec/lib.schema')
    );

    if (!hasSchemaImport) {
      errors.push(
        'Missing import for SchemaModel from @contractspec/lib.schema'
      );
    }
  }

  const usesSpecTypes =
    code.includes('OperationSpec') ||
    code.includes('PresentationSpec') ||
    code.includes('EventSpec') ||
    code.includes('FeatureSpec') ||
    code.includes('WorkflowSpec') ||
    code.includes('DataViewSpec') ||
    code.includes('MigrationSpec') ||
    code.includes('TelemetrySpec') ||
    code.includes('ExperimentSpec') ||
    code.includes('AppBlueprintSpec') ||
    code.includes('defineCommand') ||
    code.includes('defineQuery') ||
    code.includes('defineEvent') ||
    code.includes('definePresentation') ||
    code.includes('defineWorkflow') ||
    code.includes('defineDataView') ||
    code.includes('defineAppConfig') ||
    code.includes('defineFeature') || // Assuming features are validated elsewhere
    code.includes('defineExperiment') ||
    code.includes('defineTelemetry') ||
    code.includes('defineMigration');

  if (usesSpecTypes && !isInternalLib) {
    const imports = sourceFile.getImportDeclarations();
    const hasContractsImport = imports.some((i) =>
      i.getModuleSpecifierValue().includes('@contractspec/lib.contracts')
    );

    if (!hasContractsImport) {
      errors.push('Missing import from @contractspec/lib.contracts');
    }
  }

  const specObject = findMainExportedObject(sourceFile);

  if (specObject && Node.isObjectLiteralExpression(specObject)) {
    // Check owners format
    const ownersProp = specObject.getProperty('owners');
    // If owners in meta?
    let ownersArr = undefined;

    const checkOwners = (prop: Node) => {
      if (Node.isPropertyAssignment(prop)) {
        const init = prop.getInitializer();
        if (init && Node.isArrayLiteralExpression(init)) {
          return init;
        }
      }
      return undefined;
    };

    if (ownersProp) ownersArr = checkOwners(ownersProp);

    if (!ownersArr) {
      // Check meta.owners
      const metaProp = specObject.getProperty('meta');
      if (metaProp && Node.isPropertyAssignment(metaProp)) {
        const metaObj = metaProp.getInitializer();
        if (metaObj && Node.isObjectLiteralExpression(metaObj)) {
          const o = metaObj.getProperty('owners');
          if (o) ownersArr = checkOwners(o);
        }
      }
    }

    if (ownersArr) {
      for (const elem of ownersArr.getElements()) {
        if (Node.isStringLiteral(elem)) {
          const val = elem.getLiteralText();
          if (
            !val.includes('@') &&
            !val.includes('Enum') &&
            !val.match(/[A-Z][a-zA-Z0-9_]+/)
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
      }
    }

    // Check for stability
    // Similar logic: top level or meta
    let stabilityFound = false;
    const stabilityProp = specObject.getProperty('stability');
    if (stabilityProp) stabilityFound = true;

    if (!stabilityFound) {
      const metaProp = specObject.getProperty('meta');
      if (metaProp && Node.isPropertyAssignment(metaProp)) {
        const metaObj = metaProp.getInitializer();
        if (Node.isObjectLiteralExpression(metaObj)) {
          if (metaObj.getProperty('stability')) stabilityFound = true;
        }
      }
    }

    if (!stabilityFound) {
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
}

function validateDataViewSpec(
  sourceFile: SourceFile,
  errors: string[],
  warnings: string[],
  rulesConfig: RulesConfig
) {
  // Check for defineDataView call first
  const callExpressions = sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression
  );
  const defineCall = callExpressions.find(
    (c) => c.getExpression().getText() === 'defineDataView'
  );

  let specObject: ObjectLiteralExpression | undefined;

  if (defineCall) {
    const args = defineCall.getArguments();
    if (args.length > 0 && Node.isObjectLiteralExpression(args[0])) {
      specObject = args[0];
    }
  } else {
    specObject = getSpecObject(sourceFile, 'DataViewSpec');
  }

  if (!specObject) {
    errors.push('Missing defineDataView call or DataViewSpec type annotation');
    return;
  }
  if (!specObject.getProperty('meta')) {
    errors.push('Missing meta section');
  }
  if (!specObject.getProperty('source')) {
    errors.push('Missing source section');
  }

  const viewProp = specObject.getProperty('view');
  if (!viewProp) {
    errors.push('Missing view section');
    // Ensure missing kind warning is also triggered for strict validation
    errors.push('Missing or invalid view.kind (list/table/detail/grid)');
  } else if (Node.isPropertyAssignment(viewProp)) {
    const viewObj = viewProp.getInitializer();
    if (Node.isObjectLiteralExpression(viewObj)) {
      const kindProp = viewObj.getProperty('kind');
      if (!kindProp) {
        errors.push('Missing or invalid view.kind (list/table/detail/grid)');
      } else if (Node.isPropertyAssignment(kindProp)) {
        const init = kindProp.getInitializer();
        if (init && Node.isStringLiteral(init)) {
          const val = init.getLiteralText();
          if (!['list', 'table', 'detail', 'grid'].includes(val)) {
            errors.push(
              'Missing or invalid view.kind (list/table/detail/grid)'
            );
          }
        }
      }
    }
  }

  let fieldsFound = false;
  if (viewProp && Node.isPropertyAssignment(viewProp)) {
    const viewObj = viewProp.getInitializer();
    if (Node.isObjectLiteralExpression(viewObj)) {
      if (viewObj.getProperty('fields')) fieldsFound = true;
    }
  }
  if (!fieldsFound && specObject.getProperty('fields')) fieldsFound = true;

  if (!fieldsFound) {
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

// Helper to find spec object with specific type annotation
function getSpecObject(
  sourceFile: SourceFile,
  typeName: string
): ObjectLiteralExpression | undefined {
  const varStmts = sourceFile.getVariableStatements();
  for (const stmt of varStmts) {
    if (stmt.isExported()) {
      for (const decl of stmt.getDeclarations()) {
        const typeNode = decl.getTypeNode();
        if (typeNode && typeNode.getText().includes(typeName)) {
          const init = decl.getInitializer();
          if (init && Node.isObjectLiteralExpression(init)) {
            return init;
          }
        }
      }
    }
  }
  const exportAssign = sourceFile.getExportAssignment(
    (d) => !d.isExportEquals()
  );
  if (exportAssign) {
    const expr = exportAssign.getExpression();
    if (Node.isAsExpression(expr)) {
      if (expr.getTypeNode()?.getText().includes(typeName)) {
        const inner = expr.getExpression();
        if (Node.isObjectLiteralExpression(inner)) return inner;
      }
    }
    if (Node.isObjectLiteralExpression(expr)) {
      return expr;
    }
  }
  return undefined;
}

function findMainExportedObject(
  sourceFile: SourceFile
): ObjectLiteralExpression | undefined {
  // Return any object that looks like it could be the main spec
  const varStmts = sourceFile.getVariableStatements();
  for (const stmt of varStmts) {
    if (stmt.isExported()) {
      for (const decl of stmt.getDeclarations()) {
        const init = decl.getInitializer();
        if (init) {
          if (Node.isObjectLiteralExpression(init)) return init;
          if (Node.isCallExpression(init)) {
            const args = init.getArguments();
            if (args.length > 0 && Node.isObjectLiteralExpression(args[0]))
              return args[0];
          }
        }
      }
    }
  }
  const exportAssign = sourceFile.getExportAssignment(
    (d) => !d.isExportEquals()
  );
  if (exportAssign) {
    const expr = exportAssign.getExpression();
    if (Node.isObjectLiteralExpression(expr)) return expr;
    if (
      Node.isAsExpression(expr) &&
      Node.isObjectLiteralExpression(expr.getExpression())
    )
      return expr.getExpression() as ObjectLiteralExpression;
    if (Node.isCallExpression(expr)) {
      const args = expr.getArguments();
      if (args.length > 0 && Node.isObjectLiteralExpression(args[0]))
        return args[0];
    }
  }
  return undefined;
}
