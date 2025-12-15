/**
 * Watch command for ContractSpec extension.
 * 
 * Provides watch mode to auto-rebuild/validate specs on changes.
 */

import * as vscode from 'vscode';
import { getWorkspaceAdapters } from '../workspace/adapters';
import { buildSpec, validateSpec } from '@lssm/bundle.contractspec-workspace';

interface WatchState {
  watcher: any | null;
  enabled: boolean;
  validateOnChange: boolean;
  buildOnChange: boolean;
}

const watchState: WatchState = {
  watcher: null,
  enabled: false,
  validateOnChange: true,
  buildOnChange: false,
};

/**
 * Toggle watch mode.
 */
export async function toggleWatchMode(
  outputChannel: vscode.OutputChannel,
  statusBarItem: vscode.StatusBarItem
): Promise<void> {
  if (watchState.enabled) {
    await stopWatchMode(outputChannel, statusBarItem);
  } else {
    await startWatchMode(outputChannel, statusBarItem);
  }
}

/**
 * Start watch mode.
 */
async function startWatchMode(
  outputChannel: vscode.OutputChannel,
  statusBarItem: vscode.StatusBarItem
): Promise<void> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showWarningMessage('No workspace folder open');
    return;
  }

  outputChannel.appendLine('\n=== Starting watch mode ===');
  outputChannel.show(true);

  try {
    // Ask what to do on change
    const action = await vscode.window.showQuickPick(
      [
        { label: 'Validate only', value: 'validate' },
        { label: 'Build only', value: 'build' },
        { label: 'Validate and build', value: 'both' },
      ],
      { placeHolder: 'What should watch mode do when specs change?' }
    );

    if (!action) {
      return;
    }

    watchState.validateOnChange = action.value === 'validate' || action.value === 'both';
    watchState.buildOnChange = action.value === 'build' || action.value === 'both';

    const adapters = getWorkspaceAdapters();

    // Create watcher
    watchState.watcher = adapters.watcher.watch({
      pattern: '**/*.{contracts,event,presentation,workflow,data-view,migration,telemetry,experiment,app-config,integration,knowledge}.ts',
      debounceMs: 500,
      ignore: ['node_modules/**', 'dist/**', '.turbo/**', 'generated/**'],
    });

    // Set up event handler
    watchState.watcher.on(async (event: any) => {
      if (event.type === 'change') {
        outputChannel.appendLine(`\n📝 Changed: ${event.path}`);

        if (watchState.validateOnChange) {
          try {
            const result = await validateSpec(event.path, adapters);
            if (result.valid) {
              outputChannel.appendLine('✅ Validation passed');
            } else {
              outputChannel.appendLine(`❌ Validation failed: ${result.errors.length} error(s)`);
              for (const error of result.errors) {
                outputChannel.appendLine(`  • ${error}`);
              }
            }
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            outputChannel.appendLine(`❌ Validation error: ${message}`);
          }
        }

        if (watchState.buildOnChange) {
          try {
            const config = await adapters.fs.exists('.contractsrc.json')
              ? JSON.parse(await adapters.fs.readFile('.contractsrc.json'))
              : {};

            await buildSpec(event.path, adapters, config, {
              targets: ['handler'],
              overwrite: false,
            });
            outputChannel.appendLine('✅ Build completed');
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            outputChannel.appendLine(`❌ Build error: ${message}`);
          }
        }
      } else if (event.type === 'add') {
        outputChannel.appendLine(`\n📄 Added: ${event.path}`);
      } else if (event.type === 'unlink') {
        outputChannel.appendLine(`\n🗑️  Removed: ${event.path}`);
      }
    });

    watchState.enabled = true;
    updateStatusBar(statusBarItem);

    vscode.window.showInformationMessage('Watch mode started');
    outputChannel.appendLine('👀 Watching for changes...');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Failed to start watch mode: ${message}`);
    outputChannel.appendLine(`\n❌ Error: ${message}`);
  }
}

/**
 * Stop watch mode.
 */
async function stopWatchMode(
  outputChannel: vscode.OutputChannel,
  statusBarItem: vscode.StatusBarItem
): Promise<void> {
  if (watchState.watcher) {
    watchState.watcher.close();
    watchState.watcher = null;
  }

  watchState.enabled = false;
  updateStatusBar(statusBarItem);

  outputChannel.appendLine('\n=== Stopped watch mode ===');
  vscode.window.showInformationMessage('Watch mode stopped');
}

/**
 * Update status bar item.
 */
function updateStatusBar(statusBarItem: vscode.StatusBarItem): void {
  if (watchState.enabled) {
    statusBarItem.text = '$(eye) ContractSpec: Watching';
    statusBarItem.tooltip = 'Click to stop watch mode';
    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
  } else {
    statusBarItem.text = '$(eye-closed) ContractSpec: Not Watching';
    statusBarItem.tooltip = 'Click to start watch mode';
    statusBarItem.backgroundColor = undefined;
  }
  statusBarItem.show();
}

/**
 * Get watch state.
 */
export function isWatchEnabled(): boolean {
  return watchState.enabled;
}

/**
 * Clean up watch mode.
 */
export function disposeWatchMode(): void {
  if (watchState.watcher) {
    watchState.watcher.close();
    watchState.watcher = null;
  }
  watchState.enabled = false;
}

