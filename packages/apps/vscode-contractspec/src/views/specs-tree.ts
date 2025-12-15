/**
 * Specs Explorer TreeView provider.
 *
 * Supports both single projects and monorepos with package grouping.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import {
  getWorkspaceAdapters,
  isMonorepoWorkspace,
  getWorkspaceInfoCached,
  getPackageRootForFile,
} from '../workspace/adapters';
import {
  listSpecs,
  groupSpecsByType,
} from '@lssm/bundle.contractspec-workspace';

interface SpecInfo {
  name?: string;
  filePath: string;
  specType: string;
  version?: number;
  stability?: string;
  description?: string;
}

/**
 * Extended spec info with package context.
 */
interface SpecWithPackage extends SpecInfo {
  /**
   * Package name (for monorepo grouping).
   */
  packageName?: string;

  /**
   * Package root path (for monorepo grouping).
   */
  packageRoot?: string;
}

export class SpecsTreeDataProvider implements vscode.TreeDataProvider<SpecTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    SpecTreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private specs: SpecWithPackage[] = [];
  private _groupByPackage = true;

  constructor() {
    this.refresh();
  }

  /**
   * Toggle grouping mode (by package vs by type).
   */
  toggleGrouping(): void {
    this._groupByPackage = !this._groupByPackage;
    this._onDidChangeTreeData.fire();
  }

  /**
   * Refresh the tree view.
   */
  async refresh(): Promise<void> {
    try {
      const adapters = getWorkspaceAdapters();
      const rawSpecs = await listSpecs(adapters);

      // Enrich specs with package info in monorepo context
      if (isMonorepoWorkspace()) {
        const workspaceInfo = getWorkspaceInfoCached();

        this.specs = rawSpecs.map((spec) => {
          const packageRoot = getPackageRootForFile(spec.filePath);
          const relativeToWorkspace = path.relative(
            workspaceInfo.workspaceRoot,
            packageRoot
          );

          // Try to get package name from path
          const packageName =
            relativeToWorkspace === ''
              ? '(root)'
              : relativeToWorkspace.split(path.sep).slice(-1)[0] ||
                relativeToWorkspace;

          return {
            ...spec,
            packageName,
            packageRoot,
          };
        });
      } else {
        this.specs = rawSpecs;
      }

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
    const isMonorepo = isMonorepoWorkspace();

    if (!element) {
      // Root level
      if (isMonorepo && this._groupByPackage) {
        // Group by package first
        return this.getPackageGroups();
      } else {
        // Group by spec type (default for single projects)
        return this.getTypeGroups(this.specs);
      }
    } else if (element.contextValue === 'package') {
      // Package level: show type groups within this package
      const packageSpecs = this.specs.filter(
        (s) => s.packageName === element.data?.packageName
      );
      return this.getTypeGroups(packageSpecs);
    } else if (element.contextValue === 'group') {
      // Type group level: show specs
      const specType = element.data?.specType;
      const packageName = element.data?.packageName;

      let typeSpecs = this.specs.filter((s) => s.specType === specType);

      // If we're in a package context, filter by package too
      if (packageName) {
        typeSpecs = typeSpecs.filter((s) => s.packageName === packageName);
      }

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
   * Get package groups for monorepo.
   */
  private getPackageGroups(): SpecTreeItem[] {
    const packages = new Map<string, SpecWithPackage[]>();

    for (const spec of this.specs) {
      const pkgName = spec.packageName || '(unknown)';
      if (!packages.has(pkgName)) {
        packages.set(pkgName, []);
      }
      packages.get(pkgName)!.push(spec);
    }

    return Array.from(packages.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([packageName, pkgSpecs]) =>
          new SpecTreeItem(
            `📦 ${packageName} (${pkgSpecs.length})`,
            vscode.TreeItemCollapsibleState.Expanded,
            'package',
            { packageName, count: pkgSpecs.length }
          )
      );
  }

  /**
   * Get type groups for a set of specs.
   */
  private getTypeGroups(specs: SpecWithPackage[]): SpecTreeItem[] {
    const grouped = groupSpecsByType(specs);
    const items: SpecTreeItem[] = [];

    for (const [specType, typeSpecs] of grouped) {
      const packageName = typeSpecs[0]?.packageName;

      items.push(
        new SpecTreeItem(
          this.formatSpecTypeName(specType, typeSpecs.length),
          vscode.TreeItemCollapsibleState.Expanded,
          'group',
          {
            specType,
            packageName,
            count: typeSpecs.length,
          }
        )
      );
    }

    return items;
  }

  /**
   * Format spec type name for display.
   */
  private formatSpecTypeName(specType: string, count: number): string {
    const formatted = specType
      .replace(/-/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

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
