import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Libraries: ContractSpec Docs',
//   description:
//     'Explore the LSSM library ecosystem for building type-safe, policy-enforced applications.',
// };

export function LibrariesOverviewPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Libraries Overview</h1>
        <p className="text-muted-foreground">
          The LSSM ecosystem provides a comprehensive set of TypeScript
          libraries for building modern web and mobile applications. All
          libraries are designed to work together seamlessly while remaining
          modular and independently useful.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Core Libraries</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/docs/libraries/contracts"
            className="card-subtle group p-6 transition-colors hover:border-violet-500/50"
          >
            <h3 className="text-lg font-bold transition-colors group-hover:text-violet-400">
              @contractspec/lib.contracts
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Define operations, events, and policies in pure TypeScript.
              Runtime adapters serve them as REST/GraphQL/MCP endpoints.
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm text-violet-400">
              Learn more <ChevronRight size={14} />
            </div>
          </Link>

          <Link
            href="/docs/libraries/schema"
            className="card-subtle group p-6 transition-colors hover:border-violet-500/50"
          >
            <h3 className="text-lg font-bold transition-colors group-hover:text-violet-400">
              @contractspec/lib.schema
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Type-safe schema models that export to Zod, Pothos GraphQL, and
              JSON Schema from a single source.
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm text-violet-400">
              Learn more <ChevronRight size={14} />
            </div>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          AI-Native Operations
          <span className="badge badge-secondary text-xs">Featured</span>
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: '@contractspec/lib.ai-agent',
              description:
                'Agent specs, runner, memory, and approval workflow for safe AI copilots.',
              href: '/docs/libraries/ai-agent',
            },
            {
              title: '@contractspec/lib.support-bot',
              description:
                'Classification, RAG resolver, auto-responder, and performance loop for L1 automation.',
              href: '/docs/libraries/support-bot',
            },
            {
              title: '@contractspec/lib.content-gen',
              description:
                'Blog, landing, email, social, and SEO generators powered by ContentBriefs.',
              href: '/docs/libraries/content-gen',
            },
            {
              title: '@contractspec/lib.analytics',
              description:
                'Funnels, cohorts, churn scoring, and hypothesis generation without a warehouse.',
              href: '/docs/libraries/analytics',
            },
            {
              title: '@contractspec/lib.growth',
              description:
                'Experiment registry, runner, tracker, and stats engine for deterministic A/B tests.',
              href: '/docs/libraries/growth',
            },
            {
              title: '@contractspec/lib.design-system',
              description:
                'Now includes ApprovalQueue + AgentMonitor for human-in-the-loop decisions.',
              href: '/docs/libraries/design-system',
            },
          ].map((lib) => (
            <Link
              key={lib.title}
              href={lib.href}
              className="card-subtle group p-6 transition-colors hover:border-violet-500/50"
            >
              <h3 className="text-lg font-bold transition-colors group-hover:text-violet-400">
                {lib.title}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {lib.description}
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm text-violet-400">
                Learn more <ChevronRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          Personalization & Customization
          <span className="badge badge-primary text-xs">Featured</span>
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: '@contractspec/lib.personalization',
              description:
                'Track behavior, analyze unused UI, and feed overlay/workflow adapters.',
              href: '/docs/libraries/personalization',
            },
            {
              title: '@contractspec/lib.overlay-engine',
              description:
                'Signed overlays with validator, registry, runtime engine, and React hooks.',
              href: '/docs/libraries/overlay-engine',
            },
            {
              title: '@contractspec/lib.workflow-composer',
              description:
                'Tenant-aware workflow extensions with step injection helpers.',
              href: '/docs/libraries/workflow-composer',
            },
          ].map((lib) => (
            <Link
              key={lib.title}
              href={lib.href}
              className="card-subtle group p-6 transition-colors hover:border-violet-500/50"
            >
              <h3 className="text-lg font-bold transition-colors group-hover:text-violet-400">
                {lib.title}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {lib.description}
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm text-violet-400">
                Learn more <ChevronRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">UI Libraries</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/docs/libraries/ui-kit"
            className="card-subtle group p-6 transition-colors hover:border-violet-500/50"
          >
            <h3 className="text-lg font-bold transition-colors group-hover:text-violet-400">
              @contractspec/lib.ui-kit
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Universal UI components for React Native and Web, built on
              NativeWind and @rn-primitives.
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm text-violet-400">
              Learn more <ChevronRight size={14} />
            </div>
          </Link>

          <Link
            href="/docs/libraries/design-system"
            className="card-subtle group p-6 transition-colors hover:border-violet-500/50"
          >
            <h3 className="text-lg font-bold transition-colors group-hover:text-violet-400">
              @contractspec/lib.design-system
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              High-level design system components, patterns, and layouts. Built
              on top of ui-kit.
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm text-violet-400">
              Learn more <ChevronRight size={14} />
            </div>
          </Link>

          <Link
            href="/docs/libraries/accessibility"
            className="card-subtle group p-6 transition-colors hover:border-violet-500/50"
          >
            <h3 className="text-lg font-bold transition-colors group-hover:text-violet-400">
              @contractspec/lib.accessibility
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Accessibility primitives for WCAG compliance: skip links, live
              regions, focus management, and more.
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm text-violet-400">
              Learn more <ChevronRight size={14} />
            </div>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Data & Backend</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card-subtle p-4">
            <h3 className="font-semibold">@contractspec/app.cli-database</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Prisma wrapper and CLI for schema management
            </p>
          </div>
          <div className="card-subtle p-4">
            <h3 className="font-semibold">@contractspec/lib.bus</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Type-safe event bus for in-memory and distributed events
            </p>
          </div>
          <div className="card-subtle p-4">
            <h3 className="font-semibold">@contractspec/lib.logger</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Structured logging optimized for Bun with Elysia integration
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">GraphQL</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card-subtle p-4">
            <h3 className="font-semibold">@contractspec/lib.graphql-core</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Shared Pothos builder with plugins
            </p>
          </div>
          <div className="card-subtle p-4">
            <h3 className="font-semibold">@contractspec/lib.graphql-prisma</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Prisma integration for Pothos schemas
            </p>
          </div>
          <div className="card-subtle p-4">
            <h3 className="font-semibold">
              @contractspec/lib.graphql-federation
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Apollo Federation support for Pothos
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Philosophy</h2>
        <p className="text-muted-foreground">
          All LSSM libraries follow these principles:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Type Safety First</strong>: Full TypeScript support with
            strict types.
          </li>
          <li>
            <strong>Modular</strong>: Use only what you need, tree-shake the
            rest.
          </li>
          <li>
            <strong>Platform Aware</strong>: Optimized for both Web and Native
            where applicable.
          </li>
          <li>
            <strong>Single Source of Truth</strong>: Avoid duplication between
            layers (REST, GraphQL, Zod).
          </li>
          <li>
            <strong>Developer Experience</strong>: Clear APIs, comprehensive
            docs, and helpful error messages.
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/libraries/contracts" className="btn-primary">
          Explore Contracts <ChevronRight size={16} />
        </Link>
        <Link href="/docs/getting-started" className="btn-ghost">
          Getting Started
        </Link>
      </div>
    </div>
  );
}
