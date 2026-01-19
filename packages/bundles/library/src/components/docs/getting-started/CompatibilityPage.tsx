import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function CompatibilityPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Compatibility</h1>
        <p className="text-muted-foreground text-lg">
          Supported runtimes, frameworks, and agent modes for ContractSpec.
        </p>
      </div>

      <div className="space-y-6">
        <div className="card-subtle space-y-3 p-6">
          <h2 className="text-2xl font-bold">Runtimes</h2>
          <ul className="text-muted-foreground space-y-2">
            <li>Node.js 20+</li>
            <li>Bun 1.0+</li>
          </ul>
        </div>

        <div className="card-subtle space-y-3 p-6">
          <h2 className="text-2xl font-bold">Frameworks</h2>
          <ul className="text-muted-foreground space-y-2">
            <li>Next.js 14+ (App Router preferred)</li>
            <li>Bun + Elysia or compatible HTTP servers</li>
          </ul>
        </div>

        <div className="card-subtle space-y-3 p-6">
          <h2 className="text-2xl font-bold">Package managers</h2>
          <ul className="text-muted-foreground space-y-2">
            <li>pnpm (recommended)</li>
            <li>npm</li>
            <li>bun</li>
          </ul>
        </div>

        <div className="card-subtle space-y-3 p-6">
          <h2 className="text-2xl font-bold">AI agent modes</h2>
          <ul className="text-muted-foreground space-y-2">
            <li>simple (direct LLM)</li>
            <li>claude-code</li>
            <li>openai-codex</li>
            <li>cursor</li>
          </ul>
        </div>

        <div className="card-subtle space-y-3 p-6">
          <h2 className="text-2xl font-bold">Datastores</h2>
          <p className="text-muted-foreground">
            ContractSpec ships with Prisma-friendly defaults and can integrate
            with custom adapters for other databases.
          </p>
          <ul className="text-muted-foreground space-y-2">
            <li>PostgreSQL via Prisma</li>
            <li>Custom adapters for other SQL/NoSQL stores</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link href="/docs/getting-started/start-here" className="btn-ghost">
          Start here
        </Link>
        <Link
          href="/docs/getting-started/troubleshooting"
          className="btn-ghost"
        >
          Troubleshooting
        </Link>
        <Link href="/docs/getting-started/installation" className="btn-primary">
          Next: Installation <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
