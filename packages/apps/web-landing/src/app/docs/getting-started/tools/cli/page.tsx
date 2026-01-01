import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

export default function CLIPage() {
  const commands = [
    {
      name: 'create',
      description: 'Interactive wizard to create contract specifications',
      usage: 'contractspec create [--type operation] [--ai]',
    },
    {
      name: 'build',
      description:
        'Generate implementation code from contract specs using AI agents',
      usage: 'contractspec build <spec-file> [--agent-mode claude-code]',
    },
    {
      name: 'validate',
      description: 'Validate contract specifications and implementations',
      usage: 'contractspec validate <spec-file> [--check-implementation]',
    },
    {
      name: 'list',
      description: 'List all contract specifications in the project',
      usage: 'contractspec list [--type operation] [--json]',
    },
    {
      name: 'watch',
      description: 'Watch specs and auto-regenerate on changes',
      usage: 'contractspec watch [--build] [--validate]',
    },
    {
      name: 'sync',
      description: 'Sync contracts by building all discovered specs',
      usage: 'contractspec sync [--dry-run]',
    },
    {
      name: 'ci',
      description: 'Run all validation checks for CI/CD pipelines',
      usage: 'contractspec ci [--format sarif] [--output results.sarif]',
    },
    {
      name: 'deps',
      description: 'Analyze contract dependencies and relationships',
      usage: 'contractspec deps [--circular] [--format dot]',
    },
    {
      name: 'diff',
      description: 'Compare contract specifications and show differences',
      usage: 'contractspec diff <spec1> <spec2> [--breaking]',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">ContractSpec CLI</h1>
        <p className="text-muted-foreground text-lg">
          Command-line interface for creating, building, and validating contract
          specifications with AI-powered code generation.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Installation</h2>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`# Install as dev dependency
bun add -D contractspec

# Or with npm
npm install -D contractspec`}</pre>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Quick Start</h2>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`# Create a new contract spec with AI
contractspec create --ai

# Build handler from spec
contractspec build src/contracts/signup.contracts.ts

# Validate all specs
contractspec validate 'src/contracts/**/*.ts'

# Watch for changes
contractspec watch --build`}</pre>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Commands</h2>
          <div className="grid gap-4">
            {commands.map((cmd) => (
              <div key={cmd.name} className="card-subtle space-y-2 p-4">
                <h3 className="font-mono font-bold text-violet-400">
                  {cmd.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {cmd.description}
                </p>
                <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded border p-2 font-mono text-xs">
                  <code>{cmd.usage}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">AI Agent Modes</h2>
          <p className="text-muted-foreground">
            The CLI supports multiple AI agent modes for different use cases:
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="card-subtle p-4">
              <h4 className="font-bold">simple</h4>
              <p className="text-muted-foreground text-sm">
                Direct LLM API calls, fast and straightforward. Best for rapid
                prototyping.
              </p>
            </div>
            <div className="card-subtle p-4">
              <h4 className="font-bold">claude-code</h4>
              <p className="text-muted-foreground text-sm">
                Extended thinking with Claude. Best for production-quality code.
              </p>
            </div>
            <div className="card-subtle p-4">
              <h4 className="font-bold">openai-codex</h4>
              <p className="text-muted-foreground text-sm">
                GPT-4o/o1 models. Excellent for algorithms and optimization.
              </p>
            </div>
            <div className="card-subtle p-4">
              <h4 className="font-bold">cursor</h4>
              <p className="text-muted-foreground text-sm">
                Leverages Cursor agentic capabilities. Requires Cursor
                environment.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">CI/CD Integration</h2>
          <p className="text-muted-foreground">
            Run all validation checks in CI/CD with machine-readable output:
          </p>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`# GitHub Actions example
- name: Validate Contracts
  run: contractspec ci --format sarif --output results.sarif

- name: Upload SARIF
  uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: results.sarif`}</pre>
          </div>
        </div>

        <div className="card-subtle space-y-4 p-6">
          <h3 className="font-bold">Configuration</h3>
          <p className="text-muted-foreground text-sm">
            Create a <code>.contractsrc.json</code> file in your project root:
          </p>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded border p-3 font-mono text-sm">
            <pre>{`{
  "aiProvider": "claude",
  "agentMode": "claude-code",
  "outputDir": "./src",
  "conventions": {
    "operations": "interactions/commands|queries",
    "events": "events"
  }
}`}</pre>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/getting-started/tools/vscode" className="btn-primary">
          Next: VS Code Extension <ChevronRight size={16} />
        </Link>
        <Link href="/docs/getting-started/tools" className="btn-ghost">
          Back to Tools
        </Link>
      </div>
    </div>
  );
}
