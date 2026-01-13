/**
 * Feature Explorer TreeView for VS Code.
 *
 * Dedicated browser showing feature -> spec relationships
 * with navigation to spec files.
 */

import * as vscode from 'vscode';
import {
  analyzeIntegrity,
  type IntegrityAnalysisResult,
  type SpecLocation,
} from '@contractspec/bundle.workspace';
import type {
  FeatureScanResult,
  RefInfo,
} from '@contractspec/module.workspace';
import { getWorkspaceAdapters } from '../workspace/adapters';

type FeatureExplorerNode =
  | FeatureNode
  | LinkedSpecsNode
  | SpecRefNode
  | CapabilitiesNode
  | CapabilityRefNode;

interface FeatureNode {
  type: 'feature';
  feature: FeatureScanResult;
  result: IntegrityAnalysisResult;
}

interface LinkedSpecsNode {
  type: 'linked-specs';
  category: 'operations' | 'events' | 'presentations' | 'experiments';
  refs: RefInfo[];
  feature: FeatureScanResult;
  result: IntegrityAnalysisResult;
}

interface SpecRefNode {
  type: 'spec-ref';
  ref: RefInfo;
  category: 'operations' | 'events' | 'presentations' | 'experiments';
  location?: SpecLocation;
}

interface CapabilitiesNode {
  type: 'capabilities';
  direction: 'provides' | 'requires';
  refs: RefInfo[];
  feature: FeatureScanResult;
}

interface CapabilityRefNode {
  type: 'capability-ref';
  ref: RefInfo;
  direction: 'provides' | 'requires';
}

/**
 * TreeView provider for feature exploration.
 */
export class FeatureExplorerProvider implements vscode.TreeDataProvider<FeatureExplorerNode> {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    FeatureExplorerNode | undefined
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private result: IntegrityAnalysisResult | undefined;
  private isLoading = false;

  constructor() {
    void this.refresh();
  }

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
      console.error('Failed to load features:', error);
      this.result = undefined;
    } finally {
      this.isLoading = false;
      this._onDidChangeTreeData.fire(undefined);
    }
  }

  getTreeItem(element: FeatureExplorerNode): vscode.TreeItem {
    switch (element.type) {
      case 'feature':
        return this.createFeatureItem(element);
      case 'linked-specs':
        return this.createLinkedSpecsItem(element);
      case 'spec-ref':
        return this.createSpecRefItem(element);
      case 'capabilities':
        return this.createCapabilitiesItem(element);
      case 'capability-ref':
        return this.createCapabilityRefItem(element);
      default:
        return new vscode.TreeItem('Unknown');
    }
  }

  getChildren(element?: FeatureExplorerNode): FeatureExplorerNode[] {
    if (!this.result) {
      return [];
    }

    // Root level: list all features
    if (!element) {
      return this.result.features.map((feature) => ({
        type: 'feature' as const,
        feature,
        result: this.result as IntegrityAnalysisResult,
      }));
    }

    // Feature children: spec categories
    if (element.type === 'feature') {
      const children: FeatureExplorerNode[] = [];
      const { feature, result } = element;

      if (feature.operations.length > 0) {
        children.push({
          type: 'linked-specs',
          category: 'operations',
          refs: feature.operations,
          feature,
          result,
        });
      }

      if (feature.events.length > 0) {
        children.push({
          type: 'linked-specs',
          category: 'events',
          refs: feature.events,
          feature,
          result,
        });
      }

      if (feature.presentations.length > 0) {
        children.push({
          type: 'linked-specs',
          category: 'presentations',
          refs: feature.presentations,
          feature,
          result,
        });
      }

      if (feature.experiments.length > 0) {
        children.push({
          type: 'linked-specs',
          category: 'experiments',
          refs: feature.experiments,
          feature,
          result,
        });
      }

      if (feature.capabilities.provides.length > 0) {
        children.push({
          type: 'capabilities',
          direction: 'provides',
          refs: feature.capabilities.provides,
          feature,
        });
      }

      if (feature.capabilities.requires.length > 0) {
        children.push({
          type: 'capabilities',
          direction: 'requires',
          refs: feature.capabilities.requires,
          feature,
        });
      }

      return children;
    }

    // Linked specs children: individual refs
    if (element.type === 'linked-specs') {
      return element.refs.map((ref) => {
        const refKey = `${ref.key}.v${ref.version}`;
        const inventory =
          element.category === 'operations'
            ? element.result.inventory.operations
            : element.category === 'events'
              ? element.result.inventory.events
              : element.category === 'presentations'
                ? element.result.inventory.presentations
                : element.result.inventory.experiments;

        return {
          type: 'spec-ref' as const,
          ref,
          category: element.category,
          location: inventory.get(refKey),
        };
      });
    }

    // Capabilities children: individual capability refs
    if (element.type === 'capabilities') {
      return element.refs.map((ref) => ({
        type: 'capability-ref' as const,
        ref,
        direction: element.direction,
      }));
    }

    return [];
  }

  private createFeatureItem(element: FeatureNode): vscode.TreeItem {
    const { feature } = element;

    const item = new vscode.TreeItem(
      feature.title ?? feature.key,
      vscode.TreeItemCollapsibleState.Collapsed
    );

    item.iconPath = new vscode.ThemeIcon('package');

    // Show counts in description
    const counts = [];
    if (feature.operations.length > 0) {
      counts.push(`${feature.operations.length} ops`);
    }
    if (feature.events.length > 0) {
      counts.push(`${feature.events.length} events`);
    }
    if (feature.presentations.length > 0) {
      counts.push(`${feature.presentations.length} pres`);
    }

    item.description = counts.join(', ');

    item.tooltip = new vscode.MarkdownString(
      [
        `### ${feature.key}`,
        '',
        feature.description ?? '_No description_',
        '',
        feature.domain ? `**Domain:** ${feature.domain}` : '',
        feature.stability ? `**Stability:** ${feature.stability}` : '',
        '',
        `- **Operations:** ${feature.operations.length}`,
        `- **Events:** ${feature.events.length}`,
        `- **Presentations:** ${feature.presentations.length}`,
        `- **Experiments:** ${feature.experiments.length}`,
      ]
        .filter(Boolean)
        .join('\n')
    );

    // Command to open feature file
    if (feature.filePath) {
      item.command = {
        command: 'vscode.open',
        title: 'Open Feature',
        arguments: [vscode.Uri.file(feature.filePath)],
      };
    }

    item.contextValue = 'feature';

    return item;
  }

  private createLinkedSpecsItem(element: LinkedSpecsNode): vscode.TreeItem {
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

    const label = `${labels[element.category]} (${element.refs.length})`;

    const item = new vscode.TreeItem(
      label,
      vscode.TreeItemCollapsibleState.Collapsed
    );

    item.iconPath = new vscode.ThemeIcon(icons[element.category]);
    item.contextValue = 'spec-group';

    return item;
  }

  private createSpecRefItem(element: SpecRefNode): vscode.TreeItem {
    const { ref, location } = element;
    const label = `${ref.key}.v${ref.version}`;

    const item = new vscode.TreeItem(
      label,
      vscode.TreeItemCollapsibleState.None
    );

    if (location) {
      item.iconPath = new vscode.ThemeIcon(
        'check',
        new vscode.ThemeColor('testing.iconPassed')
      );
      item.tooltip = location.file;

      item.command = {
        command: 'vscode.open',
        title: 'Open Spec',
        arguments: [vscode.Uri.file(location.file)],
      };
    } else {
      item.iconPath = new vscode.ThemeIcon(
        'warning',
        new vscode.ThemeColor('editorWarning.foreground')
      );
      item.description = '(unresolved)';
      item.tooltip = 'Spec not found in workspace';
    }

    item.contextValue = 'spec-ref';

    return item;
  }

  private createCapabilitiesItem(element: CapabilitiesNode): vscode.TreeItem {
    const label =
      element.direction === 'provides'
        ? `Provides (${element.refs.length})`
        : `Requires (${element.refs.length})`;

    const item = new vscode.TreeItem(
      label,
      vscode.TreeItemCollapsibleState.Collapsed
    );

    item.iconPath = new vscode.ThemeIcon(
      element.direction === 'provides' ? 'export' : 'import'
    );

    return item;
  }

  private createCapabilityRefItem(element: CapabilityRefNode): vscode.TreeItem {
    const { ref } = element;
    const label = `${ref.key}.v${ref.version}`;

    const item = new vscode.TreeItem(
      label,
      vscode.TreeItemCollapsibleState.None
    );

    item.iconPath = new vscode.ThemeIcon('symbol-interface');

    return item;
  }
}

/**
 * Register the feature explorer view.
 */
export function registerFeatureExplorer(
  context: vscode.ExtensionContext
): FeatureExplorerProvider {
  const provider = new FeatureExplorerProvider();

  const treeView = vscode.window.createTreeView('contractspec-features', {
    treeDataProvider: provider,
    showCollapseAll: true,
  });

  // Register refresh command
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.refreshFeatures', () => {
      void provider.refresh();
    })
  );

  context.subscriptions.push(treeView);

  return provider;
}
