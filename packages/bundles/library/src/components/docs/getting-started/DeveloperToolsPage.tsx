import Link from '@contractspec/lib.ui-link';
import { ChevronRight, Code2, Cpu, Layers, Terminal } from 'lucide-react';

export function DeveloperToolsPage() {
  const tools = [
    {
      name: 'CLI',
      href: '/docs/getting-started/tools/cli',
      description:
        'Command-line interface for spec creation, building, validation, and CI/CD integration.',
      icon: Terminal,
      status: 'available',
      highlights: [
        'AI-powered code generation',
        'Multiple agent modes',
        'SARIF/JSON output',
      ],
    },
    {
      name: 'VS Code Extension',
      href: '/docs/getting-started/tools/vscode',
      description:
        'Real-time validation, scaffolding, and navigation directly in your editor.',
      icon: Code2,
      status: 'available',
      highlights: [
        'Specs Explorer sidebar',
        'Watch mode',
        'Interactive walkthroughs',
      ],
    },
    {
      name: 'ContractSpec Studio',
      href: 'https://www.contractspec.studio',
      description:
        'Visual builder, lifecycle management, and deployment orchestration.',
      icon: Layers,
      status: 'coming-soon',
      highlights: [
        'Visual spec editor',
        'Deployment pipelines',
        'Analytics dashboard',
      ],
    },
    {
      name: 'JetBrains Plugin',
      href: '#',
      description:
        'Full ContractSpec support for IntelliJ, WebStorm, and other JetBrains IDEs.',
      icon: Cpu,
      status: 'coming-soon',
      highlights: [
        'Code navigation',
        'Inline validation',
        'Refactoring support',
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Developer Tools</h1>
        <p className="text-muted-foreground text-lg">
          ContractSpec provides a suite of tools to help you build, validate,
          and manage your specifications across different environments.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          const isComingSoon = tool.status === 'coming-soon';

          return (
            <div
              key={tool.name}
              className={`card-subtle relative space-y-4 p-6 ${isComingSoon ? 'opacity-75' : ''}`}
            >
              {isComingSoon && (
                <span className="absolute -top-2 right-4 rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-medium text-violet-400">
                  Coming Soon
                </span>
              )}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                  <IconComponent className="h-5 w-5 text-violet-400" />
                </div>
                <h3 className="text-lg font-bold">{tool.name}</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                {tool.description}
              </p>
              <ul className="space-y-1">
                {tool.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="text-muted-foreground flex items-center gap-2 text-sm"
                  >
                    <span className="text-violet-400">→</span>
                    {highlight}
                  </li>
                ))}
              </ul>
              {!isComingSoon && (
                <Link
                  href={tool.href}
                  className="btn-ghost inline-flex items-center gap-1 text-sm"
                >
                  Learn more <ChevronRight size={14} />
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h3 className="font-bold">Quick Install</h3>
        <div className="space-y-3">
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-medium">
              CLI
            </p>
            <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded border p-3 font-mono text-sm">
              <pre>bun add -D contractspec</pre>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-medium">
              VS Code Extension
            </p>
            <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded border p-3 font-mono text-sm">
              <pre>code --install-extension lssm.vscode-contractspec</pre>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/getting-started/tools/cli" className="btn-primary">
          Get Started with CLI <ChevronRight size={16} />
        </Link>
        <Link href="/docs/getting-started/tools/vscode" className="btn-ghost">
          VS Code Extension
        </Link>
      </div>
    </div>
  );
}
