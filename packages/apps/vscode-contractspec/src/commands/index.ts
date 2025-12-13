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

/**
 * Register all ContractSpec commands.
 */
export function registerCommands(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel,
  telemetry: TelemetryReporter | undefined
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
}

