'use client';

import Link from 'next/link';

import {
  ChevronRight,
  Layers,
  Shield,
  RefreshCw,
  Unlock,
  FileCode,
  CheckCircle,
  GitBranch,
  Database,
  Zap,
} from 'lucide-react';

export default function ProductClientPage() {
  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="section-padding hero-gradient relative">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <h1 className="text-5xl leading-tight font-bold md:text-6xl">
            Compiler for AI-coded systems
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Define contracts once. Generate consistent code across API, DB, UI,
            and events. Regenerate safely anytime. No lock-in.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link
              href="/docs/quickstart"
              className="btn-primary inline-flex items-center gap-2"
            >
              Get started <ChevronRight size={16} />
            </Link>
            <Link href="/pricing" className="btn-ghost">
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Multi-Surface Consistency */}
      <section className="section-padding border-border border-b">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1">
              <Layers size={16} className="text-blue-400" />
              <span className="text-sm font-medium text-blue-300">
                Multi-Surface Consistency
              </span>
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">
              One contract, all surfaces in sync
            </h2>
            <p className="text-muted-foreground text-lg">
              Stop chasing drift between your API, database, UI, and events. One
              spec generates all outputs, guaranteed to stay consistent.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: 'REST & GraphQL API',
                description:
                  'Type-safe endpoints with validation. Standard Express, Hono, Elysia, or Apollo handlers.',
                icon: Zap,
              },
              {
                title: 'Database Schema',
                description:
                  'Prisma migrations and types generated from the same spec. Always in sync with your API.',
                icon: Database,
              },
              {
                title: 'UI Components',
                description:
                  'React forms and views derived from specs. Validation and types flow through automatically.',
                icon: FileCode,
              },
              {
                title: 'MCP Tools & Events',
                description:
                  'AI agent tool definitions and event schemas. Same contract, different surfaces.',
                icon: GitBranch,
              },
            ].map((item, i) => (
              <div key={i} className="card-subtle space-y-4 p-6">
                <item.icon className="text-blue-400" size={24} />
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safe Regeneration */}
      <section className="section-padding border-border bg-muted/20 border-b">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
              <RefreshCw size={16} className="text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">
                Safe Regeneration
              </span>
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">
              Regenerate anytime without fear
            </h2>
            <p className="text-muted-foreground text-lg">
              Contracts enforce invariants. Breaking changes are caught at
              compile time, not production. Regenerate with confidence.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card-subtle space-y-4 p-6">
              <h3 className="font-bold">Spec-First Safety</h3>
              <p className="text-muted-foreground text-sm">
                AI agents read specs, not implementations. Generated code that
                violates contracts gets flagged automatically.
              </p>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex gap-3">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 flex-shrink-0 text-emerald-400"
                  />
                  Type-safe from spec to runtime
                </li>
                <li className="flex gap-3">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 flex-shrink-0 text-emerald-400"
                  />
                  Invariants enforced at compile time
                </li>
                <li className="flex gap-3">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 flex-shrink-0 text-emerald-400"
                  />
                  Breaking changes detected early
                </li>
              </ul>
            </div>
            <div className="card-subtle space-y-4 p-6">
              <h3 className="font-bold">Version Control Built-in</h3>
              <p className="text-muted-foreground text-sm">
                Every spec change is tracked. Roll back to any previous version.
                Migrations are explicit and reversible.
              </p>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex gap-3">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 flex-shrink-0 text-emerald-400"
                  />
                  Git-native spec history
                </li>
                <li className="flex gap-3">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 flex-shrink-0 text-emerald-400"
                  />
                  Explicit migration paths
                </li>
                <li className="flex gap-3">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 flex-shrink-0 text-emerald-400"
                  />
                  One-click rollback
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contract Enforcement */}
      <section className="section-padding border-border border-b">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1">
              <Shield size={16} className="text-violet-400" />
              <span className="text-sm font-medium text-violet-300">
                Contract Enforcement
              </span>
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">
              AI governance that actually works
            </h2>
            <p className="text-muted-foreground text-lg">
              Constrain what AI agents can change. Enforce contracts they must
              respect. No more hallucinated refactors breaking your system.
            </p>
          </div>
          <div className="card-subtle space-y-6 p-6">
            <div className="space-y-4">
              <h3 className="font-bold">How contract enforcement works</h3>
              <p className="text-muted-foreground text-sm">
                Contracts define what the system should do. AI-generated code
                that violates these contracts is automatically flagged and
                rejected before it can cause damage.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: 'Define',
                  description:
                    'Write specs in TypeScript. Define inputs, outputs, and invariants.',
                },
                {
                  title: 'Generate',
                  description:
                    'ContractSpec generates code across all surfaces from your specs.',
                },
                {
                  title: 'Enforce',
                  description:
                    "Any code that violates specs is flagged. AI agents can't break contracts.",
                },
              ].map((step, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
                    <div className="text-sm font-bold text-violet-400">
                      {i + 1}
                    </div>
                  </div>
                  <h4 className="text-sm font-bold">{step.title}</h4>
                  <p className="text-muted-foreground text-xs">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* No Lock-in */}
      <section className="section-padding border-border border-b bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-blue-500/5">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1">
              <Unlock size={16} className="text-pink-400" />
              <span className="text-sm font-medium text-pink-300">
                No Lock-in
              </span>
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">
              You own everything. Eject anytime.
            </h2>
            <p className="text-muted-foreground text-lg">
              ContractSpec is a compiler, not a prison. The generated code is
              yours — standard TypeScript, standard SQL, standard GraphQL.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card-subtle space-y-4 p-6">
              <h3 className="text-lg font-bold">Standard Tech Output</h3>
              <ul className="text-muted-foreground space-y-3 text-sm">
                {[
                  'TypeScript you can read and modify',
                  'Prisma migrations you can run manually',
                  'GraphQL schemas you can serve anywhere',
                  'React components with no magic',
                  'REST handlers that work with any framework',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle
                      size={16}
                      className="mt-0.5 flex-shrink-0 text-pink-400"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-subtle space-y-4 p-6">
              <h3 className="text-lg font-bold">No Proprietary Dependencies</h3>
              <ul className="text-muted-foreground space-y-3 text-sm">
                {[
                  'No runtime library required',
                  'No vendor-specific abstractions',
                  'Works with your existing CI/CD',
                  'Eject anytime, keep everything',
                  'Open spec format',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle
                      size={16}
                      className="mt-0.5 flex-shrink-0 text-pink-400"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-4 text-center">
            <p className="text-muted-foreground mb-4 text-sm">
              Like TypeScript compiles to JavaScript, ContractSpec compiles to
              standard code.
              <br />
              <span className="font-medium text-violet-400">
                We're the compiler, not the prison.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Incremental Adoption */}
      <section className="section-padding border-border border-b">
        <div className="mx-auto max-w-4xl space-y-8">
          <h2 className="text-center text-3xl font-bold md:text-4xl">
            Start small. Expand gradually.
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-center text-lg">
            You don't rewrite your app. You stabilize one module at a time.
            Start with one endpoint, prove value, then expand.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Day 1',
                description:
                  'Pick one API endpoint. Write a spec. See what gets generated.',
              },
              {
                title: 'Week 1',
                description:
                  'Add a few more specs. Compare generated code to existing code.',
              },
              {
                title: 'Month 1',
                description:
                  'Migrate a full module. Enjoy multi-surface consistency.',
              },
            ].map((item, i) => (
              <div key={i} className="card-subtle space-y-4 p-6 text-center">
                <div className="text-2xl font-bold text-violet-400">
                  {item.title}
                </div>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding hero-gradient">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to stabilize your AI-generated code?
          </h2>
          <p className="text-muted-foreground text-lg">
            Start with one module. No big-bang migration. No lock-in.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link
              href="/docs/quickstart"
              className="btn-primary inline-flex items-center gap-2"
            >
              Get started free <ChevronRight size={16} />
            </Link>
            <Link href="/contact" className="btn-ghost">
              Book a demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
