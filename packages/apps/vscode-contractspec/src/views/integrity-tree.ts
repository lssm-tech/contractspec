/**
 * Integrity Analysis TreeView for VS Code.
 *
 * Displays contract integrity analysis results including:
 * - Features and their linked specs
 * - Orphaned specs not linked to features
 * - Issues (unresolved refs, broken links)
 */

import * as vscode from 'vscode';
import {
  analyzeIntegrity,
  type IntegrityAnalysisResult,
  type IntegrityIssue,
  type SpecLocation,
} from '@lssm/bundle.contractspec-workspace';
import type { FeatureScanResult } from '@lssm/module.contractspec-workspace';
import { getWorkspaceAdapters } from '../workspace/adapters';

type IntegrityNode =
  | RootNode
  | FeatureGroupNode
  | FeatureNode
  | SpecGroupNode
  | SpecNode
  | OrphansGroupNode
  | IssuesGroupNode
  | IssueNode;

interface RootNode {
  type: 'root';
  label: string;
}

interface FeatureGroupNode {
  type: 'feature-group';
  features: FeatureScanResult[];
  result: IntegrityAnalysisResult;
}

interface FeatureNode {
  type: 'feature';
  feature: FeatureScanResult;
  result: IntegrityAnalysisResult;
}

interface SpecGroupNode {
  type: 'spec-group';
  groupType: 'operations' | 'events' | 'presentations' | 'experiments';
  specs: Array<{ name: string; version: number }>;
  feature: FeatureScanResult;
  result: IntegrityAnalysisResult;
}

interface SpecNode {
  type: 'spec';
  name: string;
  version: number;
  specType: string;
  file?: string;
  resolved: boolean;
}

interface OrphansGroupNode {
  type: 'orphans-group';
  orphans: SpecLocation[];
}

interface IssuesGroupNode {
  type: 'issues-group';
  issues: IntegrityIssue[];
}

interface IssueNode {
  type: 'issue';
  issue: IntegrityIssue;
}

/**
 * TreeView provider for contract integrity analysis.
 */
export class IntegrityTreeProvider
  implements vscode.TreeDataProvider<IntegrityNode>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<
    IntegrityNode | undefined
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private result: IntegrityAnalysisResult | undefined;
  private isLoading = false;

  constructor() {
    // Initial refresh
    void this.refresh();
  }

  /**
   * Refresh the tree data.
   */
  async refresh(): Promise<void> {
    if (this.isLoading) return;

    this.isLoading = true;

    try {
      const adapters = getWorkspaceAdapters();

      this.result = await analyzeIntegrity(
        { fs: adapters.fs, logger: adapters.logger },
        {}
      );
    } catch (error) {
      console.error('Failed to analyze integrity:', error);
      this.result = undefined;
    } finally {
      this.isLoading = false;
      this._onDidChangeTreeData.fire(undefined);
    }
  }

  getTreeItem(element: IntegrityNode): vscode.TreeItem {
    switch (element.type) {
      case 'feature-group':
        return this.createFeatureGroupItem(element);
      case 'feature':
        return this.createFeatureItem(element);
      case 'spec-group':
        return this.createSpecGroupItem(element);
      case 'spec':
        return this.createSpecItem(element);
      case 'orphans-group':
        return this.createOrphansGroupItem(element);
      case 'issues-group':
        return this.createIssuesGroupItem(element);
      case 'issue':
        return this.createIssueItem(element);
      default:
        return new vscode.TreeItem('Unknown');
    }
  }

  getChildren(element?: IntegrityNode): IntegrityNode[] {
    if (!this.result) {
      return [];
    }

    // Root level
    if (!element) {
      const children: IntegrityNode[] = [];

      // Features group
      if (this.result.features.length > 0) {
        children.push({
          type: 'feature-group',
          features: this.result.features,
          result: this.result,
        });
      }

      // Orphaned specs group
      if (this.result.orphanedSpecs.length > 0) {
        children.push({
          type: 'orphans-group',
          orphans: this.result.orphanedSpecs,
        });
      }

      // Issues group
      if (this.result.issues.length > 0) {
        children.push({
          type: 'issues-group',
          issues: this.result.issues,
        });
      }

      return children;
    }

    // Feature group children
    if (element.type === 'feature-group') {
      return element.features.map((feature) => ({
        type: 'feature' as const,
        feature,
        result: element.result,
      }));
    }

    // Feature children (spec groups)
    if (element.type === 'feature') {
      const children: IntegrityNode[] = [];

      if (element.feature.operations.length > 0) {
        children.push({
          type: 'spec-group',
          groupType: 'operations',
          specs: element.feature.operations,
          feature: element.feature,
          result: element.result,
        });
      }

      if (element.feature.events.length > 0) {
        children.push({
          type: 'spec-group',
          groupType: 'events',
          specs: element.feature.events,
          feature: element.feature,
          result: element.result,
        });
      }

      if (element.feature.presentations.length > 0) {
        children.push({
          type: 'spec-group',
          groupType: 'presentations',
          specs: element.feature.presentations,
          feature: element.feature,
          result: element.result,
        });
      }

      if (element.feature.experiments.length > 0) {
        children.push({
          type: 'spec-group',
          groupType: 'experiments',
          specs: element.feature.experiments,
          feature: element.feature,
          result: element.result,
        });
      }

      return children;
    }

    // Spec group children
    if (element.type === 'spec-group') {
      return element.specs.map((spec) => {
        // Check if spec is resolved
        const specKey = `${spec.name}.v${spec.version}`;
        const inventory =
          element.groupType === 'operations'
            ? element.result.inventory.operations
            : element.groupType === 'events'
              ? element.result.inventory.events
              : element.groupType === 'presentations'
                ? element.result.inventory.presentations
                : element.result.inventory.experiments;

        const location = inventory.get(specKey);

        return {
          type: 'spec' as const,
          name: spec.name,
          version: spec.version,
          specType: element.groupType.slice(0, -1), // Remove trailing 's'
          file: location?.file,
          resolved: !!location,
        };
      });
    }

    // Orphans group children
    if (element.type === 'orphans-group') {
      return element.orphans.map((orphan) => ({
        type: 'spec' as const,
        name: orphan.name,
        version: orphan.version,
        specType: orphan.type,
        file: orphan.file,
        resolved: true,
      }));
    }

    // Issues group children
    if (element.type === 'issues-group') {
      return element.issues.map((issue) => ({
        type: 'issue' as const,
        issue,
      }));
    }

    return [];
  }

  private createFeatureGroupItem(element: FeatureGroupNode): vscode.TreeItem {
    const item = new vscode.TreeItem(
      `Features (${element.features.length})`,
      vscode.TreeItemCollapsibleState.Expanded
    );
    item.iconPath = new vscode.ThemeIcon('symbol-module');
    return item;
  }

  private createFeatureItem(element: FeatureNode): vscode.TreeItem {
    const { feature, result } = element;
    const hasIssues = result.issues.some(
      (i) => i.featureKey === feature.key && i.severity === 'error'
    );

    const label = feature.title ?? feature.key;
    const item = new vscode.TreeItem(
      label,
      vscode.TreeItemCollapsibleState.Collapsed
    );

    item.iconPath = hasIssues
      ? new vscode.ThemeIcon('error', new vscode.ThemeColor('errorForeground'))
      : new vscode.ThemeIcon(
          'pass',
          new vscode.ThemeColor('testing.iconPassed')
        );

    const counts = [
      `${feature.operations.length} ops`,
      `${feature.events.length} events`,
      `${feature.presentations.length} presentations`,
    ].join(', ');

    item.description = counts;
    item.tooltip = new vscode.MarkdownString(
      `**${feature.key}**\n\n${feature.description ?? ''}\n\n- ${counts}`
    );

    // Command to open feature file
    if (feature.filePath) {
      item.command = {
        command: 'vscode.open',
        title: 'Open Feature File',
        arguments: [vscode.Uri.file(feature.filePath)],
      };
    }

    return item;
  }

  private createSpecGroupItem(element: SpecGroupNode): vscode.TreeItem {
    const labels: Record<string, string> = {
      operations: 'Operations',
      events: 'Events',
      presentations: 'Presentations',
      experiments: 'Experiments',
    };

    const icons: Record<string, string> = {
      operations: 'symbol-method',
      events: 'broadcast',
      presentations: 'layout',
      experiments: 'beaker',
    };

    const label = `${labels[element.groupType]} (${element.specs.length})`;
    const item = new vscode.TreeItem(
      label,
      vscode.TreeItemCollapsibleState.Collapsed
    );

    item.iconPath = new vscode.ThemeIcon(icons[element.groupType]);

    return item;
  }

  private createSpecItem(element: SpecNode): vscode.TreeItem {
    const label = `${element.name}.v${element.version}`;
    const item = new vscode.TreeItem(
      label,
      vscode.TreeItemCollapsibleState.None
    );

    if (element.resolved) {
      item.iconPath = new vscode.ThemeIcon(
        'check',
        new vscode.ThemeColor('testing.iconPassed')
      );
    } else {
      item.iconPath = new vscode.ThemeIcon(
        'warning',
        new vscode.ThemeColor('editorWarning.foreground')
      );
      item.description = '(unresolved)';
    }

    // Command to open file
    if (element.file) {
      item.command = {
        command: 'vscode.open',
        title: 'Open Spec File',
        arguments: [vscode.Uri.file(element.file)],
      };
      item.tooltip = element.file;
    }

    return item;
  }

  private createOrphansGroupItem(element: OrphansGroupNode): vscode.TreeItem {
    const item = new vscode.TreeItem(
      `Orphaned Specs (${element.orphans.length})`,
      vscode.TreeItemCollapsibleState.Expanded
    );
    item.iconPath = new vscode.ThemeIcon(
      'warning',
      new vscode.ThemeColor('editorWarning.foreground')
    );
    item.tooltip = 'Specs not linked to any feature';
    return item;
  }

  private createIssuesGroupItem(element: IssuesGroupNode): vscode.TreeItem {
    const errorCount = element.issues.filter(
      (i) => i.severity === 'error'
    ).length;
    const warningCount = element.issues.filter(
      (i) => i.severity === 'warning'
    ).length;

    const label =
      errorCount > 0
        ? `Issues (${errorCount} errors, ${warningCount} warnings)`
        : `Issues (${warningCount} warnings)`;

    const item = new vscode.TreeItem(
      label,
      vscode.TreeItemCollapsibleState.Expanded
    );

    item.iconPath =
      errorCount > 0
        ? new vscode.ThemeIcon(
            'error',
            new vscode.ThemeColor('errorForeground')
          )
        : new vscode.ThemeIcon(
            'warning',
            new vscode.ThemeColor('editorWarning.foreground')
          );

    return item;
  }

  private createIssueItem(element: IssueNode): vscode.TreeItem {
    const { issue } = element;

    const item = new vscode.TreeItem(
      issue.message,
      vscode.TreeItemCollapsibleState.None
    );

    item.iconPath =
      issue.severity === 'error'
        ? new vscode.ThemeIcon(
            'error',
            new vscode.ThemeColor('errorForeground')
          )
        : new vscode.ThemeIcon(
            'warning',
            new vscode.ThemeColor('editorWarning.foreground')
          );

    item.description = issue.type;
    item.tooltip = new vscode.MarkdownString(
      `**${issue.type.toUpperCase()}**\n\n${issue.message}\n\n\`${issue.file}\``
    );

    // Command to open file
    if (issue.file) {
      item.command = {
        command: 'vscode.open',
        title: 'Open File',
        arguments: [vscode.Uri.file(issue.file)],
      };
    }

    return item;
  }

  /**
   * Get the current analysis result.
   */
  getResult(): IntegrityAnalysisResult | undefined {
    return this.result;
  }
}

/**
 * Register the integrity tree view.
 */
export function registerIntegrityTree(
  context: vscode.ExtensionContext
): IntegrityTreeProvider {
  const provider = new IntegrityTreeProvider();

  const treeView = vscode.window.createTreeView('contractspec-integrity', {
    treeDataProvider: provider,
    showCollapseAll: true,
  });

  // Register refresh command
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.refreshIntegrity', () => {
      void provider.refresh();
    })
  );

  context.subscriptions.push(treeView);

  return provider;
}

