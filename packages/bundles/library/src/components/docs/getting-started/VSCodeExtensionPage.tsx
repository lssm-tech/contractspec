import Link from '@contractspec/lib.ui-link';
import { ChevronRight, ExternalLink } from 'lucide-react';

export function VSCodeExtensionPage() {
  const features = [
    {
      category: 'Core Functionality',
      items: [
        'Real-time validation with instant feedback on spec errors',
        'Build/Scaffold handlers and components from specs',
        'Interactive spec creation wizard',
        'Watch mode for auto-rebuild on changes',
        'Sync all specs in workspace with one command',
      ],
    },
    {
      category: 'Visual Navigation',
      items: [
        'Specs Explorer sidebar with organized tree view',
        'Dependencies view to visualize spec relationships',
        'Build Results tracking with history',
        'Circular dependency detection',
      ],
    },
    {
      category: 'Comparison & Export',
      items: [
        'Semantic and text diff between specs',
        'Git comparison with baseline branches',
        'OpenAPI 3.1 specification export',
      ],
    },
  ];

  const commands = [
    {
      name: 'Create New Spec',
      description: 'Interactive wizard to create specs',
    },
    {
      name: 'Validate Current Spec',
      description: 'Validate the currently open spec',
    },
    {
      name: 'Build/Scaffold from Current Spec',
      description: 'Generate handler/component',
    },
    { name: 'Toggle Watch Mode', description: 'Auto-rebuild on changes' },
    { name: 'Sync All Specs', description: 'Build all specs in workspace' },
    {
      name: 'Analyze Spec Dependencies',
      description: 'Visualize spec dependencies',
    },
    {
      name: 'Compare Specs',
      description: 'Semantic or text diff between specs',
    },
    {
      name: 'Export to OpenAPI',
      description: 'Generate OpenAPI specification',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">VS Code Extension</h1>
        <p className="text-muted-foreground text-lg">
          Spec-first development directly in VS Code. Validate, scaffold, and
          explore your contract specifications with real-time feedback.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href="https://marketplace.visualstudio.com/items?itemName=lssm.vscode-contractspec"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2"
        >
          Install Extension <ExternalLink size={16} />
        </a>
        <a
          href="vscode:extension/lssm.vscode-contractspec"
          className="btn-ghost inline-flex items-center gap-2"
        >
          Open in VS Code
        </a>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Installation</h2>
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              <strong>Option 1:</strong> Install from VS Code Marketplace
            </p>
            <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
              <pre>code --install-extension lssm.vscode-contractspec</pre>
            </div>
            <p className="text-muted-foreground mt-4 text-sm">
              <strong>Option 2:</strong> Search for &quot;ContractSpec&quot; in
              VS Code Extensions (Ctrl/Cmd+Shift+X)
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Features</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((section) => (
              <div key={section.category} className="card-subtle space-y-3 p-4">
                <h3 className="font-bold text-violet-400">
                  {section.category}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="text-muted-foreground flex items-start gap-2 text-sm"
                    >
                      <span className="mt-1 text-violet-400">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Commands</h2>
          <p className="text-muted-foreground">
            Access commands via Command Palette (Ctrl/Cmd+Shift+P) with prefix{' '}
            <code>ContractSpec:</code>
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {commands.map((cmd) => (
              <div
                key={cmd.name}
                className="card-subtle flex items-center gap-3 p-3"
              >
                <div className="flex-1">
                  <p className="font-mono text-sm font-medium">{cmd.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {cmd.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Sidebar Views</h2>
          <p className="text-muted-foreground">
            The extension adds a ContractSpec activity bar (icon in sidebar)
            with three views:
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="card-subtle space-y-2 p-4">
              <h4 className="font-bold">Specs Explorer</h4>
              <p className="text-muted-foreground text-sm">
                Browse all specs organized by type. Shows name, version, and
                stability. Click to open, right-click for actions.
              </p>
            </div>
            <div className="card-subtle space-y-2 p-4">
              <h4 className="font-bold">Dependencies</h4>
              <p className="text-muted-foreground text-sm">
                Visualize spec relationships. Detect circular dependencies.
                Navigate to referenced specs.
              </p>
            </div>
            <div className="card-subtle space-y-2 p-4">
              <h4 className="font-bold">Build Results</h4>
              <p className="text-muted-foreground text-sm">
                Track build history (last 20). Success/failure indicators. Click
                to open generated files.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Getting Started</h2>
          <ol className="text-muted-foreground list-inside list-decimal space-y-2">
            <li>Install the extension from VS Code Marketplace</li>
            <li>Open a workspace with ContractSpec files (or create one)</li>
            <li>Start the walkthrough: Help → Welcome → ContractSpec</li>
            <li>
              Create your first spec: Click <strong>+</strong> in Specs Explorer
              or run <code>ContractSpec: Create New Spec</code>
            </li>
            <li>
              Build from it: Click the <strong>🔨</strong> icon in the editor
              title bar
            </li>
          </ol>
        </div>

        <div className="card-subtle space-y-4 p-6">
          <h3 className="font-bold">Configuration</h3>
          <p className="text-muted-foreground text-sm">
            Configure the extension in VS Code Settings:
          </p>
          <div className="overflow-x-auto">
            <table className="text-muted-foreground w-full text-sm">
              <thead>
                <tr className="border-border border-b">
                  <th className="p-2 text-left font-medium">Setting</th>
                  <th className="p-2 text-left font-medium">Description</th>
                  <th className="p-2 text-left font-medium">Default</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-border border-b">
                  <td className="p-2 font-mono text-xs">validation.onSave</td>
                  <td className="p-2">Run validation on save</td>
                  <td className="p-2">true</td>
                </tr>
                <tr className="border-border border-b">
                  <td className="p-2 font-mono text-xs">validation.onOpen</td>
                  <td className="p-2">Run validation on open</td>
                  <td className="p-2">true</td>
                </tr>
                <tr className="border-border border-b">
                  <td className="p-2 font-mono text-xs">api.baseUrl</td>
                  <td className="p-2">Base URL for ContractSpec API</td>
                  <td className="p-2">(empty)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/getting-started/tools/cli" className="btn-ghost">
          Back: CLI
        </Link>
        <Link href="/docs/specs" className="btn-primary">
          Next: Core Concepts <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
