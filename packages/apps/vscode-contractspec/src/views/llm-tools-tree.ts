/**
 * LLM Tools Tree View Provider
 *
 * Provides a sidebar view for LLM integration features:
 * - Quick actions for export, guide, verify, copy
 * - Recent specs with LLM actions
 * - Agent selection
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export type LLMToolType =
  | 'action'
  | 'spec'
  | 'agent'
  | 'header'
  | 'verification';

export interface LLMToolData {
  type: LLMToolType;
  id: string;
  specPath?: string;
  agentType?: 'claude-code' | 'cursor-cli' | 'generic-mcp';
  format?: 'context' | 'full' | 'prompt';
}

export class LLMToolTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly data: LLMToolData
  ) {
    super(label, collapsibleState);

    this.contextValue = data.type;

    // Set icons based on type
    switch (data.type) {
      case 'header':
        this.iconPath = new vscode.ThemeIcon('symbol-namespace');
        break;
      case 'action':
        this.setActionIcon(data.id);
        break;
      case 'spec':
        this.iconPath = new vscode.ThemeIcon('file-code');
        this.description = data.specPath
          ? path.basename(data.specPath)
          : undefined;
        break;
      case 'agent':
        this.setAgentIcon(data.agentType);
        break;
      case 'verification':
        this.iconPath = new vscode.ThemeIcon('beaker');
        break;
    }
  }

  private setActionIcon(actionId: string): void {
    const icons: Record<string, string> = {
      'export-full': 'export',
      'export-context': 'comment',
      'export-prompt': 'lightbulb',
      guide: 'book',
      verify: 'verified',
      copy: 'clippy',
      'cursor-rules': 'gear',
    };
    this.iconPath = new vscode.ThemeIcon(icons[actionId] ?? 'symbol-misc');
  }

  private setAgentIcon(agentType?: string): void {
    const icons: Record<string, string> = {
      'claude-code': 'robot',
      'cursor-cli': 'terminal',
      'generic-mcp': 'plug',
    };
    this.iconPath = new vscode.ThemeIcon(
      icons[agentType ?? 'generic-mcp'] ?? 'plug'
    );
  }
}

export class LLMToolsTreeDataProvider implements vscode.TreeDataProvider<LLMToolTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    LLMToolTreeItem | undefined | null
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private selectedAgent: 'claude-code' | 'cursor-cli' | 'generic-mcp' =
    'generic-mcp';
  private recentSpecs: string[] = [];
  private currentSpec: string | undefined;

  constructor() {
    // Watch for active editor changes to update current spec
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        const filePath = editor.document.uri.fsPath;
        if (this.isSpecFile(filePath)) {
          this.setCurrentSpec(filePath);
        }
      }
    });

    // Check initial active editor
    const editor = vscode.window.activeTextEditor;
    if (editor && this.isSpecFile(editor.document.uri.fsPath)) {
      this.currentSpec = editor.document.uri.fsPath;
    }
  }

  private isSpecFile(filePath: string): boolean {
    const specPatterns = [
      '.contracts.',
      '.spec.',
      '.feature.',
      '.event.',
      '.presentation.',
      '.capability.',
      '.workflow.',
      '.data-view.',
      '.form.',
      '.migration.',
      '.telemetry.',
      '.experiment.',
      '.app-config.',
      '.integration.',
      '.knowledge.',
      '.policy.',
      '.test-spec.',
    ];

    return specPatterns.some((pattern) => filePath.includes(pattern));
  }

  setCurrentSpec(specPath: string): void {
    this.currentSpec = specPath;

    // Add to recent specs (max 5)
    const idx = this.recentSpecs.indexOf(specPath);
    if (idx >= 0) {
      this.recentSpecs.splice(idx, 1);
    }
    this.recentSpecs.unshift(specPath);
    if (this.recentSpecs.length > 5) {
      this.recentSpecs.pop();
    }

    this.refresh();
  }

  setSelectedAgent(agent: 'claude-code' | 'cursor-cli' | 'generic-mcp'): void {
    this.selectedAgent = agent;
    this.refresh();
  }

  getSelectedAgent(): 'claude-code' | 'cursor-cli' | 'generic-mcp' {
    return this.selectedAgent;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: LLMToolTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: LLMToolTreeItem): Thenable<LLMToolTreeItem[]> {
    if (!element) {
      return Promise.resolve(this.getRootItems());
    }

    return Promise.resolve(this.getChildItems(element));
  }

  private getRootItems(): LLMToolTreeItem[] {
    const items: LLMToolTreeItem[] = [];

    // Current Spec section
    items.push(
      new LLMToolTreeItem(
        'Current Spec',
        vscode.TreeItemCollapsibleState.Expanded,
        { type: 'header', id: 'current-spec' }
      )
    );

    // Quick Actions section
    items.push(
      new LLMToolTreeItem(
        'Quick Actions',
        vscode.TreeItemCollapsibleState.Expanded,
        { type: 'header', id: 'actions' }
      )
    );

    // Agent Selection section
    items.push(
      new LLMToolTreeItem('Agent', vscode.TreeItemCollapsibleState.Expanded, {
        type: 'header',
        id: 'agents',
      })
    );

    // Recent Specs section
    if (this.recentSpecs.length > 0) {
      items.push(
        new LLMToolTreeItem(
          'Recent Specs',
          vscode.TreeItemCollapsibleState.Collapsed,
          { type: 'header', id: 'recent' }
        )
      );
    }

    return items;
  }

  private getChildItems(element: LLMToolTreeItem): LLMToolTreeItem[] {
    const items: LLMToolTreeItem[] = [];

    switch (element.data.id) {
      case 'current-spec':
        if (this.currentSpec) {
          const specName = path.basename(this.currentSpec, '.ts');
          const item = new LLMToolTreeItem(
            specName,
            vscode.TreeItemCollapsibleState.None,
            { type: 'spec', id: 'current', specPath: this.currentSpec }
          );
          item.command = {
            command: 'vscode.open',
            title: 'Open Spec',
            arguments: [vscode.Uri.file(this.currentSpec)],
          };
          item.tooltip = this.currentSpec;
          items.push(item);
        } else {
          const item = new LLMToolTreeItem(
            'No spec selected',
            vscode.TreeItemCollapsibleState.None,
            { type: 'spec', id: 'none' }
          );
          item.iconPath = new vscode.ThemeIcon('info');
          item.description = 'Open a spec file';
          items.push(item);
        }
        break;

      case 'actions':
        // Export actions
        const exportFull = new LLMToolTreeItem(
          'Export Full Markdown',
          vscode.TreeItemCollapsibleState.None,
          { type: 'action', id: 'export-full', format: 'full' }
        );
        exportFull.command = {
          command: 'contractspec.llmExportQuick',
          title: 'Export Full',
          arguments: ['full'],
        };
        exportFull.tooltip =
          'Export spec with all details (schemas, policies, examples)';
        items.push(exportFull);

        const exportContext = new LLMToolTreeItem(
          'Export Context Summary',
          vscode.TreeItemCollapsibleState.None,
          { type: 'action', id: 'export-context', format: 'context' }
        );
        exportContext.command = {
          command: 'contractspec.llmExportQuick',
          title: 'Export Context',
          arguments: ['context'],
        };
        exportContext.tooltip =
          'Export summary for understanding (goal, context, scenarios)';
        items.push(exportContext);

        const exportPrompt = new LLMToolTreeItem(
          'Export as Prompt',
          vscode.TreeItemCollapsibleState.None,
          { type: 'action', id: 'export-prompt', format: 'prompt' }
        );
        exportPrompt.command = {
          command: 'contractspec.llmExportQuick',
          title: 'Export Prompt',
          arguments: ['prompt'],
        };
        exportPrompt.tooltip = 'Export as actionable implementation prompt';
        items.push(exportPrompt);

        // Generate Guide
        const guide = new LLMToolTreeItem(
          'Generate Implementation Guide',
          vscode.TreeItemCollapsibleState.None,
          { type: 'action', id: 'guide' }
        );
        guide.command = {
          command: 'contractspec.llmGuideQuick',
          title: 'Generate Guide',
        };
        guide.tooltip = `Generate guide for ${this.getAgentLabel(this.selectedAgent)}`;
        items.push(guide);

        // Verify
        const verify = new LLMToolTreeItem(
          'Verify Implementation',
          vscode.TreeItemCollapsibleState.None,
          { type: 'action', id: 'verify' }
        );
        verify.command = {
          command: 'contractspec.llmVerify',
          title: 'Verify',
        };
        verify.tooltip = 'Verify implementation against spec';
        items.push(verify);

        // Copy
        const copy = new LLMToolTreeItem(
          'Copy to Clipboard',
          vscode.TreeItemCollapsibleState.None,
          { type: 'action', id: 'copy' }
        );
        copy.command = {
          command: 'contractspec.llmCopy',
          title: 'Copy',
        };
        copy.tooltip = 'Copy spec markdown to clipboard';
        items.push(copy);

        // Cursor Rules (only for cursor-cli)
        if (this.selectedAgent === 'cursor-cli') {
          const cursorRules = new LLMToolTreeItem(
            'Generate Cursor Rules',
            vscode.TreeItemCollapsibleState.None,
            { type: 'action', id: 'cursor-rules' }
          );
          cursorRules.command = {
            command: 'contractspec.llmCursorRules',
            title: 'Cursor Rules',
          };
          cursorRules.tooltip = 'Generate .mdc cursor rules file';
          items.push(cursorRules);
        }
        break;

      case 'agents':
        const agents: {
          id: 'claude-code' | 'cursor-cli' | 'generic-mcp';
          label: string;
          description: string;
        }[] = [
          {
            id: 'claude-code',
            label: 'Claude Code',
            description: 'Extended thinking mode',
          },
          {
            id: 'cursor-cli',
            label: 'Cursor',
            description: 'Background/composer mode',
          },
          {
            id: 'generic-mcp',
            label: 'Generic MCP',
            description: 'Any MCP agent',
          },
        ];

        for (const agent of agents) {
          const item = new LLMToolTreeItem(
            agent.label,
            vscode.TreeItemCollapsibleState.None,
            { type: 'agent', id: agent.id, agentType: agent.id }
          );
          item.description =
            agent.id === this.selectedAgent ? '✓ Selected' : agent.description;
          item.command = {
            command: 'contractspec.llmSelectAgent',
            title: 'Select Agent',
            arguments: [agent.id],
          };

          if (agent.id === this.selectedAgent) {
            item.iconPath = new vscode.ThemeIcon('check');
          }

          items.push(item);
        }
        break;

      case 'recent':
        for (const specPath of this.recentSpecs) {
          if (specPath === this.currentSpec) continue;
          if (!fs.existsSync(specPath)) continue;

          const specName = path.basename(specPath, '.ts');
          const item = new LLMToolTreeItem(
            specName,
            vscode.TreeItemCollapsibleState.None,
            { type: 'spec', id: `recent-${specName}`, specPath }
          );
          item.command = {
            command: 'vscode.open',
            title: 'Open Spec',
            arguments: [vscode.Uri.file(specPath)],
          };
          item.tooltip = specPath;
          items.push(item);
        }
        break;
    }

    return items;
  }

  private getAgentLabel(agent: string): string {
    const labels: Record<string, string> = {
      'claude-code': 'Claude Code',
      'cursor-cli': 'Cursor',
      'generic-mcp': 'Generic MCP',
    };
    return labels[agent] ?? agent;
  }
}

/**
 * Register the LLM Tools tree view.
 */
export function registerLLMToolsTree(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel
): LLMToolsTreeDataProvider {
  const provider = new LLMToolsTreeDataProvider();

  const treeView = vscode.window.createTreeView('contractspec.llmToolsView', {
    treeDataProvider: provider,
    showCollapseAll: false,
  });

  context.subscriptions.push(treeView);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.refreshLLMTools', () => {
      provider.refresh();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.llmSelectAgent',
      (agent: 'claude-code' | 'cursor-cli' | 'generic-mcp') => {
        provider.setSelectedAgent(agent);
        vscode.window.showInformationMessage(`Selected agent: ${agent}`);
      }
    )
  );

  // Quick export commands - delegate to the main export command with format pre-selected
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.llmExportQuick',
      async (format: 'context' | 'full' | 'prompt') => {
        // Delegate to the main export command - it will handle the format selection
        await vscode.commands.executeCommand('contractspec.llmExport');
      }
    )
  );

  // Quick guide command - delegate to main guide command
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.llmGuideQuick', async () => {
      await vscode.commands.executeCommand('contractspec.llmGuide');
    })
  );

  // Cursor rules command - a specialized version of the guide command for Cursor
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.llmCursorRules', async () => {
      // For now, just delegate to the guide command
      // A future enhancement could pass the agent type
      vscode.window.showInformationMessage(
        'To generate Cursor rules, use "Generate Implementation Guide" and select Cursor as the target agent.'
      );
    })
  );

  return provider;
}
