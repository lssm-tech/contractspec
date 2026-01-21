import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function EcosystemTemplatesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">Plugin templates</h1>
        <p className="text-muted-foreground text-lg">
          Scaffold new plugins with create-contractspec-plugin.
        </p>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Create a new plugin</h2>
        <p className="text-muted-foreground text-sm">
          Generate a plugin scaffold with tests, documentation, and CI wiring.
        </p>
        <CodeBlock
          language="bash"
          filename="create-plugin"
          code={`bunx create-contractspec-plugin create \\
  --name markdown-generator \\
  --description "Markdown docs generator" \\
  --author "Your name"`}
        />
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Template outputs</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li>src/generator.ts, src/types.ts, src/config.ts</li>
          <li>tests/ with sample fixtures</li>
          <li>.github/workflows/ci.yml</li>
          <li>README.md with usage instructions</li>
        </ul>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Publish and install</h2>
        <CodeBlock
          language="bash"
          filename="publish-plugin"
          code={`bun run build
bun publish

# install in a ContractSpec workspace
bun add @contractspec/plugin.markdown-generator`}
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/ecosystem/plugins" className="btn-primary">
          Plugin API <ChevronRight size={16} />
        </Link>
        <Link href="/docs/ecosystem/registry" className="btn-ghost">
          Registry resolution
        </Link>
      </div>
    </div>
  );
}
