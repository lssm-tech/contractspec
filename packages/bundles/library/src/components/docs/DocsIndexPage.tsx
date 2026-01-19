import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { BookOpen, ChevronRight, Shield, Zap } from 'lucide-react';
import {
  analyticsEventNames,
  captureAnalyticsEvent,
} from '../../libs/posthog/client';

// export const metadata: Metadata = {
//   title: 'Documentation – ContractSpec',
//   description:
//     'Learn to stabilize your AI-generated code. Define contracts, generate consistent code across all surfaces, regenerate safely.',
//   keywords: [
//     'documentation',
//     'guides',
//     'API reference',
//     'spec-first compiler',
//     'AI code stabilization',
//     'TypeScript',
//     'contracts',
//   ],
//   openGraph: {
//     title: 'Documentation – ContractSpec',
//     description:
//       'Learn to stabilize your AI-generated code with spec-first development.',
//     url: 'https://contractspec.io/docs',
//     type: 'website',
//   },
//   alternates: {
//     canonical: 'https://contractspec.io/docs',
//   },
// };

export function DocsIndexPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold md:text-5xl">Documentation</h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Stabilize your AI-generated code. Define contracts once, generate
          consistent code across all surfaces, regenerate safely anytime.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid gap-6 md:grid-cols-3">
        <Link
          href="/docs/getting-started/installation"
          onClick={() =>
            captureAnalyticsEvent(analyticsEventNames.DOCS_QUICKSTART_VIEW, {
              surface: 'docs-index',
              destination: 'installation',
            })
          }
          className="card-subtle group space-y-3 p-6 transition-colors hover:border-violet-500/50"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold transition-colors group-hover:text-violet-400">
                Get started
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Install ContractSpec and define your first contract in minutes.
              </p>
            </div>
            <Zap size={20} className="shrink-0 text-violet-400" />
          </div>
        </Link>

        <Link
          href="/docs/specs/capabilities"
          className="card-subtle group space-y-3 p-6 transition-colors hover:border-violet-500/50"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold transition-colors group-hover:text-violet-400">
                Core contracts
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Commands, queries, events, and presentations. The building
                blocks.
              </p>
            </div>
            <BookOpen size={20} className="shrink-0 text-violet-400" />
          </div>
        </Link>

        <Link
          href="/docs/safety/signing"
          className="card-subtle group space-y-3 p-6 transition-colors hover:border-violet-500/50"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold transition-colors group-hover:text-violet-400">
                Safe regeneration
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Golden tests, migrations, signing, and audit trails.
              </p>
            </div>
            <Shield size={20} className="shrink-0 text-violet-400" />
          </div>
        </Link>

        <Link
          href="/studio"
          className="card-subtle group space-y-3 p-6 transition-colors hover:border-violet-500/50"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold transition-colors group-hover:text-violet-400">
                Studio (managed)
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Visual builder, deployments, and team collaboration.
              </p>
            </div>
            <Zap size={20} className="shrink-0 text-violet-400" />
          </div>
        </Link>
      </div>

      {/* Quick Start */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Quick start</h2>
        <div className="card-subtle space-y-4 p-6">
          <p className="text-muted-foreground">
            Add ContractSpec to your project and define your first contract:
          </p>
          <CodeBlock
            language="bash"
            filename="docs-quick-start"
            onCopy={() =>
              captureAnalyticsEvent(analyticsEventNames.COPY_COMMAND_CLICK, {
                surface: 'docs-index',
                location: 'quick-start',
                filename: 'docs-quick-start',
              })
            }
            code={`# Install the CLI and core libraries
pnpm add -D contractspec
pnpm add @contractspec/lib.contracts @contractspec/lib.schema

# Create your first contract
contractspec create --type operation

# Generate implementation
contractspec build src/contracts/mySpec.ts`}
          />

          <div className="flex flex-wrap gap-2">
            <Link
              href="/docs/getting-started/installation"
              onClick={() =>
                captureAnalyticsEvent(
                  analyticsEventNames.DOCS_QUICKSTART_VIEW,
                  {
                    surface: 'docs-index',
                    destination: 'installation',
                  }
                )
              }
              className="btn-primary text-sm"
            >
              Installation guide <ChevronRight size={16} />
            </Link>
            <Link
              href="/docs/getting-started/hello-world"
              onClick={() =>
                captureAnalyticsEvent(
                  analyticsEventNames.DOCS_QUICKSTART_VIEW,
                  {
                    surface: 'docs-index',
                    destination: 'hello-world',
                  }
                )
              }
              className="btn-ghost text-sm"
            >
              First contract tutorial
            </Link>
          </div>

          {/*<Link*/}
          {/*  href="/docs/libraries/ai-agent"*/}
          {/*  className="card-subtle group space-y-3 p-6 transition-colors hover:border-violet-500/50"*/}
          {/*>*/}
          {/*  <div className="flex items-start justify-between">*/}
          {/*    <div>*/}
          {/*      <p className="text-xs font-semibold tracking-[0.2em] text-violet-500 uppercase">*/}
          {/*        Featured*/}
          {/*      </p>*/}
          {/*      <h3 className="text-lg font-bold transition-colors group-hover:text-violet-400">*/}
          {/*        AI Governance*/}
          {/*      </h3>*/}
          {/*      <p className="text-muted-foreground mt-1 text-sm">*/}
          {/*        Constrain what AI agents can change. Enforce contracts they*/}
          {/*        must respect. Human-in-the-loop guardrails.*/}
          {/*      </p>*/}
          {/*    </div>*/}
          {/*    <Activity size={20} className="shrink-0 text-violet-400" />*/}
          {/*  </div>*/}
          {/*</Link>*/}
        </div>
      </div>

      {/* Browse All Docs */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Browse all documentation</h2>
        <p className="text-muted-foreground">
          Use the sidebar or choose a topic to explore spec-first development.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            {
              title: 'Getting Started',
              description: 'Installation, first contract, and CLI usage',
              href: '/docs/getting-started/installation',
            },
            {
              title: 'Core Contracts',
              description:
                'Commands, queries, events, presentations, workflows',
              href: '/docs/specs/capabilities',
            },
            {
              title: 'Safe Regeneration',
              description: 'Signing, migrations, golden tests, compliance',
              href: '/docs/safety/signing',
            },
            {
              title: 'Multi-Surface Output',
              description: 'REST, GraphQL, Prisma, MCP tools, React',
              href: '/docs/advanced/renderers',
            },
            {
              title: 'Libraries',
              description: 'Core runtime libraries and utilities',
              href: '/docs/libraries',
            },
            {
              title: 'AI Governance',
              description: 'Agents, contract enforcement, approval workflows',
              href: '/docs/libraries/ai-agent',
            },
            {
              title: 'Architecture',
              description: 'Multi-tenancy, integrations, knowledge sources',
              href: '/docs/architecture',
            },
            {
              title: 'Manifesto',
              description: 'Our philosophy: compiler not prison',
              href: '/docs/manifesto',
            },
          ].map((topic, i) => (
            <Link
              key={i}
              href={topic.href}
              className="card-subtle group p-4 transition-colors hover:border-violet-500/50"
            >
              <h3 className="font-bold transition-colors group-hover:text-violet-400">
                {topic.title}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {topic.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
