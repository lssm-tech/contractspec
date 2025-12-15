/**
 * Build Results TreeView provider.
 */

import * as vscode from 'vscode';
import * as path from 'path';

interface BuildResult {
  specPath: string;
  specName: string;
  timestamp: Date;
  results: TargetResult[];
}

interface TargetResult {
  target: string;
  success: boolean;
  outputPath?: string;
  error?: string;
  skipped?: boolean;
}

export class BuildResultsTreeDataProvider implements vscode.TreeDataProvider<BuildResultTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    BuildResultTreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private buildResults: BuildResult[] = [];

  /**
   * Add build result.
   */
  addBuildResult(
    specPath: string,
    specName: string,
    results: TargetResult[]
  ): void {
    // Remove previous result for this spec
    this.buildResults = this.buildResults.filter(
      (r) => r.specPath !== specPath
    );

    // Add new result
    this.buildResults.unshift({
      specPath,
      specName,
      timestamp: new Date(),
      results,
    });

    // Keep only last 20 results
    if (this.buildResults.length > 20) {
      this.buildResults = this.buildResults.slice(0, 20);
    }

    this._onDidChangeTreeData.fire();
  }

  /**
   * Clear all results.
   */
  clear(): void {
    this.buildResults = [];
    this._onDidChangeTreeData.fire();
  }

  /**
   * Get tree item.
   */
  getTreeItem(element: BuildResultTreeItem): vscode.TreeItem {
    return element;
  }

  /**
   * Get children.
   */
  async getChildren(
    element?: BuildResultTreeItem
  ): Promise<BuildResultTreeItem[]> {
    if (!element) {
      // Root level: show all build results
      if (this.buildResults.length === 0) {
        return [
          new BuildResultTreeItem(
            'No build results yet',
            vscode.TreeItemCollapsibleState.None,
            'empty',
            undefined
          ),
        ];
      }

      return this.buildResults.map((result) => {
        const successCount = result.results.filter((r) => r.success).length;
        const failCount = result.results.filter(
          (r) => !r.success && !r.skipped
        ).length;
        const timeAgo = this.getTimeAgo(result.timestamp);

        const label = `${result.specName} ${failCount > 0 ? '❌' : '✅'}`;
        const description = `${successCount}/${result.results.length} • ${timeAgo}`;

        return new BuildResultTreeItem(
          label,
          vscode.TreeItemCollapsibleState.Collapsed,
          'build-result',
          result,
          description
        );
      });
    } else if (element.contextValue === 'build-result' && element.data) {
      // Show individual target results
      const buildResult = element.data as BuildResult;

      return buildResult.results.map((targetResult) => {
        const icon = targetResult.skipped
          ? '⏭️'
          : targetResult.success
            ? '✅'
            : '❌';
        const label = `${icon} ${targetResult.target}`;
        const description = targetResult.outputPath
          ? path.basename(targetResult.outputPath)
          : targetResult.error || (targetResult.skipped ? 'Skipped' : '');

        return new BuildResultTreeItem(
          label,
          vscode.TreeItemCollapsibleState.None,
          'target-result',
          targetResult,
          description
        );
      });
    }

    return [];
  }

  /**
   * Get time ago string.
   */
  private getTimeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) {
      return 'just now';
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
}

/**
 * Tree item for build results tree.
 */
export class BuildResultTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly contextValue: string,
    public readonly data?: any,
    public readonly description?: string
  ) {
    super(label, collapsibleState);

    this.description = description;

    if (contextValue === 'build-result' && data) {
      const buildResult = data as BuildResult;
      this.tooltip = `${buildResult.specPath}\n${buildResult.timestamp.toLocaleString()}`;
      this.resourceUri = vscode.Uri.file(buildResult.specPath);

      // Set icon based on success/failure
      const hasFailures = buildResult.results.some(
        (r) => !r.success && !r.skipped
      );
      this.iconPath = new vscode.ThemeIcon(
        hasFailures ? 'error' : 'check',
        hasFailures
          ? new vscode.ThemeColor('errorForeground')
          : new vscode.ThemeColor('successForeground')
      );
    } else if (contextValue === 'target-result' && data) {
      const targetResult = data as TargetResult;

      if (targetResult.outputPath) {
        this.tooltip = targetResult.outputPath;
        this.resourceUri = vscode.Uri.file(targetResult.outputPath);
        this.command = {
          command: 'vscode.open',
          title: 'Open Generated File',
          arguments: [this.resourceUri],
        };
      } else if (targetResult.error) {
        this.tooltip = targetResult.error;
      }

      // Set icon
      if (targetResult.skipped) {
        this.iconPath = new vscode.ThemeIcon('debug-step-over');
      } else if (targetResult.success) {
        this.iconPath = new vscode.ThemeIcon('check');
      } else {
        this.iconPath = new vscode.ThemeIcon('error');
      }
    } else if (contextValue === 'empty') {
      this.iconPath = new vscode.ThemeIcon('info');
    }
  }
}
