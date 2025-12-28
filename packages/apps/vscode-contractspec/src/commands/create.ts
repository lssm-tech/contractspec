/**
 * Create command for ContractSpec extension.
 *
 * Provides an interactive wizard to create new contract specifications.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { getWorkspaceAdapters } from '../workspace/adapters';
import {
  createSpecCreator,
  loadWorkspaceConfig,
  SpecCreatorService,
} from '@contractspec/bundle.workspace';

type SpecType =
  | 'operation'
  | 'event'
  | 'presentation'
  | 'data-view'
  | 'workflow'
  | 'migration'
  | 'telemetry'
  | 'experiment'
  | 'app-config'
  | 'integration'
  | 'knowledge';

interface OperationInputs {
  name: string;
  kind: 'command' | 'query';
  description: string;
  domain: string;
}

/**
 * Create a new spec file with wizard.
 */
export async function createSpec(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const adapters = getWorkspaceAdapters();
  const config = await loadWorkspaceConfig(
    adapters.fs,
    vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
  );
  const specCreator = createSpecCreator(config);

  outputChannel.appendLine('\n=== Creating new spec ===');
  outputChannel.show(true);

  try {
    // Step 1: Select spec type
    const specType = await selectSpecType();
    if (!specType) {
      return;
    }

    outputChannel.appendLine(`Spec type: ${specType}`);

    // Step 2: Gather inputs based on spec type

    const inputs = await gatherInputs(specType);
    if (!inputs) {
      return;
    }

    // Step 3: Select output location
    const outputPath = await selectOutputLocation(specType, inputs);
    if (!outputPath) {
      return;
    }

    outputChannel.appendLine(`Output path: ${outputPath}`);

    // Step 4: Generate spec content
    const content = generateSpecContent(specType, inputs, specCreator);

    // Step 5: Write file
    await adapters.fs.writeFile(outputPath, content);

    outputChannel.appendLine(`✅ Created: ${outputPath}`);
    vscode.window.showInformationMessage(
      `Spec created successfully: ${path.basename(outputPath)}`
    );

    // Step 6: Open the file
    const doc = await vscode.workspace.openTextDocument(outputPath);
    await vscode.window.showTextDocument(doc);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Failed to create spec: ${message}`);
    outputChannel.appendLine(`\n❌ Error: ${message}`);
  }
}

/**
 * Select spec type.
 */
async function selectSpecType(): Promise<SpecType | undefined> {
  const selected = await vscode.window.showQuickPick(
    [
      {
        label: '$(symbol-method) Operation',
        description: 'Command or Query',
        detail: 'Define a command (write) or query (read) operation',
        value: 'operation' as SpecType,
      },
      {
        label: '$(broadcast) Event',
        description: 'Domain Event',
        detail: 'Define an event that occurs in the system',
        value: 'event' as SpecType,
      },
      {
        label: '$(browser) Presentation',
        description: 'UI Component',
        detail: 'Define a presentation/UI component',
        value: 'presentation' as SpecType,
      },
      {
        label: '$(database) Data View',
        description: 'Data Renderer',
        detail: 'Define a data view/renderer',
        value: 'data-view' as SpecType,
      },
      {
        label: '$(git-branch) Workflow',
        description: 'Multi-step Process',
        detail: 'Define a workflow with multiple steps',
        value: 'workflow' as SpecType,
      },
      {
        label: '$(history) Migration',
        description: 'Data Migration',
        detail: 'Define a database migration',
        value: 'migration' as SpecType,
      },
      {
        label: '$(graph) Telemetry',
        description: 'Analytics Events',
        detail: 'Define telemetry/analytics events',
        value: 'telemetry' as SpecType,
      },
      {
        label: '$(beaker) Experiment',
        description: 'A/B Test',
        detail: 'Define an experiment/feature flag',
        value: 'experiment' as SpecType,
      },
      {
        label: '$(settings-gear) App Config',
        description: 'App Blueprint',
        detail: 'Define application configuration',
        value: 'app-config' as SpecType,
      },
      {
        label: '$(plug) Integration',
        description: 'External Integration',
        detail: 'Define an integration with external service',
        value: 'integration' as SpecType,
      },
      {
        label: '$(book) Knowledge',
        description: 'Knowledge Space',
        detail: 'Define a knowledge space/documentation',
        value: 'knowledge' as SpecType,
      },
    ],
    {
      placeHolder: 'Select spec type to create',
      matchOnDescription: true,
      matchOnDetail: true,
    }
  );

  return selected?.value;
}

/**
 * Gather inputs based on spec type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function gatherInputs(specType: SpecType): Promise<any> {
  switch (specType) {
    case 'operation':
      return await gatherOperationInputs();
    case 'event':
      return await gatherEventInputs();
    case 'presentation':
      return await gatherPresentationInputs();
    default:
      return await gatherGenericInputs(specType);
  }
}

/**
 * Gather inputs for operation spec.
 */
async function gatherOperationInputs(): Promise<OperationInputs | undefined> {
  const kind = await vscode.window.showQuickPick(
    [
      {
        label: 'Command',
        description: 'Write operation (POST, PUT, DELETE)',
        value: 'command',
      },
      { label: 'Query', description: 'Read operation (GET)', value: 'query' },
    ],
    { placeHolder: 'Is this a command or query?' }
  );

  if (!kind) {
    return undefined;
  }

  const domain = await vscode.window.showInputBox({
    prompt: 'Domain (e.g., user, order, product)',
    placeHolder: 'user',
    validateInput: (value) => {
      if (!value || value.trim().length === 0) {
        return 'Domain is required';
      }
      if (!/^[a-z][a-z0-9-]*$/.test(value)) {
        return 'Domain must be lowercase letters, numbers, and hyphens';
      }
      return null;
    },
  });

  if (!domain) {
    return undefined;
  }

  const operationName = await vscode.window.showInputBox({
    prompt: 'Operation name (e.g., signup, getProfile)',
    placeHolder: kind.value === 'command' ? 'createItem' : 'getItem',
    validateInput: (value) => {
      if (!value || value.trim().length === 0) {
        return 'Operation name is required';
      }
      if (!/^[a-z][a-zA-Z0-9]*$/.test(value)) {
        return 'Operation name must be camelCase';
      }
      return null;
    },
  });

  if (!operationName) {
    return undefined;
  }

  const description = await vscode.window.showInputBox({
    prompt: 'Short description',
    placeHolder: 'What does this operation do?',
  });

  return {
    name: `${domain}.${operationName}`,
    kind: kind.value as 'command' | 'query',
    description: description || '',
    domain,
  };
}

/**
 * Gather inputs for event spec.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function gatherEventInputs(): Promise<any> {
  const domain = await vscode.window.showInputBox({
    prompt: 'Domain (e.g., user, order)',
    placeHolder: 'user',
  });

  if (!domain) {
    return undefined;
  }

  const eventName = await vscode.window.showInputBox({
    prompt: 'Event name (e.g., created, updated)',
    placeHolder: 'created',
  });

  if (!eventName) {
    return undefined;
  }

  const description = await vscode.window.showInputBox({
    prompt: 'Description',
    placeHolder: 'When is this event emitted?',
  });

  return {
    name: `${domain}.${eventName}`,
    description: description || '',
    domain,
    eventName,
  };
}

/**
 * Gather inputs for presentation spec.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function gatherPresentationInputs(): Promise<any> {
  const componentName = await vscode.window.showInputBox({
    prompt: 'Component name (PascalCase)',
    placeHolder: 'UserProfileCard',
    validateInput: (value) => {
      if (!value || value.trim().length === 0) {
        return 'Component name is required';
      }
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(value)) {
        return 'Component name must be PascalCase';
      }
      return null;
    },
  });

  if (!componentName) {
    return undefined;
  }

  const description = await vscode.window.showInputBox({
    prompt: 'Description',
    placeHolder: 'What does this component display?',
  });

  return {
    name: componentName,
    description: description || '',
  };
}

/**
 * Gather generic inputs for other spec types.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function gatherGenericInputs(specType: SpecType): Promise<any> {
  const name = await vscode.window.showInputBox({
    prompt: 'Spec name',
    placeHolder: `my-${specType}`,
  });

  if (!name) {
    return undefined;
  }

  const description = await vscode.window.showInputBox({
    prompt: 'Description',
    placeHolder: 'Short description',
  });

  return {
    name,
    description: description || '',
  };
}

/**
 * Select output location.
 */
async function selectOutputLocation(
  specType: SpecType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputs: any
): Promise<string | undefined> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage('No workspace folder open');
    return undefined;
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath;

  // Suggest default path based on spec type
  const defaultDir = path.join(workspaceRoot, 'src', 'contracts');
  const extension = getSpecExtension(specType);
  const fileName = `${inputs.name || 'spec'}.${extension}`;
  const defaultPath = path.join(defaultDir, fileName);

  const useDefault = await vscode.window.showQuickPick(
    [
      { label: 'Use default location', value: true },
      { label: 'Choose custom location', value: false },
    ],
    { placeHolder: `Default: ${path.relative(workspaceRoot, defaultPath)}` }
  );

  if (useDefault === undefined) {
    return undefined;
  }

  if (useDefault.value) {
    // Ensure directory exists
    const adapters = getWorkspaceAdapters();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adapters.fs as any).ensureDir(defaultDir);
    return defaultPath;
  }

  // Let user choose custom location
  const uri = await vscode.window.showSaveDialog({
    defaultUri: vscode.Uri.file(defaultPath),
    filters: {
      TypeScript: ['ts'],
    },
  });

  return uri?.fsPath;
}

/**
 * Get file extension for spec type.
 */
function getSpecExtension(specType: SpecType): string {
  switch (specType) {
    case 'operation':
      return 'contracts.ts';
    case 'event':
      return 'event.ts';
    case 'presentation':
      return 'presentation.ts';
    case 'data-view':
      return 'data-view.ts';
    case 'workflow':
      return 'workflow.ts';
    case 'migration':
      return 'migration.ts';
    case 'telemetry':
      return 'telemetry.ts';
    case 'experiment':
      return 'experiment.ts';
    case 'app-config':
      return 'app-config.ts';
    case 'integration':
      return 'integration.ts';
    case 'knowledge':
      return 'knowledge.ts';
    default:
      return 'contracts.ts';
  }
}

/**
 * Generate spec content based on type and inputs.
 */

function generateSpecContent(
  specType: SpecType,
  inputs: any,
  specCreator: SpecCreatorService
): string {
  switch (specType) {
    case 'operation':
      return specCreator.templates.generateOperationSpec({
        version: 1,
        goal: '',
        context: '',
        stability: 'experimental',
        owners: [],
        tags: inputs.domain ? [inputs.domain] : [],
        auth: 'user',
        flags: [],
        emitsEvents: false,
        ...inputs,
      });
    case 'event':
      return specCreator.templates.generateEventSpec({
        ...inputs,
        version: 1,
        stability: 'experimental',
        owners: [],
        tags: inputs.domain ? [inputs.domain] : [],
        piiFields: [],
      });
    case 'presentation':
      return specCreator.templates.generatePresentationSpec({
        ...inputs,
        version: 1,
        stability: 'experimental',
        owners: [],
        tags: [],
        presentationKind: 'web_component', // Default
      });
    // Add other cases here, mapping to templates
    // For now we only refactored main ones, others can use generic or we can map them too if templates exist
    // Assuming generic template exists or we fallback to string literal if template missing?
    // Let's assume generic fallback for now if template not found or keep string literal logic for unverified templates.
    // ... Actually, better to use the template service if available.
    // Given I don't see all templates in detail, I'll stick to the ones I know are safe (Op, Event, Pres).
    // For others, I should implement them properly using templates if possible.
    // Checking file list earlier: workflow, migration, telemetry, experiment, app-config, integration, knowledge ALL have templates.
    case 'data-view':
      return specCreator.templates.generateDataViewSpec({
        ...inputs,
        version: 1,
        stability: 'experimental',
        owners: [],
        tags: [],
      });
    case 'workflow':
      return specCreator.templates.generateWorkflowSpec({
        ...inputs,
        version: 1,
        stability: 'experimental',
        owners: [],
        tags: [],
      });
    case 'migration':
      return specCreator.templates.generateMigrationSpec({
        ...inputs,
        version: 1,
        owners: [],
        steps: [],
      });
    case 'telemetry':
      return specCreator.templates.generateTelemetrySpec({
        ...inputs,
        version: 1,
        owners: [],
        events: [],
      });
    case 'experiment':
      return specCreator.templates.generateExperimentSpec({
        ...inputs,
        version: 1,
        owners: [],
        variants: [],
      });
    case 'app-config':
      return specCreator.templates.generateAppConfigSpec({
        ...inputs,
        version: 1,
        owners: [],
        config: {},
      });
    case 'integration':
      return specCreator.templates.generateIntegrationSpec({
        ...inputs,
        version: 1,
        owners: [],
        provider: 'custom',
      });
    case 'knowledge':
      return specCreator.templates.generateKnowledgeSpec({
        ...inputs,
        version: 1,
        owners: [],
        format: 'markdown',
      });
    default:
      return `// ${specType} spec: ${inputs.name}
// ${inputs.description}

// TODO: Implement ${specType} spec
export const ${toPascalCase(inputs.name)}Spec = {
  // Add spec definition here
};
`;
  }
}

/**
 * Convert string to PascalCase.
 */
function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[a-z]/, (chr) => chr.toUpperCase());
}
