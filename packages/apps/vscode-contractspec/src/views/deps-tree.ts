/**
 * Dependencies TreeView provider.
 */

import * as vscode from 'vscode';
import { getWorkspaceAdapters } from '../workspace/adapters';
import { analyzeDeps } from '@lssm/bundle.contractspec-workspace';

interface DependencyNode {
  name: string;
  filePath: string;
  dependencies: string[];
  isCircular?: boolean;
}

export class DependenciesTreeDataProvider implements vscode.TreeDataProvider<DependencyTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    DependencyTreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private dependencyGraph = new Map<string, DependencyNode>();
  private circularDeps: string[][] = [];

  constructor() {
    this.refresh();
  }

  /**
   * Refresh the tree view.
   */
  async refresh(): Promise<void> {
    try {
      const adapters = getWorkspaceAdapters();
      const result = await analyzeDeps(adapters, {
        pattern: '**/*.{contracts,event,presentation,workflow}.ts',
      });

      this.dependencyGraph = result.graph;
      this.circularDeps = result.cycles || [];
      this._onDidChangeTreeData.fire();
    } catch (error) {
      console.error('Failed to refresh dependencies:', error);
      this.dependencyGraph = new Map();
      this.circularDeps = [];
      this._onDidChangeTreeData.fire();
    }
  }

  /**
   * Get tree item.
   */
  getTreeItem(element: DependencyTreeItem): vscode.TreeItem {
    return element;
  }

  /**
   * Get children.
   */
  async getChildren(
    element?: DependencyTreeItem
  ): Promise<DependencyTreeItem[]> {
    if (!element) {
      // Root level: show all specs with dependencies
      const items: DependencyTreeItem[] = [];

      // Add circular dependencies section if any
      if (this.circularDeps.length > 0) {
        items.push(
          new DependencyTreeItem(
            `⚠️ Circular Dependencies (${this.circularDeps.length})`,
            vscode.TreeItemCollapsibleState.Expanded,
            'circular-group',
            undefined
          )
        );
      }

      // Add all specs
      for (const [name, node] of this.dependencyGraph) {
        const hasCircular = this.circularDeps.some((cycle) =>
          cycle.includes(name)
        );
        const collapsible =
          node.dependencies.length > 0
            ? vscode.TreeItemCollapsibleState.Collapsed
            : vscode.TreeItemCollapsibleState.None;

        items.push(
          new DependencyTreeItem(name, collapsible, 'spec', node, hasCircular)
        );
      }

      return items;
    } else if (element.contextValue === 'circular-group') {
      // Show circular dependency cycles
      return this.circularDeps.map((cycle, index) => {
        const label = `Cycle ${index + 1}: ${cycle.join(' → ')}`;
        return new DependencyTreeItem(
          label,
          vscode.TreeItemCollapsibleState.None,
          'circular-cycle',
          { cycle }
        );
      });
    } else if (element.contextValue === 'spec' && element.data) {
      // Show dependencies of this spec
      const node = element.data as DependencyNode;
      return node.dependencies.map((depName) => {
        const depNode = this.dependencyGraph.get(depName);
        const collapsible =
          depNode && depNode.dependencies.length > 0
            ? vscode.TreeItemCollapsibleState.Collapsed
            : vscode.TreeItemCollapsibleState.None;

        return new DependencyTreeItem(
          depName,
          collapsible,
          'dependency',
          depNode
        );
      });
    }

    return [];
  }
}

/**
 * Tree item for dependencies tree.
 */
export class DependencyTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly contextValue: string,
    public readonly data?: any,
    public readonly isCircular?: boolean
  ) {
    super(label, collapsibleState);

    if (contextValue === 'spec' || contextValue === 'dependency') {
      if (data && data.filePath) {
        this.tooltip = data.filePath;
        this.resourceUri = vscode.Uri.file(data.filePath);
        this.command = {
          command: 'vscode.open',
          title: 'Open Spec',
          arguments: [this.resourceUri],
        };
      }

      if (isCircular) {
        this.iconPath = new vscode.ThemeIcon(
          'error',
          new vscode.ThemeColor('errorForeground')
        );
      } else if (data && data.dependencies && data.dependencies.length > 0) {
        this.iconPath = new vscode.ThemeIcon('symbol-interface');
      } else {
        this.iconPath = new vscode.ThemeIcon('symbol-file');
      }
    } else if (contextValue === 'circular-group') {
      this.iconPath = new vscode.ThemeIcon('warning');
    } else if (contextValue === 'circular-cycle') {
      this.iconPath = new vscode.ThemeIcon('error');
    }
  }
}
