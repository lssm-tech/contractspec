/**
 * Specs Explorer TreeView provider.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { getWorkspaceAdapters } from '../workspace/adapters';
import { listSpecs, groupSpecsByType } from '@lssm/bundle.contractspec-workspace';

interface SpecInfo {
  name?: string;
  filePath: string;
  specType: string;
  version?: number;
  stability?: string;
  description?: string;
}

export class SpecsTreeDataProvider
  implements vscode.TreeDataProvider<SpecTreeItem>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<
    SpecTreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private specs: SpecInfo[] = [];

  constructor() {
    this.refresh();
  }

  /**
   * Refresh the tree view.
   */
  async refresh(): Promise<void> {
    try {
      const adapters = getWorkspaceAdapters();
      this.specs = await listSpecs(adapters);
      this._onDidChangeTreeData.fire();
    } catch (error) {
      console.error('Failed to refresh specs:', error);
      this.specs = [];
      this._onDidChangeTreeData.fire();
    }
  }

  /**
   * Get tree item.
   */
  getTreeItem(element: SpecTreeItem): vscode.TreeItem {
    return element;
  }

  /**
   * Get children.
   */
  async getChildren(element?: SpecTreeItem): Promise<SpecTreeItem[]> {
    if (!element) {
      // Root level: group by spec type
      const grouped = groupSpecsByType(this.specs);
      const items: SpecTreeItem[] = [];

      for (const [specType, typeSpecs] of grouped) {
        items.push(
          new SpecTreeItem(
            this.formatSpecTypeName(specType),
            vscode.TreeItemCollapsibleState.Expanded,
            'group',
            {
              specType,
              count: typeSpecs.length,
            }
          )
        );
      }

      return items;
    } else if (element.contextValue === 'group') {
      // Group level: show specs of this type
      const specType = element.data?.specType;
      const typeSpecs = this.specs.filter((s) => s.specType === specType);

      return typeSpecs.map((spec) => {
        const name = spec.name || path.basename(spec.filePath);
        const version = spec.version ? ` v${spec.version}` : '';
        const stability = spec.stability ? ` [${spec.stability}]` : '';

        return new SpecTreeItem(
          `${name}${version}${stability}`,
          vscode.TreeItemCollapsibleState.None,
          'spec',
          spec
        );
      });
    }

    return [];
  }

  /**
   * Format spec type name for display.
   */
  private formatSpecTypeName(specType: string): string {
    const formatted = specType
      .replace(/-/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const count = this.specs.filter((s) => s.specType === specType).length;

    return `${formatted} (${count})`;
  }
}

/**
 * Tree item for specs tree.
 */
export class SpecTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly contextValue: string,
    public readonly data?: any
  ) {
    super(label, collapsibleState);

    if (contextValue === 'spec' && data) {
      this.tooltip = data.description || data.filePath;
      this.description = path.basename(data.filePath);
      this.resourceUri = vscode.Uri.file(data.filePath);
      this.command = {
        command: 'vscode.open',
        title: 'Open Spec',
        arguments: [this.resourceUri],
      };

      // Set icon based on spec type
      this.iconPath = this.getIconForSpecType(data.specType);
    } else if (contextValue === 'group') {
      this.iconPath = new vscode.ThemeIconIcon('folder');
    }
  }

  /**
   * Get icon for spec type.
   */
  private getIconForSpecType(specType: string): vscode.ThemeIcon {
    const iconMap: Record<string, string> = {
      operation: 'symbol-method',
      event: 'broadcast',
      presentation: 'browser',
      'data-view': 'database',
      workflow: 'git-branch',
      migration: 'history',
      telemetry: 'graph',
      experiment: 'beaker',
      'app-config': 'settings-gear',
      integration: 'plug',
      knowledge: 'book',
    };

    return new vscode.ThemeIcon(iconMap[specType] || 'file');
  }
}

