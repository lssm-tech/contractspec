/**
 * Integrity Analysis TreeView for VS Code.
 *
 * Displays contract integrity analysis results including:
 * - Features and their linked specs
 * - Orphaned specs not linked to features
 * - Issues grouped by type (unresolved refs, broken links, etc.)
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

/**
 * Issue type for grouping in the tree view.
 */
type IssueType = IntegrityIssue['type'];

type IntegrityNode =
  | SummaryNode
  | FeatureGroupNode
  | FeatureNode
  | SpecGroupNode
  | SpecNode
  | OrphansGroupNode
  | OrphanSpecNode
  | IssuesGroupNode
  | IssueTypeGroupNode
  | IssueNode;

interface SummaryNode {
  type: 'summary';
  result: IntegrityAnalysisResult;
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
  specs: { name: string; version: number }[];
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
  featureKey?: string;
}

interface OrphansGroupNode {
  type: 'orphans-group';
  orphans: SpecLocation[];
}

interface OrphanSpecNode {
  type: 'orphan-spec';
  spec: SpecLocation;
}

interface IssuesGroupNode {
  type: 'issues-group';
  issues: IntegrityIssue[];
}

interface IssueTypeGroupNode {
  type: 'issue-type-group';
  issueType: IssueType;
  issues: IntegrityIssue[];
}

interface IssueNode {
  type: 'issue';
  issue: IntegrityIssue;
}

/**
 * Labels and icons for issue types.
 */
const ISSUE_TYPE_META: Record<IssueType, { label: string; icon: string }> = {
  orphaned: { label: 'Orphaned Specs', icon: 'question' },
  'unresolved-ref': { label: 'Unresolved References', icon: 'warning' },
  'missing-feature': { label: 'Missing Features', icon: 'error' },
  'broken-link': { label: 'Broken Links', icon: 'link' },
};

/**
 * TreeView provider for contract integrity analysis.
 */
export class IntegrityTreeProvider implements vscode.TreeDataProvider<IntegrityNode> {
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
      case 'summary':
        return this.createSummaryItem(element);
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
      case 'orphan-spec':
        return this.createOrphanSpecItem(element);
      case 'issues-group':
        return this.createIssuesGroupItem(element);
      case 'issue-type-group':
        return this.createIssueTypeGroupItem(element);
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

      // Summary item
      children.push({
        type: 'summary',
        result: this.result,
      });

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

      // Issues group (only if there are issues)
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
          featureKey: element.feature.key,
        };
      });
    }

    // Orphans group children
    if (element.type === 'orphans-group') {
      return element.orphans.map((orphan) => ({
        type: 'orphan-spec' as const,
        spec: orphan,
      }));
    }

    // Issues group children - group by issue type
    if (element.type === 'issues-group') {
      const issuesByType = new Map<IssueType, IntegrityIssue[]>();

      for (const issue of element.issues) {
        if (!issuesByType.has(issue.type)) {
          issuesByType.set(issue.type, []);
        }
        issuesByType.get(issue.type)?.push(issue);
      }

      return Array.from(issuesByType.entries()).map(([issueType, issues]) => ({
        type: 'issue-type-group' as const,
        issueType,
        issues,
      }));
    }

    // Issue type group children
    if (element.type === 'issue-type-group') {
      return element.issues.map((issue) => ({
        type: 'issue' as const,
        issue,
      }));
    }

    return [];
  }

  private createSummaryItem(element: SummaryNode): vscode.TreeItem {
    const { result } = element;
    const healthy = result.healthy;
    const label = healthy ? 'Healthy' : 'Issues Found';

    const item = new vscode.TreeItem(
      label,
      vscode.TreeItemCollapsibleState.None
    );

    item.iconPath = healthy
      ? new vscode.ThemeIcon(
          'check',
          new vscode.ThemeColor('testing.iconPassed')
        )
      : new vscode.ThemeIcon(
          'warning',
          new vscode.ThemeColor('editorWarning.foreground')
        );

    const coverage = result.coverage;
    const coveragePercent =
      coverage.total > 0
        ? Math.round((coverage.linkedToFeature / coverage.total) * 100)
        : 100;

    item.description = `${coveragePercent}% coverage (${coverage.linkedToFeature}/${coverage.total} specs linked)`;

    item.tooltip = new vscode.MarkdownString(
      [
        `### Contract Integrity Summary`,
        '',
        `**Status:** ${healthy ? 'Healthy' : 'Issues Found'}`,
        '',
        `**Coverage:**`,
        `- Total specs: ${coverage.total}`,
        `- Linked to features: ${coverage.linkedToFeature}`,
        `- Orphaned: ${coverage.orphaned}`,
        '',
        `**Breakdown:**`,
        ...Object.entries(coverage.byType).map(
          ([type, data]) =>
            `- ${type}: ${data.covered}/${data.total} (${data.orphaned} orphaned)`
        ),
      ].join('\n')
    );

    return item;
  }

  private createFeatureGroupItem(element: FeatureGroupNode): vscode.TreeItem {
    const item = new vscode.TreeItem(
      `Features (${element.features.length})`,
      vscode.TreeItemCollapsibleState.Expanded
    );
    item.iconPath = new vscode.ThemeIcon('symbol-module');
    item.contextValue = 'feature-group';
    return item;
  }

  private createFeatureItem(element: FeatureNode): vscode.TreeItem {
    const { feature, result } = element;
    const featureIssues = result.issues.filter(
      (i) => i.featureKey === feature.key
    );
    const hasErrors = featureIssues.some((i) => i.severity === 'error');
    const hasWarnings = featureIssues.some((i) => i.severity === 'warning');

    const label = feature.title ?? feature.key;
    const item = new vscode.TreeItem(
      label,
      vscode.TreeItemCollapsibleState.Collapsed
    );

    if (hasErrors) {
      item.iconPath = new vscode.ThemeIcon(
        'error',
        new vscode.ThemeColor('errorForeground')
      );
    } else if (hasWarnings) {
      item.iconPath = new vscode.ThemeIcon(
        'warning',
        new vscode.ThemeColor('editorWarning.foreground')
      );
    } else {
      item.iconPath = new vscode.ThemeIcon(
        'pass',
        new vscode.ThemeColor('testing.iconPassed')
      );
    }

    const counts = [
      `${feature.operations.length} ops`,
      `${feature.events.length} events`,
      `${feature.presentations.length} presentations`,
    ].join(', ');

    item.description = counts;

    const issuesSummary =
      featureIssues.length > 0
        ? `\n\n**Issues (${featureIssues.length}):**\n${featureIssues.map((i) => `- ${i.message}`).join('\n')}`
        : '';

    item.tooltip = new vscode.MarkdownString(
      `**${feature.key}**\n\n${feature.description ?? '_No description_'}\n\n- ${counts}${issuesSummary}`
    );

    // Command to open feature file
    if (feature.filePath) {
      item.command = {
        command: 'vscode.open',
        title: 'Open Feature File',
        arguments: [vscode.Uri.file(feature.filePath)],
      };
    }

    item.contextValue = 'feature';

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

    // Count unresolved specs
    const unresolvedCount = element.specs.filter((spec) => {
      const specKey = `${spec.name}.v${spec.version}`;
      const inventory =
        element.groupType === 'operations'
          ? element.result.inventory.operations
          : element.groupType === 'events'
            ? element.result.inventory.events
            : element.groupType === 'presentations'
              ? element.result.inventory.presentations
              : element.result.inventory.experiments;
      return !inventory.get(specKey);
    }).length;

    const label = `${labels[element.groupType]} (${element.specs.length})`;
    const item = new vscode.TreeItem(
      label,
      vscode.TreeItemCollapsibleState.Collapsed
    );

    item.iconPath = new vscode.ThemeIcon(icons[element.groupType]);

    if (unresolvedCount > 0) {
      item.description = `${unresolvedCount} unresolved`;
    }

    item.contextValue = 'spec-group';

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
    } else {
      item.tooltip = 'Spec file not found in workspace';
    }

    item.contextValue = element.resolved ? 'spec' : 'unresolved-spec';

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
    item.tooltip = new vscode.MarkdownString(
      [
        '### Orphaned Specs',
        '',
        'These specs are not linked to any feature.',
        '',
        'Consider:',
        '- Linking them to an existing feature',
        '- Creating a new feature for them',
        '- Removing them if no longer needed',
      ].join('\n')
    );
    item.contextValue = 'orphans-group';
    return item;
  }

  private createOrphanSpecItem(element: OrphanSpecNode): vscode.TreeItem {
    const { spec } = element;
    const label = `${spec.name}.v${spec.version}`;
    const item = new vscode.TreeItem(
      label,
      vscode.TreeItemCollapsibleState.None
    );

    item.iconPath = new vscode.ThemeIcon(
      'question',
      new vscode.ThemeColor('editorWarning.foreground')
    );
    item.description = spec.type;

    // Command to open file
    if (spec.file) {
      item.command = {
        command: 'vscode.open',
        title: 'Open Spec File',
        arguments: [vscode.Uri.file(spec.file)],
      };
      item.tooltip = spec.file;
    }

    item.contextValue = 'orphan-spec';

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

    item.contextValue = 'issues-group';

    return item;
  }

  private createIssueTypeGroupItem(
    element: IssueTypeGroupNode
  ): vscode.TreeItem {
    const meta = ISSUE_TYPE_META[element.issueType];
    const label = `${meta.label} (${element.issues.length})`;

    const item = new vscode.TreeItem(
      label,
      vscode.TreeItemCollapsibleState.Collapsed
    );

    const hasErrors = element.issues.some((i) => i.severity === 'error');
    item.iconPath = new vscode.ThemeIcon(
      meta.icon,
      hasErrors
        ? new vscode.ThemeColor('errorForeground')
        : new vscode.ThemeColor('editorWarning.foreground')
    );

    item.contextValue = 'issue-type-group';

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

    // Show relevant context in description
    if (issue.specName) {
      item.description = `${issue.specName}`;
    } else if (issue.featureKey) {
      item.description = `in ${issue.featureKey}`;
    }

    const tooltipParts = [
      `**${issue.type.toUpperCase()}** (${issue.severity})`,
      '',
      issue.message,
    ];

    if (issue.specName) {
      tooltipParts.push('', `**Spec:** ${issue.specName}`);
    }
    if (issue.featureKey) {
      tooltipParts.push(`**Feature:** ${issue.featureKey}`);
    }
    if (issue.file) {
      tooltipParts.push('', `\`${issue.file}\``);
    }

    item.tooltip = new vscode.MarkdownString(tooltipParts.join('\n'));

    // Command to open file
    if (issue.file) {
      item.command = {
        command: 'vscode.open',
        title: 'Open File',
        arguments: [vscode.Uri.file(issue.file)],
      };
    }

    item.contextValue = 'issue';

    return item;
  }

  /**
   * Get the current analysis result.
   */
  getResult(): IntegrityAnalysisResult | undefined {
    return this.result;
  }

  /**
   * Get all features from the analysis.
   */
  getFeatures(): FeatureScanResult[] {
    return this.result?.features ?? [];
  }

  /**
   * Get orphaned specs from the analysis.
   */
  getOrphanedSpecs(): SpecLocation[] {
    return this.result?.orphanedSpecs ?? [];
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
