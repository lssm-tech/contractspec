import { basename } from 'node:path';

export type SpecBuildType =
  | 'operation'
  | 'presentation'
  | 'form'
  | 'event'
  | 'workflow'
  | 'data-view'
  | 'telemetry'
  | 'migration'
  | 'experiment'
  | 'app-config'
  | 'integration'
  | 'knowledge'
  | 'unknown';

export function detectSpecType(
  specFile: string,
  specCode: string
): SpecBuildType {
  const file = basename(specFile);
  if (file.includes('.contracts.') || /define(Command|Query)/.test(specCode)) {
    return 'operation';
  }
  if (file.includes('.presentation.') || /PresentationSpec/.test(specCode)) {
    return 'presentation';
  }
  if (file.includes('.form.') || /defineForm/.test(specCode)) {
    return 'form';
  }
  if (file.includes('.event.') || /defineEvent/.test(specCode)) {
    return 'event';
  }
  if (file.includes('.workflow.') || /WorkflowSpec/.test(specCode)) {
    return 'workflow';
  }
  if (file.includes('.data-view.') || /DataViewSpec/.test(specCode)) {
    return 'data-view';
  }
  if (file.includes('.telemetry.') || /TelemetrySpec/.test(specCode)) {
    return 'telemetry';
  }
  if (file.includes('.experiment.') || /ExperimentSpec/.test(specCode)) {
    return 'experiment';
  }
  if (file.includes('.app-config.') || /AppBlueprintSpec/.test(specCode)) {
    return 'app-config';
  }
  if (file.includes('.migration.') || /MigrationSpec/.test(specCode)) {
    return 'migration';
  }
  if (file.includes('.integration.') || /IntegrationSpec/.test(specCode)) {
    return 'integration';
  }
  if (file.includes('.knowledge.') || /KnowledgeSpaceSpec/.test(specCode)) {
    return 'knowledge';
  }
  return 'unknown';
}

export function extractMetaValue(
  specCode: string,
  field: string
): string | null {
  const regex = new RegExp(`${field}\\s*:\\s*['\\"]([^'\\"]+)['\\"]`);
  const match = specCode.match(regex);
  if (match && typeof match[1] === 'string' && match[1].length > 0) {
    return match[1];
  }
  return null;
}

export function extractOperationKind(
  specCode: string
): 'command' | 'query' | null {
  const match = specCode.match(/kind\\s*:\\s*['\\"](command|query)['\\"]/);
  return match ? (match[1] as 'command' | 'query') : null;
}

export function deriveNameFromFile(specFile: string): string {
  const file = basename(specFile, '.ts');
  return file.replace(/\\.[^/.]+$/, '');
}

export function extractWorkflowExportName(specCode: string): string | null {
  const match = specCode.match(
    /export\\s+const\\s+(\\w+)\\s*:\\s*WorkflowSpec/
  );
  return match ? (match[1] ?? null) : null;
}

export function extractDataViewExportName(specCode: string): string | null {
  const match = specCode.match(
    /export\\s+const\\s+(\\w+)\\s*:\\s*DataViewSpec/
  );
  return match ? (match[1] ?? null) : null;
}

export function extractDataViewKind(specCode: string): string | null {
  const match = specCode.match(
    /view\\s*:\\s*{[\\s\\S]*?kind:\\s*['\\"]([^'\\"]+)['\\"]/
  );
  return match ? (match[1] ?? null) : null;
}

