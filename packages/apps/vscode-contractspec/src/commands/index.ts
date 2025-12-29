/**
 * Command registration for ContractSpec extension.
 */

import * as vscode from 'vscode';
import type { TelemetryReporter } from '../telemetry/index';
import { validateCurrentSpec, validateWorkspace } from './validate';
import { buildCurrentSpec } from './build';
import { listAllSpecs } from './list';
import { analyzeSpecDependencies } from './deps';
import { searchDocs } from './mcp';
import { addFromRegistry, browseRegistry, searchRegistry } from './registry';
import { browseExamples, initExampleIntoWorkspace } from './examples';
import { createSpec } from './create';
import { toggleWatchMode } from './watch';
import { syncAllSpecs } from './sync';
import { cleanGeneratedFiles } from './clean';
import { compareSpecFiles, compareWithGit } from './diff';
import {
  exportToOpenApi,
  importFromOpenApiCommand,
  validateAgainstOpenApiCommand,
} from './openapi';
import { runSetupWizard, runQuickSetup } from './setup';
import { runDoctorCheck, runQuickDoctorCheck } from './doctor/index';
import { registerLLMCommands } from './llm';
import { registerAgentCommands } from './agent';
export * from './agent';
import { registerChatCommands } from './chat';
import { runQuickstartWizard, runQuickInstall } from './quickstart';
import { registerImpactCommands } from './impact';
import { registerWorkspaceCommands } from './workspace';
import { registerVersionCommands } from './version';

/**
 * Register all ContractSpec commands.
 */
export function registerCommands(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel,
  telemetry: TelemetryReporter | undefined,
  statusBarItem?: vscode.StatusBarItem
): void {
  // Validate current spec
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.validate', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'validate',
      });
      await validateCurrentSpec(outputChannel);
    })
  );

  // Validate all specs in workspace
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.validateWorkspace',
      async () => {
        telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
          command: 'validateWorkspace',
        });
        await validateWorkspace(outputChannel);
      }
    )
  );

  // Build/scaffold from current spec
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.build', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'build',
      });
      await buildCurrentSpec(outputChannel);
    })
  );

  // List all specs
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.listSpecs', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'listSpecs',
      });
      await listAllSpecs(outputChannel);
    })
  );

  // Analyze dependencies
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.analyzeDeps', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'analyzeDeps',
      });
      await analyzeSpecDependencies(outputChannel);
    })
  );

  // Search docs via MCP
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.searchDocs', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.mcp_call', {
        endpoint: 'docs',
        tool: 'search',
      });
      await searchDocs(outputChannel);
    })
  );

  // Registry commands
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.registryBrowse', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'registryBrowse',
      });
      await browseRegistry(outputChannel);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.registryAdd', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'registryAdd',
      });
      await addFromRegistry(outputChannel);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.registrySearch', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'registrySearch',
      });
      await searchRegistry(outputChannel);
    })
  );

  // Examples commands
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.examplesBrowse', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'examplesBrowse',
      });
      await browseExamples(outputChannel);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.examplesInit', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'examplesInit',
      });
      await initExampleIntoWorkspace(outputChannel);
    })
  );

  // Create spec
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.create', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'create',
      });
      await createSpec(outputChannel);
    })
  );

  // Watch mode toggle
  if (statusBarItem) {
    context.subscriptions.push(
      vscode.commands.registerCommand('contractspec.watchToggle', async () => {
        telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
          command: 'watchToggle',
        });
        await toggleWatchMode(outputChannel, statusBarItem);
      })
    );
  }

  // Sync all specs
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.sync', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'sync',
      });
      await syncAllSpecs(outputChannel);
    })
  );

  // Clean generated files
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.clean', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'clean',
      });
      await cleanGeneratedFiles(outputChannel);
    })
  );

  // Compare specs
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.diff', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'diff',
      });
      await compareSpecFiles(outputChannel);
    })
  );

  // Compare with git
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.diffGit', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'diffGit',
      });
      await compareWithGit(outputChannel);
    })
  );

  // Export to OpenAPI
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.openapi', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'openapi',
      });
      await exportToOpenApi(outputChannel);
    })
  );

  // Import from OpenAPI
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.openapiImport', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'openapiImport',
      });
      await importFromOpenApiCommand(outputChannel);
    })
  );

  // Validate against OpenAPI
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.openapiValidate',
      async () => {
        telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
          command: 'openapiValidate',
        });
        await validateAgainstOpenApiCommand(outputChannel);
      }
    )
  );

  // Setup wizard (interactive)
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.setup', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'setup',
      });
      await runSetupWizard(outputChannel);
    })
  );

  // Quick setup (defaults)
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.quickSetup', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'quickSetup',
      });
      await runQuickSetup(outputChannel);
    })
  );

  // Doctor (full health check)
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.doctor', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'doctor',
      });
      await runDoctorCheck(outputChannel);
    })
  );

  // Quick doctor check
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.quickDoctor', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'quickDoctor',
      });
      await runQuickDoctorCheck(outputChannel);
    })
  );

  // LLM integration commands
  registerLLMCommands(context, outputChannel, telemetry);
  registerAgentCommands(context, outputChannel, telemetry);

  // Chat command (AI-powered vibe coding)
  registerChatCommands(context, outputChannel, telemetry);

  // Quickstart (install dependencies wizard)
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.quickstart', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'quickstart',
      });
      await runQuickstartWizard(outputChannel);
    })
  );

  // Quick install (minimal dependencies, no prompts)
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.quickInstall', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'quickInstall',
      });
      await runQuickInstall(outputChannel);
    })
  );

  // Impact detection commands
  registerImpactCommands(context, outputChannel, telemetry);

  // Workspace commands (meta-repo support)
  registerWorkspaceCommands(context, outputChannel);

  // Version management commands
  registerVersionCommands(context, outputChannel, telemetry);
}
