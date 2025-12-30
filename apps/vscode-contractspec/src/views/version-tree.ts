/**
 * Version Management TreeView for VS Code.
 *
 * Displays pending version updates including:
 * - Summary of changes
 * - Specs needing version bumps grouped by impact type
 * - Breaking changes highlighting
 */

import * as vscode from 'vscode';
import {
  versioning,
  createNodeGitAdapter,
} from '@contractspec/bundle.workspace';
import type {
  VersionAnalysis,
  VersionBumpType,
} from '@contractspec/lib.contracts';

const { analyzeVersions } = versioning;
import { getWorkspaceAdapters } from '../workspace/adapters';

type VersionNode = SummaryNode | BumpGroupNode | SpecVersionNode | ChangeNode;

interface SummaryNode {
  type: 'summary';
  totalBumps: number;
  breakingCount: number;
}

interface BumpGroupNode {
  type: 'bump-group';
  bumpType: VersionBumpType;
  analyses: VersionAnalysis[];
}

interface SpecVersionNode {
  type: 'spec';
  analysis: VersionAnalysis;
}

interface ChangeNode {
  type: 'change';
  entry: {
    type: string;
    description: string;
    path?: string;
  };
}

/**
 * TreeView provider for version management.
 */
export class VersionTreeProvider implements vscode.TreeDataProvider<VersionNode> {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    VersionNode | undefined
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private analyses: VersionAnalysis[] = [];
  private isLoading = false;

  constructor() {
    // Initial refresh
    void this.refresh();
  }

  async refresh(): Promise<void> {
    if (this.isLoading) return;

    this.isLoading = true;
    this._onDidChangeTreeData.fire(undefined);

    try {
      const adapters = getWorkspaceAdapters();
      // Use 'impact' strategy by default for the tree view
      const analysesResult = await analyzeVersions(
        {
          fs: adapters.fs,
          logger: adapters.logger,
          git: createNodeGitAdapter(),
        },
        {}
      );
      this.analyses = analysesResult.analyses;
    } catch (error) {
      console.error('Failed to analyze versions:', error);
      this.analyses = [];
    } finally {
      this.isLoading = false;
      this._onDidChangeTreeData.fire(undefined);
    }
  }

  getTreeItem(element: VersionNode): vscode.TreeItem {
    switch (element.type) {
      case 'summary':
        return this.createSummaryItem(element);
      case 'bump-group':
        return this.createBumpGroupItem(element);
      case 'spec':
        return this.createSpecItem(element);
      case 'change':
        return this.createChangeItem(element);
    }
  }

  getChildren(element?: VersionNode): VersionNode[] {
    if (this.isLoading) {
      return [];
    }

    if (!element) {
      if (this.analyses.length === 0) {
        return [];
      }

      const breakingCount = this.analyses.filter((a) => a.hasBreaking).length;

      const children: VersionNode[] = [
        {
          type: 'summary',
          totalBumps: this.analyses.length,
          breakingCount,
        },
      ];

      // Group by bump type
      const groups: Record<VersionBumpType, VersionAnalysis[]> = {
        major: [],
        minor: [],
        patch: [],
      };

      for (const analysis of this.analyses) {
        groups[analysis.bumpType].push(analysis);
      }

      // Add groups in order of severity
      if (groups.major.length > 0) {
        children.push({
          type: 'bump-group',
          bumpType: 'major',
          analyses: groups.major,
        });
      }
      if (groups.minor.length > 0) {
        children.push({
          type: 'bump-group',
          bumpType: 'minor',
          analyses: groups.minor,
        });
      }
      if (groups.patch.length > 0) {
        children.push({
          type: 'bump-group',
          bumpType: 'patch',
          analyses: groups.patch,
        });
      }

      return children;
    }

    if (element.type === 'bump-group') {
      return element.analyses.map((analysis) => ({
        type: 'spec',
        analysis,
      }));
    }

    if (element.type === 'spec') {
      return element.analysis.changes.map((change) => ({
        type: 'change',
        entry: change,
      }));
    }

    return [];
  }

  private createSummaryItem(element: SummaryNode): vscode.TreeItem {
    const label =
      element.totalBumps === 0
        ? 'All specs up to date'
        : `${element.totalBumps} spec${element.totalBumps === 1 ? '' : 's'} to bump`;

    const item = new vscode.TreeItem(
      label,
      vscode.TreeItemCollapsibleState.None
    );

    if (element.totalBumps === 0) {
      item.iconPath = new vscode.ThemeIcon(
        'check',
        new vscode.ThemeColor('testing.iconPassed')
      );
    } else if (element.breakingCount > 0) {
      item.iconPath = new vscode.ThemeIcon(
        'warning',
        new vscode.ThemeColor('errorForeground')
      );
      item.description = `${element.breakingCount} breaking`;
    } else {
      item.iconPath = new vscode.ThemeIcon(
        'bell-dot',
        new vscode.ThemeColor('charts.blue')
      );
    }

    return item;
  }

  private createBumpGroupItem(element: BumpGroupNode): vscode.TreeItem {
    const labels: Record<VersionBumpType, string> = {
      major: 'Major Updates (Breaking)',
      minor: 'Minor Updates (New Features)',
      patch: 'Patch Updates (Fixes)',
    };

    const icons: Record<VersionBumpType, string> = {
      major: 'error',
      minor: 'gift',
      patch: 'tools',
    };

    const colors: Record<VersionBumpType, string> = {
      major: 'errorForeground',
      minor: 'charts.blue',
      patch: 'charts.green',
    };

    const item = new vscode.TreeItem(
      labels[element.bumpType],
      vscode.TreeItemCollapsibleState.Expanded
    );

    item.description = `(${element.analyses.length})`;
    item.iconPath = new vscode.ThemeIcon(
      icons[element.bumpType],
      new vscode.ThemeColor(colors[element.bumpType])
    );

    return item;
  }

  private createSpecItem(element: SpecVersionNode): vscode.TreeItem {
    const { analysis } = element;
    const label = `${analysis.specKey}`;

    const item = new vscode.TreeItem(
      label,
      vscode.TreeItemCollapsibleState.Collapsed
    );

    item.description = `${analysis.currentVersion} → ${analysis.suggestedVersion}`;

    if (analysis.hasBreaking) {
      item.iconPath = new vscode.ThemeIcon(
        'warning',
        new vscode.ThemeColor('errorForeground')
      );
    } else {
      item.iconPath = new vscode.ThemeIcon('file-code');
    }

    item.contextValue = 'version-spec';

    // Command to open file
    item.command = {
      command: 'vscode.open',
      title: 'Open Spec',
      arguments: [vscode.Uri.file(analysis.specPath)],
    };

    return item;
  }

  private createChangeItem(element: ChangeNode): vscode.TreeItem {
    const { entry } = element;
    const item = new vscode.TreeItem(
      entry.description,
      vscode.TreeItemCollapsibleState.None
    );

    const icons: Record<string, string> = {
      breaking: 'alert',
      added: 'plus',
      removed: 'trash',
      changed: 'diff',
      fixed: 'bug',
      deprecated: 'stop',
    };

    item.iconPath = new vscode.ThemeIcon(icons[entry.type] || 'circle-filled');

    if (entry.path) {
      item.description = entry.path;
    }

    return item;
  }
}

/**
 * Register the version tree view.
 */
export function registerVersionTree(
  context: vscode.ExtensionContext
): VersionTreeProvider {
  const provider = new VersionTreeProvider();

  const treeView = vscode.window.createTreeView('contractspec.versionsView', {
    treeDataProvider: provider,
    showCollapseAll: true,
  });

  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.version.refresh', () => {
      void provider.refresh();
    })
  );

  context.subscriptions.push(treeView);

  return provider;
}
