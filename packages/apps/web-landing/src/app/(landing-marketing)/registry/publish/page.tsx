import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Publish a Pack | agentpacks Registry',
  description:
    'Learn how to create and publish your own agentpack to the registry.',
};

export default function PublishGuidePage() {
  return (
    <div className="section-padding">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">
          Publish a Pack
        </h1>
        <p className="text-muted-foreground mb-8">
          Share your AI coding agent configurations with the community.
        </p>

        {/* Steps */}
        <div className="space-y-8">
          {/* Step 1 */}
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
              <span className="bg-primary flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white">
                1
              </span>
              Create your pack
            </h2>
            <div className="border-border bg-muted/20 rounded-lg border p-4">
              <pre className="overflow-x-auto text-sm">{`# Initialize a new agentpacks project
npx agentpacks init my-pack

# Or create agentpacks.yaml manually
cat > agentpacks.yaml << 'EOF'
name: my-pack
version: 1.0.0
description: My awesome AI coding rules
author:
  name: Your Name
  email: you@example.com
targets:
  - cursor
  - opencode
  - claudecode
rules:
  - content: |
      Always use TypeScript strict mode.
      Prefer functional patterns.
EOF`}</pre>
            </div>
          </section>

          {/* Step 2 */}
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
              <span className="bg-primary flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white">
                2
              </span>
              Authenticate
            </h2>
            <div className="border-border bg-muted/20 rounded-lg border p-4">
              <pre className="overflow-x-auto text-sm">{`# Log in to the registry
npx agentpacks login

# Or set a token directly
export AGENTPACKS_TOKEN=your-token-here`}</pre>
            </div>
          </section>

          {/* Step 3 */}
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
              <span className="bg-primary flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white">
                3
              </span>
              Publish
            </h2>
            <div className="border-border bg-muted/20 rounded-lg border p-4">
              <pre className="overflow-x-auto text-sm">{`# Publish to the registry
npx agentpacks publish

# Publish with a specific version
npx agentpacks publish --version 1.0.0`}</pre>
            </div>
          </section>

          {/* Step 4 */}
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
              <span className="bg-primary flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white">
                4
              </span>
              Install your pack
            </h2>
            <p className="text-muted-foreground mb-3 text-sm">
              Others can now install your pack by adding it to their{' '}
              <code className="bg-muted/50 rounded px-1.5 py-0.5 text-xs">
                agentpacks.yaml
              </code>
              :
            </p>
            <div className="border-border bg-muted/20 rounded-lg border p-4">
              <pre className="overflow-x-auto text-sm">{`# In agentpacks.yaml
packs:
  - registry:my-pack

# Then sync
npx agentpacks sync`}</pre>
            </div>
          </section>
        </div>

        {/* Best practices */}
        <div className="border-border mt-12 rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Best Practices</h2>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Include a descriptive README with usage examples</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Specify which targets your pack supports</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Use semantic versioning for updates</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>
                Tag your pack for discoverability (e.g., typescript, testing,
                react)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>
                Test with{' '}
                <code className="bg-muted/50 rounded px-1 py-0.5 text-xs">
                  agentpacks preview
                </code>{' '}
                before publishing
              </span>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div className="mt-8 flex gap-4 text-sm">
          <Link href="/registry/packs" className="text-primary hover:underline">
            Browse existing packs →
          </Link>
          <Link
            href="/registry/featured"
            className="text-primary hover:underline"
          >
            See featured packs →
          </Link>
        </div>
      </div>
    </div>
  );
}
