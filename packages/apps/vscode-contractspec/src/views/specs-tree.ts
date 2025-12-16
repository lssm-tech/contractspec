/**
 * Specs Explorer TreeView provider.
 *
 * Supports both single projects and monorepos with multiple grouping modes.
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

/**
 * Grouping mode for the specs tree view.
 */
export enum SpecsGroupingMode {
  TYPE = 'type',
  PACKAGE = 'package',
  NAMESPACE = 'namespace',
  OWNER = 'owner',
  TAG = 'tag',
  STABILITY = 'stability',
}

const GROUPING_MODE_LABELS: Record<SpecsGroupingMode, string> = {
  [SpecsGroupingMode.TYPE]: 'Group by Type',
  [SpecsGroupingMode.PACKAGE]: 'Group by Package',
  [SpecsGroupingMode.NAMESPACE]: 'Group by Namespace',
  [SpecsGroupingMode.OWNER]: 'Group by Owner',
  [SpecsGroupingMode.TAG]: 'Group by Tag',
  [SpecsGroupingMode.STABILITY]: 'Group by Stability',
};

interface SpecInfo {
  name?: string;
  filePath: string;
  specType: string;
  version?: number;
  stability?: string;
  description?: string;
  owners?: string[];
  tags?: string[];
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

  /**
   * Namespace extracted from spec name (e.g., 'user' from 'user.createUser').
   */
  namespace?: string;
}

export class SpecsTreeDataProvider implements vscode.TreeDataProvider<SpecTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    SpecTreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private specs: SpecWithPackage[] = [];
  private _groupingMode: SpecsGroupingMode = SpecsGroupingMode.TYPE;

  constructor() {
    // Load saved grouping mode from configuration
    const config = vscode.workspace.getConfiguration('contractspec');
    const savedMode = config.get<string>('specsExplorer.groupBy');
    if (
      savedMode &&
      Object.values(SpecsGroupingMode).includes(savedMode as SpecsGroupingMode)
    ) {
      this._groupingMode = savedMode as SpecsGroupingMode;
    }

    this.refresh();
  }

  /**
   * Get current grouping mode.
   */
  get groupingMode(): SpecsGroupingMode {
    return this._groupingMode;
  }

  /**
   * Set grouping mode and refresh.
   */
  async setGroupingMode(mode: SpecsGroupingMode): Promise<void> {
    this._groupingMode = mode;

    // Save to configuration
    const config = vscode.workspace.getConfiguration('contractspec');
    await config.update(
      'specsExplorer.groupBy',
      mode,
      vscode.ConfigurationTarget.Workspace
    );

    this._onDidChangeTreeData.fire();
  }

  /**
   * Cycle to next grouping mode.
   */
  async cycleGroupingMode(): Promise<void> {
    const modes = Object.values(SpecsGroupingMode);
    const currentIndex = modes.indexOf(this._groupingMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    await this.setGroupingMode(modes[nextIndex]);
  }

  /**
   * Show quick pick to select grouping mode.
   */
  async selectGroupingMode(): Promise<void> {
    const items = Object.values(SpecsGroupingMode).map((mode) => ({
      label: GROUPING_MODE_LABELS[mode],
      description: mode === this._groupingMode ? '(current)' : undefined,
      mode,
    }));

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select grouping mode',
    });

    if (selected) {
      await this.setGroupingMode(selected.mode);
    }
  }

  /**
   * Refresh the tree view.
   */
  async refresh(): Promise<void> {
    try {
      const adapters = getWorkspaceAdapters();
      const rawSpecs = await listSpecs(adapters);

      // Enrich specs with package info and namespace
      const workspaceInfo = isMonorepoWorkspace()
        ? getWorkspaceInfoCached()
        : null;

      this.specs = rawSpecs.map((spec) => {
        const enriched: SpecWithPackage = { ...spec };

        // Extract namespace from spec name (e.g., 'user.createUser' -> 'user')
        if (spec.name) {
          const parts = spec.name.split('.');
          if (parts.length > 1) {
            enriched.namespace = parts[0];
          } else {
            enriched.namespace = '(root)';
          }
        }

        // Add package info for monorepos
        if (workspaceInfo) {
          const packageRoot = getPackageRootForFile(spec.filePath);
          const relativeToWorkspace = path.relative(
            workspaceInfo.workspaceRoot,
            packageRoot
          );

          enriched.packageName =
            relativeToWorkspace === ''
              ? '(root)'
              : relativeToWorkspace.split(path.sep).slice(-1)[0] ||
                relativeToWorkspace;
          enriched.packageRoot = packageRoot;
        }

        return enriched;
      });

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
   * Get children based on current grouping mode.
   */
  async getChildren(element?: SpecTreeItem): Promise<SpecTreeItem[]> {
    if (!element) {
      // Root level - get groups based on mode
      return this.getRootGroups();
    }

    if (element.contextValue === 'group') {
      // Return specs within this group
      return this.getSpecsInGroup(element.data);
    }

    return [];
  }

  /**
   * Get root-level groups based on current grouping mode.
   */
  private getRootGroups(): SpecTreeItem[] {
    switch (this._groupingMode) {
      case SpecsGroupingMode.TYPE:
        return this.getTypeGroups(this.specs);
      case SpecsGroupingMode.PACKAGE:
        return this.getPackageGroups();
      case SpecsGroupingMode.NAMESPACE:
        return this.getNamespaceGroups();
      case SpecsGroupingMode.OWNER:
        return this.getOwnerGroups();
      case SpecsGroupingMode.TAG:
        return this.getTagGroups();
      case SpecsGroupingMode.STABILITY:
        return this.getStabilityGroups();
      default:
        return this.getTypeGroups(this.specs);
    }
  }

  /**
   * Get specs within a group.
   */
  private getSpecsInGroup(groupData: GroupData): SpecTreeItem[] {
    let filteredSpecs: SpecWithPackage[];

    switch (groupData.groupType) {
      case 'type':
        filteredSpecs = this.specs.filter(
          (s) => s.specType === groupData.value
        );
        break;
      case 'package':
        filteredSpecs = this.specs.filter(
          (s) => s.packageName === groupData.value
        );
        break;
      case 'namespace':
        filteredSpecs = this.specs.filter(
          (s) => s.namespace === groupData.value
        );
        break;
      case 'owner':
        filteredSpecs = this.specs.filter((s) =>
          s.owners?.includes(groupData.value)
        );
        break;
      case 'tag':
        filteredSpecs = this.specs.filter((s) =>
          s.tags?.includes(groupData.value)
        );
        break;
      case 'stability':
        filteredSpecs = this.specs.filter(
          (s) => (s.stability ?? 'unknown') === groupData.value
        );
        break;
      default:
        filteredSpecs = [];
    }

    return filteredSpecs.map((spec) => this.createSpecItem(spec));
  }

  /**
   * Create a spec tree item.
   */
  private createSpecItem(spec: SpecWithPackage): SpecTreeItem {
    const name = spec.name || path.basename(spec.filePath);
    const version = spec.version ? ` v${spec.version}` : '';
    const stability = spec.stability ? ` [${spec.stability}]` : '';

    return new SpecTreeItem(
      `${name}${version}${stability}`,
      vscode.TreeItemCollapsibleState.None,
      'spec',
      spec
    );
  }

  /**
   * Get type groups.
   */
  private getTypeGroups(specs: SpecWithPackage[]): SpecTreeItem[] {
    const grouped = groupSpecsByType(specs);
    const items: SpecTreeItem[] = [];

    for (const [specType, typeSpecs] of grouped) {
      items.push(
        new SpecTreeItem(
          this.formatGroupLabel(specType, typeSpecs.length),
          vscode.TreeItemCollapsibleState.Expanded,
          'group',
          { groupType: 'type', value: specType, count: typeSpecs.length }
        )
      );
    }

    return items;
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
            `${packageName} (${pkgSpecs.length})`,
            vscode.TreeItemCollapsibleState.Expanded,
            'group',
            { groupType: 'package', value: packageName, count: pkgSpecs.length }
          )
      );
  }

  /**
   * Get namespace groups.
   */
  private getNamespaceGroups(): SpecTreeItem[] {
    const namespaces = new Map<string, SpecWithPackage[]>();

    for (const spec of this.specs) {
      const ns = spec.namespace || '(no namespace)';
      if (!namespaces.has(ns)) {
        namespaces.set(ns, []);
      }
      namespaces.get(ns)!.push(spec);
    }

    return Array.from(namespaces.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([namespace, nsSpecs]) =>
          new SpecTreeItem(
            `${namespace} (${nsSpecs.length})`,
            vscode.TreeItemCollapsibleState.Expanded,
            'group',
            { groupType: 'namespace', value: namespace, count: nsSpecs.length }
          )
      );
  }

  /**
   * Get owner groups.
   */
  private getOwnerGroups(): SpecTreeItem[] {
    const owners = new Map<string, SpecWithPackage[]>();

    for (const spec of this.specs) {
      if (spec.owners && spec.owners.length > 0) {
        for (const owner of spec.owners) {
          if (!owners.has(owner)) {
            owners.set(owner, []);
          }
          owners.get(owner)!.push(spec);
        }
      } else {
        const noOwner = '(no owner)';
        if (!owners.has(noOwner)) {
          owners.set(noOwner, []);
        }
        owners.get(noOwner)!.push(spec);
      }
    }

    return Array.from(owners.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([owner, ownerSpecs]) =>
          new SpecTreeItem(
            `${owner} (${ownerSpecs.length})`,
            vscode.TreeItemCollapsibleState.Expanded,
            'group',
            { groupType: 'owner', value: owner, count: ownerSpecs.length }
          )
      );
  }

  /**
   * Get tag groups.
   */
  private getTagGroups(): SpecTreeItem[] {
    const tags = new Map<string, SpecWithPackage[]>();

    for (const spec of this.specs) {
      if (spec.tags && spec.tags.length > 0) {
        for (const tag of spec.tags) {
          if (!tags.has(tag)) {
            tags.set(tag, []);
          }
          tags.get(tag)!.push(spec);
        }
      } else {
        const noTag = '(no tags)';
        if (!tags.has(noTag)) {
          tags.set(noTag, []);
        }
        tags.get(noTag)!.push(spec);
      }
    }

    return Array.from(tags.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([tag, tagSpecs]) =>
          new SpecTreeItem(
            `${tag} (${tagSpecs.length})`,
            vscode.TreeItemCollapsibleState.Expanded,
            'group',
            { groupType: 'tag', value: tag, count: tagSpecs.length }
          )
      );
  }

  /**
   * Get stability groups.
   */
  private getStabilityGroups(): SpecTreeItem[] {
    const stabilities = new Map<string, SpecWithPackage[]>();
    const stabilityOrder = [
      'stable',
      'beta',
      'alpha',
      'experimental',
      'deprecated',
      'unknown',
    ];

    for (const spec of this.specs) {
      const stability = spec.stability || 'unknown';
      if (!stabilities.has(stability)) {
        stabilities.set(stability, []);
      }
      stabilities.get(stability)!.push(spec);
    }

    return Array.from(stabilities.entries())
      .sort(([a], [b]) => {
        const aIndex = stabilityOrder.indexOf(a);
        const bIndex = stabilityOrder.indexOf(b);
        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
      })
      .map(
        ([stability, stabilitySpecs]) =>
          new SpecTreeItem(
            `${stability} (${stabilitySpecs.length})`,
            vscode.TreeItemCollapsibleState.Expanded,
            'group',
            {
              groupType: 'stability',
              value: stability,
              count: stabilitySpecs.length,
            }
          )
      );
  }

  /**
   * Format group label for display.
   */
  private formatGroupLabel(value: string, count: number): string {
    const formatted = value
      .replace(/-/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return `${formatted} (${count})`;
  }

  /**
   * Get all specs (for external use).
   */
  getSpecs(): SpecWithPackage[] {
    return this.specs;
  }
}

/**
 * Group data stored in tree items.
 */
interface GroupData {
  groupType: 'type' | 'package' | 'namespace' | 'owner' | 'tag' | 'stability';
  value: string;
  count: number;
}

/**
 * Tree item for specs tree.
 */
export class SpecTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly contextValue: string,
    public readonly data?: SpecWithPackage | GroupData
  ) {
    super(label, collapsibleState);

    if (contextValue === 'spec' && data && 'filePath' in data) {
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
    } else if (contextValue === 'group' && data && 'groupType' in data) {
      this.iconPath = this.getIconForGroupType(data.groupType);
    }
  }

  /**
   * Get icon for group type.
   */
  private getIconForGroupType(groupType: string): vscode.ThemeIcon {
    const iconMap: Record<string, string> = {
      type: 'symbol-class',
      package: 'package',
      namespace: 'symbol-namespace',
      owner: 'person',
      tag: 'tag',
      stability: 'shield',
    };

    return new vscode.ThemeIcon(iconMap[groupType] || 'folder');
  }

  /**
   * Get icon for spec type.
   */
  private getIconForSpecType(specType: string): vscode.ThemeIcon {
    const iconMap: Record<string, string> = {
      operation: 'symbol-method',
      event: 'broadcast',
      presentation: 'browser',
      feature: 'package',
      capability: 'symbol-interface',
      'data-view': 'database',
      form: 'note',
      workflow: 'git-branch',
      migration: 'history',
      telemetry: 'graph',
      experiment: 'beaker',
      'app-config': 'settings-gear',
      integration: 'plug',
      knowledge: 'book',
      policy: 'shield',
      'test-spec': 'beaker',
    };

    return new vscode.ThemeIcon(iconMap[specType] || 'file');
  }
}
